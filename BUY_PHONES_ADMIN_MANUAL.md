# 🛒 Buy Phones Admin Panel — Complete Operational Manual

**Route:** `/admin/buy-phones`  
**Target Operations:** Certified Pre-Owned Resale Marketplace, Inventory Stock Management, Doorstep Deliveries & Warranty Issuance  
**System Version:** 2.4.0  

---

## 1. System Overview & Business Impact

The **Buy Phones Admin Panel** is the e-commerce nerve center for SellPhone24's certified pre-owned smartphone resale business. It allows store managers to:
- **Publish & Manage Inventory**: Manage pristine pre-owned smartphones with transparent cosmetic grades, verified battery health percentages, and genuine screen certifications.
- **1-Click Import from Trade-In Catalog**: Instantly convert trade-in models into resale listings with custom profit margin multipliers (e.g., $1.25\times$ trade-in cost).
- **Brand Catalog Linking**: Bind products to official brand logos for dedicated brand showroom pages (`/buy-phones/brand/[slug]`).
- **Fulfill Customer Delivery Orders**: Track orders across the UAE (Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah) from verification to doorstep delivery with Cash or Card on Delivery.
- **Automate Warranty & Accounting**: Automatically sync purchase orders to the Google Sheet tab `"Buy Phone Orders"`, issue **12-Month Store Warranty Certificates**, and dispatch status updates.

---

## 2. Authentication & Access Control

Access to `/admin/buy-phones` is secured by **Clerk Authentication** and restricted to authorized administrator emails:
- `admin@sellyourphone24.com`
- `shaun@sellyourphone24.com`
- `sellphone24phone@gmail.com`
- `mesouq2@gmail.com`

---

## 3. Architecture & Technical Dependencies

| Component | Technology | File Path |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js App Router (React, Tailwind, Lucide Icons) | `sellyouphone24/src/app/admin/buy-phones/page.tsx` |
| **Backend REST APIs** | Express.js Router & Controllers | `backend/routes/buyOrderRoutes.js`, `backend/routes/buyProductRoutes.js` |
| **Database Schemas** | MongoDB / Mongoose Collections: `buyproducts`, `buyorders` | `backend/models/BuyProduct.js`, `backend/models/BuyOrder.js` |
| **Google Sheets Sync** | Apps Script Webhook (`appendBuyOrder`) | `backend/utils/googleSheetsService.js` $\to$ Tab: `"Buy Phone Orders"` |
| **Transactional Email** | Nodemailer Live SMTP (Gmail Port 587, Emerald Theme `#059669`) | `backend/utils/buyOrderEmailService.js`, `backend/utils/buyOrderEmailTemplates.js` |

---

## 4. Screen-by-Screen Feature Walkthrough

### 1. KPI Metrics Banner (Top of Screen)
- **Total Orders**: Cumulative count of orders placed on `/buy-phones`.
- **Total Revenue (AED)**: Gross value of all completed and pending orders.
- **Available Stock**: Total units currently available across all active listings.
- **Out of Stock**: Count of phones with `stock = 0`.
- **Average Order Value (AOV)**: Average transaction size in AED.

### 2. Tab: Handsets Inventory (`BuyProductManager`)
- **Add Product Modal**:
  - **Form Source**: Choose between *Custom Manual Entry* or *1-Click Import from Trade-In Catalog*.
  - **Brand Selection**: Select official brand (Apple, Samsung, Google, OnePlus, Xiaomi) to generate automatic brand links.
  - **Pricing**: Selling Price (AED) and Original Retail Strikethrough Price (e.g., `Price: 3,299 | Original: 4,499`).
  - **Condition Grade**:
    - `Pristine (Like New)`: Zero scratches, flawless body.
    - `Excellent`: Minor imperceptible hairline marks.
    - `Good`: Normal light cosmetic wear, 100% functional.
  - **Hardware Quality Specs**: Battery Health percentage (e.g. `98% Original OEM`), Warranty terms (e.g. `12 Months Comprehensive Store Warranty`).
  - **Stock Quantity**: Real-time inventory counter. Decrements automatically upon checkout; auto-switches to `Out of Stock` when reaching 0.
  - **Variants**: Comma-separated Storage options (`128GB, 256GB, 512GB`) and Colors (`Natural Titanium, Black Titanium`).

