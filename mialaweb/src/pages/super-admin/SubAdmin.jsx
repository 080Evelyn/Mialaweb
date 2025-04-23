import AdminList from "@/components/admin/admin-list";
import SuperAdminOverview from "@/components/admin/overview";
import AgentOverview from "@/components/agent/overview";

const SubAdmin = () => {
  return (
    <div>
      <SuperAdminOverview />
      <AdminList />
    </div>
  );
};

export default SubAdmin;
