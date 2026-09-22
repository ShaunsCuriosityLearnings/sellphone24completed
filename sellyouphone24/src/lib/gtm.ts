// sellyouphone24/src/lib/gtm.ts

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TJFWWLNZ";

export const pushDataLayer = (eventData: { event: string; [key: string]: any }) => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
    
    if (process.env.NODE_ENV === "development") {
      console.log("📊 [Sellphonecash GTM Event Pushed]:", eventData);
    }
  }
};
