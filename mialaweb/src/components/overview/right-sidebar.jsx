import { useSelector } from "react-redux";
import Activities from "./right-bottom";
import NotificationList from "./right-top";

const OverviewSidebar = () => {
  const auth = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col">
      <NotificationList />
      <Activities />
    </div>
  );
};

export default OverviewSidebar;
