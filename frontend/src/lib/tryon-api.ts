import { createClient } from "./supabase";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function getAccessToken(): Promise<string> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  return session.access_token;
}

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  label: string;
}

export async function getPackages(): Promise<Record<string, CreditPackage>> {
  const res = await fetch(`${BACKEND_URL}/api/tryon/packages`);
  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
}

export async function getCredits(): Promise<number> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/api/tryon/credits`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch credits");
  const data = await res.json();
  return data.credits;
}

export async function createCheckoutSession(
  packageId: string
): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/api/tryon/checkout`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      package_id: packageId,
      success_url: `${window.location.origin}/tryon?payment=success`,
      cancel_url: `${window.location.origin}/tryon?payment=cancelled`,
    }),
  });
  if (!res.ok) throw new Error("Failed to create checkout session");
  const data = await res.json();
  return data.checkout_url;
}

export interface TryOnResult {
  success: boolean;
  message: string;
  credits_remaining: number;
  result_image?: string; // base64 PNG
}

export async function submitTryOn(
  bodyImage: string,
  clothingImage: string
): Promise<TryOnResult> {
  const token = await getAccessToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min

  try {
    const res = await fetch(`${BACKEND_URL}/api/tryon/submit`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        body_image: bodyImage,
        clothing_image: clothingImage,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      if (res.status === 402) throw new Error("Insufficient credits");
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail || "Try-on submission failed");
    }

    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}
