# SellPhoneCash Analytics & Intelligence Engine — Complete Architecture & Setup Guide

This document provides a comprehensive technical breakdown of the complete analytics architecture implemented in **SellPhoneCash** (`sellphone24completed`), covering both the frontend client-side telemetry SDK, external tag management (GTM/GA4/Meta), privacy consent controls, backend event ingestion, MongoDB data models, and the live Admin Analytics Dashboard.

---

## 1. Architectural Overview

The analytics system in SellPhoneCash is a **dual-layer, full-funnel intelligence engine**:

1. **First-Party Telemetry & Behavioral Intelligence**:
   * Custom, privacy-first event tracking library (`AnalyticsSDK` in `sellyouphone24/src/lib/analytics.ts`).
   * Batched, non-blocking telemetry dispatched using `navigator.sendBeacon` and `keepalive` fetch.
   * Real-time user Intent Scoring (0–100) that automatically triggers interactive conversion nudges (`DynamicNudgeModal.tsx`).
   * First-party session management, UTM marketing attribution capture, and geo-location tracking.
   * In-house MongoDB data persistence with 60-day auto-purging (TTL indexes).

2. **Third-Party Acquisition & Ad Tagging**:
   * Google Tag Manager container (`GTM-TJFWWLNZ`) and Google Analytics 4 (`G-1WQ6NFX8KS`).
   * Dynamic Meta Pixel injector keyed by `NEXT_PUBLIC_META_PIXEL_ID`.
   * Standardized DataLayer pushes for e-commerce and conversion funnel actions.

3. **Admin Intelligence Dashboard (`/analytics`)**:
   * Real-time 8-stage buyback conversion funnel.
   * Device valuation performance & average cash payout matrix.
   * Sourcing Demand Radar (unlisted devices searched by visitors with 0 search results).
   * UAE Geographic demand heat (Dubai, Abu Dhabi, Sharjah, etc.).
   * Acquisition channel attribution (UTM source, intent score, and conversion rate).
   * Real empirical Blog SEO performance & trade-in referral click matrix.
   * Automated conversion bottleneck & inventory demand alerts.

---

## 2. Directory Structure & Key Files

```
sellphone24completed/
├── sellyouphone24/                             # Frontend (Next.js App Router)
│   ├── next.config.ts                         # API proxy rewrite to Express backend (:5000)
│   └── src/
│       ├── app/
│       │   ├── layout.tsx                     # Root Layout: GTM script & AnalyticsProvider mount
│       │   └── analytics/
│       │       └── page.tsx                   # Admin Analytics & Intelligence Page (/analytics)
│       ├── components/
│       │   ├── AnalyticsDashboard.tsx         # Master Analytics Dashboard component
│       │   ├── AnalyticsProvider.tsx          # Global route change & scroll depth observer
│       │   ├── CookieConsentBanner.tsx        # GDPR / UAE e-Privacy consent banner
│       │   └── DynamicNudgeModal.tsx          # Exit/Hesitation Intent Nudge modal
│       └── lib/
│           ├── analytics.ts                   # Client-side First-Party Analytics SDK
│           ├── cookieConsent.ts               # Cookie consent state store (LocalStorage)
│           └── gtm.ts                         # Window DataLayer helper & GTM container ID
│
└── backend/                                   # Backend (Node.js / Express / MongoDB)
    ├── controllers/
    │   └── analyticsController.js             # Event ingestion and aggregation controller
    ├── models/
    │   ├── AnalyticsSession.js                # High-level visitor session document
    │   ├── AnalyticsEvent.js                  # Granular micro-events with 60-day TTL
    │   ├── AnalyticsRollup.js                 # Pre-aggregated daily rollups
    │   └── SearchQueryLog.js                  # Search query intelligence & missing model capture
    └── routes/
        └── analyticsRoutes.js                 # Endpoints: POST /track & GET /dashboard
```

---

## 3. Client-Side Telemetry SDK (`analytics.ts`)

