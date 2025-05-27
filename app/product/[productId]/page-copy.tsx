// app/projects/[projectId]/page.tsx or similar

import ProductPage from "@/app/components/ProductPage";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { productId } = await params;
  const extracted = productId.split("-");
  console.log(productId, searchParams);
  const slugId = extracted[extracted.length - 1];
  if (!extracted || !slugId) {
    throw new Error("Failed to fetch data");
  }
  const product = await fetch(
    `https://api.lendora.ng/api/v1/inventory/inventory-detail?slug_ulid=${slugId}`
  ).then((res) => res.json());

  // console.log(product, "frm a products");

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.data.inventory.name,
    description: product.data.inventory.description,
    openGraph: {
      images: [product.data.images[0], ...previousImages],
      title: product.data.inventory.name, // Title for social media
      description: product.data.inventory.description, // Description for social media
      // url: product.data.inventory.url, // Canonical URL for social sharing
    },
  };
}

async function getData(productId: string) {
  const extracted = productId.split("-");
  const slugId = extracted[extracted.length - 1];
  const res = await fetch(
    `https://api.lendora.ng/api/v1/inventory/inventory-detail?slug_ulid=${slugId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  // console.log(res.status);

  return res.json();
}

// export default async function Page({ params }: { params: Params }) {
//   const data = await getData(params.productId);
//   return (
//     <main className="bg-zinc-100">
//       <ProductPage product={data} />
//     </main>
//   );
// }

export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const extracted = productId.split("-");
  const slugId = extracted[extracted.length - 1];
  if (!extracted || !slugId) {
    throw new Error("Failed to fetch data");
  }
  const data = await getData(productId);
  if (!data) {
    throw new Error("Failed to fetch data");
  }
  return (
    <main className="">
      <ProductPage product={data.data} />
    </main>
  );
}
