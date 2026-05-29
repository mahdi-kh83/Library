import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:9000/books";

export default function AdminDashboard() {
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

  /* =========================
      Fetch Books
  ========================= */

  useEffect(() => {
    fetchBooks();
  }, []);

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

  return (
    <div className="dashboard">
      {/* Sidebar */}

      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <span>📚</span>

          <h2>پنل مدیریت</h2>
        </div>

        <nav className="dashboard-menu">
          <button className="active">📖 مدیریت کتاب‌ها</button>
        </nav>
      </aside>

      {/* Main */}

      <main className="dashboard-main">
        {/* Header */}

        <header className="dashboard-header">
          <div>
            <h1>مدیریت کتابخانه</h1>

            <p>مدیریت کامل کتاب‌های کتابخانه</p>
          </div>

          <button
            className="add-book-btn"
            onClick={() => setShowAddForm((show) => !show)}
          >
            افزودن کتاب
          </button>
        </header>

        {/* Stats */}

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

        {/* Add Form */}

        {showAddForm && (
          <form className="add-book-form" onSubmit={handleAddBook}>
            <input
              type="text"
              placeholder="آیدی کتاب"
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

        {/* Search */}

        <section className="dashboard-tools">
          <input
            type="text"
            placeholder="جستجوی کتاب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        {/* Loading */}

        {loading && <p className="loading">Loading...</p>}

        {/* Table */}

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
                          book.status === "available" ? "available" : "borrowed"
                        }`}
                      >
                        {book.status === "available"
                          ? "موجود"
                          : "امانت داده شده"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button>✏️</button>

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
      </main>
    </div>
  );
}
