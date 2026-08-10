"use client";

import { useEffect, useState } from "react";
import { Recycle, ShieldCheck, Award, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { TestimonialType } from "@/types";

const fallbackReviews: TestimonialType[] = [
  {
    name: "Ahmed R.",
    location: "Dubai Marina",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    quote: "Got my iPhone 15 Pro Max picked up in 1 hour and received cash instantly. Super smooth service!",
    rating: 5,
  },
  {
    name: "Sara K.",
    location: "Jumeirah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    quote: "Best price in Dubai! Very professional and trustworthy team. Doorstep collection was hassle-free.",
    rating: 5,
  },
  {
    name: "Khalid M.",
    location: "Business Bay",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    quote: "Smooth and quick process. Upgraded my MacBook and sold the old one here within 2 hours.",
    rating: 5,
  },
  {
    name: "Tariq A.",
    location: "Abu Dhabi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    quote: "Fastest device trade-in experience in the UAE. Highly recommended to everyone selling electronics.",
    rating: 5,
  },
];

const coreValues = [
  {
    icon: Recycle,
    title: "Circular Economy",
    desc: "We are dedicated to extending the lifespan of mobile devices. Every phone we purchase is either responsibly refurbished or cleanly harvested for materials.",
  },
  {
    icon: ShieldCheck,
    title: "Secured Data Wipe",
    desc: "Data security is our top priority. We implement military-grade sanitization procedures to guarantee all user records are erased from all purchased tech.",
  },
  {
    icon: Award,
    title: "Transparent Valuation",
    desc: "No hidden deductions or bait-and-switch pricing. Our real-time calculator is backed by secondary market analytics to give you competitive payouts.",
  },
];

const AboutPage = () => {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>(fallbackReviews);
  const [activeValueIndex, setActiveValueIndex] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await api.getTestimonials({ featured: true });
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err) {
        console.warn("Could not load dynamic testimonials on About page:", err);
      }
    }
    loadTestimonials();
  }, []);

  // Auto-shifting mobile timer for Core Values (shifts every 3.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveValueIndex((prev) => (prev + 1) % coreValues.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Auto-shifting mobile timer for Testimonials (shifts every 3.5s)
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [testimonials]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 text-slate-800">
      
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Pioneering Sustainable <br />
          <span className="text-emerald-500">Tech Buybacks in the UAE</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500">
          We simplify device resale to help UAE residents clear out drawers, unlock value, and save our environment.
        </p>
      </div>

      {/* DESKTOP Core Values grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 pt-6">
        {coreValues.map((val, idx) => {
          const Icon = val.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Icon size={24} />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">{val.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
            </div>
          );
        })}
      </div>

      {/* MOBILE Minimalist Auto-Shifting Core Values Carousel */}
      <div className="md:hidden space-y-3 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 shadow-sm min-h-[170px] flex flex-col justify-between">
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                {(() => {
                  const Icon = coreValues[activeValueIndex].icon;
                  return <Icon size={20} />;
                })()}
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                0{activeValueIndex + 1} / 0{coreValues.length}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              {coreValues[activeValueIndex].title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {coreValues[activeValueIndex].desc}
            </p>
          </div>

          {/* Indicators Dots */}
          <div className="flex justify-center gap-1.5 pt-3">
            {coreValues.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveValueIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeValueIndex ? "w-6 bg-emerald-500" : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Our Mission Detail Section */}
      <div className="bg-slate-900 text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Our Environmental Footprint Goal</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Every year, millions of electronic units find their way to landfill grounds globally, leaking nickel, lithium, and lead into ecological networks. Our goal is to make recycling so seamless that it becomes the default choice in Dubai, Abu Dhabi, and the rest of the UAE. Through local collections, we hope to redirect 100,000 devices away from dump yards by 2028.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="bg-slate-850 p-6 rounded-3xl border border-slate-800 text-center space-y-2">
              <span className="text-4xl">🌵</span>
              <h4 className="font-bold text-xs text-white">Save UAE Deserts</h4>
              <p className="text-[10px] text-slate-400">Join our clean recycling program today.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div id="testimonials" className="space-y-6 pt-6 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-emerald-500 font-extrabold text-xs uppercase tracking-wider">Verified Seller Reviews</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">What UAE Sellers Say About Us</h2>
          <p className="text-xs text-slate-500">Real feedback from verified device trade-ins across Dubai and UAE</p>
        </div>

        {/* DESKTOP Professional Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div key={t.id || t._id || idx} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden relative bg-slate-100 shrink-0 border border-slate-200">
                      <img src={t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{t.name}</h4>
                      <p className="text-[10px] text-slate-400">{t.location || "Dubai, UAE"}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Verified Seller
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <div className="text-amber-400 text-xs flex gap-0.5">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">5.0 / 5.0 Google Review</span>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE Minimalist Auto-Shifting Testimonial Cards */}
        <div className="md:hidden space-y-3">
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 shadow-sm min-h-[210px] flex flex-col justify-between">
            {testimonials.length > 0 && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={testimonials[activeTestimonialIndex].avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt={testimonials[activeTestimonialIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{testimonials[activeTestimonialIndex].name}</h4>
                      <p className="text-[10px] text-slate-400">{testimonials[activeTestimonialIndex].location || "Dubai, UAE"}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Verified Seller
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &quot;{testimonials[activeTestimonialIndex].quote}&quot;
                </p>

                <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                  <div className="text-amber-400 text-xs flex gap-0.5">
                    {[...Array(testimonials[activeTestimonialIndex].rating || 5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {activeTestimonialIndex + 1} of {testimonials.length}
                  </span>
                </div>
              </div>
            )}

            {/* Indicators Dots */}
            <div className="flex justify-center gap-1.5 pt-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonialIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeTestimonialIndex ? "w-6 bg-emerald-500" : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* FAQ shortcut CTA */}
      <div className="text-center pt-8 border-t border-slate-100 space-y-4">
        <h3 className="font-extrabold text-slate-800 text-base">Ready to sell your used device?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Get a quote and schedule a free pickup from your home. We pay cash instantly.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl text-xs transition cursor-pointer shadow-md"
        >
          Explore Supported Devices
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;
