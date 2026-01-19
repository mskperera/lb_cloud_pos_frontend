import LegalLayout from "./LegalLayout";

export const TermsOfService = () => (
  <LegalLayout title="Terms of Service">
    <section>
      <h2 className="text-xl font-bold text-gray-800">1. The Service</h2>
      <p>LegendByte grants you a non-exclusive license to use the Cloud POS software for your business operations.</p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">2. Account Security</h2>
      <p>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">3. Payments</h2>
      <p>All payments are handled by <strong>Paddle</strong>, our Merchant of Record. By subscribing to our service, you agree to be bound by Paddle's Checkout Terms and Conditions.</p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">4. Limitation of Liability</h2>
      <p>The service is provided <strong>"as is."</strong> LegendByte is not liable for any data loss, financial loss, or business interruption resulting from the use or inability to use our software.</p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">5. Governing Law</h2>
      <p>These terms are governed by and construed in accordance with the laws of <strong>Sri Lanka</strong>.</p>
    </section>
  </LegalLayout>
);