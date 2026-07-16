export const metadata = {
  title: "Privacy Policy & Data Sanitization | SellYourPhone24",
  description: "Read our privacy guidelines. SellYourPhone24 enforces strict personal data security and complete military-grade device data erasure on all bought mobiles.",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
      
      {/* Header section */}
      <div className="space-y-3 border-b pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 font-semibold uppercase">Last Updated: June 25, 2026</p>
      </div>

      {/* Main Text Content */}
      <section className="space-y-4">
        <p>
          At SellYourPhone24, we recognize the sensitivity of your personal information. This Privacy Policy outlines the types of data we collect, how we secure it, and our strict protocols for sanitizing user information on all mobile phones, tablets, and smartwatches purchased through our platform.
        </p>
        <p>
          By accessing SellYourPhone24, scheduling a doorstep pickup, or submitting device details, you consent to the collections and data practices outlined below in compliance with United Arab Emirates Federal Laws on Personal Data Protection.
        </p>
      </section>

      {/* Section 1: Device Data Sanitization */}
      <section className="space-y-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
        <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>🔒</span>
          1. Critical Device Data Sanitization Guarantee
        </h2>
        <p className="text-xs md:text-sm text-slate-600">
          We maintain a zero-tolerance policy on personal data remnants. While we require all sellers to perform a factory reset before handing over their device:
        </p>
        <ul className="list-disc pl-6 text-xs md:text-sm text-slate-600 space-y-2">
          <li>
            <strong>Secondary Inspection Wipe:</strong> Upon receipt, our engineering team subjects every device to professional data sanitization software to overwrite memory blocks and prevent recovery of emails, photos, or messages.
          </li>
          <li>
            <strong>Activation Lock Auditing:</strong> If a device is found with Find My iPhone (iCloud Lock) or Google Account Lock enabled, we suspend processing and contact the seller to guide them through remote removal. We do not resell or store locked devices.
          </li>
          <li>
            <strong>Physical Destruction:</strong> Devices that are broken beyond repair are immediately dismantled, and their storage chips are physically destroyed at certified recycling facilities to ensure data remains permanently unrecoverable.
          </li>
        </ul>
      </section>

      {/* Section 2: Personal Information We Collect */}
      <section className="space-y-3">
        <h2 className="text-base md:text-lg font-bold text-slate-800">2. Personal Information We Collect</h2>
        <p>
          We collect personal information necessary to facilitate valuations, doorstep collection, and payouts. This includes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Contact Details:</strong> Full name, email address, and UAE phone number.</li>
          <li><strong>Logistical Information:</strong> Complete pickup address, city, and preferred pickup schedules.</li>
          <li><strong>Payout Details:</strong> Payout selections and related data, such as IBAN details, account holder name, or PayPal email accounts. We do not store credit card credentials.</li>
        </ul>
      </section>

      {/* Section 3: Third Party Disclosures */}
      <section className="space-y-3">
        <h2 className="text-base md:text-lg font-bold text-slate-800">3. Information Sharing and Disclosure</h2>
        <p>
          We do not sell, rent, or trade your personal data to advertising companies. We share contact information strictly with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Authorized Couriers:</strong> Delivery networks to fulfill the scheduled doorstep inspection.</li>
          <li><strong>UAE Banking Channels:</strong> Financial networks to execute instant bank transfers or payouts.</li>
          <li><strong>Regulatory Authorities:</strong> Law enforcement agencies when required under federal buyback laws to report device serial numbers to confirm they are not flagged as stolen.</li>
        </ul>
      </section>

      {/* Section 4: Security and Storage */}
      <section className="space-y-3">
        <h2 className="text-base md:text-lg font-bold text-slate-800">4. Security of Information</h2>
        <p>
          All data inputs are encrypted in transit using industry-standard TLS (Transport Layer Security). We maintain firewalled database systems to safeguard personal data records against unauthorized entry, loss, or alteration.
        </p>
      </section>

      {/* Contact Section */}
      <section className="space-y-2 border-t pt-6 text-slate-500 text-xs">
        <p>
          For queries concerning device wipes, data protection compliance, or deleting your profile, please contact our Data Protection Officer:
        </p>
        <p className="font-bold text-slate-600">
          Email: privacy@sellyourphone24.com | Address: Techno Hub 2, Dubai Silicon Oasis, UAE
        </p>
      </section>

    </div>
  );
};

export default PrivacyPolicyPage;
