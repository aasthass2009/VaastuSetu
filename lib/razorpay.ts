import Razorpay from "razorpay";

// IMPORTANT: These are TEST MODE keys (rzp_test_*).
// Before going live: complete KYC at razorpay.com, then swap for rzp_live_ keys in .env.
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
