import Footer from "../components/Footer";

function Page() {
  return (
    <>
      <main className="my-5 ">
        <div className="max-w-7xl mx-auto px-3 py-12 text-gray-800">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: June, 1 2025
            {/* • Last Updated: [Insert Date] */}
          </p>

          <p className="mb-6">
            At <strong>Lendora.ng</strong>, your privacy matters. This Privacy
            Policy explains how we collect, use, store, and protect your
            personal information when you use our website, mobile app, or
            related services (the “Platform”).
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>

            <h3 className="font-semibold mb-2">a. Personal Information</h3>
            <ul className="list-disc list-inside mb-4">
              <li>Name, email address, phone number</li>
              <li>Profile photo (optional)</li>
              <li>Government-issued ID (if required for verification)</li>
              <li>
                Location data (when enabled or required for location-based
                listings)
              </li>
            </ul>

            <h3 className="font-semibold mb-2">
              b. Listing & Transaction Data
            </h3>
            <ul className="list-disc list-inside mb-4">
              <li>Item listings and descriptions</li>
              <li>Rental or sale history</li>
              <li>Payment records and chat history with other users</li>
            </ul>

            <h3 className="font-semibold mb-2">
              c. Device & Usage Information
            </h3>
            <ul className="list-disc list-inside">
              <li>IP address</li>
              <li>Browser type and device type</li>
              <li>Access times and pages viewed</li>
              <li>Cookies and tracking data (see Section 6)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside mb-4">
              <li>Create and manage your account</li>
              <li>Facilitate listings, rentals, and purchases</li>
              <li>Process payments securely</li>
              <li>Enable communication between users</li>
              <li>Prevent fraud or unauthorized activity</li>
              <li>Improve the platform experience and support</li>
              <li>Show relevant ads or featured listings (only on-platform)</li>
            </ul>
            <p>We do not sell or rent your personal data to third parties.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              3. Sharing Your Information
            </h2>
            <p className="mb-4">We may share limited personal data with:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Other users (when necessary to complete a rental or sale)</li>
              <li>
                Payment processors and logistics partners (where applicable)
              </li>
              <li>Law enforcement or regulators (only when required by law)</li>
              <li>
                Service providers who help us operate the platform (under strict
                confidentiality)
              </li>
            </ul>
            <p>
              We will never share your contact details without your consent,
              except where legally required.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <ul className="list-disc list-inside mb-4">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure payment gateways</li>
              <li>Access controls and audit logs</li>
            </ul>
            <p>
              Despite our efforts, no system is 100% secure. Use strong
              passwords and be cautious when interacting with other users.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              5. Your Rights & Choices
            </h2>
            <ul className="list-disc list-inside mb-4">
              <li>Access or update your personal information</li>
              <li>Request deletion of your account</li>
              <li>Withdraw consent for marketing messages</li>
              <li>
                Opt out of location tracking (by changing your device settings)
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact{" "}
              <a
                href="mailto:privacy@lendora.ng"
                className="text-blue-600 underline"
              >
                privacy@lendora.ng
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              6. Cookies & Tracking
            </h2>
            <ul className="list-disc list-inside mb-4">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze traffic and platform usage</li>
            </ul>
            <p>
              You can disable cookies via your browser settings, but parts of
              the platform may not function properly.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p>We retain your data only as long as necessary to:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes or enforce our Terms</li>
            </ul>
            <p>
              Once no longer needed, your data is securely deleted or
              anonymized.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              8. Children’s Privacy
            </h2>
            <p>
              Lendora.ng is not intended for users under the age of 18. We do
              not knowingly collect personal data from minors.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. If we make material
              changes, we will notify users through the platform or via email.
              Continued use of the platform means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have questions or concerns about this policy, you can reach
              us at:{" "}
              <a
                href="mailto:privacy@lendora.ng"
                className="text-blue-600 underline"
              >
                privacy@lendora.ng
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Page;
