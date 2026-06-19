"use client";

import { useState, useEffect, useRef } from "react";

// Razorpay Checkout loads as a browser global via the CDN script below.
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export type PaymentType = "REPORT_UNLOCK" | "SUBSCRIPTION";

interface Props {
  homeId?: string;
  type: PaymentType;
  onSuccess: (type: PaymentType) => void;
  onError?: (msg: string) => void;
  children: (pay: () => void, loading: boolean) => React.ReactNode;
}

export function RazorpayCheckout({ homeId, type, onSuccess, onError, children }: Props) {
  const [loading, setLoading] = useState(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => { scriptLoaded.current = true; };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  async function pay() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, homeId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to create order" }));
        onError?.(err.error ?? "Failed to create order");
        setLoading(false);
        return;
      }

      const { razorpayOrderId, amount, currency, keyId, description } = await res.json() as {
        razorpayOrderId: string;
        amount: number;
        currency: string;
        keyId: string;
        description: string;
      };

      if (!window.Razorpay) {
        onError?.("Payment gateway failed to load. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: keyId,
        order_id: razorpayOrderId,
        amount,
        currency,
        name: "VaastuSetu",
        description,
        image: "/icon-192.png",
        theme: { color: "#C05A12" },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              onSuccess(type);
            } else {
              const body = await verifyRes.json().catch(() => ({})) as { error?: string };
              onError?.(body.error ?? "Payment verification failed. Contact support if amount was deducted.");
            }
          } catch {
            onError?.("Network error during verification. Contact support if amount was deducted.");
          } finally {
            setLoading(false);
          }
        },
      });

      rzp.open();
    } catch (err) {
      console.error("[RazorpayCheckout] unexpected error:", err);
      onError?.("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return <>{children(pay, loading)}</>;
}
