import asyncio
from fastapi import APIRouter, Depends, Request, HTTPException
from app.models.schemas import (
    CheckoutRequest,
    CheckoutResponse,
    CreditsResponse,
    TryOnSubmitRequest,
    TryOnSubmitResponse,
)
from app.auth import get_current_user_id
from app.services.credits_service import CreditsService, InsufficientCreditsError
from app.services.stripe_service import StripeService, CREDIT_PACKAGES
from app.services.tryon_service import TryOnService

router = APIRouter()

credits_service = CreditsService()
stripe_service = StripeService()
tryon_ai = TryOnService()

_loop = asyncio.get_event_loop


@router.get("/tryon/packages")
async def get_packages():
    return {
        pid: {"id": pid, **info}
        for pid, info in CREDIT_PACKAGES.items()
    }


@router.get("/tryon/credits", response_model=CreditsResponse)
async def get_credits(user_id: str = Depends(get_current_user_id)):
    try:
        loop = asyncio.get_event_loop()
        balance = await loop.run_in_executor(None, credits_service.get_credits, user_id)
        return CreditsResponse(credits=balance)
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")


@router.post("/tryon/checkout", response_model=CheckoutResponse)
async def create_checkout(body: CheckoutRequest, user_id: str = Depends(get_current_user_id)):
    if body.package_id not in CREDIT_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid package")
    loop = asyncio.get_event_loop()
    url = await loop.run_in_executor(
        None,
        stripe_service.create_checkout_session,
        body.package_id,
        user_id,
        body.success_url,
        body.cancel_url,
    )
    return CheckoutResponse(checkout_url=url)


@router.post("/tryon/submit", response_model=TryOnSubmitResponse)
async def submit_tryon(body: TryOnSubmitRequest, user_id: str = Depends(get_current_user_id)):
    loop = asyncio.get_event_loop()

    # Deduct credit first
    try:
        new_balance = await loop.run_in_executor(
            None, credits_service.deduct_credit, user_id
        )
    except InsufficientCreditsError:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    except Exception:
        raise HTTPException(status_code=404, detail="User not found or credit check failed")

    # Call Gemini — refund on failure
    try:
        print("[tryon] calling Gemini 2.5 Flash (Nano Banana)...")
        result_image = await loop.run_in_executor(
            None, tryon_ai.generate_tryon, body.body_image, body.clothing_image
        )
        print("[tryon] image generated successfully")
    except Exception as e:
        print(f"[tryon] Gemini failed: {e}")
        await loop.run_in_executor(None, credits_service.add_credits, user_id, 1)
        raise HTTPException(
            status_code=500,
            detail="AI processing failed — your credit has been refunded.",
        )

    return TryOnSubmitResponse(
        success=True,
        message="Your virtual try-on is ready!",
        credits_remaining=new_balance,
        result_image=result_image,
    )


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    print(f"[stripe webhook] received event, sig present: {bool(sig)}")

    loop = asyncio.get_event_loop()
    event = await loop.run_in_executor(
        None, stripe_service.verify_webhook, payload, sig
    )
    if event is None:
        print("[stripe webhook] signature verification failed")
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_id = event.get("id", "")
    print(f"[stripe webhook] event type: {event['type']}, id: {event_id}")

    existing = await loop.run_in_executor(
        None,
        lambda: credits_service.client.table("processed_stripe_events")
        .select("event_id").eq("event_id", event_id).execute(),
    )
    if existing.data:
        print(f"[stripe webhook] duplicate event {event_id}, skipping")
        return {"received": True}

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        user_id = metadata.get("user_id")
        credits_str = metadata.get("credits")
        print(f"[stripe webhook] user_id={user_id}, credits={credits_str}")
        if user_id and credits_str:
            new_balance = await loop.run_in_executor(
                None, credits_service.add_credits, user_id, int(credits_str)
            )
            print(f"[stripe webhook] credits added, new balance: {new_balance}")

    await loop.run_in_executor(
        None,
        lambda: credits_service.client.table("processed_stripe_events")
        .insert({"event_id": event_id}).execute(),
    )

    return {"received": True}
