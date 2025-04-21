import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

function NotificationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      console.log('Setting up Local Notification listener...');
      LocalNotifications.requestPermissions().then(perm => {
         if (perm.display !== 'granted') {
             console.warn('Local Notification permission not granted.');
         }
      }).catch(err => console.error("Error requesting local notification permissions", err));


      const listenerHandle = LocalNotifications.addListener(
        'localNotificationActionPerformed',
        (event) => {
          const data = event.notification.data;
          console.log('Local Notification action performed:', event);

          if (data?.click_action === 'OPEN_ORDER_DETAIL' && data?.order_id) {
            console.log(`Navigating to /orders?order_id=${data.order_id}`);
            navigate(`/orders?order_id=${data.order_id}&fromNotification=true`);
          } else {
            console.log('Notification action not handled or missing data:', data);
          }
        }
      );

      return () => {
        console.log('Removing Local Notification listener...');
        listenerHandle.remove().catch(err => console.error("Error removing listener", err));
      };
    }
    return () => {};

  }, [navigate]);

  return null;
}

export default NotificationHandler;