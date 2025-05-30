import { useSelector } from "react-redux";

const SuperAdminOverview = () => {
  const riders = useSelector((state) => state.riders.riders);
  const subAdmins = useSelector((state) => state.subadmin.subadmin);
  const pendingRiders = useSelector(
    (state) => state.pendingRiders.pendingRiders
  );

  return (
    <div className="left-[240px] top-[77px] flex flex-col gap-[8px] mb-3">
      <h2 className="text-sm font-medium">Overview</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:gap-4 overflow-x-auto py-1">
        <div className="flex flex-col w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#EDEEFC]">
          <p className="text-sm font-medium text-slate-500">Total Agent</p>
          <p className="text-xl font-bold text-slate-900">
            {/* {riders ? riders?.length : "..."} */}
          </p>
        </div>

        <div className="flex flex-col w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#E6F1FD]">
          <p className="text-sm font-medium text-slate-500">Total Admin</p>
          {subAdmins ? subAdmins?.length : "..."}
        </div>

        {/* <div className="flex flex-col w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#EDEEFC]">
          <p className="text-sm font-medium text-slate-500">Admin Request</p>
          <p className="text-xl font-bold text-slate-900">156</p>
        </div> */}

        <div className="flex flex-col w-full lg:max-w-[238px] lg:min-w-[170px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#E6F1FD]">
          <p className="text-sm font-medium text-slate-500">Agent Request</p>
          {pendingRiders ? pendingRiders?.length : "..."}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminOverview;
