import React from "react";
import { useLocalStore } from "./helpers";

export const AppContext = React.createContext(null);
export const useApp = () => React.useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useLocalStore("lg_user", null);
  const [appointments, setAppointments] = useLocalStore("lg_appointments", []);
  const [notifications, setNotifications] = useLocalStore(
    "lg_notifications",
    []
  );
  const [adminNotifications, setAdminNotifications] = useLocalStore(
    "lg_admin_notifications",
    []
  );

  const addNotification = (msg) =>
    setNotifications((n) => [
      { id: crypto.randomUUID(), msg, ts: Date.now(), read: false },
      ...n,
    ]);
  const addAdminNotification = (msg) =>
    setAdminNotifications((n) => [
      { id: crypto.randomUUID(), msg, ts: Date.now(), read: false },
      ...n,
    ]);
  const addAppointment = (appt) => {
    // allow attaching a form snapshot to the appointment for detail view
    const withMeta = { ...appt, meta: appt.meta || null };
    setAppointments((a) => [...a, withMeta]);
    addNotification(
      `Appointment booked for ${new Date(appt.datetime).toLocaleString()}`
    );
    // notify admin of new submission
    addAdminNotification(
      `New appointment submitted for ${new Date(
        appt.datetime
      ).toLocaleString()}`
    );
  };

  const updateAppointment = (id, changes) => {
    setAppointments((a) =>
      a.map((x) => (x.id === id ? { ...x, ...changes } : x))
    );
  };

  // add or update feedback for an appointment
  const addFeedback = (id, feedback) => {
    setAppointments((a) =>
      a.map((x) => (x.id === id ? { ...x, feedback } : x))
    );
    addNotification(`Thanks for your feedback`);
    addAdminNotification(`New feedback submitted for appointment ${id}`);
  };

  const value = {
    user,
    setUser,
    appointments,
    setAppointments,
    notifications,
    setNotifications,
    adminNotifications,
    setAdminNotifications,
    addNotification,
    addAppointment,
    updateAppointment,
    addFeedback,
    addAdminNotification,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
