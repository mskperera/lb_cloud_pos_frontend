import { useNavigate, Link } from "react-router-dom";
import pos_logo_long from "../../assets/pos_logo_long.png";
import pos_logo_long_inv from "../../assets/pos_logo_long_inv.png";
import settng_up_pos from "../../assets/settng_up_pos.png";
import windows_icon from "../../assets/windows_icon.png";
import linux_icon from "../../assets/linux_icon.png";
import desktop_app_screenshot from "../../assets/desktop_app_screenshot.png";
import { Cloud, Laptop, Printer, Download, CheckCircle, ChevronRight, Mail, Phone, MapPin } from "lucide-react";
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";
import ContactSection from "./ContactSection";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
// ─── Navbar ────────────────────────────────────────────────────────────────
// const Navbar = () => {
//   const scrollToSection = (id) => {
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           <Link to="/" className="flex items-center">
//             <img src={pos_logo_long} alt="Legend POS" className="h-10" />
//           </Link>

//          <div className="hidden md:flex items-center space-x-8">
//   <button onClick={() => scrollToSection("hero")} className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
//     Home
//   </button>
//   <button onClick={() => scrollToSection("about")} className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
//     About
//   </button>
//   <button onClick={() => scrollToSection("features")} className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
//     Features
//   </button>
//   <button onClick={() => scrollToSection("desktop")} className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
//     Download
//   </button>
//   <button onClick={() => scrollToSection("pricing")} className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
//     Pricing
//   </button>
//   <button onClick={() => scrollToSection("faq")} className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
//     FAQ
//   </button>
//   <button onClick={() => scrollToSection("contact")} className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
//     Contact
//   </button>

//   {/* Legal links – smaller, lighter, tighter spacing */}
//   <div className="flex items-center space-x-4 text-sm text-gray-500">
//     <Link to="/terms" className="hover:text-gray-800 transition-colors">
//       Terms
//     </Link>
//     <Link to="/privacy" className="hover:text-gray-800 transition-colors">
//       Privacy
//     </Link>
//     <Link to="/refund" className="hover:text-gray-800 transition-colors">
//       Refund
//     </Link>
//   </div>
// </div>

//           <div className="flex items-center space-x-4">
//             <Link to="/signin" className="text-sky-600 hover:text-sky-800 font-medium px-4 py-2">
//               Sign In
//             </Link>
//             <Link
//               to="/signup"
//               className="bg-sky-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-sm"
//             >
//               Start Free Trial
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };




// ─── Hero (with Desktop App) ───────────────────────────────────────────────
// const HeroSection = () => {
//   return (
//     <section className="relative bg-gradient-to-br from-sky-50 via-white to-blue-50 pt-20 pb-24 md:pb-32 overflow-hidden" id="hero">
//       <div className="absolute inset-0 opacity-10 pointer-events-none">
//         <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-300 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-300 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <img src={pos_logo_long} alt="Legend POS" className="h-16 mx-auto mb-8" />
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
//             Simple, Fast, Reliable Point of Sale
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
//             Run your store from any device you already own — no expensive hardware needed.
//           </p>

//           <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
//             <Link
//               to="/signup"
//               className="inline-flex items-center justify-center px-8 py-4 bg-sky-600 text-white text-lg font-semibold rounded-xl hover:bg-sky-700 transition-all shadow-lg transform hover:-translate-y-1"
//             >
//               Start 1-Month Free Trial
//               <ChevronRight className="ml-2 w-5 h-5" />
//             </Link>
//             <Link
//               to="/signin"
//               className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-sky-600 text-sky-600 text-lg font-semibold rounded-xl hover:bg-sky-50 transition-all"
//             >
//               Sign In
//             </Link>
//           </div>

//           <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-5 rounded-2xl shadow-sm border border-sky-100 mb-16">
//             <div className="flex items-center justify-center gap-6 flex-wrap">
//               <span className="text-3xl text-gray-500 line-through">$17</span>
//               <div className="text-center">
//                 <p className="text-5xl font-black text-sky-700">$10</p>
//                 <p className="text-lg font-medium text-gray-600">/month</p>
//               </div>
//             </div>
            
//             <p className="mt-3 text-gray-700 font-medium">
//                           Limited-time launch pricing: <span className="underline decoration-white/60"> $10/month</span>
//             </p>
//             <p className="mt-2 text-green-700 font-semibold">
//               1-month free trial • No credit card needed
//             </p>
//           </div>
//         </div>

