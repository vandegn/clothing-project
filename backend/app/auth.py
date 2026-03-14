import os
from fastapi import Depends, HTTPException, Request
from supabase import create_client

_supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"],
)


async def get_current_user_id(request: Request) -> str:
    """FastAPI dependency that extracts and verifies the user from the Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = auth_header.removeprefix("Bearer ")

    try:
        user_response = _supabase.auth.get_user(token)
        return user_response.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
