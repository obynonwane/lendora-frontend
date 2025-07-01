import Link from "next/link";
// import Link from "next/link";
// import Footer from "../components/Footer";
// import Image from "next/image";

function Page() {
  const offerings = [
    {
      title: "Featured Placement & Advertising Support",
      points: [
        "Banner Display on Lendora.ng homepage and relevant category pages.",
        "Inclusion in Paid Ads (social media, Google Ads, influencer campaigns).",
        "Priority Listings that appear higher in search results for better visibility.",
      ],
      bg: "bg-lendora-50",
      border: "border-lendora-200",
    },
    {
      title: "Branded Storefronts (Micro-Shops)",
      points: [
        {
          title: "Customizable profile pages with:",
          subpoints: [
            "Business logo, description, address, and business hours",
            "Catalog of all listed items",
            "Customer reviews specific to the business",
          ],
        },
        "Direct shareable links (great for WhatsApp marketing or social campaigns).",
      ],
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      title: "Business Analytics Dashboard",
      points: [
        "Listing performance (views, rentals/sales, average income per item).",
        "Customer behavior (locations, repeat customers).",
        "Revenue reports for accounting and tax purposes.",
      ],
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      title: "Custom Logistics Integration",
      points: [
        "Access to priority pick-up/delivery via Lendora’s logistics partners.",
        "Option for API/webhook integration with third-party delivery tools.",
      ],
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    {
      title: "Customer Relationship Tools",
      points: [
        "Automated messaging for rental confirmations, reminders, and return notices.",
        "Follow-up templates to encourage ratings and re-rentals.",
        "Business-branded communication (email or SMS templates).",
      ],
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      title: "Exclusive Business Support",
      points: [
        "Dedicated account manager or support line for business accounts.",
        "Early access to platform features and beta programs.",
        "Workshops or webinars on how to grow your rental/sales business online.",
      ],
      bg: "bg-pink-50",
      border: "border-pink-200",
    },
    {
      title: "Verified Business Badge",
      points: [
        "A special badge on listings and storefronts to boost credibility.",
        "Option to submit additional verification documents to increase trust.",
      ],
      bg: "bg-teal-50",
      border: "border-teal-200",
    },
    {
      title: "Discounted Platform Fees or Subscriptions",
      points: [
        "Tiered pricing or subscription plans based on volume.",
        "Lower transaction fees or free promotional credits.",
      ],
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      title: "Cross-Promotion Opportunities",
      points: [
        {
          title: "Business features in:",
          subpoints: [
            "Newsletters",
            "Blog stories (e.g., “Meet our top wedding gear rental partner!”)",
            "Success case studies",
          ],
        },
        "Affiliate or referral partnerships.",
      ],
      bg: "bg-indigo-50",
      border: "border-indigo-200",
    },
  ];

  return (
    <>
      <main className="my-5 ">
        <section className="max-w-7xl mx-auto px-3 py-6">
          <h1 className="text-3xl font-bold text-center">
            Lendora for Business Offering
          </h1>
          <p className="mb-10 mt-2  text-center max-w-3xl mx-auto">
            Unlock powerful tools and exclusive benefits designed to help
            businesses grow, manage rentals efficiently, and reach more
            customers on Lendora.
          </p>

          <div className="grid grid-cols-12  gap-x-5  gap-y-12 relative">
            <div className="flex absolute inset-0 -top-5  justify-around z-10">
              <span className="block h-full w-px bg-slate-300 -ml-2"></span>
              <span className="block h-full w-px bg-slate-200 ml-1"></span>
              <span className="block h-full w-px bg-slate-300 -mr-2"></span>
            </div>
            {offerings.map((item, index) => (
              <div
                key={index}
                className={`z-20 col-span-12 lg:col-span-4 hover:shadow  rounded p-5 ${item.bg} ${item.border}  border`}
              >
                <div
                  className={` bg-white ${item.border} text-xl w-10 h-10 rounded-full flex items-center justify-center -mt-10 mx-auto bg-white border`}
                >
                  {index + 1}
                </div>
                <h2 className="text-xl font-medium mb-3 mt-2"> {item.title}</h2>
                <ul className="list-disc pl-5  space-y-1">
                  {item.points.map((point, i) =>
                    typeof point === "string" ? (
                      <li key={i}>{point}</li>
                    ) : (
                      <li key={i}>
                        {point.title}
                        <ul className="list-disc pl-5 space-y-1">
                          {point.subpoints.map((sub, j) => (
                            <li key={j}>{sub}</li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <section className="text-center py-10 px-4 lg:mt-10 mt-8 bg-gradient-to-br from-lendora-500 to-red-400  max-w-7xl mx-auto rounded-lg border border-gray-200">
            <h2 className="md:text-4xl text-3xl font-semibold mb-2 text-white">
              Ready to get started?
            </h2>
            <p className="text-lg text-white mb-4">
              Sign up for Lendora Business
            </p>
            <Link
              href="/signup?business=true"
              className="inline-block font-medium hover:bg-white/90  text-lendora-500 bg-white px-10 py-3 rounded transition"
            >
              Signup Now!
            </Link>
          </section>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default Page;