//         {/* Desktop App Area */}
//        <div id="desktop" className="mt-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12">
//   <div className="max-w-5xl mx-auto">
//     {/* Header */}
//     <div className="text-center mb-10 md:mb-12">
//       <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-5">
//         Download Desktop App
//       </h2>
//       <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//         Print receipts instantly — just like a traditional POS.<br className="hidden sm:inline" />
//         Connects seamlessly to your cloud account and local printer.
//       </p>
//     </div>

//     {/* Screenshot – centered and responsive */}
//     <div className="mb-10 md:mb-14">
//       <div className="relative mx-auto max-w-3xl">
//         <img
//           src={desktop_app_screenshot}
//           alt="Legend POS Desktop App screenshot"
//           className="rounded-2xl shadow-2xl w-full border border-gray-200 object-cover"
//           // Consider adding loading="lazy" if this is below the fold
//         />
//       </div>
//     </div>

//     {/* Download buttons – responsive grid */}
//     <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-xl mx-auto">
//       {/* Windows Card */}
//       <div className="group bg-gray-50/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:border-sky-200 hover:bg-white">
//         <div className="flex items-center gap-4 mb-5">
//           <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
//             <img src={windows_icon} alt="Windows" className="w-10 h-10 md:w-12 md:h-12" />
//           </div>
//           <h3 className="text-xl md:text-2xl font-bold text-gray-900">Windows</h3>
//         </div>

//         <p className="text-gray-600 mb-6 text-sm md:text-base">
//           Windows 10 & 11 (64-bit)
//         </p>

//         <a
//           href="#"
//           className="flex items-center justify-center gap-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
       
//        >
//           <Download className="w-5 h-5 md:w-6 md:h-6" />
//           Download for Windows
//         </a>
//       </div>

//       {/* Linux Card */}
//       <div className="group bg-gray-50/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:border-sky-200 hover:bg-white">
//         <div className="flex items-center gap-4 mb-5">
//           <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
//             <img src={linux_icon} alt="Linux" className="w-10 h-10 md:w-12 md:h-12" />
//           </div>
//           <h3 className="text-xl md:text-2xl font-bold text-gray-900">Linux</h3>
//         </div>

//         <p className="text-gray-600 mb-6 text-sm md:text-base">
//           Ubuntu, Fedora, Debian, Mint...
//         </p>

//         <a
//           href="#"
//           className="flex items-center justify-center gap-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
//         >
//           <Download className="w-5 h-5 md:w-6 md:h-6" />
//           Download for Linux
//         </a>
//       </div>
//     </div>

//     {/* Optional small footer note */}
//     {/* <p className="text-center text-sm text-gray-500 mt-10">
//       Version 1.4.2 • Requires internet connection for first login
//     </p> */}
//   </div>
// </div>
//       </div>
//     </section>
//   );
// };
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-sky-50 via-white to-blue-50 pt-20 pb-24 md:pb-32 overflow-hidden" id="hero">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-300 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <img src={pos_logo_long} alt="Legend POS" className="h-16 mx-auto mb-8" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Simple, Fast, Reliable Point of Sale
          </h1>

          {/* Existing short benefit line */}
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-6">
            Run your store from any device you already own — no expensive hardware needed.
          </p>

          {/* Added: Brief product/service description for Paddle */}
<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 font-medium">
  Built for everyday businesses, Legend POS helps small shops, cafés, boutiques, and retailers run smarter with a simple cloud-based POS.
