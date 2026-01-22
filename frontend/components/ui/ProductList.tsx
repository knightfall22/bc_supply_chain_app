"use client";

import { useProducts } from "@/components/hooks/useProducts";
import decodeU8 from "@/utils/decodeU8";
import Link from "next/link";

const ProductList = () => {
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading && !products) {
    return <p className="text-sm text-muted">Loading products…</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-500">Failed to load products</p>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="editorial-card p-6 text-sm text-muted">
        No products found.
      </div>
    );
  }

  console.log("products", products);

  return (
    <div className="flex flex-wrap gap-4">
      {products.map((product) => (
        <Link
          key={product.account.productId}
          href={`/products/${product.publicKey.toBase58()}`}
          className="
                editorial-card
                p-6
                hover:shadow-sm
                hover:-translate-y-[1px]
                transition
                w-full
                sm:w-[calc(50%-0.5rem)]
                lg:w-[calc(33.333%-0.75rem)]
            "
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-sm font-medium">{product.account.name}</h2>

              <p className="text-xs text-muted">
                {decodeU8(product.account.productId)}
              </p>
            </div>

            <span className="text-xs text-muted">
              Qty: {product.account.quantity.toString()}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
