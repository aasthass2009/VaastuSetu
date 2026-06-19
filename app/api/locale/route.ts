import { NextRequest, NextResponse } from "next/server";

const VALID_LOCALES = ["en", "hi"];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { locale?: string };
  const locale = body.locale;

  if (!locale || !VALID_LOCALES.includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const res = NextResponse.json({ locale });
  res.cookies.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  return res;
}
