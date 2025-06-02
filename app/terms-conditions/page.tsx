import Footer from "../components/Footer";

function Page() {
  return (
    <>
      <main className="my-5 ">
        <section className="max-w-7xl mx-auto px-3 py-10 text-gray-800">
          <h1 className="text-3xl font-bold mb-4">Terms &amp; Conditions</h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: June, 1 2025
            {/* | Last Updated: [Insert Date] */}
          </p>

          <p className="mb-6">
            Welcome to Lendora.ng. By accessing or using our platform (the
            &apos;Service&apos;), you agree to comply with and be bound by the
            following Terms and Conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-semibold mb-2">1. Platform Overview</h2>
          <p className="mb-6">
            Lendora.ng is a marketplace platform that allows users to list,
            discover, rent, or purchase items from other users. We do not own,
            inspect, or guarantee any of the items listed, nor do we participate
            in any transactions beyond connecting users.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            2. User Responsibilities
          </h2>
          <ul className="list-disc list-inside mb-6 space-y-1">
            <li>
              You are at least 18 years old and have the legal capacity to enter
              into agreements.
            </li>
            <li>
              You are responsible for the accuracy of the information and
              listings you post.
            </li>
            <li>
              You are solely responsible for coordinating the terms of rentals,
              payments, returns, or purchases with other users.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">
            3. Disclaimer of Liability
          </h2>
          <p className="mb-4">
            Lendora.ng is a neutral facilitator and does not:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Own or control any of the items listed on the platform.</li>
            <li>
              Verify the condition, availability, or legality of listed items.
            </li>
            <li>Provide insurance, guarantees, or warranties of any kind.</li>
            <li>
              Mediate disputes or ensure fulfillment of any rental or sale
              agreements.
            </li>
          </ul>
          <p className="mb-6">
            <strong>Important:</strong> Lendora.ng is not responsible for theft,
            damage, or loss of any item, non-payment, late return, or misuse by
            any party, or accidents, injuries, or incidents resulting from the
            use of rented or purchased items. All transactions are at your own
            risk.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. User Conduct</h2>
          <ul className="list-disc list-inside mb-6 space-y-1">
            <li>Post fraudulent, misleading, or illegal content.</li>
            <li>
              Use the platform for prohibited or unsafe items (e.g., firearms,
              drugs, counterfeit goods).
            </li>
            <li>Harass, defraud, or harm other users.</li>
            <li>
              Circumvent the platform&apos;s payment or communication systems.
            </li>
          </ul>
          <p className="mb-6">
            Lendora.ng reserves the right to suspend or terminate accounts that
            violate these terms.
          </p>

          <h2 className="text-xl font-semibold mb-2">5. Fees &amp; Payments</h2>
          <p className="mb-6">
            Lendora.ng may charge service fees for listings or successful
            transactions. These will be communicated transparently. All
            payments, deposits, and negotiations are the responsibility of the
            parties involved.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            6. No Endorsement or Verification
          </h2>
          <p className="mb-6">
            Lendora.ng does not endorse or verify any user or listing. Any
            &apos;verified&apos; badges or promotions are purely platform-based
            and do not imply any background checks or guarantees.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            7. Limitation of Liability
          </h2>
          <p className="mb-6">
            To the fullest extent permitted by law, Lendora.ng, its affiliates,
            and employees shall not be liable for any direct, indirect,
            incidental, or consequential damages resulting from your use of the
            platform.
          </p>

          <h2 className="text-xl font-semibold mb-2">8. Indemnity</h2>
          <p className="mb-6">
            You agree to indemnify and hold harmless Lendora.ng from any claims,
            damages, losses, or legal fees arising out of your use of the
            platform or violation of these terms.
          </p>

          <h2 className="text-xl font-semibold mb-2">9. Privacy</h2>
          <p className="mb-6">
            Please review our{" "}
            <a href="/privacy-policy" className="text-blue-600 underline">
              Privacy Policy
            </a>{" "}
            to understand how your data is handled.
          </p>

          <h2 className="text-xl font-semibold mb-2">10. Modifications</h2>
          <p className="mb-6">
            We reserve the right to modify or update these terms at any time.
            Continued use of the platform after changes means you accept the
            revised terms.
          </p>

          <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
          <p className="mb-6">
            These terms are governed by the laws of the Federal Republic of
            Nigeria. Any disputes arising will be subject to the exclusive
            jurisdiction of Nigerian courts.
          </p>

          <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
          <p className="mb-6">
            For any questions, you can reach us at: <br />
            📧{" "}
            <a
              href="mailto:support@lendora.ng"
              className="text-blue-600 underline"
            >
              support@lendora.ng
            </a>
            <br />
            Or via our in-app help center.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Page;
