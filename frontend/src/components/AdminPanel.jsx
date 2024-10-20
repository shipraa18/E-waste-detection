import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = ({ authToken }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/admin/notifications', {
          headers: {
            Authorization: authToken,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [authToken]);

  return (
    <div>
      <h1>Admin Panel - Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <p>{notification.message}</p>
              <small>{new Date(notification.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPanel;
