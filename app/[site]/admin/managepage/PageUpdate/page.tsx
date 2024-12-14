import { Metadata } from "next";

type ProductPageProps = {
  params: { name: string }; // Define the type of the dynamic parameter
};

export default function ProductPage({ params }: ProductPageProps) {
  const { name } = params; // Extract the `id` parameter
  return <h1>Page: {name}</h1>;
}
