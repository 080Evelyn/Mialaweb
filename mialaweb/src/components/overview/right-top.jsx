import { notifications } from "@/config/notification";
import DeliveryIcon from "../../assets/icons/delivery-report.svg";
import PayoutIcon from "../../assets/icons/payout.svg";
import AgentIcon from "../../assets/icons/user-group.svg";
// import SockJS from "sockjs-client";
// For browser (ESM)
import SockJS from "sockjs-client/dist/sockjs";
import { Stomp } from "@stomp/stompjs";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const getIconByType = (type) => {
  switch (type) {
    case "delivery-failed":
    case "delivery-success":
      return {
        icon: <img src={DeliveryIcon} alt="delivery" className="w-4 h-4" />,
        bg: "#221D7A",
      };
    case "payout":
      return {
        icon: <img src={PayoutIcon} alt="payout" className="w-4 h-4" />,
        bg: "#0A55D0",
      };
    case "new-agent":
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
  let stompClient;
  const userId = useSelector((state) => state.auth.user.userId);
  const [notifications, setNotifications] = useState([]);

  // const connectWebSocket = () => {
  //   const socket = new SockJS("https://miala.onrender.com/ws-notifications"); // Spring Boot endpoint
  //   stompClient = Stomp.over(socket);

  //   stompClient.connect({}, () => {
  //     console.log("Connected");

  //     // Subscribe to a topic
  //     stompClient.subscribe(`/topic/user/${userId}`, (message) => {
  //       console.log("Received:", message.body);
  //     });
  //   });
  // };

  // const disconnectWebSocket = () => {
  //   if (stompClient) {
  //     stompClient.disconnect(() => {
  //       console.log("Disconnected");
  //     });
  //   }
  // };
  // useEffect(() => {
  //   connectWebSocket();
  // }, []);
  return (
    <div className=" font-normal text-[#1C1C1C]">
      <div className=" pb-3 text-sm">Notifications</div>
      <div className=" max-h-[36vh] overflow-y-auto">
        {notifications.map((notif) => {
          const { icon, bg } = getIconByType(notif.type);
          return (
            <div key={notif.id} className="flex items-start gap-2 mb-2 pe-1 ">
              <div
                className="shrink-0 flex items-center h-6 w-6 justify-center rounded p-1"
                style={{ backgroundColor: bg }}>
                {icon}
              </div>

              <div className="flex flex-col flex-grow gap-1">
                <div className="flex justify-between items-start ">
                  <span className=" text-sm -mt-1">{notif.title}</span>
                  <span className="text-[#8C8C8C] text-[10px] ml-2 whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
                <span
                  className={` text-[10px] ${
                    notif.message.toLowerCase().includes("failed")
                      ? "text-[#B10303]"
                      : notif.message.toLowerCase().includes("success")
                      ? "text-green-600"
                      : "text-[#8C8C8C]"
                  }`}>
                  {notif.message}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationList;