</p>


          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-sky-600 text-white text-lg font-semibold rounded-xl hover:bg-sky-700 transition-all shadow-lg transform hover:-translate-y-1"
            >
              Start 1-Month Free Trial
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-sky-600 text-sky-600 text-lg font-semibold rounded-xl hover:bg-sky-50 transition-all"
            >
              Sign In
            </Link>
          </div>

          <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-5 rounded-2xl shadow-sm border border-sky-100 mb-16">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <span className="text-3xl text-gray-500 line-through">$17</span>
              <div className="text-center">
                <p className="text-5xl font-black text-sky-700">$10</p>
                <p className="text-lg font-medium text-gray-600">/month</p>
              </div>
            </div>
            
            <p className="mt-3 text-gray-700 font-medium">
              Limited-time launch pricing: <span className="underline decoration-white/60">$10/month</span>
            </p>
            <p className="mt-2 text-green-700 font-semibold">
              1-month free trial • No credit card needed
            </p>
          </div>
        </div>

             <div id="desktop" className="mt-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12">
  <div className="max-w-5xl mx-auto">
    {/* Header */}
    <div className="text-center mb-10 md:mb-12">
      <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-5">
        Download Desktop App
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Print receipts instantly — just like a traditional POS.<br className="hidden sm:inline" />
        Connects seamlessly to your cloud account and local printer.
      </p>
    </div>

    {/* Screenshot – centered and responsive */}
    <div className="mb-10 md:mb-14">
      <div className="relative mx-auto max-w-3xl">
        <img
          src={desktop_app_screenshot}
          alt="Legend POS Desktop App screenshot"
          className="rounded-2xl shadow-2xl w-full border border-gray-200 object-cover"
          // Consider adding loading="lazy" if this is below the fold
        />
      </div>
    </div>

    {/* Download buttons – responsive grid */}
    <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-xl mx-auto">
      {/* Windows Card */}
      <div className="group w-full bg-gray-50/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:border-sky-200 hover:bg-white">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
            <img src={windows_icon} alt="Windows" className="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">Windows</h3>
        </div>

        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Windows 10 & 11 (64-bit)
        </p>

        <a
          href="#"
          className="flex items-center justify-center gap-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
       
       >
          <Download className="w-5 h-5 md:w-6 md:h-6" />
          Download for Windows
        </a>
      </div>

      {/* Linux Card */}
      <div className="group w-full bg-gray-50/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:border-sky-200 hover:bg-white">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
            <img src={linux_icon} alt="Linux" className="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">Linux</h3>
        </div>

        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Ubuntu, Fedora, Debian, Mint...
        </p>

        <a
          href="#"
          className="flex items-center justify-center gap-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          <Download className="w-5 h-5 md:w-6 md:h-6" />
          Download for Linux
        </a>
      </div>
    </div>

    {/* Optional small footer note */}
    {/* <p className="text-center text-sm text-gray-500 mt-10">
      Version 1.4.2 • Requires internet connection for first login
    </p> */}
  </div>
</div>
      </div>
    </section>
  );
};


// ─── About ────────────────────────────────────────────────────────────────
const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          About Legend POS
        </h2>

   <p className="text-xl text-gray-700 leading-relaxed mb-6">
  <strong>Legend POS</strong> is a cloud-based Point of Sale system designed for small and medium-sized retail shops, cafes, boutiques and restaurants that want to avoid spending a lot of money on traditional POS systems and hardware. 
  It helps manage sales, inventory, customers, and reports efficiently through a cloud-based solution that can be accessed from anywhere using any web browser or our lightweight desktop app for instant receipt printing.
</p>
<p className="text-lg text-gray-600 leading-relaxed">
  Legend POS is developed and operated by <strong>Susantha Perera</strong>, sole proprietor, trading as <strong>Legendbyte</strong>. 
  Our goal is to provide an affordable, reliable, and easy-to-use POS solution without expensive hardware or long-term contracts.
</p>
      </div>
    </section>
  );
};


// ─── Features ──────────────────────────────────────────────────────────────
const FeaturesSection = () => {
  const features = [
{
  icon: CheckCircle,
  title: "Real-Time Inventory",
  desc: "Monitor stock levels instantly and stay updated on every product"
},

    {
      icon: CheckCircle,
      title: "Sales Processing",
      desc: "Quick checkout with barcode scanning support"
    },
    {
  icon: CheckCircle,
  title: "Assembly Products (Combo Products)",
  desc: "Assemble multiple products into one item while managing stock automatically"
}
,
    {
      icon: CheckCircle,
      title: "Product Variations",
      desc: "Manage variations like size, color, and more"
    },
{
  icon: CheckCircle,
  title: "Quick Printing",
  desc: "Print receipts quickly with the desktop app"
}

,
    {
      icon: CheckCircle,
      title: "Customer & Supplier Management",
      desc: "Store customer and supplier details in one place"
    },
    {
  icon: CheckCircle,
  title: "Stock Entry & GRN (Goods Received Notes)",
  desc: "Record stock received and supplier deliveries accurately"
}
,
    {
      icon: CheckCircle,
      title: "Reports & Analytics",
      desc: "View sales, profit, and performance reports"
    },
    {
      icon: CheckCircle,
      title: "Dashboard Overview",
      desc: "See key business insights at a glance"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Powerful Features for Your Business</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to run a modern retail or hospitality business — made simple and affordable.
          </p>

          {/* Added this to clearly show what is included with the purchase */}
          <p className="mt-6 text-lg font-medium text-sky-700">
            All features listed below are included in every subscription — no feature gating, no hidden tiers, no upsells.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <f.icon className="w-12 h-12 text-sky-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-600 text-lg">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Optional reinforcement at the bottom – can keep or remove */}
        <p className="text-center mt-12 text-base text-gray-600">
          One simple plan. Full access to everything you see here.
        </p>
      </div>
    </section>
  );
};

