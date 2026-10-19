# 📱 Sell Phones Admin Panel — Complete Operational Manual

**Route:** `/admin`  
**Target Operations:** Inbound Device Trade-In Sourcing, Valuation Pricing Engine, Doorstep Courier Pickups & Cash Payouts  
**System Version:** 2.4.0  

---

## 1. System Overview & Business Impact

The **Sell Phones Admin Panel** is the operational backbone for the device trade-in and cash buyout engine of SellPhone24. It empowers administrators and operations managers to:
- **Control the Pricing Engine**: Adjust base trade-in valuations, storage upgrade boosts, and condition markdown percentages across 5 device categories (Smartphones, Laptops, Watches, Tablets, Consoles).
- **Manage Doorstep Collection Leads**: Review incoming customer trade-in bookings, assign logistics couriers, and track device verification at the customer's doorstep.
- **Drive Inbound Lead Generation**: Dynamically configure and monitor 93 programmatic SEO landing pages without code redeployments.
- **Automate Records & Accounting**: Sync trade-in leads automatically to the Google Sheet tab `"Sell Phone Leads"` and dispatch instant trade-in receipt emails.

---

## 2. Authentication & Access Control

Access to `/admin` is protected by **Clerk Authentication** and a strict server-side email allowlist:
- `admin@sellyourphone24.com`
- `shaun@sellyourphone24.com`
- `sellphone24phone@gmail.com`
- `mesouq2@gmail.com`

> **Note:** If an unauthorized user logs in via Clerk, the panel denies access and displays an *Unauthorized Access* screen.

---

## 3. Architecture & Technical Dependencies

| Component | Technology | File Path |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js App Router (React, Tailwind, Lucide Icons) | `sellyouphone24/src/app/admin/page.tsx` |
| **Backend REST APIs** | Express.js Router & Controllers | `backend/routes/orderRoutes.js`, `backend/routes/productRoutes.js` |
| **Database Schema** | MongoDB / Mongoose Collection: `orders` | `backend/models/Order.js`, `backend/models/Product.js` |
| **Google Sheets Sync** | Apps Script Webhook (`appendSellLead`) | `backend/utils/googleSheetsService.js` $\to$ Tab: `"Sell Phone Leads"` |
| **Transactional Email** | Nodemailer Live SMTP (Gmail Port 587, Brand Blue `#0284c7`) | `backend/utils/emailService.js`, `backend/utils/emailTemplates.js` |

---

## 4. Screen-by-Screen Feature Walkthrough

### Tab 1: Orders & Valuation Leads (`OrdersTable`)
- **Search & Filter**: Search by Customer Name, Phone, Email, Order ID, or City. Filter by Status (`pending`, `pickup_assigned`, `inspected`, `completed`, `cancelled`).
- **Lead Snapshot**:
  - Customer contact details & physical doorstep address.
  - Scheduled pickup date and preferred time slot.
  - Itemized device specifications: Brand, Model, Storage, Color, Selected Condition grade.
  - Total Cash Payout amount (AED).
  - Marketing attribution (Source, Medium, UTM Campaign, GCLID).
- **Status Lifecycle Control**:
  - `pending` $\to$ Valuation submitted by user, awaiting verification.
  - `pickup_assigned` $\to$ Courier driver scheduled for doorstep pickup.
  - `inspected` $\to$ Technician verified device physical/hardware condition.
  - `completed` $\to$ Physical device handed over and cash payout settled.
  - `cancelled` $\to$ Customer rejected valuation or cancelled pickup.
- **Sync Actions**: Status badge showing Google Sheets sync state with a 1-click **Retry Sync** button.

### Tab 2: Catalog & Pricing Engine (`ProductManager`)
- **Add / Edit Device**: Configure Base Device Valuation, Category, and Brand.
- **Spec Variants Preset**: 1-click generation of storage sizes (`128GB`, `256GB`, `512GB`, `1TB`) with custom price boosts (e.g. `+200 AED`).
- **Condition Deductions**:
  - *Flawless*: 100% of calculated value.
  - *Good*: 85% of calculated value (minor cosmetic wear).
  - *Average*: 70% of calculated value (visible scratches, 80%+ battery).
  - *Below Average*: 50% of calculated value (heavy denting/cracked back).

### Tab 3: Custom Valuation Requests (`CustomRequestManager`)
- Displays custom device inquiries submitted by users with unlisted devices.
- Shows customer notes, photos, and requested quote.

### Tab 4: Programmatic SEO Engine (`SeoPagesManager`)
- Real-time management of all 93 SEO routes (`/sell/model/...`, `/sell/location/...`).
- Override H1 titles, meta descriptions, and minimum offer price badges instantly without code builds.

### Tab 5: Database Safe Backup & Restore (`DatabaseManager`)
- 1-click JSON snapshot exports (`/api/database/backup`) saved to `backend/backups/`.
- 1-click rollback restoration (`/api/database/restore`).

---

