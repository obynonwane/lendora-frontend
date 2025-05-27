// app/products/[productId]/page.tsx

import ProductPage from "@/app/components/ProductPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// --- Helper Function for Slug Extraction ---
function extractSlugId(productId: string): string {
  const parts = productId.split("-");
  const slugId = parts[parts.length - 1];

  // Basic validation for the extracted slug
  if (!slugId || slugId.length === 0) {
    throw new Error("Invalid product ID format. Slug not found.");
  }
  return slugId;
}

// --- Type Definitions for API Response ---
interface ProductImage {
  id: string;
  live_url: string;
  local_url: string;
  inventory_id: string;
  created_at: { seconds: number };
  updated_at: { seconds: number };
}

interface Inventory {
  id: string;
  name: string;
  description: string;
  user_id: string;
  category_id: string;
  subcategory_id: string;
  created_at_human: string;
  updated_at_human: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  verified: boolean;
  created_at_human: string;
  updated_at_human: string;
}

interface ProductDetailData {
  inventory: Inventory;
  user: User;
  images: ProductImage[];
}

interface ApiResponse {
  error: boolean;
  message: string;
  status_code: number;
  data: ProductDetailData;
}

// --- Data Fetching Function ---
async function getProductData(slugId: string): Promise<ApiResponse> {
  const res = await fetch(
    `https://api.lendora.ng/api/v1/inventory/inventory-detail?slug_ulid=${slugId}`,
    {
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    // If the resource is not found, use Next.js's notFound()
    notFound();
  }

  if (!res.ok) {
    // For any other HTTP error (e.g., 500, network issues),
    // throw an error to be caught by error.tsx
    throw new Error(
      `Failed to fetch product data: ${res.status} ${res.statusText}`
    );
  }

  const jsonResponse: ApiResponse = await res.json();

  // You might want to add a check here if the API itself signals an error
  // even with a 200 OK status, based on its 'error' field in the JSON.
  if (jsonResponse.error === true) {
    throw new Error(`API returned an error: ${jsonResponse.message}`);
  }

  return jsonResponse;
}

// --- Type for Page Props ---
type PageProps = {
  params: { productId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// --- generateMetadata Function ---
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slugId = extractSlugId(params.productId);

  // Fetch product data specifically for metadata
  const productResponse = await getProductData(slugId); // This is now ApiResponse type
  const product = productResponse.data; // Access the 'data' field

  // const previousImages = (await parent).openGraph?.images || [];

  // Ensure images array exists and has at least one image before accessing [0]
  const imageUrl = product.images[0].live_url;

  return {
    title: product.inventory.name,
    description: product.inventory.description,
    openGraph: {
      images: [imageUrl],
      title: product.inventory.name,
      description: product.inventory.description,
      // url: `https://yourdomain.com/products/${params.productId}`,
    },
  };
}

// --- Page Component ---
export default async function Page({ params }: PageProps) {
  const slugId = extractSlugId(params.productId);

  // Fetch product data for the page content
  const dataResponse = await getProductData(slugId); // This is now ApiResponse type
  const productData = dataResponse.data; // Access the 'data' field

  return (
    <main className="">
      <ProductPage product={productData} />
    </main>
  );
}
