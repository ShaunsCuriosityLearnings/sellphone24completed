import AnalyticsSession from "../models/AnalyticsSession.js";
import AnalyticsEvent from "../models/AnalyticsEvent.js";
import AnalyticsRollup from "../models/AnalyticsRollup.js";
import SearchQueryLog from "../models/SearchQueryLog.js";
import Order from "../models/Order.js";
import Blog from "../models/Blog.js";

// Helper stage hierarchy for maximum stage computation
const STAGE_ORDER = [
  "visitor",
  "browsed",
  "valuation_started",
  "valuation_completed",
  "offer_viewed",
  "offer_accepted",
  "lead_submitted",
  "pickup_requested",
  "device_collected",
  "completed_sale"
];

const updateMaxStage = (currentStage, newStage) => {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  const newIndex = STAGE_ORDER.indexOf(newStage);
  return newIndex > currentIndex ? newStage : currentStage;
};

// Batch Event Ingestion Endpoint (Public API)
export const trackEvents = async (req, res) => {
  try {
    const rawPayload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const events = Array.isArray(rawPayload) ? rawPayload : [rawPayload];

    if (!events || !events.length) {
      return res.status(400).json({ message: "No events provided" });
    }

    const sessionId = events[0]?.sessionId || events[0]?.properties?.sessionId;
    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    // 1. Fetch or create session
    let session = await AnalyticsSession.findOne({ sessionId });
    if (!session) {
      session = new AnalyticsSession({
        sessionId,
        deviceType: events[0].properties?.deviceType || "desktop",
        browser: events[0].properties?.browser || "Unknown",
        os: events[0].properties?.os || "Unknown",
        marketingConsent: events[0].properties?.marketingConsent !== false,
        acquisition: {
          referrer: events[0].properties?.referrer || "direct",
          landingPage: events[0].properties?.pageUrl || "/",
          exitPage: events[0].properties?.pageUrl || "/",
          utmSource: events[0].properties?.utmSource || "direct",
          utmMedium: events[0].properties?.utmMedium || "none",
          utmCampaign: events[0].properties?.utmCampaign || "none",
          utmContent: events[0].properties?.utmContent || "none",
          utmTerm: events[0].properties?.utmTerm || "none",
          gclid: events[0].properties?.gclid || "",
          fbclid: events[0].properties?.fbclid || "",
          ttclid: events[0].properties?.ttclid || "",
          channel: events[0].properties?.utmSource ? events[0].properties.utmSource : "Organic / Direct",
        },
        geo: {
          country: events[0].properties?.country || "UAE",
          city: events[0].properties?.city || "Dubai",
          emirate: events[0].properties?.emirate || "Dubai",
          area: events[0].properties?.area || "",
        }
      });
    }

    // 2. Process each event in batch
    const eventDocs = [];
    for (const ev of events) {
      const eventName = ev.eventName;
      const category = ev.category || "behaviour";
      const props = ev.properties || {};

      eventDocs.push({
        sessionId,
        eventName,
        category,
        properties: props,
        timestamp: ev.timestamp ? new Date(ev.timestamp) : new Date(),
      });

      // Update Session Exit Page & Duration
      if (props.pageUrl) {
        session.acquisition.exitPage = props.pageUrl;
      }
      if (props.sessionDuration) {
        session.durationSeconds = Math.max(session.durationSeconds || 0, props.sessionDuration);
      }

      // Track Intent Scoring Increments
      switch (eventName) {
        case "page_view":
          session.intentScore = Math.min(100, session.intentScore + 1);
          session.maxStageReached = updateMaxStage(session.maxStageReached, "browsed");
          break;

        case "device_browsed":
        case "model_selected":
          session.intentScore = Math.min(100, session.intentScore + 5);
          session.maxStageReached = updateMaxStage(session.maxStageReached, "browsed");
          break;

        case "valuation_started":
          session.intentScore = Math.min(100, session.intentScore + 15);
          session.maxStageReached = updateMaxStage(session.maxStageReached, "valuation_started");
          break;

        case "recalculation_performed":
          session.recalculationCount += 1;
          session.intentScore = Math.min(100, session.intentScore + 3);
          break;

        case "valuation_completed":
          session.intentScore = Math.min(100, session.intentScore + 20);
          session.maxStageReached = updateMaxStage(session.maxStageReached, "valuation_completed");
          if (props.calculatedPrice) {
            session.totalPayoutOffered = Math.max(session.totalPayoutOffered || 0, props.calculatedPrice);
          }
          break;

        case "offer_viewed":
          session.intentScore = Math.min(100, session.intentScore + 5);
          session.maxStageReached = updateMaxStage(session.maxStageReached, "offer_viewed");
          break;

        case "offer_accepted":
          session.intentScore = Math.min(100, session.intentScore + 25);
          session.maxStageReached = updateMaxStage(session.maxStageReached, "offer_accepted");
          break;

        case "whatsapp_clicked":
        case "call_clicked":
          session.intentScore = Math.min(100, session.intentScore + 20);
          break;

        case "form_started":
          session.intentScore = Math.min(100, session.intentScore + 15);
          break;

        case "pickup_requested":
          session.intentScore = 100;
          session.maxStageReached = updateMaxStage(session.maxStageReached, "pickup_requested");
          session.isConverted = true;
          break;

        case "search_performed":
          if (props.searchQuery) {
            await SearchQueryLog.create({
              query: props.searchQuery,
              resultCount: props.resultCount || 0,
              hasResults: (props.resultCount || 0) > 0,
              sessionId,
            });
          }
          break;
      }
    }

    // Save Session and bulk insert Events
    await session.save();
    if (eventDocs.length > 0) {
      await AnalyticsEvent.insertMany(eventDocs);
    }

    return res.status(200).json({ status: "OK", recorded: eventDocs.length, intentScore: session.intentScore });
  } catch (error) {
    console.error("❌ Analytics tracking error:", error);
    return res.status(500).json({ message: "Failed to log analytics events", error: error.message });
  }
};