The core tracking client is instantiated in [`sellyouphone24/src/lib/analytics.ts`](file:///c:/Users/Admin/sellphone24completed/sellyouphone24/src/lib/analytics.ts) as a singleton `analytics`.

### Key Capabilities:
* **Session Management**: Automatically provisions and stores a persistent `spc_analytics_session_id` in `localStorage` (`sess_<random>_<timestamp>`).
* **Campaign & UTM Attribution**: Automatically inspects query parameters (`utm_source`, `utm_medium`, `utm_campaign`, `gclid`, `fbclid`, `ttclid`, and `document.referrer`) on landing, storing attribution in `localStorage` under `spc_marketing_attribution`.
* **Micro-Batching**: Events are queued in memory and flushed every 3 seconds (`BATCH_INTERVAL_MS = 3000`) or immediately upon high-priority actions (`pickup_requested`, `whatsapp_clicked`, `offer_accepted`).
* **Non-Blocking Egress**: Dispatches data using `navigator.sendBeacon("/api/analytics/track", blob)` to avoid blocking user navigation, with fallback to `fetch(..., { keepalive: true })`.
* **Page Lifecycle Observers**: Automatically flushes queued telemetry on `visibilitychange` (when document becomes hidden) and on `pagehide`.

### Dynamic Intent Scoring Algorithm:
Every user action adds an intent score increment (capped at 100):
| Event Trigger | Intent Points Added | Stage Reached |
| :--- | :--- | :--- |
| `page_view` | +1 | `visitor` / `browsed` |
| `model_selected` | +5 | `browsed` |
| `valuation_started` | +15 | `valuation_started` |
| `recalculation_performed` | +3 | — |
| `valuation_completed` | +20 | `valuation_completed` |
| `offer_viewed` | +5 | `offer_viewed` |
| `offer_accepted` | +25 | `offer_accepted` |
| `whatsapp_clicked` | +20 | — |
| `form_started` | +15 | — |
| `pickup_requested` | +50 (sets to 100) | `pickup_requested` (Converted) |

When a user's intent score hits **60 or higher** and they reach `offer_viewed` or trigger a hesitation event, the SDK fires `onNudgeTrigger`, triggering the **Dynamic Nudge Modal**.

---

## 4. Global Providers & Behavioral Monitors

### 1. `AnalyticsProvider.tsx` ([`sellyouphone24/src/components/AnalyticsProvider.tsx`](file:///c:/Users/Admin/sellphone24completed/sellyouphone24/src/components/AnalyticsProvider.tsx))
Mounted in the root layout ([`layout.tsx`](file:///c:/Users/Admin/sellphone24completed/sellyouphone24/src/app/layout.tsx)), wrapping all children.
* **Automatic Page View Tracking**: Reacts to Next.js route transitions (`usePathname` and `useSearchParams`), logging `page_view` events with the full URL.
* **Scroll Depth Telemetry**: Passively monitors window scroll percent and fires UX events at 25%, 50%, 75%, and 100% depth without duplicate firing.
* **Meta Pixel Injector**: Checks consent and dynamically injects `fbevents.js` if `NEXT_PUBLIC_META_PIXEL_ID` is present.
* **Mounts**: Embeds `<DynamicNudgeModal />` and `<CookieConsentBanner />`.

### 2. `DynamicNudgeModal.tsx` ([`sellyouphone24/src/components/DynamicNudgeModal.tsx`](file:///c:/Users/Admin/sellphone24completed/sellyouphone24/src/components/DynamicNudgeModal.tsx))
* Appears as an interactive floating card in the bottom-right corner when a high-intent user pauses after receiving a device quote.
* Offers two high-conversion escape paths:
  1. **Direct WhatsApp Quote**: Locks valuation for 7 days via WhatsApp API chat.
  2. **Book Free Doorstep Pickup**: Directs immediately into checkout `/cart?step=1`.
* Dismissing the modal logs `nudge_dismissed` and respects session storage to prevent spamming.

### 3. `CookieConsentBanner.tsx` & `cookieConsent.ts`
* Provides granular opt-in/opt-out for `essential`, `analytics`, and `marketing` cookies.
* Telemetry respects user choice: if analytics consent is rejected, tracking events (except direct order completion) are halted.

### 4. Google Tag Manager & GA4 Integration (`gtm.ts` & `layout.tsx`)
* GTM Script is injected via `next/script` in `layout.tsx`:
  ```tsx
  <Script id="google-tag-manager" strategy="afterInteractive">
    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');`}
  </Script>
  ```
* Standard helper function `pushDataLayer({ event: '...', ...params })` sends events directly to GTM DataLayer.

---

## 5. Backend Data Pipeline & Ingestion (`backend`)

### API Routing & Proxy
* Next.js proxies frontend `/api/*` calls to the Node.js Express server on port 5000 via `next.config.ts`:
  ```ts
  {
    source: '/api/:path*',
    destination: 'http://localhost:5000/api/:path*'
  }
  ```
* Express routes defined in [`backend/routes/analyticsRoutes.js`](file:///c:/Users/Admin/sellphone24completed/backend/routes/analyticsRoutes.js):
  * `POST /api/analytics/track` $\rightarrow$ `trackEvents`
  * `GET /api/analytics/dashboard` $\rightarrow$ `getDashboardData`

### Database Models

1. **`AnalyticsSession`** ([`backend/models/AnalyticsSession.js`](file:///c:/Users/Admin/sellphone24completed/backend/models/AnalyticsSession.js)):
   * Represents a single visitor session.
   * Fields: `sessionId`, `deviceType`, `browser`, `os`, `geo` (`country`, `city`, `emirate`, `area`), `acquisition` (`utmSource`, `utmMedium`, `utmCampaign`, `gclid`, `fbclid`, `ttclid`, `referrer`), `intentScore`, `maxStageReached`, `recalculationCount`, `durationSeconds`, `totalPayoutOffered`, `isConverted`.
   * Indexes on `createdAt`, `maxStageReached`, and `acquisition.utmSource`.

2. **`AnalyticsEvent`** ([`backend/models/AnalyticsEvent.js`](file:///c:/Users/Admin/sellphone24completed/backend/models/AnalyticsEvent.js)):
   * High-volume micro-event stream.
   * Fields: `sessionId`, `eventName`, `category` (`acquisition`, `behaviour`, `valuation`, `conversion`, `search`, `ux`), `properties` (`brand`, `model`, `categorySlug`, `storage`, `color`, `condition`, `calculatedPrice`, `hesitationMs`, etc.), `timestamp`.
   * **Storage Optimization**: Includes a MongoDB TTL index that automatically deletes events older than 60 days:
     `{ timestamp: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 }`.

3. **`SearchQueryLog`** ([`backend/models/SearchQueryLog.js`](file:///c:/Users/Admin/sellphone24completed/backend/models/SearchQueryLog.js)):
   * Logs all on-site catalog search queries.
   * Tracks `query`, `resultCount`, `hasResults`, `convertedToValuation`, `convertedToLead`.
   * Queries with `hasResults: false` power the **Sourcing Demand Radar**.

---

## 6. The Master Analytics Dashboard (`/analytics`)

The dashboard page at [`sellyouphone24/src/app/analytics/page.tsx`](file:///c:/Users/Admin/sellphone24completed/sellyouphone24/src/app/analytics/page.tsx) renders [`AnalyticsDashboard.tsx`](file:///c:/Users/Admin/sellphone24completed/sellyouphone24/src/components/AnalyticsDashboard.tsx). Data is refreshed via `GET /api/analytics/dashboard`.

### The 7 Intelligence Panels:

### 1. Top KPI Summary Cards
* **Total Traffic Sessions**: Real-time count of unique visitor sessions.
* **Session-to-Lead Conversion Rate**: Percentage of sessions that convert into booked pickup requests (`(pickups / totalSessions) * 100`).
* **Pickup Requests**: Total trade-in orders submitted.
* **Valuation Volume (AED)**: Total cumulative valuation price offered across all sessions.

### 2. Master Seller Conversion Funnel (8 Stages)
Visual step-by-step funnel displaying volume and retention percentage at each stage:
1. `Unique Visitors`
2. `Browsed Device`
3. `Started Valuation`
4. `Completed Valuation`
5. `Viewed Offer`
6. `Accepted Offer`
7. `Pickup Requested`
8. `Completed Payout`

### 3. Blog Performance & SEO Matrix
A data matrix ranking blogs by:
* **Readers (Views)**: Real view count tracked per article.
* **Trade-in Referrals**: Clicks on the embedded device valuation CTA banners inside blog articles (`blog_cta_clicked`).
* **SEO Alignment**: Cross-references visitor search queries with blog titles and topics to show matching search intent.
* **Engagement Score (0–100)**: Derived from actual views, referral clicks, and keyword search matches.

### 4. Top Valued Devices Performance
A top-10 matrix displaying the highest-volume devices visitors are evaluating and selling:
* Device Model name
* Brand
* Valuation inquiries
* Offers accepted
* Average cash payout in AED

### 5. Sourcing Demand Radar (Missing Product Demand)
Aggregates search queries where `hasResults === false`.
* Reveals exact unlisted devices that UAE customers are searching for (e.g. specific older iPads, niche gaming phones, smartwatches).
* Alerts operations to immediately acquire stock or add pricing models for high-demand items.

### 6. UAE Location Demand Heatmap
Breaks down visitor sessions and converted trade-in leads by Emirate and City (Dubai, Abu Dhabi, Sharjah, Ajman, etc.).

### 7. Acquisition Channel Attribution
Compares traffic sources (Google Ads / CPC, Organic Search, Social, Direct):
* Visit count
* Average Intent Score (0–100)
* Final converted leads

### 8. Dynamic Alert Banner
Automated diagnostic alerts flag issues such as:
* High unlisted model search demand (e.g., when a missing model exceeds search thresholds).
* Conversion rate optimization drop-offs if visit-to-pickup rates fall below benchmarks.

---

## 7. How to Access and Run the Analytics System

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev    # runs on port 5000
   ```
2. **Start Frontend Server**:
   ```bash
   cd sellyouphone24
   npm run dev    # runs on port 3000
   ```
3. **Open Analytics Dashboard**:
   * Navigate to: `http://localhost:3000/analytics`
   * Or access via the Admin panel at: `http://localhost:3000/admin` $\rightarrow$ Click **Analytics & Intelligence**.
