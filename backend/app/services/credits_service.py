import os
from supabase import create_client, Client


class InsufficientCreditsError(Exception):
    pass


class CreditsService:
    def __init__(self):
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        self.client: Client = create_client(url, key)

    def get_credits(self, user_id: str) -> int:
        result = (
            self.client.table("profiles")
            .select("credits")
            .eq("id", user_id)
            .single()
            .execute()
        )
        return result.data["credits"]

    def add_credits(self, user_id: str, amount: int) -> int:
        result = self.client.rpc(
            "add_credits", {"p_user_id": user_id, "p_amount": amount}
        ).execute()
        if not result.data:
            raise Exception("User not found")
        return result.data

    def deduct_credit(self, user_id: str) -> int:
        result = self.client.rpc(
            "deduct_credit", {"p_user_id": user_id}
        ).execute()
        if not result.data:
            raise InsufficientCreditsError("Not enough credits")
        return result.data
