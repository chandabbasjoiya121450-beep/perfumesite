import crypto from "crypto";

export interface AdminSession {
  email: string;
  role: "administrator";
  exp: number;
}

const ADMIN_SECRET =
  process.env.ADMIN_SECRET_KEY || "velore-haute-parfumerie-master-secret-key-2026";
const CONFIGURED_ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "admin@velore.com";
const CONFIGURED_ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "VeloreAdmin2026!";

export const ADMIN_COOKIE_NAME = "velore_admin_session";

/**
 * Validates provided credentials against the server-side administrator credentials.
 */
export function validateAdminCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;
  return (
    email.trim().toLowerCase() === CONFIGURED_ADMIN_EMAIL.toLowerCase() &&
    password === CONFIGURED_ADMIN_PASSWORD
  );
}

/**
 * Signs an admin session payload using HMAC-SHA256.
 */
export function signAdminToken(email: string): string {
  const payload: AdminSession = {
    email: email.trim().toLowerCase(),
    role: "administrator",
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a signed admin token string.
 */
export function verifyAdminToken(token: string): AdminSession | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(payloadB64)
      .digest("base64url");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson) as AdminSession;

    // Check expiration
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    if (payload.role !== "administrator") {
      return null;
    }

    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Extracts and verifies the admin session from an incoming HTTP Request.
 */
export function verifyAdminRequest(request: Request): AdminSession | null {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const session = verifyAdminToken(token);
    if (session) return session;
  }

  // 2. Check Cookie header
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    const sessionCookie = cookies.find((c) =>
      c.startsWith(`${ADMIN_COOKIE_NAME}=`)
    );
    if (sessionCookie) {
      const token = sessionCookie.substring(ADMIN_COOKIE_NAME.length + 1);
      const session = verifyAdminToken(token);
      if (session) return session;
    }
  }

  return null;
}

/**
 * Returns configuration instructions for administrators.
 */
export function getAdminConfigInfo() {
  return {
    isConfigured: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD),
    configuredEmail: CONFIGURED_ADMIN_EMAIL,
    instructions:
      "To customize administrative access credentials, set ADMIN_EMAIL and ADMIN_PASSWORD in your .env.local file.",
  };
}
