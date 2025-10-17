import { useSelector } from "react-redux";

const AgentOverview = () => {
  const riders = useSelector((state) => state.allRiders.allRiders);
  const pendingRiders = useSelector(
    (state) => state.pendingRiders.pendingRiders
  );
  const approved = riders?.filter((rider) => {
    return (
      rider?.approvalStatus === "APPROVED" ||
      rider?.approvalStatus === "ACTIVATE"
    );
  });
  return (
    <div className="left-[240px] top-[77px] flex flex-col gap-[8px] mb-3">
      <h2 className="text-sm font-medium">Overview</h2>

      <div className="grid grid-cols-2 gap-4  overflow-x-auto py-1">
        <div className="flex flex-col w-[80%]  lg:w-[362px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#EDEEFC]">
          <p className="text-sm font-medium text-slate-500">Total Agent</p>
          {approved ? approved?.length : "..."}
        </div>

        <div className="flex flex-col w-[80%]  lg:w-[362px] justify-center h-[98px] p-[24px] gap-2 rounded-[16px] shadow-sm bg-[#E6F1FD]">
          <p className="text-sm font-medium text-slate-500">
            Total Agent Request
          </p>
          {pendingRiders ? pendingRiders?.length : "..."}
        </div>
      </div>
    </div>
  );
};

export default AgentOverview;
