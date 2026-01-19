
import LegalLayout from "./LegalLayout";

export const RefundPolicy = () => (
  <LegalLayout title="Refund Policy">
    <p>
      At <strong>Legend Cloud POS</strong>, we aim to provide a reliable and valuable service to our customers.
    </p>

    <section>
      <h2 className="text-xl font-bold text-gray-800">1. Refund Eligibility</h2>
      <p>
        You may request a full refund within <strong>14 days</strong> of your
        <strong> initial subscription purchase</strong> if you are not satisfied
        with the service or if you experience technical issues that we are unable
        to resolve.
      </p>
      <p className="mt-2">
        This refund policy applies only to first-time subscriptions and does not
        cover subsequent renewal payments.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">2. Refund Process</h2>
      <p>
        All payments are processed through <strong>Paddle</strong>, our Merchant of
        Record. To request a refund, you may:
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li>Use the “Contact Support” option in your Paddle payment receipt email.</li>
        <li>
          Contact us directly at{" "}
          <span className="text-sky-600">legendbyteworld@gmail.com</span> with your
          order details.
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">3. Cancellations & Exclusions</h2>
      <p>
        You may cancel your subscription at any time. Subscription cancellations
        stop future billing but do not automatically qualify for a refund.
      </p>
      <p className="mt-2">
        Refunds are not provided for renewal payments unless required by applicable law.
        Approved refunds will be issued to the original payment method within
        <strong> 5–10 business days</strong>.
      </p>
    </section>
  </LegalLayout>
);


// import LegalLayout from "./LegalLayout";

// export const RefundPolicy = () => (
//   <LegalLayout title="Refund Policy">
//     <p>At <strong>LegendByte Cloud POS</strong>, we want you to be fully satisfied with our service.</p>
    
//     <section>
//       <h2 className="text-xl font-bold text-gray-800">1. Refund Eligibility</h2>
//       <p>You may request a full refund within <strong>14 days</strong> of your initial subscription date if you are unsatisfied with the product or experience technical issues we cannot resolve.</p>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">2. Processing</h2>
//       <p>Our payments are processed via <strong>Paddle</strong>, our Merchant of Record. To request a refund, you can:</p>
//       <ul className="list-disc pl-5 mt-2 space-y-2">
//         <li>Click the "Contact Support" link in your Paddle email receipt.</li>
//         <li>Email us at <span className="text-sky-600">legendbyteworld@gmail.com</span> with your order details.</li>
//       </ul>
//     </section>
// {/* support@legendbyte.com */}
//     <section>
//       <h2 className="text-xl font-bold text-gray-800">3. Exclusions</h2>
//       <p>Refunds are not available for subscription renewals unless required by law. Approved refunds will be credited back to your original payment method within 5–10 business days.</p>
//     </section>
//   </LegalLayout>
// );