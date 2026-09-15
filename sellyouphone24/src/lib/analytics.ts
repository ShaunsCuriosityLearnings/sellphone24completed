"use client";

import { cookieConsent } from "./cookieConsent";

export interface AnalyticsEventPayload {
  sessionId?: string;
  eventName: string;
  category: "acquisition" | "behaviour" | "valuation" | "conversion" | "search" | "ux";
  properties?: Record<string, any>;
  timestamp?: number;
}

const SESSION_KEY = "spc_analytics_session_id";
const INTENT_KEY = "spc_analytics_intent_score";
const MARKETING_ATTRIBUTION_KEY = "spc_marketing_attribution";
const BATCH_INTERVAL_MS = 3000;

export interface MarketingAttribution {
  source: string;
  medium: string;
  campaign: string;
  gclid: string;
  fbclid: string;
  ttclid: string;
  referrer: string;
}

class AnalyticsSDK {
  private sessionId: string = "";
  private intentScore: number = 0;
  private queue: AnalyticsEventPayload[] = [];
  private timer: any = null;
  private pageStartTime: number = Date.now();
  private nudgeSubscribers: Array<(score: number) => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.initSession();
      this.captureMarketingAttribution();
      this.startBatchLoop();
      this.setupExitListener();
    }
  }

  private initSession() {
    let existingId = localStorage.getItem(SESSION_KEY);
    if (!existingId) {
      existingId = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem(SESSION_KEY, existingId);
    }
    this.sessionId = existingId;

    const savedScore = localStorage.getItem(INTENT_KEY);
    if (savedScore) {
      this.intentScore = parseInt(savedScore, 10) || 0;
    }
  }

  private captureMarketingAttribution() {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);

    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const gclid = urlParams.get("gclid");
    const fbclid = urlParams.get("fbclid");
    const ttclid = urlParams.get("ttclid");

    // Only update stored attribution if new parameters exist in URL
    if (utmSource || gclid || fbclid || ttclid) {
      const attribution: MarketingAttribution = {
        source: utmSource || (gclid ? "google" : fbclid ? "facebook" : ttclid ? "tiktok" : "direct"),
        medium: utmMedium || (gclid ? "cpc" : fbclid ? "social" : ttclid ? "social" : "none"),
        campaign: utmCampaign || "none",
        gclid: gclid || "",
        fbclid: fbclid || "",
        ttclid: ttclid || "",
        referrer: document.referrer || "direct",
      };
      localStorage.setItem(MARKETING_ATTRIBUTION_KEY, JSON.stringify(attribution));
    }
  }

  public getMarketingAttribution(): MarketingAttribution {
    if (typeof window === "undefined") {
      return { source: "direct", medium: "none", campaign: "none", gclid: "", fbclid: "", ttclid: "", referrer: "direct" };
    }
    try {
      const raw = localStorage.getItem(MARKETING_ATTRIBUTION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      source: "direct",
      medium: "none",
      campaign: "none",
      gclid: "",
      fbclid: "",
      ttclid: "",
      referrer: document.referrer || "direct",
    };
  }

  public getSessionId(): string {
    if (!this.sessionId && typeof window !== "undefined") {
      this.initSession();
    }
    return this.sessionId;
  }

  public getIntentScore(): number {
    return this.intentScore;
  }

  public onNudgeTrigger(callback: (score: number) => void) {
    this.nudgeSubscribers.push(callback);
  }

  private notifyNudgeSubscribers() {
    this.nudgeSubscribers.forEach(cb => cb(this.intentScore));
  }

  public track(eventName: string, category: AnalyticsEventPayload["category"] = "behaviour", properties: Record<string, any> = {}) {
    if (typeof window === "undefined") return;

    // Respect user cookie preferences for analytics telemetry
    if (!cookieConsent.hasAnalyticsConsent() && !["pickup_requested"].includes(eventName)) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const attribution = this.getMarketingAttribution();

    const contextProps = {
      sessionId: this.getSessionId(),
      pageUrl: window.location.pathname + window.location.search,
      deviceType: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
      referrer: document.referrer || "direct",
      utmSource: attribution.source || urlParams.get("utm_source") || "direct",
      utmMedium: attribution.medium || urlParams.get("utm_medium") || "none",
      utmCampaign: attribution.campaign || urlParams.get("utm_campaign") || "none",
      utmContent: urlParams.get("utm_content") || "none",
      utmTerm: urlParams.get("utm_term") || "none",
      gclid: attribution.gclid || urlParams.get("gclid") || "",
      fbclid: attribution.fbclid || urlParams.get("fbclid") || "",
      ttclid: attribution.ttclid || urlParams.get("ttclid") || "",
      marketingConsent: cookieConsent.hasMarketingConsent(),
      sessionDuration: Math.round((Date.now() - this.pageStartTime) / 1000),
      ...properties,
    };

    // Calculate dynamic intent score increment
    this.updateIntentScore(eventName, properties);

    const eventPayload: AnalyticsEventPayload = {
      sessionId: this.getSessionId(), // Top level for backend intake
      eventName,
      category,
      properties: contextProps,
      timestamp: Date.now(),
    };

    this.queue.push(eventPayload);

    // If urgent conversion event (e.g. pickup_requested), flush immediately
    if (["pickup_requested", "whatsapp_clicked", "offer_accepted"].includes(eventName)) {
      this.flush();
    }
  }

  private updateIntentScore(eventName: string, props: Record<string, any>) {
    let delta = 0;
    switch (eventName) {
      case "page_view": delta = 1; break;
      case "model_selected": delta = 5; break;
      case "valuation_started": delta = 15; break;
      case "recalculation_performed": delta = 3; break;
      case "valuation_completed": delta = 20; break;
      case "offer_viewed": delta = 5; break;
      case "offer_accepted": delta = 25; break;
      case "whatsapp_clicked": delta = 20; break;
      case "form_started": delta = 15; break;
      case "pickup_requested": delta = 50; break;
    }

    if (delta > 0) {
      this.intentScore = Math.min(100, this.intentScore + delta);
      localStorage.setItem(INTENT_KEY, this.intentScore.toString());

      // Trigger Smart Nudge if score >= 60 on valuation offer view or hesitation
      if (this.intentScore >= 60 && (eventName === "offer_viewed" || eventName === "hesitation_detected")) {
        this.notifyNudgeSubscribers();
      }
    }
  }

  public flush() {
    if (this.queue.length === 0) return;

    const payloadToSend = [...this.queue];
    this.queue = [];

    const endpoint = "/api/analytics/track";

    // Use sendBeacon if available, otherwise fetch
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payloadToSend)], { type: "application/json" });
      const success = navigator.sendBeacon(endpoint, blob);
      if (!success) {
        this.fallbackFetch(endpoint, payloadToSend);
      }
    } else {
      this.fallbackFetch(endpoint, payloadToSend);
    }
  }

  private async fallbackFetch(endpoint: string, payload: AnalyticsEventPayload[]) {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (err) {
      // Re-queue on network error
      this.queue.unshift(...payload);
    }
  }

  private startBatchLoop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.flush(), BATCH_INTERVAL_MS);
  }

  private setupExitListener() {
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush();
      }
    });
    window.addEventListener("pagehide", () => this.flush());
  }
}

export const analytics = new AnalyticsSDK();
