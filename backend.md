# معماری پروژه کتابخانه بدون Backend

برای نسخه اولیه پروژه، اصلاً لازم نیست بک‌اند واقعی داشته باشی.  
اتفاقاً بهترین کار این است که اول کل Flow فرانت‌اند را کامل کنی، بعد بک‌اند اضافه کنی.

پروژه تو الان خیلی مناسب MVP فرانت‌اندی است.

---

# معماری پیشنهادی بدون بک‌اند

تو می‌توانی فعلاً همه چیز را با:

```txt
localStorage
Context API
Fake Data
Protected Routes
```

پیاده‌سازی کنی.

---

# ساختار منطقی پروژه

پیشنهاد می‌کنم پروژه را این شکلی بچینی:

```txt
src/
│
├── pages/
│   ├── LoginPage.jsx
│   ├── UserDashboard.jsx
│   ├── AdminDashboard.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── BookCard.jsx
│   ├── BookList.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── data/
│   └── users.js
│
├── hooks/
│   ├── useLocalStorageState.js
│   └── useBooks.js
│
├── App.jsx
└── main.jsx
```

---

# ایده اصلی سیستم Login بدون Backend

تو فعلاً کاربران فیک می‌سازی:

```js
const users = [
  {
    id: 1,
    email: "admin@gmail.com",
    password: "1234",
    role: "admin",
    name: "ادمین",
  },

  {
    id: 2,
    email: "user@gmail.com",
    password: "1234",
    role: "user",
    name: "کاربر",
  },
];
```

---

# روند لاگین

کاربر:

1. ایمیل وارد می‌کند
2. پسورد وارد می‌کند
3. داخل آرایه users چک می‌کنی
4. اگر درست بود:
   - user را داخل localStorage ذخیره می‌کنی
5. بر اساس role:
   - admin → AdminDashboard
   - user → UserDashboard

---

# چرا localStorage؟

چون وقتی صفحه refresh شد:

```js
localStorage.getItem("user")
```

دوباره لاگین باقی می‌ماند.

---

# معماری حرفه‌ای‌تر

## AuthContext

تو باید authentication را مرکزی کنی.

مثلاً:

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

---

# داخل AuthContext

این‌ها را مدیریت می‌کنی:

```js
user
login()
logout()
isAuthenticated
role
```

---

# نمونه کامل منطق

## users.js

```js
export const users = [
  {
    id: 1,
    email: "admin@gmail.com",
    password: "1234",
    role: "admin",
    name: "ادمین",
  },

  {
    id: 2,
    email: "user@gmail.com",
    password: "1234",
    role: "user",
    name: "علی",
  },
];
```

---

# AuthContext.jsx

```jsx
import {
  createContext,
  useContext,
  useState,
} from "react";

import { users } from "../data/users";

const AuthContext = createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user"),
    ) || null,
  );

  function login(email, password) {
    const foundUser = users.find(
      (user) =>
        user.email === email &&
        user.password === password,
    );

    if (!foundUser) return false;

    setUser(foundUser);

    localStorage.setItem(
      "user",
      JSON.stringify(foundUser),
    );

    return true;
  }

  function logout() {
    setUser(null);

    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

# App.jsx

اینجا routing ذهنی پروژه شکل می‌گیرد:

```jsx
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  // اگر لاگین نکرده
  if (!user) return <LoginPage />;

  // اگر ادمین بود
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  // اگر کاربر عادی بود
  return <UserDashboard />;
}
```

---

# داخل LoginPage

```js
const success = login(email, password);

if (!success) {
  alert("اطلاعات اشتباه است");
}
```

---

# نتیجه نهایی

## کاربر عادی:

```txt
Login
   ↓
User Dashboard
   ↓
Borrow Books
```

---

## مدیر:

```txt
Login
   ↓
Admin Dashboard
   ↓
Manage Books
Manage Users
```

---

# مدیریت کتاب‌ها بدون Backend

فعلاً:

```txt
books
borrowedBooks
users
```

را داخل:

```txt
localStorage
```

نگه دار.

---

# چرا این روش عالیه؟

چون الان تمرکزت روی:

- UI
- State Management
- Flow
- UX
- Architecture

است.

نه دردسر backend.

---

# مرحله بعد حرفه‌ای

وقتی پروژه کامل شد:

## فقط این‌ها را عوض می‌کنی:

### الان:

```js
localStorage
```

### بعداً:

```js
fetch("/api/login")
fetch("/api/books")
```

یعنی کل UI حفظ می‌شود.

---

# پیشنهاد مهم

الان بهترین استک برای پروژه تو:

```txt
React
Context API
localStorage
json-server
React Router
```

است.

---

# پیشنهاد حرفه‌ای‌تر

بعداً اضافه کن:

- React Router
- Protected Routes
- Toast Notifications
- JWT Authentication
- Firebase/Auth
- Node.js Backend
- MongoDB

---

# مسیر توسعه درست پروژه تو

## فاز 1

- UI کامل
- Fake Login
- LocalStorage
- مدیریت کتاب

## فاز 2

- React Router
- Context API
- Protected Pages

## فاز 3

- json-server
- API واقعی

## فاز 4

- Backend واقعی
- Authentication واقعی

---

# نتیجه

تو الان کاملاً می‌توانی:

- لاگین
- نقش کاربر
- پنل ادمین
- پنل کاربر
- مدیریت کتاب
- امانت گرفتن
- ذخیره اطلاعات

را بدون بک‌اند واقعی بسازی و پروژه کاملاً قابل ارائه خواهد بود.