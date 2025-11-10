import { useEffect, useRef, useState } from "react";
import ScrollToTop from "./scrollToTop";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import { useLocation } from "react-router";
import ActivityInterceptor from "./ActivityInterceptor";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import { resetDelivery } from "@/redux/deliverySlice";
import { resetProducts } from "@/redux/productSlice";
import { resetSubadmin } from "@/redux/subadminSlice";
import { resetTransaction } from "@/redux/transactionSlice";
import { resetriders } from "@/redux/riderSlice";
import { resetNotifications } from "@/redux/notificationSlice";
import { resetPayment } from "@/redux/allCustomerPaymentSlice";
import { resetStats } from "@/redux/statSlice";
import { resetSummary } from "@/redux/orderSummarySlice";
import { resetRequest } from "@/redux/requestSlice";
import { resetRevenue } from "@/redux/revenueSlice";

const Layout = ({ children, rightSidebar }) => {
  const dispatch = useDispatch();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showRight, setShowRight] = useState(true); // controls collapsible panel
  const mainRef = useRef(null);
  const location = useLocation();
  const dash = location.pathname === "/overview";
  const fee = location.pathname === "/proposedFee";

  useEffect(() => {
    if (!fee) setShowRight(true);
  }, [location.pathname]);
  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetDelivery());
    dispatch(resetProducts());
    dispatch(resetSubadmin());
    dispatch(resetTransaction());
    dispatch(resetriders());
    dispatch(resetNotifications());
    dispatch(resetPayment());
    dispatch(resetStats());
    dispatch(resetSummary());
    dispatch(resetRequest());
    dispatch(resetRevenue());
    navigate("/");
  };
  return (
    <div className="flex h-screen w-full overflow-x-hidden relative">
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 flex flex-col lg:ml-53">
        <AdminHeader
          setOpen={setOpenSidebar}
          rightSidebar={rightSidebar}
          toggleRightSidebar={
            fee ? () => setShowRight((prev) => !prev) : undefined
          } // toggle only for /proposedFee
        />
        <ScrollToTop scrollRef={mainRef} />
        <main
          ref={mainRef}
          className="flex-1 overflow-auto md:overflow-x-scroll p-4 md:p-6">
          <ActivityInterceptor onLogout={handleLogout} />
          {children}
        </main>
      </div>

      {/* Collapsible Right Sidebar */}
      {rightSidebar && (
        <aside
          className={`hidden lg:flex flex-col border-l bg-background p-4 transition-all duration-500 ease-in-out ${
            dash
              ? "!w-[22%]"
              : fee
              ? showRight
                ? "!w-[20%]"
                : "!w-0"
              : "!w-[20%]"
          } overflow-auto ${
            showRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
          {rightSidebar}
        </aside>
      )}
    </div>
  );
};

export default Layout;
