import { fetchRevenue } from "@/redux/revenueSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminOverview = () => {
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const dispatch = useDispatch();
  const deliveryList = useSelector((state) => state.delivery.delivery);
  const { products } = useSelector((state) => state.product);
  const revenue = useSelector((state) => state.revenue.revenue);
  const loading = useSelector((state) => state.revenue.loading);
  const success = useSelector((state) => state.revenue.success);
  const sold = deliveryList?.filter((product) => product.paymentApproval);
  const riders = useSelector((state) => state.allRiders.allRiders);
  const approved = riders?.filter((rider) => {
    return rider.approvalStatus === "APPROVED";
  });
  useEffect(() => {
    if (success) {
      return;
    }
    dispatch(fetchRevenue({ token, userRole }));
  }, []);

  return (
    <div className="md:left-[240px]  top-[77px] flex flex-row md:flex-col gap-[8px] mb-3">
      <h2 className="text-sm font-medium mt-[-15px]">Overview</h2>

      <div className="grid grid-cols-1 w-[70%] ml-[-7%] md:ml-0 gap-4 sm:grid sm:grid-cols-2 lg:flex lg:gap-4 overflow-x-auto py-1">
        <div className="flex flex-col w-[80%] md:w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#EDEEFC]">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="text-xl font-bold text-slate-900">
            {products?.length > 0 ? products?.length : "..."}
          </p>
        </div>

        <div className="flex flex-col w-[80%] md:w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#E6F1FD]">
          <p className="text-sm font-medium text-slate-500">Total Sold</p>
          <p className="text-xl font-bold text-slate-900">{sold?.length}</p>
        </div>

        <div className="flex flex-col w-[80%] md:w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#EDEEFC]">
          <p className="text-sm font-medium text-slate-500">Total Revenue</p>
          <p className="text-xl font-bold text-slate-900">
            <span className="text-sm font-medium text-slate-500 ">
              Deposits:₦
            </span>
            {loading ? "..." : revenue.totalDeposits}
          </p>
          <p className="text-xl font-bold text-slate-900">
            <span className="text-sm font-medium text-slate-500">
              Transfers:₦
            </span>
            {loading ? "..." : revenue.totalTransfers * 100}
          </p>
        </div>

        <div className="flex flex-col w-[80%] md:w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#E6F1FD]">
          <p className="text-sm font-medium text-slate-500">Active Users</p>
          <p className="text-xl font-bold text-slate-900">
            {approved ? approved?.length : "..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
