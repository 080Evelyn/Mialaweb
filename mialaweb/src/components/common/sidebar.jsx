import { Fragment } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Admin from "../../assets/icons/admin.png";
import OverviewIcon from "../../assets/icons/overview.svg";
import ProductMgt from "../../assets/icons/productMgt.svg";
import Agents from "../../assets/icons/agents.svg";
import Fees from "../../assets/icons/fees.svg";
import DeliveryBox from "../../assets/icons/delivery-box.svg";
import { useLocation, useNavigate } from "react-router";
import useUser from "@/hooks/useUser";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { resetDelivery } from "@/redux/deliverySlice";
import { resetProducts } from "@/redux/productSlice";
import { resetSubadmin } from "@/redux/subadminSlice";
import { resetTransaction } from "@/redux/transactionSlice";
import { resetriders } from "@/redux/riderSlice";
import { resetNotifications } from "@/redux/notificationSlice";
import { resetPayment } from "@/redux/allCustomerPaymentSlice";

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useSelector((state) => state.auth.user.userRole);
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
    {
      id: "delivery",
      label: "Orders",
      path: "/delivery",
      icon: <img src={DeliveryBox} alt="delivery box" className="w-5 h-5" />,
    },
    {
      id: "proposedFee",
      label: "Proposed Fees",
      path: "/proposedFee",
      icon: <img src={Fees} alt="proposedFee box" className="w-5 h-5" />,
    },
    {
      id: "fees",
      label: "Fees",
      path: "/fees",
      icon: <img src={Fees} alt="Fees-logo" className="w-5 h-5" />,
    },
    {
      id: "agent",
      label: userRole === "Subadmin" ? "Agents" : "Agents/Admins",
      path: userRole === "Subadmin" ? "/agents" : "/admin/agents",
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

    navigate("/");
  };
  return (
    <nav className="mt-3 flex flex-col gap-1 pl-3">
      {SidebarMenuItems.map((menuItem) => {
        const isActive =
          location.pathname === menuItem.path ||
          (menuItem.id === "agent" &&
            (location.pathname.startsWith("/admin/agents") ||
              location.pathname.startsWith("/admin/sub-admins"))) ||
          (menuItem.id === "fees" &&
            location.pathname.startsWith("/payout-summary"));

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex cursor-pointer items-center gap-1.5 text-sm rounded-[16px] py-3 px-1.5 ${
              isActive ? "bg-[#FFBFBF] text-foreground" : " hover:bg-[#FFBFBF] "
            }`}>
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        );
      })}
      <div
        onClick={handleSignOut}
        className={`flex cursor-pointer items-center gap-1.5 text-sm rounded-[16px] py-3 px-1.5`}>
        <span>Sign Out</span>
      </div>
      <div className="absolute bottom-10 inset-x-0 ps-4 lg:ps-5.5 px-3">
        <div className="flex cursor-pointer items-center gap-1.5 text-sm rounded-[16px] py-3 px-1.5 hover:bg-[#FFBFBF]">
          <img src={Admin} alt="Admin-logo" className="w-5 h-5" />
          <span>{userRole}</span>
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
