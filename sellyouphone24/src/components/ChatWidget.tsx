"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, PhoneCall, CheckCircle2, Search, ArrowRight, ShieldCheck, Sparkles, Smartphone, Tag, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: { label: string; value: string; icon?: string }[];
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<"menu" | "get_in_touch_model" | "know_value_model" | "order_status_id" | "capture_contact" | "completed">("menu");
  const [inquiryType, setInquiryType] = useState<"get_in_touch" | "know_value" | "order_status">("get_in_touch");
  
  // Captured Form Data
  const [deviceModel, setDeviceModel] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  
  const [inputVal, setInputVal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = () => {
    setStep("menu");
    setMessages([
      {
        id: "1",
        sender: "bot",
        text: "👋 Hi there! Welcome to SellPhoneCash support. How can we help you today?",
        options: [
          { label: "💬 Get in Touch (Specific Device)", value: "get_in_touch" },
          { label: "💰 Know My Device Value", value: "know_value" },
          { label: "📦 Know Order Status", value: "order_status" },
        ],
      },
    ]);
  };

  const handleSelectOption = (value: string) => {
    if (value === "get_in_touch") {
      setInquiryType("get_in_touch");
      setStep("get_in_touch_model");
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: "💬 Get in Touch (Specific Device)" },
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Please type the specific device model & specs you want to discuss (e.g. iPhone 15 Pro 256GB, PS5, etc.):",
        },
      ]);
    } else if (value === "know_value") {
      setInquiryType("know_value");
      setStep("know_value_model");
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: "💰 Know My Device Value" },
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "What device model are you looking to get a valuation for?",
        },
      ]);
    } else if (value === "order_status") {
      setInquiryType("order_status");
      setStep("order_status_id");
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: "📦 Know Order Status" },
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Please enter your Order ID or the Email Address used when placing your sell request:",
        },
      ]);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputVal.trim();
    if (!text) return;

    setInputVal("");

    // Add user message
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text }]);

    if (step === "get_in_touch_model" || step === "know_value_model") {
      setDeviceModel(text);
      setStep("capture_contact");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `Got it! Before connecting you with our customer support team regarding your "${text}", please enter your contact details so we can save your inquiry.`,
        },
      ]);
    } else if (step === "order_status_id") {
      setOrderQuery(text);
      setIsSubmitting(true);
      try {
        const orders = await api.getOrders();
        const found = orders.find(
          (o: any) =>
            o._id?.toLowerCase() === text.toLowerCase() ||
            o.customerDetails?.email?.toLowerCase() === text.toLowerCase() ||
            o.customerDetails?.phone?.includes(text)
        );

        if (found) {
          setFoundOrder(found);
          setStep("completed");
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: "bot",
              text: `✅ Order Found!\n• Order ID: #${found._id}\n• Status: ${found.status.toUpperCase()}\n• Payout: AED ${found.totalPayout}\n• Scheduled Date: ${found.pickupSchedule?.pickupDate || "N/A"} (${found.pickupSchedule?.pickupTime || "N/A"})`,
              options: [
                { label: "💬 Connect with Support on WhatsApp", value: "whatsapp" },
                { label: "🔄 Main Menu", value: "menu" },
              ],
            },
          ]);
        } else {
          setStep("capture_contact");
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: "bot",
              text: `We couldn't immediately locate order "${text}". Please enter your details below so support can locate your account and connect with you directly.`,
            },
          ]);
        }
      } catch (err) {
        setStep("capture_contact");
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "Please enter your contact details so our support team can verify your order details.",
          },
        ]);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCaptureFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || (!userEmail.trim() && !userPhone.trim())) {
      toast.error("Please provide your name and phone number or email");
      return;
    }

    setIsSubmitting(true);
    try {
      // Capture lead data to custom-requests (triggers email notification to sellphone24phone@gmail.com)
      await api.submitCustomDeviceRequest({
        name: userName.trim(),
        email: userEmail.trim() || "support-lead@sellphonecash.com",
        phone: userPhone.trim() || "+971000000000",
        deviceBrand: inquiryType === "order_status" ? "Order Inquiry" : "Custom Device",
        deviceModel: deviceModel || orderQuery || "General Support",
        condition: "flawless",
        description: `Chatbot lead via web widget [Type: ${inquiryType}]. Customer Note: ${deviceModel || orderQuery}`,
      });

      setStep("completed");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text: `Details submitted: ${userName} (${userPhone || userEmail})`,
        },
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `🎉 Thank you, ${userName}! Your details have been captured and logged with support. Click below to connect live on WhatsApp or call support.`,
          options: [
            { label: "💬 Connect with Live Support on WhatsApp", value: "whatsapp" },
            { label: "📞 Call Support (+971 50 123 4567)", value: "call" },
            { label: "🔄 Start New Chat", value: "menu" },
          ],
        },
      ]);
      toast.success("Details saved! Connecting to support...");
    } catch (err) {
      toast.error("Failed to submit lead data, connecting anyway...");
      setStep("completed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActionOption = (val: string) => {
    if (val === "whatsapp") {
      const msg = encodeURIComponent(
        `Hi SellPhoneCash Support! My name is ${userName || "Customer"}. I'd like support regarding: ${deviceModel || orderQuery || "Device Valuation"}`
      );
      window.open(`https://wa.me/971501234567?text=${msg}`, "_blank");
    } else if (val === "call") {
      window.open("tel:+971501234567", "_self");
    } else if (val === "menu") {
      initChat();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="w-[360px] sm:w-[390px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 mb-4">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-white text-sm shadow-md">
                  S
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  SellPhoneCash Assistant
                  <Sparkles size={13} className="text-emerald-400" />
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Online • Instant Valuation Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-emerald-500 text-slate-950 font-medium rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>

                {/* Dynamic Choice Buttons */}
                {m.options && m.options.length > 0 && (
                  <div className="flex flex-col gap-2 mt-3 w-full">
                    {m.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          if (step === "completed") {
                            handleActionOption(opt.value);
                          } else {
                            handleSelectOption(opt.value);
                          }
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 font-semibold transition flex items-center justify-between text-xs cursor-pointer shadow-sm"
                      >
                        <span>{opt.label}</span>
                        <ArrowRight size={14} className="text-emerald-500 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* MANDATORY CONTACT CAPTURE FORM STEP */}
            {step === "capture_contact" && (
              <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs border-b pb-2">
                  <ShieldCheck size={16} />
                  <span>Connect with Customer Support</span>
                </div>
                <form onSubmit={handleCaptureFormSubmit} className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. John Smith"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="e.g. +971 50 123 4567"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save & Connect Support"}
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          {step !== "menu" && step !== "capture_contact" && step !== "completed" && (
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isSubmitting}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl transition disabled:opacity-40 cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          )}

        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer border-2 border-white"
        aria-label="Open Chatbot"
      >
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-ping" />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />
        
        {isOpen ? (
          <X size={26} className="text-slate-950 transition-transform duration-300 rotate-90" />
        ) : (
          <MessageSquare size={26} className="text-slate-950 transition-transform duration-300 group-hover:rotate-12" />
        )}

        {/* Floating Tooltip Label */}
        {!isOpen && (
          <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
            <Sparkles size={12} className="text-emerald-400" />
            Chat with Support
          </span>
        )}
      </button>
    </div>
  );
}
