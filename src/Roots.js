import { useEffect, useState } from "react";

import LoginPage from "./Login";
import AdminDashboard from "./AdminDashboard";
import App from "./App";

export default function Root() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("libraryUser");

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  function handleLogin(user) {
    setCurrentUser(user);
  }

  function handleLogout() {
    localStorage.removeItem("libraryUser");

    setCurrentUser(null);
  }

  // هنوز لاگین نکرده
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // مدیر
  if (currentUser.role === "admin") {
    return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  // کاربر عادی
  return <App currentUser={currentUser} onLogout={handleLogout} />;
}
