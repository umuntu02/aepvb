import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/verify";

// GET — admin clicks "Aperçu" from an editor page.
// Sets the preview cookie and redirects to the public site with the section anchor.
export async function GET(request: NextRequest) {
  if (!(await verifyAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") ?? "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const anchor = section ? `#${section}` : "";
  const redirectUrl = `${siteUrl}/?preview=1${anchor}`;

  const response = NextResponse.redirect(redirectUrl);
  // DECISION: HttpOnly=false so the amber banner's "Quitter" button can be a
  // regular form POST without needing client-side JS to read the cookie.
  response.cookies.set("aepvb_preview_mode", "1", {
    path: "/",
    maxAge: 60 * 60, // 1 hour
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}

// POST — "Quitter l'aperçu" form button clears the preview cookie.
export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const response = NextResponse.redirect(siteUrl + "/");
  response.cookies.set("aepvb_preview_mode", "", {
    path: "/",
    maxAge: 0,
    httpOnly: false,
  });
  return response;
}
