import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

function NotificationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const listenerHandle = PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (event) => {
          const data = event.notification.data;
          if (data?.click_action === "OPEN_ORDER_DETAIL" && data?.order_id) {
            navigate(`/orders?order_id=${data.order_id}&fromNotification=true`);
          } else {
            console.log(
              "Notification action not handled or missing data:",
              data
            );
          }
        }
      );

      return () => {
        console.log("Removing Push Notification listener...");
        listenerHandle
          .remove()
          .catch((err) => console.error("Error removing listener", err));
      };
    }
    return () => {};
  }, [navigate]);

  return null;
}

export default NotificationHandler;
