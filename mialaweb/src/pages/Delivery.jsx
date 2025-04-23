import AdminOverview from "@/components/common/overview";
import DeliveryList from "@/components/delivery/deliveryList";
import { Fragment } from "react";

const Delivery = () => {
  return (
    <Fragment>
      <AdminOverview />
      <DeliveryList />
    </Fragment>
  );
};

export default Delivery;