// Admin Dashboard Analytics Aggregator (Admin API)
export const getDashboardData = async (req, res) => {
  try {
    // 1. Funnel Aggregation
    const totalSessions = await AnalyticsSession.countDocuments();
    const stageCounts = await AnalyticsSession.aggregate([
      { $group: { _id: "$maxStageReached", count: { $sum: 1 } } }
    ]);

    const stageMap = {};
    stageCounts.forEach(s => { stageMap[s._id] = s.count; });

    const funnel = {
      visitors: totalSessions,
      browsed: (stageMap["browsed"] || 0) + (stageMap["valuation_started"] || 0) + (stageMap["valuation_completed"] || 0) + (stageMap["offer_viewed"] || 0) + (stageMap["offer_accepted"] || 0) + (stageMap["pickup_requested"] || 0),
      valuationStarted: (stageMap["valuation_started"] || 0) + (stageMap["valuation_completed"] || 0) + (stageMap["offer_viewed"] || 0) + (stageMap["offer_accepted"] || 0) + (stageMap["pickup_requested"] || 0),
      valuationCompleted: (stageMap["valuation_completed"] || 0) + (stageMap["offer_viewed"] || 0) + (stageMap["offer_accepted"] || 0) + (stageMap["pickup_requested"] || 0),
      offerViewed: (stageMap["offer_viewed"] || 0) + (stageMap["offer_accepted"] || 0) + (stageMap["pickup_requested"] || 0),
      offerAccepted: (stageMap["offer_accepted"] || 0) + (stageMap["pickup_requested"] || 0),
      pickupRequested: await Order.countDocuments(),
      completedSales: await Order.countDocuments({ status: "completed" }),
    };

    // 2. Top Devices Performance Matrix
    const topDevices = await AnalyticsEvent.aggregate([
      { $match: { eventName: { $in: ["valuation_completed", "offer_accepted", "pickup_requested"] }, "properties.model": { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$properties.model",
          brand: { $first: "$properties.brand" },
          valuations: { $sum: { $cond: [{ $eq: ["$eventName", "valuation_completed"] }, 1, 0] } },
          offerAccepted: { $sum: { $cond: [{ $eq: ["$eventName", "offer_accepted"] }, 1, 0] } },
          pickups: { $sum: { $cond: [{ $eq: ["$eventName", "pickup_requested"] }, 1, 0] } },
          avgValuation: { $avg: "$properties.calculatedPrice" },
        }
      },
      { $sort: { valuations: -1 } },
      { $limit: 10 }
    ]);

    // 3. Unlisted / Missing Model Search Demand (Sourcing Radar)
    const missingModelSearches = await SearchQueryLog.aggregate([
      { $match: { hasResults: false } },
      { $group: { _id: "$query", count: { $sum: 1 }, lastSearched: { $max: "$createdAt" } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 4. UAE Location Heatmap
    const locationStats = await AnalyticsSession.aggregate([
      { $group: { _id: "$geo.city", sessions: { $sum: 1 }, converted: { $sum: { $cond: ["$isConverted", 1, 0] } } } },
      { $sort: { sessions: -1 } },
      { $limit: 8 }
    ]);

    // 5. Traffic Channel & UTM Source Performance
    const trafficSources = await AnalyticsSession.aggregate([
      {
        $group: {
          _id: "$acquisition.utmSource",
          sessions: { $sum: 1 },
          valuations: { $sum: { $cond: [{ $ne: ["$maxStageReached", "visitor"] }, 1, 0] } },
          conversions: { $sum: { $cond: ["$isConverted", 1, 0] } },
          avgIntentScore: { $avg: "$intentScore" }
        }
      },
      { $sort: { sessions: -1 } },
      { $limit: 8 }
    ]);

    // 6. Pricing Elasticity Diagnostics
    const pricingElasticity = await AnalyticsEvent.aggregate([
      { $match: { eventName: "valuation_completed", "properties.calculatedPrice": { $exists: true } } },
      {
        $group: {
          _id: "$properties.condition",
          count: { $sum: 1 },
          avgPrice: { $avg: "$properties.calculatedPrice" },
        }
      }
    ]);

    // 7. Recent Anomalies & System Alerts
    const alerts = [];
    if (missingModelSearches.length > 0 && missingModelSearches[0].count > 3) {
      alerts.push({
        type: "warning",
        title: "High Unlisted Model Search Demand",
        message: `Users searched "${missingModelSearches[0]._id}" ${missingModelSearches[0].count} times recently. Consider adding this product model.`,
      });
    }

    // 8. Ad Campaign & Paid Attribution Breakdown
    const adCampaignStats = await Order.aggregate([
      {
        $group: {
          _id: "$marketingAttribution.source",
          ordersCount: { $sum: 1 },
          totalPayoutAED: { $sum: "$totalPayout" },
          campaigns: { $addToSet: "$marketingAttribution.campaign" }
        }
      },
      { $sort: { ordersCount: -1 } }
    ]);

    // 9. Privacy & Cookie Consent Opt-in Metrics
    const consentStats = {
      analyticsOptInCount: await AnalyticsSession.countDocuments({ marketingConsent: true }),
      essentialOnlyCount: await AnalyticsSession.countDocuments({ marketingConsent: false }),
    };

    const conversionRate = totalSessions > 0 ? ((funnel.pickupRequested / totalSessions) * 100).toFixed(1) : "0.0";
    if (totalSessions > 20 && parseFloat(conversionRate) < 2.0) {
      alerts.push({
        type: "info",
        title: "Conversion Rate Optimization Opportunity",
        message: `Current visit-to-pickup conversion is ${conversionRate}%. Review form friction diagnostics.`,
      });
    }

    // 10. Blog Performance & SEO Analysis Matrix
    const blogsList = await Blog.find({}).sort({ views: -1 }).limit(10);
    const blogAnalytics = blogsList.map((blog, idx) => {
      const views = blog.views || 0;
      const score = Math.min(100, Math.round((views / 15) + (blog.likes || 0) * 2 + 60));
      return {
        rank: idx + 1,
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        author: blog.author,
        views: views,
        likes: blog.likes || 0,
        score: score,
        productReferralClicks: Math.round(views * 0.18),
        seoKeywordMatch: blog.category === "Price Analysis" ? "High Target" : "Optimal",
      };
    });

    return res.status(200).json({
      summary: {
        totalSessions,
        conversionRate: `${conversionRate}%`,
        totalOrders: funnel.pickupRequested,
        completedSales: funnel.completedSales,
        totalValuationVolumeAED: (await AnalyticsSession.aggregate([{ $group: { _id: null, sum: { $sum: "$totalPayoutOffered" } } }]))[0]?.sum || 0,
      },
      funnel,
      topDevices,
      missingModelSearches,
      locationStats,
      trafficSources,
      pricingElasticity,
      adCampaignStats,
      consentStats,
      blogAnalytics,
      alerts,
    });
  } catch (error) {
    console.error("❌ Analytics dashboard error:", error);
    return res.status(500).json({ message: "Failed to generate analytics dashboard data", error: error.message });
  }
};
