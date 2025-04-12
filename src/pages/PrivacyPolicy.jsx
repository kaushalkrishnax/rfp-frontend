import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        Thank you for using our hotel booking app. Your privacy is important to
        us. This policy explains what data we collect and how we use it.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Phone Number:</strong> Used for login, booking confirmations,
          and support.
        </li>
        <li>
          <strong>Name:</strong> Used for booking details and personalization.
        </li>
        <li>
          <strong>Live Location:</strong> Used to suggest nearby hotels or
          services.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>To create and manage your bookings</li>
        <li>To personalize your experience</li>
        <li>To show nearby hotels and services based on your location</li>
        <li>To communicate updates, confirmations, or support messages</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
      <p className="mb-4">
        We do <strong>not</strong> sell or rent your personal information. Your
        data is only shared with trusted services that help run our app (like
        map or notification services), under strict privacy terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Location Data</h2>
      <p className="mb-4">
        Your location is only used while using the app to suggest relevant
        hotels or services. You can choose to disable location access at any
        time via your device settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
      <p className="mb-4">
        We use secure technologies to protect your information. However, no
        system is 100% secure, so we recommend using strong passwords and
        keeping your phone secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p className="mb-4">
        You can request to view, update, or delete your personal information by
        contacting us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
      <p>
        For questions or concerns about this policy, email us at{" "}
        <a
          href="mailto:support@yourhotelapp.com"
          className="text-blue-600 underline"
        >
          support@yourhotelapp.com
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
