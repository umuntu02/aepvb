import { timingSafeEqual, createHash } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, createSessionToken, verifySessionToken } from "@/lib/admin/session";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return Response.json({ error: "Configuration manquante" }, { status: 503 });
  }

  // DECISION: timingSafeEqual prevents timing-attack enumeration of the password.
  // Pad both buffers to identical length before comparing.
  const a = Buffer.from(createHash("sha256").update(password ?? "").digest());
  const b = Buffer.from(createHash("sha256").update(expected).digest());
  const match = timingSafeEqual(a, b);

  if (!match) {
    return Response.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, COOKIE_OPTS);

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (token && !(await verifySessionToken(token))) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  cookieStore.set(ADMIN_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  return Response.json({ ok: true });
}
