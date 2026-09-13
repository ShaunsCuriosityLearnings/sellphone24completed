"use client";

export interface AnalyticsEventPayload {
  eventName: string;
  category: "acquisition" | "behaviour" | "valuation" | "conversion" | "search" | "ux";
  properties?: Record<string, any>;
  timestamp?: number;
}

const SESSION_KEY = "spc_analytics_session_id";
const INTENT_KEY = "spc_analytics_intent_score";
const BATCH_INTERVAL_MS = 3000;

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

    // Detect UTM and Device context if first event
    const urlParams = new URLSearchParams(window.location.search);
    const contextProps = {
      sessionId: this.getSessionId(),
      pageUrl: window.location.pathname + window.location.search,
      deviceType: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
      referrer: document.referrer || "direct",
      utmSource: urlParams.get("utm_source") || "direct",
      utmMedium: urlParams.get("utm_medium") || "none",
      utmCampaign: urlParams.get("utm_campaign") || "none",
      utmContent: urlParams.get("utm_content") || "none",
      utmTerm: urlParams.get("utm_term") || "none",
      sessionDuration: Math.round((Date.now() - this.pageStartTime) / 1000),
      ...properties,
    };

    // Calculate dynamic intent score increment
    this.updateIntentScore(eventName, properties);

    const eventPayload: AnalyticsEventPayload = {
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
