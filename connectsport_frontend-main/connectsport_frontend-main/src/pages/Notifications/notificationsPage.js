import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/useAuth";
import Navbar from "../../Components/layout/navbar";
import styles from "../../Styles/Notifications/notifications.css";
import SearchComponent from "../../Components/common/searchComponent";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  const [searchInput, setSearchInput] = useState("");

  // Extract the notification fetching logic into its own function
  const fetchNotifications = () => {
    if (currentUser) {
      fetch(`${process.env.REACT_APP_API_URL}/notifications/${currentUser}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched notifications:", data); // Check the structure of fetched data
          setNotifications(data);
        })
        .catch(console.error);
    }
  };

  // useEffect(() => {
  //   if (currentUser) {
  //     fetch(`${process.env.REACT_APP_API_URL}/notifications/${currentUser}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Fetched notifications:", data); // Check the structure of fetched data
  //         setNotifications(data);
  //       })
  //       .catch(console.error);
  //   }
  // }, [currentUser]);

  // Call fetchNotifications on component mount and when currentUser changes
  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const handleMarkAsRead = (notificationId) => {
    console.log(`Marking notification ${notificationId} as read`);
    fetch(`${process.env.REACT_APP_API_URL}/mark-notification-as-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser, notificationId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to mark notification as read");
        }
        return response.json();
      })
      .then(() => {
        console.log(`Notification ${notificationId} marked as read`);
        // Update the notification state to reflect the change
        const updatedNotifications = notifications.map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, read: true };
          }
          return notification;
        });
        setNotifications(updatedNotifications);
      })
      .catch(console.error);
  };

  const handleDelete = (notificationId) => {
    console.log(`Deleting notification ${notificationId}`);
    fetch(`${process.env.REACT_APP_API_URL}/notifications/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser, notificationId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete notification");
        }
        // setNotifications(notifications.filter((notification) => notification.id !== notificationId));
        fetchNotifications();
      })
      .catch(console.error);
  };

  return (
    <div className={`container-fluid ${styles.container} p-0`}>
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput} // Pass setSearchInput as a prop
      />
      {searchInput && <SearchComponent />}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className={`card ${styles.cardCustom}`}>
            <div className={`card-body ${styles.cardBody}`}>
              <h3 className={`card-title ${styles.cardTitle}`}>
                Notifications
              </h3>
              <div className={styles.notificationsList}>
                {notifications.length > 0 ? (
                  <div className="list-group">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`list-group-item ${styles.listGroupItem} d-flex justify-content-between align-items-center`}
                      >
                        <span className={styles.message}>
                          {notification.message}
                        </span>
                        <div>
                          {!notification.read && (
                            <button
                              className={`btn ${styles.btnCustom} ${styles.btnMarkAsRead}`}
                              onClick={() => handleMarkAsRead(notification._id)}
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            className={`btn ${styles.btnCustom} ${styles.btnDelete}`}
                            onClick={() => handleDelete(notification._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`text-muted ${styles.textCenter} ${styles.textMuted}`}
                  >
                    You have no notifications.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotificationsPage;
