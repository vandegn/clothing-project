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
        current = self.get_credits(user_id)
        new_balance = current + amount
        self.client.table("profiles").update(
            {"credits": new_balance}
        ).eq("id", user_id).execute()
        return new_balance

    def deduct_credit(self, user_id: str) -> int:
        current = self.get_credits(user_id)
        if current < 1:
            raise InsufficientCreditsError("Not enough credits")
        new_balance = current - 1
        self.client.table("profiles").update(
            {"credits": new_balance}
        ).eq("id", user_id).execute()
        return new_balance
