import { Route, Routes } from "react-router";
import Overview from "./pages/Overview";
import OverviewSidebar from "./components/overview/right-sidebar";
import Agents from "./pages/Agents";
import AgentSidebar from "./components/agent/right-sidebar";
import Delivery from "./pages/Delivery";
import FeesSidebar from "./components/fees/right-sidebar";
import ProductManagement from "./pages/ProductManagement";
import Settings from "./pages/Settings";
import Layout from "./components/common/layout";
import AdminSidebar from "./components/admin/admin-r-sidebar";
import AdminAgent from "./pages/super-admin/Agents";
import AdminAgentSidebar from "./components/admin/agent-r-sidebar";
import SubAdmin from "./pages/super-admin/SubAdmin";
import TotalFees from "./pages/fees/TotalFees";
import PayoutSummary from "./pages/fees/PayoutSummary";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout rightSidebar={<OverviewSidebar />}>
            <Overview />
          </Layout>
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route
        path="overview"
        element={
          <Layout rightSidebar={<OverviewSidebar />}>
            <Overview />
          </Layout>
        }
      />
      <Route
        path="agents"
        element={
          <Layout rightSidebar={<AgentSidebar />}>
            <Agents />
          </Layout>
        }
      />
      <Route
        path="admin/agents"
        element={
          <Layout rightSidebar={<AdminAgentSidebar />}>
            <AdminAgent />
          </Layout>
        }
      />
      <Route
        path="admin/sub-admins"
        element={
          <Layout rightSidebar={<AdminSidebar />}>
            <SubAdmin />
          </Layout>
        }
      />
      <Route
        path="delivery"
        element={
          <Layout>
            <Delivery />
          </Layout>
        }
      />
      <Route
        path="fees"
        element={
          <Layout rightSidebar={<FeesSidebar />}>
            <TotalFees />
          </Layout>
        }
      />
      <Route
        path="payout-summary"
        element={
          <Layout rightSidebar={<FeesSidebar />}>
            <PayoutSummary />
          </Layout>
        }
      />
      <Route
        path="products"
        element={
          <Layout>
            <ProductManagement />
          </Layout>
        }
      />
      <Route
        path="settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
