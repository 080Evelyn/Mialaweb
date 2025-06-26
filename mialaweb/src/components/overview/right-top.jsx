import DeliveryIcon from "../../assets/icons/delivery-report.svg";
import PayoutIcon from "../../assets/icons/payout.svg";
import AgentIcon from "../../assets/icons/user-group.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchNotifications, setMultiCallNot } from "@/redux/notificationSlice";
import { Bell, EllipsisVertical } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/Api";

const getIconByType = (type) => {
  switch (type) {
    case "delivery-failed":
    case "DELIVERY_FEE_PROPOSED":
      return {
        icon: <img src={DeliveryIcon} alt="delivery" className="w-4 h-4" />,
        bg: "#221D7A",
      };
    case "PAYMENT_RECEIVED":
      return {
        icon: <img src={PayoutIcon} alt="payout" className="w-4 h-4" />,
        bg: "#0A55D0",
      };
    case "USER_SIGNUP":
      return {
        icon: <img src={AgentIcon} alt="agent" className="w-4 h-4" />,
        bg: "#0A55D0",
      };
    default:
      return {
        icon: null,
        bg: "transparent",
      };
  }
};

const NotificationList = () => {
  const [markAsRead, setMarkAsRead] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.auth.user.userId);
  const notification = useSelector((state) => state.notification.notifications);
  const loading = useSelector((state) => state.notification.loading);
  const error = useSelector((state) => state.notification.error);
  const multiCallNot = useSelector((state) => state.notification.multiCallNot);
  const [action, setAction] = useState(false);
  useEffect(() => {
    dispatch(fetchNotifications({ token, id }));
  }, []);
  const unreadCount = notification.filter((n) => n.read === false).length;

  const handleAction = (id) => {
    setAction(!action);
    setMarkAsRead(id);
  };

  const handleMarkAsRead = async (notId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/notify/notifications/mark-read/${notId}`,
        null,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        dispatch(fetchNotifications({ token, id }));
        dispatch(setMultiCallNot());
      }
    } catch (error) {
      setErrorMessage(`An error occured.`);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  function formatDateArray(dateArray) {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      throw new Error("Invalid date array.");
    }

    const [
      year,
      month,
      day,
      hour = 0,
      minute = 0,
      second = 0,
      nanoseconds = 0, // changed variable name for clarity
    ] = dateArray;

    const milliseconds = Math.floor(nanoseconds / 1_000_000); // convert ns to ms

    const date = new Date(
      year,
      month - 1, // JavaScript months are zero-based
      day,
      hour,
      minute,
      second,
      milliseconds
    );

    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading && !multiCallNot) {
    return <h2>Loading notifcations...</h2>;
  }

  if (!loading && error) {
    return (
      <h2 className="text-red-600 text-sm ">
        Failed to load notification. check internet connection and try again.
      </h2>
    );
  }
  return (
    <div className=" font-normal text-[#1C1C1C] ">
      <div className=" pb-3 flex gap-1 text-sm">
        Notifications
        <Bell />
        {unreadCount !== 0 && (
          <span className="bg-red-500 h-[20px] w-[20px] relative right-3 bottom-1.5 text-center font-bold rounded-full text-white">
            {unreadCount}
          </span>
        )}
      </div>
      <div className=" max-h-[screen] overflow-y-auto">
        {Array.isArray(notification) && notification.length > 0 ? (
          notification
            .filter((not) => not?.read === false)
            .map((notif) => {
              const { icon, bg } = getIconByType(notif.type);
              return (
                <div
                  key={notif.id}
                  className="flex items-start gap-2 mb-2 pe-1">
                  <div
                    className="shrink-0 flex items-center h-6 w-6 justify-center rounded p-1"
                    style={{ backgroundColor: bg }}>
                    {icon}
                  </div>

                  <div className="flex flex-col flex-grow gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm -mt-1">{notif.message}</span>
                      <span className="text-[#8C8C8C] text-[14px] ml-2 whitespace-nowrap">
                        {formatDateArray(notif?.createdAt)}
                      </span>
                      <EllipsisVertical
                        onClick={() => {
                          handleAction(notif.id);
                        }}
                        className="items-center cursor-pointer"
                        size={30}
                      />
                    </div>
                    {action && markAsRead === notif.id && (
                      <>
                        <button
                          onClick={() => {
                            handleMarkAsRead(notif.id);
                          }}
                          className="text-[12px] bg-white font-bold text-black px-3 py-2 cursor-pointer shadow-2xl">
                          {isLoading ? "processing..." : "Mark as read"}
                        </button>
                        {errorMessage && (
                          <p className="text-red-500 text-[10px]">
                            {errorMessage}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
        ) : (
          <p className="text-black">No Unread notifications at the moment</p>
        )}

        {unreadCount === 0 && (
          <p className="text-black">No Unread notifications at the moment</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
