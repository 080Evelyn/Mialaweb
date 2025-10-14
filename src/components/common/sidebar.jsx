import { Fragment } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Admin from "../../assets/icons/admin.png";
import OverviewIcon from "../../assets/icons/overview.svg";
import ProductMgt from "../../assets/icons/productMgt.svg";
import Agents from "../../assets/icons/agents.svg";
import Fees from "../../assets/icons/fees.svg";
import DeliveryBox from "../../assets/icons/delivery-box.svg";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { resetDelivery } from "@/redux/deliverySlice";
import { resetProducts } from "@/redux/productSlice";
import { resetSubadmin } from "@/redux/subadminSlice";
import { resetTransaction } from "@/redux/transactionSlice";
import { resetriders } from "@/redux/riderSlice";
import { resetNotifications } from "@/redux/notificationSlice";
import { resetPayment } from "@/redux/allCustomerPaymentSlice";
import { BarChart3, FileText, LogOut, Power, TrendingUp } from "lucide-react";
import { resetStats } from "@/redux/statSlice";
import { resetSummary } from "@/redux/orderSummarySlice";

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useSelector((state) => state.auth.user.userRole);
  const first_name = useSelector((state) => state.auth.user.first_name);
  const permissions = useSelector((state) => state.auth.permissions);

  const dispatch = useDispatch();

  const SidebarMenuItems = [
    {
      id: "overview",
      label: "Overview",
      path: "/overview",
      icon: <img src={OverviewIcon} alt="overview logo" className="w-5 h-5" />,
    },
    {
      id: "productsMgt",
      label: "Product Management",
      path: "/products",
      icon: (
        <img
          src={ProductMgt}
          alt="product management logo"
          className="w-5 h-5"
        />
      ),
    },

    // {
    //   id: "product-stats",
    //   label: "Product Stats",
    //   path: "/productStat",
    //   icon: <TrendingUp className="w-5 h-5" />,
    // },
    {
      id: "delivery",
      label: "Orders",
      path: "/delivery",
      icon: <img src={DeliveryBox} alt="delivery box" className="w-5 h-5" />,
    },
    {
      id: "order-summary",
      label: "Delivery Summary",
      path: "/orderSummary",
      icon: <FileText className="w-5 h-5" />,
    },

    {
      id: "proposedFee",
      label: "Delivery Fees",
      path: "/proposedFee",
      icon: <img src={Fees} alt="proposedFee box" className="w-5 h-5" />,
    },

    (permissions.includes("TRANSACTIONS") || userRole === "Admin") && {
      id: "Revenue",
      label: "payin-summary",
      path: "/Fees",
      icon: <img src={Fees} alt="Fees-logo" className="w-5 h-5" />,
    },

    (permissions.includes("TRANSACTIONS") || userRole === "Admin") && {
      id: "payout-summary",
      label: "payout-summary",
      path: "/payout-summary",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    (permissions.includes("ORDERS_MANAGEMENT") || userRole === "Admin") && {
      id: "performance",
      label: "performance",
      path: "/performance",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "agent",
      label: "Agents",
      path: "/admin/agents",
      icon: <img src={Agents} alt="Agent" className="w-5 h-5" />,
    },
    (permissions.includes("ACTIVATE_RIDER") || userRole === "Admin") && {
      id: "request",
      label: "Request",
      path: "/request",
      icon: <Power src={Agents} alt="Agent" className="w-5 h-5" />,
    },
    {
      id: "admin",
      label: "Admin",
      path: "/admin/sub-admins",
      icon: <img src={Agents} alt="Agent" className="w-5 h-5" />,
    },
  ];

  const handleSignOut = () => {
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
    navigate("/");
  };
  return (
    <nav className="mt-0 flex flex-col gap-1 h-screen overflow-y-scroll  pl-3 ">
      {SidebarMenuItems.filter(Boolean).map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        // ||
        // (menuItem.id === "agent" &&
        //   (location.pathname.startsWith("/admin/agents") ||
        //     location.pathname.startsWith("/admin/sub-admins")));
        // (menuItem.id === "fees" &&
        //   location.pathname.startsWith("/payout-summary"));

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex  items-center gap-1.5 text-sm rounded-[16px] py-3 px-1.5 ${
              isActive
                ? "bg-[#FFBFBF] text-foreground"
                : !menuItem.path
                ? "hover:bg-transparent "
                : "hover:bg-[#FFBFBF] cursor-pointer"
            }`}>
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        );
      })}
      <div
        onClick={handleSignOut}
        className={`flex cursor-pointer items-center gap-1.5 text-sm rounded-[16px] py-3 px-1.5 relative bottom-3 `}>
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </div>
      <div className="absolute bottom-0 inset-x-0 ps-4 lg:ps-5.5 px-3">
        <div className="flex items-center gap-1.5 text-sm rounded-[16px] py-3 px-1.5 ">
          <img src={Admin} alt="Admin-logo" className="w-5 h-5" />
          <span>{`${first_name} `}</span>
        </div>
      </div>
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex justify-center mt-4 mb-4">
                <img
                  src="/images/logo.svg"
                  alt="logo img"
                  className="mx-auto"
                />
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 h-full hidden z-50 w-53 flex-col border-r bg-background p-6 pt-8 px-3 lg:flex">
        <div className="cursor-pointer flex justify-center mb-8">
          <img src="/images/logo.svg" alt="logo img" />
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
