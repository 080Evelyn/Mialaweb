import { useSelector } from "react-redux";

const AdminOverview = () => {
  const deliveryList = useSelector((state) => state.delivery.delivery);
  const sold = deliveryList?.filter((product) => product.paymentApproval);
  const riders = useSelector((state) => state.allRiders.allRiders);
  return (
    <div className="md:left-[240px]  top-[77px] flex flex-row md:flex-col gap-[8px] mb-3">
      <h2 className="text-sm font-medium mt-[-15px]">Overview</h2>

      <div className="grid grid-cols-1 w-[70%] ml-[-7%] md:ml-0 gap-4 sm:grid sm:grid-cols-2 lg:flex lg:gap-4 overflow-x-auto py-1">
        <div className="flex flex-col w-[80%] md:w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#EDEEFC]">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="text-xl font-bold text-slate-900">
            {deliveryList?.length > 0 ? deliveryList?.length : "..."}
          </p>
        </div>

        <div className="flex flex-col w-[80%] md:w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#E6F1FD]">
          <p className="text-sm font-medium text-slate-500">Total Sold</p>
          <p className="text-xl font-bold text-slate-900">{sold?.length}</p>
        </div>

        <div className="flex flex-col w-[80%] md:w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#EDEEFC]">
          <p className="text-sm font-medium text-slate-500">Total Revenue</p>
          <p className="text-xl font-bold text-slate-900">156</p>
        </div>

        <div className="flex flex-col w-[80%] md:w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#E6F1FD]">
          <p className="text-sm font-medium text-slate-500">Active Users</p>
          <p className="text-xl font-bold text-slate-900">
            {riders ? riders?.length : "..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
