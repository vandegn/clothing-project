import os
import stripe


CREDIT_PACKAGES = {
    "pack_5": {"credits": 5, "price": 399, "label": "5 Credits"},
    "pack_15": {"credits": 15, "price": 999, "label": "15 Credits"},
    "pack_50": {"credits": 50, "price": 2499, "label": "50 Credits"},
}


class StripeService:
    def __init__(self):
        stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
        self.webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

    def create_checkout_session(
        self,
        package_id: str,
        user_id: str,
        success_url: str,
        cancel_url: str,
    ) -> str:
        package = CREDIT_PACKAGES[package_id]
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": package["price"],
                        "product_data": {
                            "name": package["label"],
                            "description": f'{package["credits"]} virtual try-on credits',
                        },
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": user_id,
                "package_id": package_id,
                "credits": str(package["credits"]),
            },
        )
        return session.url

    def verify_webhook(self, payload: bytes, sig_header: str) -> dict | None:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, self.webhook_secret
            )
            return event
        except Exception:
            return None
