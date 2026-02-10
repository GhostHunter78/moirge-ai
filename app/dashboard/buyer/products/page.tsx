import RecommendedProducts from "@/components/dashboard/overview/buyer/recommended-products";

export const metadata = {
  title: "Products",
  description: "Browse products from all stores on the marketplace",
};

export default function BuyerProductsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <p className="text-gray-600 text-sm">
          Discover featured and recommended products from sellers across the
          marketplace.
        </p>
        <RecommendedProducts />
      </div>
    </div>
  );
}

