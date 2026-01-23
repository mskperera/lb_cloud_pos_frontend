import LegalLayout from "./LegalLayout";

export const TermsOfService = () => (
  <LegalLayout title="Terms of Service">
    <p className="mb-6 text-gray-700">
      These Terms of Service ("Terms") govern your access to and use of the Legend POS cloud-based Point of Sale system
      (the "Service"), operated by <strong>Susantha Perera</strong>, a sole proprietor trading as <strong>Legendbyte</strong>
      (referred to as "we", "us", or "Legendbyte").
    </p>

    <p className="mb-8 text-gray-700">
      All payments and subscriptions for the Service are processed by <strong>Paddle.com Market Ltd.</strong> ("Paddle"),
      who acts as our <strong>Merchant of Record</strong>. By subscribing or using the Service, you also agree to Paddle's
      Checkout Buyer Terms and Conditions available at{" "}
      <a href="https://www.paddle.com/legal/checkout-buyer-terms" className="text-sky-600 underline hover:text-sky-800">
        https://www.paddle.com/legal/checkout-buyer-terms
      </a>.
    </p>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">1. The Service</h2>
      <p className="text-gray-700">
        We grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for your internal
        business operations (e.g., managing sales, inventory, customers, and reports for your retail, cafe, or similar
        business), subject to these Terms and your active subscription.
      </p>
      <p className="text-gray-700 mt-3">
        The Service is provided "as is" and "as available". We do not guarantee uninterrupted or error-free access.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Accounts and Security</h2>
      <p className="text-gray-700">
        You must provide accurate information during signup. You are solely responsible for maintaining the
        confidentiality of your account credentials and for all activities under your account. Notify us immediately of
        any unauthorized use.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Subscriptions and Payments</h2>
      <p className="text-gray-700">
        Subscriptions are billed monthly via Paddle. Pricing is displayed on our website (currently $10/month with
        launch offers; subject to change with notice). Paddle handles all billing, taxes, currency conversion, and
        compliance as Merchant of Record.
      </p>
      <p className="text-gray-700 mt-3">
        You may cancel your subscription at any time through your Paddle account or by contacting Paddle support. Cancellation
        takes effect at the end of the current billing period; no prorated refunds for partial months unless required by law.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitation of Liability</h2>
      <p className="text-gray-700">
        To the maximum extent permitted by law, Legendbyte and its operators shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages (including loss of profits, data, goodwill, or business
        interruption) arising from your use of the Service, even if advised of the possibility.
      </p>
      <p className="text-gray-700 mt-3">
        Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Governing Law and Disputes</h2>
      <p className="text-gray-700">
        These Terms are governed by the laws of <strong>Sri Lanka</strong>, without regard to conflict of law principles.
        Any disputes shall be resolved exclusively in the courts of Colombo, Sri Lanka.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
      <p className="text-gray-700">
        We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance.
        We will notify you of material changes via email or in-app notice.
      </p>
      <p className="text-gray-600 mt-6 text-sm">
        Last updated: January 2026
      </p>
    </section>
  </LegalLayout>
);

// import LegalLayout from "./LegalLayout";

// export const TermsOfService = () => (
//   <LegalLayout title="Terms of Service">
//     <p className="mb-4">
//       These Terms of Service govern your use of <strong>Legendbyte Cloud POS</strong>.
//       This service is operated by <strong>Susantha Perera</strong>, a sole proprietor,
//       trading as <strong>Legendbyte</strong>.
//     </p>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">1. The Service</h2>
//       <p>
//         Legendbyte grants you a non-exclusive, non-transferable license to use the
//         Cloud POS software for your business operations, subject to these terms.
//       </p>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">2. Account Security</h2>
//       <p>
//         You are responsible for maintaining the confidentiality of your login
//         credentials and for all activities that occur under your account.
//       </p>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">3. Payments</h2>
//       <p>
//         All payments are processed by <strong>Paddle</strong>, our Merchant of Record.
//         By subscribing, you agree to Paddle’s Checkout Terms and Conditions in addition
//         to these Terms.
//       </p>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">4. Limitation of Liability</h2>
//       <p>
//         The service is provided <strong>"as is"</strong>. Legendbyte shall not be
//         liable for any indirect, incidental, or consequential damages, including
//         loss of data, revenue, or business interruption.
//       </p>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">5. Governing Law</h2>
//       <p>
//         These terms are governed by and construed in accordance with the laws of
//         <strong> Sri Lanka</strong>.
//       </p>
//     </section>
//   </LegalLayout>
// );
