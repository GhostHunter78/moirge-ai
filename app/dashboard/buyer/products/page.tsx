import AllProductsPage from "@/components/dashboard/buyer/all-products-page";

export const metadata = {
  title: "Products",
  description: "Browse products from all stores on the marketplace",
};

export default function BuyerProductsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AllProductsPage />
    </div>
  );
}

