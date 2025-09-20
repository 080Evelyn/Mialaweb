import AdminList from "@/components/admin/admin-list";
import SuperAdminOverview from "@/components/admin/overview";

const SubAdmin = () => {
  return (
    <div>
      <SuperAdminOverview />
      <AdminList />
    </div>
  );
};

export default SubAdmin;
