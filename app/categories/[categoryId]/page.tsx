import { notFound } from "next/navigation";
import type { Metadata } from "next";

// --- Type Definitions ---
import { Category_TYPE } from "@/app/types";
import CategoriesPage from "@/app/components/CategoriesPage";
interface ApiResponse {
  error: boolean;
  message: string;
  status_code: number;
  data: Category_TYPE;
}

// --- Data Fetching Function ---
async function getProductData(slugId: string): Promise<ApiResponse> {
  // console.log(`slugId ID: ${slugId}`);

  const res = await fetch(
    `https://api.lendora.ng/api/v1/inventory/category?category_slug=${slugId}`,

    { cache: "no-store" }
  );

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    console.log(`Error fetching product data: ${res.status} ${res.statusText}`);
    // throw new Error(
    //   `Failed to fetch product data: ${res.status} ${res.statusText}`
    // );
  }

  const jsonResponse: ApiResponse = await res.json();

  if (jsonResponse.error) {
    throw new Error(`API returned an error: ${jsonResponse.message}`);
  }

  return jsonResponse;
}

// --- Page Props Type ---
type PageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// --- generateMetadata ---
export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { categoryId } = await params;

  const slugId = categoryId;
  const categoryResponse = await getProductData(slugId);
  const category = categoryResponse.data;
  // const imageUrl = category.images?.[0]?.live_url || "";
  console.log(searchParams);
  return {
    title: category.name,
    description: category.description,
    openGraph: {
      // images: imageUrl ? [imageUrl] : [],
      title: category.name,
      description: category.description,
    },
  };
}

// --- Page Component ---
export default async function Page({ params }: PageProps) {
  const { categoryId } = await params;
  const slugId = categoryId;
  const dataResponse = await getProductData(slugId);
  const categoryData = dataResponse.data;

  console.log({ categoryData });

  return (
    <main>
      {/* <ProductPage product={productData} /> */}
      {/* display categoryData as string */}
      {/* <pre>{JSON.stringify(categoryData, null, 2)}</pre> */}
      <CategoriesPage categoryData={categoryData} />
    </main>
  );
}