### 3. Tab: Orders & Deliveries (`BuyOrdersTable`)
- **Search & Filter**: Search by Order Number (`BUY-YYYYMMDD-XXXX`), Customer Name, Phone, Email, or City. Filter by status (`all`, `pending`, `confirmed`, `dispatched`, `delivered`, `cancelled`).
- **Order Card Breakdown**:
  - Customer contact details & doorstep address (Street, Villa/Apt, Building, City).
  - Itemized handsets ordered with color, storage, condition, quantity, and unit price.
  - Payment Method badge (`Cash on Delivery` or `Card on Delivery`).
  - Special delivery notes submitted by the buyer.
- **Status Lifecycle Control**:
  - `pending` $\to$ Order received; warehouse verifying IMEI and accessory packaging.
  - `confirmed` $\to$ Order verified; security tamper seal applied with 12-month warranty certificate card.
  - `dispatched` $\to$ Express courier partner has picked up parcel for same-day/next-day doorstep delivery.
  - `delivered` $\to$ Package handed to customer, payment collected via Cash or Mobile POS terminal, warranty officially activated.
  - `cancelled` $\to$ Customer cancelled or failed verification.
- **Actions**:
  - **Google Sheets Sync Status**: Shows green badge if recorded; red badge with **Retry Sync** button if network failed.
  - **WhatsApp Direct**: Opens WhatsApp Web / Mobile pre-filled with:  
    `"Hello [Customer Name], this is SellPhone24 regarding your order #[OrderNumber]..."`

---

## 5. End-to-End Walkthrough: Concrete Dummy Example

### Scenario
Customer **Mariam Al Suwaidi** wants to buy a certified pre-owned **Samsung Galaxy S24 Ultra (512GB, Titanium Gray)** in **Pristine** condition with **Card on Delivery** to **Corniche Road, Abu Dhabi**.

---

### Step 1: Admin Sets Up Inventory in `/admin/buy-phones`

1. Open `/admin/buy-phones` $\to$ Click **"Add Handset"**.
2. Select **Form Source**: *"1-Click Import from Trade-In"* $\to$ pick **Samsung Galaxy S24 Ultra**.
3. System pre-fills specs:
   - **Title**: Samsung Galaxy S24 Ultra 5G
   - **Brand**: Samsung (Linked to Samsung Brand ID)
   - **Price**: AED 3,299 *(Original Price: AED 4,999)*
   - **Condition**: Pristine (Like New)
   - **Battery Health**: 99% (Original OEM)
   - **Warranty**: 12 Months Comprehensive Store Warranty
   - **Stock**: 2 units
   - **Storage**: 256GB, 512GB, 1TB
   - **Colors**: Titanium Gray, Titanium Black
4. Click **"Save & Publish"**.
5. The device immediately appears live on `/buy-phones` and `/buy-phones/brand/samsung`.

---

### Step 2: Customer Purchases Phone on `/buy-phones`

1. Mariam selects **512GB** and **Titanium Gray**.
2. Adds to Cart $\to$ proceeds to Checkout.
3. Enters details:
   - **Name**: Mariam Al Suwaidi
   - **Phone**: `+971 52 987 6543`
   - **Email**: `mariam.suwaidi@example.ae`
   - **Address**: Corniche Tower A, Flat 804, Corniche Road, Abu Dhabi
   - **Payment Method**: Card on Delivery (POS Machine at Doorstep)
   - **Notes**: *"Please call 30 mins before arrival."*
