import React from "react";
import packageJson from "../../../package.json";  // Import the whole JSON file

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12">
      <div className="max-w-4xl bg-white shadow-lg rounded-xl p-8 md:p-12 mx-4">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6 animate-fade-in">
          About Legend POS
        </h1>
        <p className="text-lg text-gray-600 text-center mb-4 leading-relaxed">
          Welcome to <span className="font-semibold text-blue-600">Legend POS</span>—a{" "}
          <span className="italic">cloud-based Point of Sale system</span> crafted to make your business life easier and
          more affordable. We’re here to help you manage sales, inventory, and customers with a{" "}
          <span className="font-semibold text-blue-600">simple subscription</span> that fits your budget.
        </p>
        <p className="text-sm text-gray-500 text-center">
          Version: <span className="font-semibold">{packageJson.version}</span>
        </p>

        {/* Why Choose Section */}
        <div className="mt-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Why Legend POS?</h2>
          <div className="space-y-4">
            {[
              "🌐 Cloud-Based Efficiency – Access your data anywhere, anytime.",
              "⚡ Seamless Transactions – Speed through sales with an intuitive design.",
              "📦 Real-Time Inventory – Keep your stock in check, automatically.",
              "🔒 Secure & Scalable – Built with top-notch security for peace of mind.",
              "💰 Subscription Pricing – Affordable with no big upfront costs.",
              "🏪 Multi-Store Support – Run all your locations from one place.",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-300"
              >
                <span className="text-xl mr-3">{item.split(" – ")[0]}</span>
                <span className="text-gray-700">{item.split(" – ")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who Can Benefit Section */}
        <div className="mt-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Who’s It For?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { emoji: "🛒", text: "Retail Stores" },
              { emoji: "📚", text: "Stationery Shops" },
              { emoji: "👗", text: "Textile Shops" },
              { emoji: "🥤", text: "Juice Bars" },
              { emoji: "🍽️", text: "Restaurants & Cafés" },
              { emoji: "🏢", text: "Similar Businesses" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <span className="text-2xl mr-3">{item.emoji}</span>
                <span className="font-semibold text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="mt-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At <span className="font-semibold text-blue-600">Legend POS</span>, we’re passionate about empowering
            businesses with{" "}
            <span className="italic text-blue-600">smart, cloud-based tools</span>. Our goal? To deliver a{" "}
            <span className="font-semibold">cost-effective POS solution</span> that helps you grow—without the stress or
            hefty price tag.
          </p>
        </div>

        {/* Privacy Policy Link */}
        <div className="mt-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Privacy Matters</h2>
          <p className="text-lg text-gray-600">
            We care about your data as much as you do. Dive into our{" "}
            <a
              href="/privacy-policy"
              className="text-blue-600 font-semibold hover:underline transition-colors duration-200"
            >
              Privacy Policy
            </a>{" "}
            to see how we keep it safe.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button className="btn bg-blue-600 text-white btn-lg px-8 py-3 text-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300">
            Start with Legend POS Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
