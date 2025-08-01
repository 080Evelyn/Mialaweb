import ProductList from "@/components/productMgt/productList";
import AdminOverview from "@/components/common/overview";
import { Fragment } from "react";

const ProductManagement = () => {
  return (
    <Fragment>
      <AdminOverview />
      <ProductList />
    </Fragment>
  );
};

export default ProductManagement;
