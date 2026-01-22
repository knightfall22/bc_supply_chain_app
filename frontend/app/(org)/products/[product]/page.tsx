import ProductDetails from "@/components/ui/ProductDetails";

interface PageProps {
  params: Promise<{
    product: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { product } = await params;

  return (
    <section className="flex justify-center py-12">
      <ProductDetails productAddress={product} />
    </section>
  );
}