4. Clicks **"Confirm & Place Order"**.

---

### Step 3: Automatic System Processing

1. **MongoDB Decrements Stock (`BuyProduct` Collection)**:
   - Stock automatically reduces from `2` $\to$ `1`.
2. **MongoDB Creates Order (`BuyOrder` Collection)**:
   - Generates unique Order Number: `BUY-20261019-4821`.
3. **Google Sheet Sync ("Buy Phone Orders" Tab)**:
```text
| Timestamp           | Order Number        | Customer Name     | Phone           | City      | Purchased Handsets                                          | Total (AED) | Payment Method   | Status  |
| 2026-10-19 10:15:00 | BUY-20261019-4821   | Mariam Al Suwaidi | +971 52 987 6543| Abu Dhabi | Samsung Galaxy S24 Ultra (512GB, Titanium Gray, Pristine) x1 | 3,299       | Card on Delivery | pending |
```
4. **Customer Receives Emerald E-Commerce Invoice Email (`#059669`)**:
   - **Subject**: `Order Confirmation #BUY-20261019-4821 | SellPhone24 Certified Store`
   - **Header**: "SellPhone24 Store — Certified Pre-Owned & Open-Box"
   - **Invoice Details**: Total Due: **AED 3,299.00** | Shipping: **FREE** | Payment: **Card on Delivery (POS)**
   - **Warranty Certificate Card**:
     > *"🛡️ 12-Month Comprehensive Store Warranty Included. 32-Point Technician Inspection Passed: Genuine Dynamic AMOLED 2X Display, 99% Battery Health, Clean IMEI TRA Unlocked."*
   - **WhatsApp Support Link**: Pre-configured button to chat with support.
5. **Admin Receives Order Notification Alert**:
   - Sent to `sellphone24phone@gmail.com` with one-click button: *"Open in Buy Phones Admin"*.

---

### Step 4: Admin Fulfillment in `/admin/buy-phones`

1. Open `/admin/buy-phones` $\to$ click the **"Orders & Deliveries"** tab.
2. Locate order `#BUY-20261019-4821` for **Mariam Al Suwaidi**.
3. **Packaging**: Warehouse technician inspects handset, cleans with anti-static solution, packs inside luxury unboxing box with charging cable, and slips in physical **12-Month Store Warranty Certificate**.
4. **Dispatched**:
   - Admin changes status dropdown to `dispatched`.
   - Courier driver departs with mobile POS credit card machine.
   - Customer automatically receives **"Your Smartphone is On the Way!"** email:
     > *"Your parcel is out for express delivery in Abu Dhabi. Please have your credit/debit card ready for the courier's POS machine."*
5. **Doorstep Delivery & Payment**:
   - Driver arrives at Corniche Tower A, Flat 804.
   - Mariam inspects outer box and powers on phone.
   - Mariam taps card on courier POS terminal: **AED 3,299** settled.
6. **Delivered**:
   - Admin marks order status as `delivered` and payment status as `paid`.
   - Google Sheet updates to `delivered` & `paid`.
   - Customer receives final email:
     > *"🎉 Delivered Successfully! Your 12-Month Store Warranty is officially active as of today."*

---

## 6. Troubleshooting & FAQs

### Q: What happens if a customer orders the last phone in stock?
**A:** When `stock` reaches `0`, the system automatically sets `isAvailable = false`. The frontend immediately disables the "Add to Cart" button and shows an **"Out of Stock"** badge, preventing backorders.

### Q: What if the courier needs to contact the customer directly?
**A:** Inside the order card in `/admin/buy-phones`, click the green **WhatsApp** button. It opens a direct WhatsApp chat with the customer's phone number and pre-populates their order number and delivery address.

### Q: How do I re-sync an order if the Google Sheet shows an error?
**A:** Click the **Retry Sync** button next to the order. It re-sends the payload to the Apps Script webhook without duplicating any database records.
