import Link from "next/link";
// import Link from "next/link";
// import Footer from "../components/Footer";
import Image from "next/image";
import img1 from "@/images/8983.jpg";
import img2 from "@/images/41620.jpg";
import img3 from "@/images/1291.jpg";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiTarget } from "react-icons/fi";

function Page() {
  return (
    <>
      <main className="my-5 ">
        <div className="px-3 mt-5 py-12 max-w-7xl mx-auto space-y-20 text-gray-800">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">About Lendora</h1>
            <p className="text-lg max-w-3xl mx-auto">
              Lendora.ng is a community-driven platform built on the belief that
              every item has value beyond its occasional use. Whether it’s a
              wedding gown gathering dust or a car parked idle, Lendora helps
              turn those assets into income or access for others.
            </p>
            <Image
              src={img1}
              alt="Lendora platform preview"
              className="w-full max-w-4xl mx-auto rounded-xl shadow-md"
            />
          </section>

          {/* Who We Are */}
          <section className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
              <p>
                Individuals and businesses alike can list anything
                rentable—bridal dresses, power tools, cameras, furniture,
                vehicles—and connect with people who need them for hours, days,
                or weeks. Prefer to sell instead of rent? Lendora.ng offers a
                listing option for that too, so nothing of value goes to waste.
              </p>
            </div>
            <Image
              src={img2}
              alt="People collaborating"
              className="rounded-lg shadow-md"
            />
          </section>

          {/* Our Mission */}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* our mission */}
            <section className="space-y-6 ">
              <div className="flex items-center justify-center text-3xl rounded w-20 h-20 bg-lendora-100 text-lendora-500">
                <FiTarget className="" />
              </div>
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  <strong>Empower Owners:</strong> Give individuals and small
                  businesses an extra income stream by monetizing items they
                  already own.
                </li>
                <li>
                  <strong>Provide Affordable Access:</strong> Enable renters to
                  access high-quality goods at a fraction of retail cost.
                </li>
                <li>
                  <strong>Foster Trust & Convenience:</strong> Streamline
                  listings, payments, and communications so that renting or
                  selling is simple and secure.
                </li>
              </ul>
            </section>
            {/* /sustainability  */}
            <section className="space-y-6 ">
              <div className="flex items-center justify-center text-3xl rounded w-20 h-20 bg-lendora-100 text-lendora-500">
                <FaArrowTrendUp />
              </div>
              <h2 className="text-2xl font-semibold">
                Our Commitment to Sustainability
              </h2>
              <p>
                Lendora.ng is part of a movement toward a circular economy. By
                renting instead of buying, we:
              </p>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  <strong>Reduce Waste:</strong> Extend the lifecycle of goods.
                </li>
                <li>
                  <strong>Conserve Resources:</strong> Minimize the need for new
                  manufacturing.
                </li>
                <li>
                  <strong>Lower Carbon Footprints:</strong> Rent locally, reduce
                  shipping emissions.
                </li>
                <li>
                  <strong>Build Community:</strong> Spark real-world connections
                  through sharing.
                </li>
              </ul>
            </section>
          </section>

          {/* How It Works */}
          <section className="space-y-4" id="how-it-works">
            <div className="flex items-center gap-4">
              <h2 className="md:text-3xl text-2xl font-semibold whitespace-nowrap">
                How It Works
              </h2>
              <div className="flex-grow h-1 rounded bg-lendora-500"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 rounded-lg border border-green-300">
                <h3 className="font-bold mb-2">1. List Your Item</h3>
                <p>
                  Sign up, upload photos, set your price, availability, and
                  logistics preference.
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-300">
                <h3 className="font-bold mb-2">2. Browse & Rent/Buy</h3>
                <p>
                  Search by category or location, chat with the owner, and book
                  securely.
                </p>
              </div>
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-300">
                <h3 className="font-bold mb-2">3. Enjoy & Return</h3>
                <p>
                  Use the item, return it, or complete the purchase. Rate your
                  experience to build community trust.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Lendora */}
          <section className="grid grid-cols-1 md:grid-cols-2 md:gap-x-32 gap-10 items-center">
            <Image
              src={img3}
              alt="Lendora platform preview"
              className="w-full max-w-4xl mx-auto rounded-xl "
            />
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Why Choose Lendora.ng?
              </h2>
              <ul className="text-gray-700 list-disc list-inside space-y-2">
                <li>Diverse inventory for all needs and lifestyles.</li>
                <li>Secure payments and protection policies.</li>
                <li>Support for entrepreneurs and rental businesses.</li>
                <li>Reliable user reviews and transparent ratings.</li>
              </ul>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-10 px-4 lg:mt-10 mt-8 bg-gradient-to-br from-lendora-500 to-red-500  max-w-7xl mx-auto rounded-lg border border-gray-200">
            <h2 className="md:text-4xl text-3xl font-semibold mb-2 text-white">
              Join Our Community
            </h2>
            <p className="max-w-3xl mx-auto text-white mb-4">
              Whether you&apos;re listing or renting, Lendora.ng offers a
              simple, sustainable, and rewarding way to exchange resources. Sign
              up today and be part of a smarter, greener future.
            </p>
            <Link
              href="/signup"
              className="block mt-5 w-fit mx-auto font-medium hover:bg-white/90  text-lendora-500 bg-white px-10 py-3 rounded transition"
            >
              Signup Now!
            </Link>
          </section>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default Page;
