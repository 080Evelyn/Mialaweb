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
import AdminAgent from "./pages/super-admin/Agents";
import AdminAgentSidebar from "./components/admin/agent-r-sidebar";
import SubAdmin from "./pages/super-admin/SubAdmin";
import TotalFees from "./pages/fees/TotalFees";
import PayoutSummary from "./pages/fees/PayoutSummary";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import InstallPWA from "./components/ui/InstallPWA";
import ProposedFeeReview from "./pages/ProposedFeeReview";
import OrderSummary from "./pages/OrderSummary";
import PerformanceMenu from "./pages/PerformanceMenu";

function App() {
  return (
    <>
      {/* InstallPWA outside Routes so it can run globally */}
      <InstallPWA />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />

        {/* Protected routes wrapper */}
        <Route element={<ProtectedRoute />}>
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
              <Layout>
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
            path="proposedFee"
            element={
              <Layout>
                <ProposedFeeReview />
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
              <Layout
              // rightSidebar={<FeesSidebar />}
              >
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
            path="orderSummary"
            element={
              <Layout>
                <OrderSummary />
              </Layout>
            }
          />
          <Route
            path="performance"
            element={
              <Layout>
                <PerformanceMenu />
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
        </Route>
      </Routes>
    </>
  );
}

export default App;
