import { useState } from "react";

export default function RegisterPage({ onLogin, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("لطفاً همه فیلدها را تکمیل کنید");
      return;
    }

    try {
      const usersRes = await fetch("http://localhost:9000/users");

      const users = await usersRes.json();

      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        setError("این ایمیل قبلاً ثبت شده است");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        role: "user",
      };

      const res = await fetch("http://localhost:9000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        throw new Error();
      }

      setSuccess("ثبت نام با موفقیت انجام شد");

      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setError("خطا در ارتباط با سرور");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <span>📚</span>
          <h1>ثبت نام</h1>
          <p>ایجاد حساب کاربری جدید</p>
        </div>

        {error && <p className="login-error">{error}</p>}

        {success && <p className="success-message">{success}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>نام</label>

            <input
              type="text"
              value={name}
              placeholder="نام"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>ایمیل</label>

            <input
              type="email"
              value={email}
              placeholder="ایمیل"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>رمز عبور</label>

            <input
              type="password"
              value={password}
              placeholder="رمز عبور"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            ثبت نام
          </button>
        </form>

        <div className="login-footer">
          <p>حساب دارید؟</p>

          <button className="register-btn" onClick={onBackToLogin}>
            ورود
          </button>
        </div>
      </div>
    </div>
  );
}
