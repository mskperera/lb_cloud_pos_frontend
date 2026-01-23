import LegalLayout from "./LegalLayout";

export const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy">
    <p className="mb-6 text-gray-700">
      This Privacy Policy explains how <strong>Susantha Perera</strong> (sole proprietor trading as <strong>Legendbyte</strong>)
      collects, uses, and protects your personal information when you use Legend POS (the "Service").
    </p>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
      <p className="text-gray-700">
        We collect minimal personal data necessary to provide the Service:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
        <li>Email address and name (for account creation and communication).</li>
        <li>Business-related data you enter (e.g., products, sales, customers) — this is your data, stored securely for your use only.</li>
      </ul>
      <p className="text-gray-700 mt-3">
        <strong>We do not collect or store your credit card or full payment details</strong> — all payment processing is handled directly by Paddle.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Third-Party Payment Processor (Paddle)</h2>
      <p className="text-gray-700">
        Paddle acts as our Merchant of Record and collects billing information (e.g., name, email, billing address, payment method)
        directly during checkout. We do not have access to your full payment card details.
      </p>
      <p className="text-gray-700 mt-3">
        Paddle uses this data to process payments, handle taxes, prevent fraud, and comply with law. For full details, see Paddle's
        Privacy Policy:{" "}
        <a href="https://www.paddle.com/legal/privacy" className="text-sky-600 underline hover:text-sky-800">
          https://www.paddle.com/legal/privacy
        </a>.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
      <p className="text-gray-700">
        Your data is used only to:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-700">
        <li>Provide and maintain your account and the Service.</li>
        <li>Send important updates, support responses, or billing notices.</li>
        <li>Improve the Service (aggregated/anonymized analytics only).</li>
      </ul>
      <p className="text-gray-700 mt-3">
        We do not sell, rent, or share your personal data with third parties except as required by law or with service providers (e.g., hosting, email) under strict confidentiality.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
      <p className="text-gray-700">
        We implement reasonable security measures (encryption, access controls) to protect your data. However, no system is 100% secure.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Contact</h2>
      <p className="text-gray-700">
        You may request access, correction, or deletion of your personal data by emailing{" "}
        <span className="font-medium">legendbyteworld@gmail.com</span>. For Paddle-held data, contact privacy@paddle.com.
      </p>
      <p className="text-gray-600 mt-6 text-sm">
        Last updated: January 2026
      </p>
    </section>
  </LegalLayout>
);

// import LegalLayout from "./LegalLayout";

// export const PrivacyPolicy = () => (
//   <LegalLayout title="Privacy Policy">
//     <section>
//       <h2 className="text-xl font-bold text-gray-800">1. Data We Collect</h2>
//       <p>We collect your email and name during signup to provide access to the Cloud POS. <strong>We do not store your credit card information.</strong></p>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">2. Third-Party Processors</h2>
//       <p>We use <strong>Paddle</strong> to manage payments and subscriptions. When you make a purchase, your billing data is collected directly by Paddle. You can view their privacy policy at <a href="https://paddle.com/legal/privacy" className="text-sky-600 underline">paddle.com/legal/privacy</a>.</p>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">3. Usage</h2>
//       <p>Your data is used only to maintain your account, provide support, and improve the POS system. We do not sell your personal data to third parties.</p>
//     </section>
//   </LegalLayout>
// );