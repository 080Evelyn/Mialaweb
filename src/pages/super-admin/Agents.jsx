import AdminAgentList from "@/components/admin/agent-list";
import SuperAdminOverview from "@/components/admin/overview";
const AdminAgent = () => {
  return (
    <div>
      <SuperAdminOverview />
      <AdminAgentList />
    </div>
  );
};

export default AdminAgent;
