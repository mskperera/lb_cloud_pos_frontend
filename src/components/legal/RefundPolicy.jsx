import LegalLayout from "./LegalLayout";

export const RefundPolicy = () => (
  <LegalLayout title="Refund Policy">
    <p className="mb-6 text-gray-700">
      Legendbyte (operated by <strong>Susantha Perera</strong>, sole proprietor trading as Legendbyte) offers
      subscriptions to Legend POS through <strong>Paddle</strong>, our Merchant of Record. All refund requests are handled
      exclusively by Paddle according to their policies and applicable law.
    </p>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Refund Eligibility</h2>
      <p className="text-gray-700">
        You may be eligible for a refund within <strong>14 days</strong> of your initial subscription purchase if you are
        dissatisfied or encounter unresolved technical issues. This applies primarily to first-time subscriptions.
      </p>
      <p className="text-gray-700 mt-3">
        Refunds for renewal payments are generally not provided unless required by law or in exceptional cases at Paddle's discretion.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Refund Process</h2>
      <p className="text-gray-700">
        Because Paddle processes all payments and acts as Merchant of Record, you must request refunds directly through Paddle:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li>Reply to the Paddle receipt email you received after purchase and request a refund.</li>
        <li>Use Paddle's support contact form or email (details in your receipt or at paddle.com/support).</li>
        <li>Contact us at <span className="font-medium">legendbyteworld@gmail.com</span> — we can assist by coordinating with Paddle, but Paddle makes the final decision.</li>
      </ul>
      <p className="text-gray-700 mt-4">
        Approved refunds are typically issued to your original payment method within 5–10 business days.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cancellations</h2>
      <p className="text-gray-700">
        You can cancel your subscription anytime via your Paddle account dashboard. Cancellation prevents future charges
        but does not trigger an automatic refund for the current period.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Exceptions</h2>
      <p className="text-gray-700">
        Refunds may be denied in cases of abuse, fraud, or violation of our Terms of Service. See Paddle's full refund
        guidelines in their{" "}
        <a href="https://www.paddle.com/legal/checkout-buyer-terms" className="text-sky-600 underline hover:text-sky-800">
          Checkout Buyer Terms
        </a>.
      </p>
      <p className="text-gray-600 mt-6 text-sm">
        Last updated: January 2026
      </p>
    </section>
  </LegalLayout>
);

// import LegalLayout from "./LegalLayout";

// export const RefundPolicy = () => (
//   <LegalLayout title="Refund Policy">
//     <p>
//       At <strong>Legend Cloud POS</strong>, we aim to provide a reliable and valuable service to our customers.
//     </p>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">1. Refund Eligibility</h2>
//       <p>
//         You may request a full refund within <strong>14 days</strong> of your
//         <strong> initial subscription purchase</strong> if you are not satisfied
//         with the service or if you experience technical issues that we are unable
//         to resolve.
//       </p>
//       <p className="mt-2">
//         This refund policy applies only to first-time subscriptions and does not
//         cover subsequent renewal payments.
//       </p>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">2. Refund Process</h2>
//       <p>
//         All payments are processed through <strong>Paddle</strong>, our Merchant of
//         Record. To request a refund, you may:
//       </p>
//       <ul className="list-disc pl-5 mt-2 space-y-2">
//         <li>Use the “Contact Support” option in your Paddle payment receipt email.</li>
//         <li>
//           Contact us directly at{" "}
//           <span className="text-sky-600">legendbyteworld@gmail.com</span> with your
//           order details.
//         </li>
//       </ul>
//     </section>

//     <section>
//       <h2 className="text-xl font-bold text-gray-800">3. Cancellations & Exclusions</h2>
//       <p>
//         You may cancel your subscription at any time. Subscription cancellations
//         stop future billing but do not automatically qualify for a refund.
//       </p>
//       <p className="mt-2">
//         Refunds are not provided for renewal payments unless required by applicable law.
//         Approved refunds will be issued to the original payment method within
//         <strong> 5–10 business days</strong>.
//       </p>
//     </section>
//   </LegalLayout>
// );

