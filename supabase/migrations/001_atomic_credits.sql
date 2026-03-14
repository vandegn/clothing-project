-- Run this in the Supabase SQL Editor to create atomic credit functions.
-- These replace the non-atomic read-modify-write pattern in credits_service.py.

-- Atomically deduct one credit. Returns the new balance.
-- Returns no rows if credits are already 0 (caller should treat as insufficient).
CREATE OR REPLACE FUNCTION deduct_credit(p_user_id uuid)
RETURNS int
LANGUAGE sql
AS $$
    UPDATE profiles
    SET credits = credits - 1
    WHERE id = p_user_id AND credits > 0
    RETURNING credits;
$$;

-- Atomically add credits. Returns the new balance.
CREATE OR REPLACE FUNCTION add_credits(p_user_id uuid, p_amount int)
RETURNS int
LANGUAGE sql
AS $$
    UPDATE profiles
    SET credits = credits + p_amount
    WHERE id = p_user_id
    RETURNING credits;
$$;
