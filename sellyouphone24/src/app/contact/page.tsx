import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export const metadata = {
  title: "Contact Us | SellYourPhone24",
  description: "Get in touch with SellYourPhone24. We are based in Dubai Silicon Oasis. Contact our support team for bulk device quotes, pickup coordination, or general help.",
};

const ContactPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 text-slate-800">
      
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
          How Can We <span className="text-emerald-500">Help You?</span>
        </h1>
        <p className="text-sm text-slate-500">
          Have questions about valuation, pickup schedules, or corporate buybacks? Contact our support team below.
        </p>
      </div>

      {/* Grid containing details and form */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-lg border-b pb-3">Get in Touch</h3>
            
            <div className="space-y-5 text-sm text-slate-600">
              {/* Telephone */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Phone Support</h4>
                  <p className="mt-1">+971 4 123 4567</p>
                  <p className="text-[10px] text-slate-400">Available Mon-Sat (9:00 AM - 6:00 PM)</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Email Channels</h4>
                  <p className="mt-1">support@sellyourphone24.com</p>
                  <p className="text-[10px] text-slate-400">Response within 2 hours</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Dubai Headquarters</h4>
                  <p className="mt-1 leading-normal">
                    Office 402, Techno Hub 2, Dubai Silicon Oasis, Dubai, United Arab Emirates
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Box Mockup */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-lg relative overflow-hidden h-[180px] flex items-center justify-center text-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 space-y-2">
              <span className="text-3xl">📍</span>
              <h4 className="font-extrabold text-sm text-white">Techno Hub 2, DSO</h4>
              <p className="text-[10px] text-slate-400">Open in Google Maps →</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[40px] p-6 md:p-10 shadow-sm">
          <form className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Send us a Message</h2>
              <p className="text-xs text-slate-500 mt-1">Our support agents typically respond within a business hour.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm w-full bg-slate-50/50"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm w-full bg-slate-50/50"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Subject</label>
              <input
                type="text"
                placeholder="Valuation query, pickup modification, bulk trade-in..."
                className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm w-full bg-slate-50/50"
                required
              />
            </div>

            {/* Message Body */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Message Body</label>
              <textarea
                placeholder="Type your question or request detail here..."
                rows={5}
                className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm w-full resize-none bg-slate-50/50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3.5 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <Send size={14} />
              Submit Message
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
