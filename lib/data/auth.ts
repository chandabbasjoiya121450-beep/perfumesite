export interface Address {
  id: string;
  isDefault: boolean;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  tier: string;
  memberSince: string;
  favoriteFamily: string;
  favoriteNotes: string[];
  addresses: Address[];
}

const DEFAULT_USER: UserProfile = {
  id: "usr-velore-001",
  email: "eleanor.vance@velore.com",
  firstName: "Eleanor",
  lastName: "Vance",
  phone: "+1 (555) 234-8901",
  tier: "Grand Connoisseur Reserve",
  memberSince: "September 2024",
  favoriteFamily: "Woody & Resinous",
  favoriteNotes: ["Mysore Sandalwood", "Cardamom", "Aged Oud", "Damascena Rose"],
  addresses: [
    {
      id: "addr-01",
      isDefault: true,
      label: "Primary Residence",
      street: "740 Park Avenue",
      apartment: "Penthouse B",
      city: "New York",
      state: "NY",
      postalCode: "10021",
      country: "United States",
    },
    {
      id: "addr-02",
      isDefault: false,
      label: "Summer Estate",
      street: "24 Meadow Lane",
      city: "Southampton",
      state: "NY",
      postalCode: "11968",
      country: "United States",
    },
  ],
};

const USER_STORAGE_KEY = "velore_user_profile";
const AUTH_STATUS_KEY = "velore_is_authenticated";

export function getSavedUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
}

export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const status = localStorage.getItem(AUTH_STATUS_KEY);
    // Default to true for elegant showcase experience, or check flag
    return status === null ? true : status === "true";
  } catch (e) {
    return true;
  }
}

export function setUserAuthentication(status: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STATUS_KEY, status ? "true" : "false");
  } catch (e) {
    console.error("Failed to update auth status", e);
  }
}
