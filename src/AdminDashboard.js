import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:9000/books";
const USERS_API = "http://localhost:9000/users";

export default function AdminDashboard({ currentUser, onLogout }) {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [newBook, setNewBook] = useState({
    id: "",
    title: "",
    author: "",
    picture: "",
    precis: "",
  });

  const [users, setUsers] = useState([]);

  const [activeSection, setActiveSection] = useState("books");

  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const [editBook, setEditBook] = useState({
    id: "",
    title: "",
    author: "",
    picture: "",
    precis: "",
    status: "available",
  });

  /* =========================
      Fetch Books
  ========================= */

  async function fetchBooks() {
    try {
      setLoading(true);

      const res = await fetch(API_URL);

      const data = await res.json();

      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
      Add Book
  ========================= */
  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  // user functions
  async function fetchUsers() {
    try {
      const res = await fetch(USERS_API);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddUser(e) {
    e.preventDefault();

    if (!newUser.id || !newUser.name || !newUser.email || !newUser.password) {
      alert("لطفا همه فیلدها را کامل کنید");
      return;
    }

    const isDuplicate = users.some(
      (user) => String(user.id) === String(newUser.id),
    );

    if (isDuplicate) {
      alert("این شناسه قبلا ثبت شده است");
      return;
    }

    try {
      const res = await fetch(USERS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      setUsers((users) => [...users, data]);

      setNewUser({
        id: "",
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      setShowAddUserForm(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteUser(id) {
    const confirmDelete = window.confirm("آیا از حذف کاربر مطمئن هستید؟");

    if (!confirmDelete) return;

    try {
      await fetch(`${USERS_API}/${id}`, {
        method: "DELETE",
      });

      setUsers((users) => users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  const totalUsers = users.length;

  const totalAdmins = users.filter((user) => user.role === "admin").length;

  async function handleAddBook(e) {
    e.preventDefault();

    if (!newBook.id || !newBook.title || !newBook.author || !newBook.picture) {
      alert("لطفا همه فیلدها را کامل کنید");
      return;
    }

    // چک کردن تکراری نبودن آیدی

    const isDuplicate = books.some(
      (book) => String(book.id) === String(newBook.id),
    );

    if (isDuplicate) {
      alert("این آیدی قبلا ثبت شده است");
      return;
    }

    const bookToAdd = {
      id: String(newBook.id),

      title: newBook.title,

      author: newBook.author,

      picture: newBook.picture,

      precis: newBook.precis,

      status: "available",
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(bookToAdd),
      });

      if (!res.ok) {
        throw new Error("خطا در افزودن کتاب");
      }

      const data = await res.json();

      setBooks((books) => [...books, data]);

      setNewBook({
        id: "",
        title: "",
        author: "",
        picture: "",
        precis: "",
      });

      setShowAddForm(false);
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================
      Delete Book
  ========================= */

  async function handleDeleteBook(id) {
    const confirmDelete = window.confirm("آیا از حذف این کتاب مطمئن هستید؟");

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setBooks((books) => books.filter((book) => book.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================
      Filter Books
  ========================= */

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()),
    );
  }, [books, search]);

  /* =========================
      Stats
  ========================= */

  const totalBooks = books.length;

  const availableBooks = books.filter(
    (book) => book.status === "available",
  ).length;

  const borrowedBooks = books.filter(
    (book) => book.status === "borrowed",
  ).length;

  function handleEditClick(book) {
    setEditBook({
      id: book.id,
      title: book.title,
      author: book.author,
      picture: book.picture,
      precis: book.precis,
      status: book.status,
    });

    setShowEditModal(true);
  }

  async function handleUpdateBook(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/${editBook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editBook),
      });

      if (!res.ok) {
        throw new Error("خطا در ویرایش کتاب");
      }

      const updatedBook = await res.json();

      setBooks((books) =>
        books.map((book) => (book.id === updatedBook.id ? updatedBook : book)),
      );

      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}

      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <span>📚</span>
          <h2>پنل مدیریت</h2>
        </div>

        <nav className="dashboard-menu">
          <button
            className={activeSection === "books" ? "active" : ""}
            onClick={() => setActiveSection("books")}
          >
            📖 مدیریت کتاب‌ها
          </button>

          <button
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            👤 مدیریت کاربران
          </button>
        </nav>
      </aside>

      {/* Main */}

      <main className="dashboard-main">
        {/* ==========================
            BOOKS SECTION
      ========================== */}

        {activeSection === "books" && (
          <>
            <header className="dashboard-header">
              <button
                className="add-book-btn"
                onClick={() => setShowAddForm((show) => !show)}
              >
                افزودن کتاب
              </button>
              <div>
                <h1>مدیریت کتابخانه</h1>

                <p>مدیریت کامل کتاب‌های کتابخانه</p>
              </div>

              <button className="logout-btn" onClick={onLogout}>
                خروج
              </button>
            </header>

            <section className="dashboard-stats">
              <div className="stat-card">
                <span>📚</span>

                <div>
                  <h3>{totalBooks}</h3>

                  <p>کل کتاب‌ها</p>
                </div>
              </div>

              <div className="stat-card">
                <span>✅</span>

                <div>
                  <h3>{availableBooks}</h3>

                  <p>کتاب موجود</p>
                </div>
              </div>

              <div className="stat-card">
                <span>📦</span>

                <div>
                  <h3>{borrowedBooks}</h3>

                  <p>امانت داده شده</p>
                </div>
              </div>
            </section>

            {showAddForm && (
              <form className="add-book-form" onSubmit={handleAddBook}>
                <input
                  type="text"
                  placeholder="شناسه کتاب"
                  value={newBook.id}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      id: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="نام کتاب"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      title: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="نام نویسنده"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      author: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="لینک تصویر"
                  value={newBook.picture}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      picture: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="خلاصه کتاب"
                  value={newBook.precis}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      precis: e.target.value,
                    })
                  }
                />

                <button type="submit">ذخیره کتاب</button>
              </form>
            )}

            <section className="dashboard-tools">
              <input
                type="text"
                placeholder="جستجوی کتاب..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </section>

            {loading && <p className="loading">Loading...</p>}

            {!loading && (
              <section className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>تصویر</th>
                      <th>شناسه</th>
                      <th>نام کتاب</th>
                      <th>نویسنده</th>
                      <th>وضعیت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id}>
                        <td>
                          <img
                            className="table-book-image"
                            src={book.picture}
                            alt={book.title}
                          />
                        </td>

                        <td>{book.id}</td>

                        <td>{book.title}</td>

                        <td>{book.author}</td>

                        <td>
                          <span
                            className={`status ${
                              book.status === "available"
                                ? "available"
                                : "borrowed"
                            }`}
                          >
                            {book.status === "available"
                              ? "موجود"
                              : "امانت داده شده"}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions">
                            <button onClick={() => handleEditClick(book)}>
                              ✏️
                            </button>

                            <button onClick={() => handleDeleteBook(book.id)}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}

        {/* ==========================
            USERS SECTION
      ========================== */}

        {activeSection === "users" && (
          <>
            <header className="dashboard-header">
              <button
                className="add-book-btn"
                onClick={() => setShowAddUserForm((show) => !show)}
              >
                افزودن کاربر
              </button>
              <div>
                <h1>مدیریت کاربران</h1>

                <p>مدیریت کاربران سیستم</p>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                خروج
              </button>
            </header>

            <section className="dashboard-stats">
              <div className="stat-card">
                <span>👥</span>

                <div>
                  <h3>{totalUsers}</h3>

                  <p>کل کاربران</p>
                </div>
              </div>

              <div className="stat-card">
                <span>🛡️</span>

                <div>
                  <h3>{totalAdmins}</h3>

                  <p>مدیران</p>
                </div>
              </div>
            </section>

            {showAddUserForm && (
              <form className="add-book-form" onSubmit={handleAddUser}>
                <input
                  type="text"
                  placeholder="شناسه"
                  value={newUser.id}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      id: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="نام"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="ایمیل"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  type="password"
                  placeholder="رمز عبور"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      password: e.target.value,
                    })
                  }
                />

                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="user">کاربر</option>

                  <option value="admin">مدیر</option>
                </select>

                <button type="submit">ذخیره کاربر</button>
              </form>
            )}

            <section className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>شناسه</th>
                    <th>نام</th>
                    <th>ایمیل</th>
                    <th>نقش</th>
                    <th>عملیات</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>

                      <td>{user.name}</td>

                      <td>{user.email}</td>

                      <td>{user.role === "admin" ? "مدیر" : "کاربر"}</td>

                      <td>
                        <div className="table-actions">
                          <button onClick={() => handleDeleteUser(user.id)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
        {showEditModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>ویرایش کتاب</h2>

              <form onSubmit={handleUpdateBook}>
                <div className="modal-form-group">
                  <label>نام کتاب</label>

                  <input
                    type="text"
                    value={editBook.title}
                    onChange={(e) =>
                      setEditBook({
                        ...editBook,
                        title: e.target.value,
                      })
                    }
                    placeholder="نام کتاب"
                  />
                </div>

                <div className="modal-form-group">
                  <label>نویسنده</label>

                  <input
                    type="text"
                    value={editBook.author}
                    onChange={(e) =>
                      setEditBook({
                        ...editBook,
                        author: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>لینک تصویر</label>

                  <input
                    type="text"
                    value={editBook.picture}
                    onChange={(e) =>
                      setEditBook({
                        ...editBook,
                        picture: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>خلاصه کتاب</label>

                  <textarea
                    className="modal-form-textArea"
                    value={editBook.precis}
                    onChange={(e) =>
                      setEditBook({
                        ...editBook,
                        precis: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>وضعیت کتاب</label>

                  <select
                    value={editBook.status}
                    onChange={(e) =>
                      setEditBook({
                        ...editBook,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="available">موجود</option>
                    <option value="borrowed">امانت داده شده</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="submit">ذخیره</button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowEditModal(false)}
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
