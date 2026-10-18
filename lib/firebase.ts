import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * ============================================================
 * VELORÉ — Firebase Client Integration Foundation
 * ============================================================
 * Safe, environment-variable-backed Firebase client setup.
 * Does not expose secrets or invent fake live connections.
 * If credentials are missing, it degrades gracefully to offline/local state.
 * ============================================================
 */

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Check whether required Firebase environment variables are defined.
 */
export function checkFirebaseConfig(): FirebaseConfigStatus {
  const requiredKeys: (keyof typeof firebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "appId",
  ];

  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
  return {
    isConfigured: missingKeys.length === 0,
    missingKeys,
  };
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const configStatus = checkFirebaseConfig();

if (configStatus.isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[VELORÉ Firebase] Initialization deferred or failed:", error);
    }
  }
}

export { app, auth, db };

/**
 * Common data interfaces for future e-commerce modules
 */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  createdAt?: string;
  defaultShippingAddressId?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}
