const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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

export async function createCheckoutSession(
  packageId: string,
  userId: string
): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/api/tryon/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: packageId,
      user_id: userId,
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
  result_image?: string; // base64 PNG from OpenAI
}

export async function submitTryOn(
  userId: string,
  bodyImage: string,
  clothingImage: string
): Promise<TryOnResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min

  try {
    const res = await fetch(`${BACKEND_URL}/api/tryon/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
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
