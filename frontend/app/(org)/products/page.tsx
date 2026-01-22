import ProductList from "@/components/ui/ProductList";

export default function ProductsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">
          Products
        </h1>
        <p className="text-sm text-muted">
          All registered products in this organization
        </p>
      </header>

      <ProductList />
    </section>
  );
}
