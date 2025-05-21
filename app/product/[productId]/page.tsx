// app/projects/[projectId]/page.tsx or similar

import ProductPage from "@/app/components/ProductPage";
import type { Metadata, ResolvingMetadata } from "next";

interface Params {
  productId: string;
}

interface SearchParams {
  [key: string]: string | string[];
}

interface ProjectUser {
  firstName: string;
  lastName: string;
}

interface Project {
  name: string;
  description: string;
  imageUrl: string;
  user: ProjectUser;
}

interface ProjectResponse {
  data: {
    project: Project;
  };
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { productId } = await params;

  const product = await fetch(`https://fakestoreapi.com/products/1`).then(
    (res) => res.json()
  );

  console.log(product, "frm a products");

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image, ...previousImages],
      title: product.title, // Title for social media
      description: product.description, // Description for social media
      url: product.url, // Canonical URL for social sharing
    },
  };
}

async function getData(productId: string): Promise<ProjectResponse> {
  const res = await fetch(`https://fakestoreapi.com/products/1`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({ params }: { params: Params }) {
  const data = await getData(params.productId);
  return (
    <main className="bg-zinc-100">
      <ProductPage product={data} />
    </main>
  );
}
