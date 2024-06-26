// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (id, type, progress, body) => {

    var header = ""

    switch (type) {
      case 1: // Upload
        if (progress === 100) {
          header = "Upload Complete"
        } else {
          header = "Upload in progress..."
        }
        break;
      case 2: // Warning
        header = "Warning"
        break;
      default:
        break;
    }

    const newNotification = { id, header, progress, age: Date.now(), body, type};
    setNotifications([...notifications, newNotification]);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
