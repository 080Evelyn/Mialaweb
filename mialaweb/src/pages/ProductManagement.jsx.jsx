import DeliveryList from "@/components/productMgt/deliveryList";
import AdminHeader from "@/components/productMgt/header";
import AdminOverview from "@/components/productMgt/overview";
import AdminSidebar from "@/components/productMgt/sidebar";
import { useState } from "react";

const ProductManagement = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="lg:ml-53">
        <AdminHeader setOpen={setOpenSidebar} />
        <div className="h-[calc(100vh-4.5rem)] overflow-y-auto">
          <main className="flex flex-col bg-muted/40 p-4 md:p-6">
            <AdminOverview />
            <DeliveryList />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
