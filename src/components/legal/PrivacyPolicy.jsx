import LegalLayout from "./LegalLayout";

export const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy">
    <section>
      <h2 className="text-xl font-bold text-gray-800">1. Data We Collect</h2>
      <p>We collect your email and name during signup to provide access to the Cloud POS. <strong>We do not store your credit card information.</strong></p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">2. Third-Party Processors</h2>
      <p>We use <strong>Paddle</strong> to manage payments and subscriptions. When you make a purchase, your billing data is collected directly by Paddle. You can view their privacy policy at <a href="https://paddle.com/legal/privacy" className="text-sky-600 underline">paddle.com/legal/privacy</a>.</p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">3. Usage</h2>
      <p>Your data is used only to maintain your account, provide support, and improve the POS system. We do not sell your personal data to third parties.</p>
    </section>
  </LegalLayout>
);