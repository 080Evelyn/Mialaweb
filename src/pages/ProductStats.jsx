import AdminOverview from "@/components/common/overview";
import { Fragment } from "react";
import Stats from "@/components/productStats/Stats";

const ProductStats = () => {
  return (
    <Fragment>
      <AdminOverview />
      <Stats />
    </Fragment>
  );
};

export default ProductStats;
