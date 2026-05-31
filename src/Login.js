import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("لطفاً ایمیل و رمز عبور را وارد کنید");
      return;
    }

    try {
      const res = await fetch("http://localhost:9000/users");

      if (!res.ok) {
        throw new Error("خطا در دریافت کاربران");
      }

      const users = await res.json();

      const user = users.find(
        (user) => user.email === email && user.password === password,
      );

      if (!user) {
        setError("ایمیل یا رمز عبور اشتباه است");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("libraryUser", JSON.stringify(user));
      }

      onLogin(user);
    } catch (error) {
      console.error(error);

      setError("خطا در ارتباط با سرور");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Header */}

        <div className="login-header">
          <span>📚</span>

          <h1>کتابخانه من</h1>

          <p>ورود به حساب کاربری</p>
        </div>

        {/* Error */}

        {error && <p className="login-error">{error}</p>}

        {/* Form */}

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}

          <div className="form-group">
            <label>ایمیل</label>

            <input
              type="text"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}

          <div className="form-group">
            <label>رمز عبور</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword((show) => !show)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M2 2L22 22"
                      stroke="#585858"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                      stroke="#585858"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                      stroke="#585858"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                      stroke="#585858"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                      stroke="#585858"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#585858"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Options */}

          <div className="login-options">
            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((remember) => !remember)}
              />
              مرا به خاطر بسپار
            </label>

            <button type="button" className="forgot-password">
              فراموشی رمز؟
            </button>
          </div>

          {/* Submit */}

          <button className="login-btn" type="submit">
            ورود
          </button>
        </form>

        {/* Footer */}

        <div className="login-footer">
          <p>حساب کاربری ندارید؟</p>

          <button type="button" className="register-btn">
            ثبت نام
          </button>
        </div>
      </div>
    </div>
  );
}
