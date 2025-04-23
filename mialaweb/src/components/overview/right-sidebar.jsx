import Activities from "./right-bottom";
import NotificationList from "./right-top";

const OverviewSidebar = () => {
  return (
    <div className="flex flex-col">
      <NotificationList />
      <Activities />
    </div>
  );
};

export default OverviewSidebar;
