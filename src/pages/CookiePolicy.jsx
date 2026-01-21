const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-sky">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-gray-600 mb-6">Last updated: January 21, 2026</p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit our website. They help us provide better functionality and understand how you use Legend POS.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">2. Cookies We Use</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Necessary cookies</strong> — required for basic site functionality (no consent needed)</li>
          <li><strong>Analytics cookies</strong> — help us understand visitor behavior (optional)</li>
          <li><strong>Marketing cookies</strong> — used for personalized ads (optional, not currently active)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">3. How We Manage Consent</h2>
        <p>
          On your first visit you see our cookie banner. You can:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Accept all cookies</li>
          <li>Reject non-essential cookies</li>
          <li>Change your mind later via the "Cookie Settings" button</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">4. Third Parties</h2>
        <p>
          We currently do not use third-party advertising cookies. If we add analytics (e.g. Google Analytics, PostHog) in future, they will only load after explicit consent.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">5. Managing Cookies</h2>
        <p>
          You can manage or delete cookies via your browser settings. Note that disabling necessary cookies may affect site functionality.
        </p>

        <p className="mt-12 text-sm text-gray-500">
          Questions? Contact us at legendbyteworld@gmail.com
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;