## 5. End-to-End Walkthrough: Concrete Dummy Example

### Scenario
Customer **Tariq Mansoor** wants to sell his pre-owned **Apple iPhone 15 Pro Max (256GB)** in **Flawless** condition and book a cash doorstep pickup in **Downtown Dubai**.

---

### Step 1: Customer Submits Valuation on Frontend
- **Device Selected**: Apple iPhone 15 Pro Max
- **Storage**: 256GB (`+200 AED` boost on base price 3,050 AED = 3,250 AED)
- **Condition**: Flawless (100% payout = **AED 3,250**)
- **Pickup Address**: Boulevard Plaza Tower 1, Apt 1402, Downtown, Dubai
- **Pickup Slot**: Tomorrow, 10:00 AM - 01:00 PM
- **Payment Method**: Cash on Pickup

---

### Step 2: System Automatic Dispatches

1. **MongoDB Record Created (`Order` Collection)**:
```json
{
  "_id": "671390ab128f7c9e012a45bc",
  "customerDetails": {
    "name": "Tariq Mansoor",
    "phone": "+971 50 123 4567",
    "email": "tariq.mansoor@example.ae",
    "address": "Boulevard Plaza Tower 1, Apt 1402",
    "city": "Dubai"
  },
  "pickupSchedule": {
    "pickupDate": "Tomorrow",
    "pickupTime": "10:00 AM - 01:00 PM"
  },
  "devices": [{
    "name": "iPhone 15 Pro Max",
    "brand": "Apple",
    "selectedStorage": "256GB",
    "selectedCondition": "Flawless",
    "calculatedPrice": 3250,
    "quantity": 1
  }],
  "totalPayout": 3250,
  "paymentMethod": "cash",
  "status": "pending",
  "googleSheetsSync": { "isSynced": true, "syncedAt": "2026-10-19T10:00:00Z" }
}
```

2. **Google Sheet Synced ("Sell Phone Leads" Tab)**:
```text
| Timestamp           | Order ID                 | Customer Name  | Phone           | City  | Pickup Date | Time Slot             | Devices & Condition                                  | Payout (AED) | Status  |
| 2026-10-19 10:00:00 | 671390ab128f7c9e012a45bc | Tariq Mansoor  | +971 50 123 4567| Dubai | Tomorrow    | 10:00 AM - 01:00 PM   | Apple iPhone 15 Pro Max (256GB, Flawless) x1 @ 3,250 | 3,250        | pending |
```

3. **Customer Confirmation Email Dispatched (Brand Blue Theme `#0284c7`)**:
   - **Subject**: `Order Confirmed - #671390ab128f7c9e012a45bc | SellPhoneCash`
   - **Headline**: "Order Confirmed! 🎉"
   - **Payout Card**: "Estimated Cash Payout: **AED 3,250.00** (Cash on Pickup)"
   - **Pickup Schedule**: "Tomorrow @ 10:00 AM - 01:00 PM | Boulevard Plaza Tower 1, Apt 1402, Dubai"
   - **Next Steps**: Verification team assigns courier $\to$ Doorstep physical check $\to$ Cash handed over immediately.

---

### Step 3: Admin Operations in `/admin`

1. Open `/admin` and click the **"Orders & Valuation Leads"** tab.
2. Locate order `#671390ab128f7c9e012a45bc` for **Tariq Mansoor**.
3. Call the customer via phone link: `+971 50 123 4567` to confirm availability.
4. **Assign Courier**: Change status dropdown from `pending` to `pickup_assigned`:
   - System automatically dispatches **Order Status Update Email** to customer:
     > *"Your device pickup has been assigned to our logistics driver. They will arrive between 10:00 AM - 01:00 PM."*
5. **Doorstep Physical Inspection**:
   - Courier driver checks screen, TrueTone, FaceID, battery health (95%), and pristine body.
   - Device condition matches "Flawless".
6. **Cash Settlement**:
   - Courier gives customer **AED 3,250** in cash and collects device with signed transfer receipt.
7. **Complete Order**:
   - Admin sets status to `completed`.
   - Google Sheet updates to `completed`.
   - Customer receives final completion receipt email.
8. *(Optional)* **Cross-Inventory Import**: Admin can take this verified phone and click **"Import to Buy Phones Catalog"** in `/admin/buy-phones` with a retail resale margin!

---

## 6. Troubleshooting & FAQs

### Q: Why does an order show "Sync Failed" for Google Sheets?
**A:** If your Google Apps Script was temporarily warming up or the network timed out, click the red **Retry Sync** button next to the order. The system will re-post the payload directly to the `"Sell Phone Leads"` tab.

### Q: How do I change device prices across the website?
**A:** Go to `/admin` $\to$ **Catalog & Pricing Engine** $\to$ click **Edit** on any device model $\to$ update the Base Price or Storage Upgrade Boosts $\to$ click **Save**. The dynamic calculator on the website updates immediately without redeploying.
