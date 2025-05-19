import AdminOverview from "@/components/common/overview";
import AgentGraph from "@/components/overview/agent-graph";
import RevenueBarChart from "@/components/overview/revenueBarChart";
import RevenuePieChart from "@/components/overview/revenuePieChart";

const Overview = () => {
  return (
    <div>
      <AdminOverview />
      <AgentGraph />
      <div className="grid grid-cols-1 md:grid-cols- mt-4 gap-4">
        <RevenueBarChart />
        {/* <RevenuePieChart /> */}
      </div>
    </div>
  );
};

export default Overview;
