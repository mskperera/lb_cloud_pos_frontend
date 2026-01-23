// src/pages/PricingPage.jsx  (or wherever your pages are)

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "./Navbar";

const PricingPage = () => {
  return (
       <div className="min-h-screen bg-white scroll-smooth">
      {/* <Navbar /> */}
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50/30 pt-20 pb-32">
      {/* Optional subtle background effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Simple, Transparent Pricing
        </h1>
        
        <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
          One plan. Everything included. No hidden fees, no feature gating.
        </p>
        
        <p className="text-lg text-gray-600 mb-16">
          Get started with our special launch pricing — and keep it forever.
        </p>

        {/* Main Pricing Card */}
        <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-3xl p-10 md:p-16 shadow-2xl border border-sky-500/30 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 mb-10">
            <div className="text-center">
              <p className="text-3xl opacity-90 line-through decoration-white/60">$17/month</p>
            </div>
            <div className="text-center">
              <p className="text-8xl md:text-9xl font-black">$10</p>
              <p className="text-3xl font-bold mt-1">/month</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-3xl font-bold">
              Limited-time launch pricing: <span className="underline decoration-white/50">$10/month</span>
            </p>

            <p className="text-2xl opacity-95">
              + <span className="font-extrabold text-white">1 full month free</span> — no credit card required
            </p>

            <p className="text-xl opacity-90 pt-4">
              Billed monthly. Cancel anytime. All features included from day one.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Link
              to="/signup"
              className="inline-flex items-center px-12 py-6 bg-white text-sky-700 text-2xl font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your Free Month
              <ChevronRight className="ml-4 w-8 h-8" />
            </Link>
          </div>

          {/* Small trust signals */}
          <div className="mt-10 text-sm opacity-90 flex flex-col sm:flex-row justify-center gap-6">
            <span>✓ No credit card needed to start</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Full access — no upsells</span>
          </div>
        </div>

        {/* Optional FAQ-style reassurance block */}
        <div className="mt-20 max-w-3xl mx-auto text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What You Get
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700">
            <p>• Full access to all features (real-time inventory, sales, reports, printing, etc.)</p>
            <p>• Cloud access from any device + desktop app for instant receipt printing</p>
            <p>• 1-month free trial — no payment details required upfront</p>
            <p>• Launch pricing locked in forever (as long as you stay subscribed)</p>
            <p>• Processed securely via Paddle (our Merchant of Record)</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PricingPage;