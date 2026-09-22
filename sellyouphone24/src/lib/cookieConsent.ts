"use client";

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  hasAnswered: boolean;
}

const CONSENT_STORAGE_KEY = "spc_cookie_consent_v1";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: true,
  marketing: true,
  timestamp: Date.now(),
  hasAnswered: false,
};

export const cookieConsent = {
  getPreferences(): CookiePreferences {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          essential: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
          timestamp: parsed.timestamp || Date.now(),
          hasAnswered: true,
        };
      }
    } catch (e) {
      console.warn("Error reading cookie preferences:", e);
    }
    return DEFAULT_PREFERENCES;
  },

  setPreferences(analytics: boolean, marketing: boolean): CookiePreferences {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      marketing,
      timestamp: Date.now(),
      hasAnswered: true,
    };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
        window.dispatchEvent(new CustomEvent("spc_consent_updated", { detail: prefs }));
      } catch (e) {
        console.warn("Error saving cookie preferences:", e);
      }
    }
    return prefs;
  },

  acceptAll(): CookiePreferences {
    return this.setPreferences(true, true);
  },

  rejectNonEssential(): CookiePreferences {
    return this.setPreferences(false, false);
  },

  hasAnalyticsConsent(): boolean {
    const prefs = this.getPreferences();
    return prefs.essential && prefs.analytics;
  },

  hasMarketingConsent(): boolean {
    const prefs = this.getPreferences();
    return prefs.essential && prefs.marketing;
  },
};
