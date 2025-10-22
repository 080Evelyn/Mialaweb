const Policy = () => {
  return (
    <section className="py-16 px-6 md:px-16 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Privacy Policy
        </h1>

        {/* Intro */}
        <p className="mb-6 leading-relaxed">
          <span className="font-semibold">Miala</span> (“we,” “our,” or “us”)
          respects your privacy and is committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard your data when you use our mobile application and related
          services.
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold mt-10 mb-3">
          1. Information We Collect
        </h2>
        <p className="leading-relaxed mb-2">
          When you use Miala, we may collect the following:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-semibold">Personal Information:</span> Name,
            email address, phone number, and profile picture.
          </li>
          <li>
            <span className="font-semibold">Authentication Data:</span> Login
            details and verification information.
          </li>
          <li>
            <span className="font-semibold">Usage Data:</span> Delivery
            assignments, task progress, history of activities, and performance
            records.
          </li>
          <li>
            <span className="font-semibold">Notifications Data:</span>{" "}
            Preferences and interactions with in-app alerts.
          </li>
        </ul>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold mt-10 mb-3">
          2. How We Use Your Information
        </h2>
        <p className="leading-relaxed mb-2">
          We use the information collected to:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Enable secure login and account management.</li>
          <li>
            Provide access to your dashboard and display activity summaries.
          </li>
          <li>Track and manage delivery assignments.</li>
          <li>Send notifications and updates about your activities.</li>
          <li>Improve app functionality, performance, and security.</li>
          <li>Personalize your app experience.</li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold mt-10 mb-3">
          3. Sharing of Information
        </h2>
        <p className="leading-relaxed mb-2">
          We do not sell or rent personal data. Information may only be shared
          with:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-semibold">Service Providers:</span> Who help
            us operate or improve Miala.
          </li>
          <li>
            <span className="font-semibold">Authorities:</span> If required by
            law, regulation, or valid legal request.
          </li>
        </ul>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold mt-10 mb-3">4. Data Security</h2>
        <p className="leading-relaxed">
          We apply appropriate security measures to protect your data, including
          encryption and restricted access. However, no method of electronic
          storage or transmission is 100% secure.
        </p>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold mt-10 mb-3">5. Your Rights</h2>
        <p className="leading-relaxed mb-2">You may:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Access the personal information we hold about you.</li>
          <li>Update or correct your profile details.</li>
          <li>Request deletion of your account and data.</li>
          <li>Manage your notification preferences.</li>
        </ul>

        {/* Section 6 */}
        <h2 className="text-xl font-semibold mt-10 mb-3">6. Data Retention</h2>
        <p className="leading-relaxed">
          We retain your data for as long as your account is active or as
          necessary to provide services. Some data may remain in backup copies
          for a limited period.
        </p>

        {/* Section 7 */}
        <h2 className="text-xl font-semibold mt-10 mb-3">
          7. Changes to This Policy
        </h2>
        <p className="leading-relaxed">
          We may update this Privacy Policy from time to time. Any updates will
          be made available in the application, and continued use after updates
          means acceptance of the revised policy.
        </p>

        {/* Section 8 */}
        <h2 className="text-xl font-semibold mt-10 mb-3">8. Contact Us</h2>
        <p className="leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p className="mt-3">
          <span className="font-semibold block">Miala Media Marketing</span>
          <span>Email: </span>
          <a
            href="mailto:mialamedi@gmail.com"
            className="text-rose-500 hover:underline"
          >
            mialamedi@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default Policy;