// ─── Testimonials ──────────────────────────────────────────────────────────
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Retail Store Owner",
      quote: "Legend POS transformed my business. The cloud access and easy printing make daily operations a breeze!",
    },
    {
      name: "Mike Chen",
      role: "Cafe Manager",
      quote: "Affordable pricing and powerful features. The desktop app's one-click printing is a game-changer.",
    },
    {
      name: "Emma Rodriguez",
      role: "Boutique Owner",
      quote: "Simple setup and reliable performance. Highly recommend for small businesses.",
    },
  ];

  return (
    <section  className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <p className="text-gray-700 italic text-lg mb-6">“{t.quote}”</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-600">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Pricing ───────────────────────────────────────────────────────────────
// const PricingSection = () => {
//   return (
//     <section id="pricing" className="py-20 bg-white">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h2 className="text-4xl font-bold text-gray-900 mb-6">Affordable Pricing</h2>
//         <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
//           Get started today with our special launch pricing — and keep it forever.
//         </p>

//         <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-3xl p-10 md:p-16 shadow-2xl">
//           <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
//             <div className="text-center">
//               <p className="text-2xl opacity-90 line-through">$17/month</p>
//             </div>
//             <div className="text-center">
//               <p className="text-7xl font-black">$10</p>
//               <p className="text-2xl font-bold mt-2">/month</p>
//             </div>
//           </div>

//           <p className="text-2xl font-bold mt-10 mb-6">
            
//             Limited-time launch pricing: <span className="underline decoration-white/60"> $10/month</span>
//           </p>

//           <p className="text-xl opacity-90 mb-10">
//             + <span className="font-bold text-white">1 full month free</span> — no credit card required
//           </p>

//           <Link
//             to="/signup"
//             className="inline-flex items-center px-10 py-5 bg-white text-sky-700 text-xl font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
//           >
//             Get Started Free
//             <ChevronRight className="ml-3 w-6 h-6" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// ─── FAQ ───────────────────────────────────────────────────────────────────
const FAQSection = () => {
  const faqs = [
    {
      question: "Is Legend POS really free for the first month?",
      answer: "Yes! Enjoy a full 1-month free trial with no credit card required. Cancel anytime.",
    },
    {
      question: "Do I need special hardware?",
      answer: "You don’t need a new device. Use your current laptop, PC, or tablet. For faster printing, install the desktop app.",
    },
    {
      question: "How does the desktop app help with printing?",
      answer: "It enables one-click receipt printing directly to your connected printer, mimicking standalone POS systems while staying connected to the cloud.",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures to protect your business data.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{faq.question}</h3>
              <p className="text-gray-700 text-lg">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



// ─── Footer ────────────────────────────────────────────────────────────────
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <img src={pos_logo_long_inv} alt="Legend POS" className="h-10 mb-4 mx-auto md:mx-0" />
            <p className="text-gray-400">© {new Date().getFullYear()} Legend POS by Legendbyte</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
<Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            {/* Most visible place for settings link */}
            <button
              onClick={() => {
                Cookies.remove('legendpos_cookie_consent');
                window.location.reload();
              }}
              className="hover:text-white transition-colors font-medium underline"
            >
              Cookie Settings
            </button>
            {/* <button onClick={scrollToSection("contact")} className="hover:text-white transition-colors">Contact</Link>
             */}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── Main Landing Page ─────────────────────────────────────────────────────
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <Navbar />

      <HeroSection />


<div className="text-center py-20 bg-gradient-to-b from-sky-50 to-white border-t border-b border-sky-100">
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">
      Just <span className="text-sky-600">$10/month</span> after launch offer
    </h2>
    <p className="text-xl md:text-2xl text-gray-700 mb-8">
      + 1 full month free • No credit card required • All features included forever
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-6">
      <Link
        to="/signup"
        className="inline-flex items-center px-8 py-4 bg-sky-600 text-white text-lg font-semibold rounded-xl hover:bg-sky-700 transition-colors shadow-md"
      >
        Start Free Trial
      </Link>
      <Link
        to="/pricing"
        className="inline-flex items-center px-8 py-4 border-2 border-sky-600 text-sky-600 text-lg font-semibold rounded-xl hover:bg-sky-50 transition-colors"
      >
        View Pricing Details →
      </Link>
    </div>
  </div>
</div>


      <AboutSection />
      <FeaturesSection />
      {/* <TestimonialsSection /> */}
      {/* <PricingSection /> */}
      <FAQSection />
      <ContactSection />

      <Footer />
    </div>
  );
};

export default LandingPage;