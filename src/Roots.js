import { useEffect, useState } from "react";

import LoginPage from "./Login";
import RegisterPage from "./Register";

import AdminDashboard from "./AdminDashboard";
import App from "./App";

export default function Root() {
  const [currentUser, setCurrentUser] = useState(null);

  const [page, setPage] = useState("login");

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

    setPage("login");
  }

  // کاربر هنوز وارد نشده
  if (!currentUser) {
    // صفحه ثبت نام
    if (page === "register") {
      return (
        <RegisterPage
          onLogin={handleLogin}
          onBackToLogin={() => setPage("login")}
        />
      );
    }

    // صفحه ورود
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegisterClick={() => setPage("register")}
      />
    );
  }

  // پنل مدیر
  if (currentUser.role === "admin") {
    return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  // پنل کاربر عادی
  return <App currentUser={currentUser} onLogout={handleLogout} />;
}
