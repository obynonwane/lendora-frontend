// app/products/[productId]/page.tsx

import ProductPage from "@/app/components/ProductPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductPageProduct } from "@/app/types";

// --- Helper Function for Slug Extraction ---
// function extractSlugId(productId: string): string {
//   const parts = productId.split("-");
//   const slugId = parts[parts.length - 1];
//   if (!slugId || slugId.length === 0) {
//     throw new Error("Invalid product ID format. Slug not found.");
//   }
//   return slugId;
// }

// --- Type Definitions ---
// interface ProductImage {
//   id: string;
//   live_url: string;
//   local_url: string;
//   inventory_id: string;
//   created_at: { seconds: number };
//   updated_at: { seconds: number };
// }

// interface Category {

//   id: string;
//   name: string;
//   description: string;
//   subcategory_slug: string;
//   icon_class: string;
//   created_at_human: string;
//   updated_at_human: string;
// }

// interface Subcategory {
//   id: string;
//   name: string;
//   description: string;
//   icon_class: string;
//   subcategory_slug: string;
// }

// interface User {
//   id: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   phone: string;
//   verified: boolean;
//   created_at_human: string;
//   updated_at_human: string;
// }

// interface ProductDetailData {
//   inventory: InventoryItem;
//   user: User;
//   subcategory: Subcategory;
//   category: Category;
//   images: ProductImage[];
// }

interface ApiResponse {
  error: boolean;
  message: string;
  status_code: number;
  data: ProductPageProduct;
}

// --- Data Fetching Function ---
async function getProductData(slugId: string): Promise<ApiResponse> {
  const url = `https://api.lendora.ng/api/v1/inventory/inventory-detail?slug_ulid=${slugId}`;
  console.log({ url, slugId });
  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    console.log({ res: res.json() });
    throw new Error(
      `Failed to fetch product data-: ${res.status} ${res.statusText}`
    );
  }

  const jsonResponse: ApiResponse = await res.json();

  if (jsonResponse.error) {
    throw new Error(`API returned an error: ${jsonResponse.message}`);
  }

  return jsonResponse;
}

// --- Page Props Type ---
type PageProps = {
  params: Promise<{ productId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// --- generateMetadata ---
export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { productId } = await params;

  // const slugId = extractSlugId(productId);
  const productResponse = await getProductData(productId);
  const product = productResponse.data;
  const imageUrl = product.images?.[0]?.live_url || "";
  console.log(searchParams);
  return {
    title: product.inventory.name,
    description: product.inventory.description,
    openGraph: {
      images: imageUrl ? [imageUrl] : [],
      title: product.inventory.name,
      description: product.inventory.description,
    },
  };
}

// --- Page Component ---
export default async function Page({ params }: PageProps) {
  const { productId } = await params;

  // const slugId = extractSlugId(productId);
  // console.log({ productId, slugId });
  const dataResponse = await getProductData(productId);
  const productData = dataResponse.data;

  return (
    <main>
      {/* hello */}
      <ProductPage product={productData} />
    </main>
  );
}
