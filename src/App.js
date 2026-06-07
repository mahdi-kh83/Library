import { useState, useRef, useEffect } from "react";
import StarRating from "./StarRating";
import { useBooks } from "./useBooks";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

/* =========================
   Styles
========================= */

const style = {
  fontSize: "12px",
  color: "gray",
};

/* =========================
   Helpers
========================= */

const average = (arr) =>
  arr.length === 0 ? 0 : arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

// تبدیل تاریخ میلادی به شمسی فارسی
function formatPersianDate(dateString) {
  return new Date(dateString).toLocaleDateString("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* =========================
   App
========================= */

export default function App({ currentUser, onLogout }) {
  const [selectedBookId, setSelectedBookId] = useState(null);

  const [query, setQuery] = useState("");

  // دریافت کتاب‌ها
  const { books, isLoading, error } = useBooks(query);

  // کتاب‌های امانت گرفته شده
  const [borrowedBooks, setBorrowedBooks] = useLocalStorageState(
    [],
    "borrowedBooks",
  );

  const [page, setPage] = useState("login");

  /* =========================
     Handlers
  ========================= */

  function handleSelectBook(id) {
    setSelectedBookId((currentId) => (currentId === id ? null : id));
  }

  function handleCloseBook() {
    setSelectedBookId(null);
  }

  function handleAddBorrowed(book) {
    setBorrowedBooks((prev) => [...prev, book]);
  }

  function handleDeleteBorrowed(id) {
    setBorrowedBooks((prev) => prev.filter((book) => book.id !== id));
  }

  /* =========================
     Render
  ========================= */

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />

        <div className="nav-actions">
          {/* <NumResults books={books} /> */}
          <span className="current-user"> {currentUser.name} 👤</span>

          <button className="logout-btn" onClick={onLogout}>
            خروج
          </button>
        </div>
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}

          {!isLoading && !error && (
            <BookList books={books} onSelectBook={handleSelectBook} />
          )}

          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedBookId ? (
            <BookDetails
              selectedBookId={selectedBookId}
              onCloseBook={handleCloseBook}
              onAddBorrowed={handleAddBorrowed}
              borrowedBooks={borrowedBooks}
            />
          ) : (
            <>
              <BorrowedSummary borrowedBooks={borrowedBooks} />

              <BorrowedBooksList
                borrowedBooks={borrowedBooks}
                onDeleteBorrowed={handleDeleteBorrowed}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

/* =========================
   Loader
========================= */

function Loader() {
  return <p className="loader">Loading...</p>;
}

/* =========================
   Error
========================= */

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}

/* =========================
   Navbar
========================= */

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">📚</span>

      <h1>کتابخانه</h1>
    </div>
  );
}

/* =========================
   Search
========================= */

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus();

    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="جستجوی کتاب..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

/* =========================
   Results
========================= */

function NumResults({ books }) {
  return (
    <p className="num-results">
      <strong>{books.length}</strong>
      <span> کتاب پیدا شد</span>
    </p>
  );
}

/* =========================
   Main
========================= */

function Main({ children }) {
  return <main className="main">{children}</main>;
}

/* =========================
   Box
========================= */

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

/* =========================
   Book List
========================= */

function BookList({ books, onSelectBook }) {
  return (
    <ul className="list list-books">
      {books?.map((book) => (
        <Book key={book.id} book={book} onSelectBook={onSelectBook} />
      ))}
    </ul>
  );
}

/* =========================
   Book Item
========================= */

function Book({ book, onSelectBook }) {
  return (
    <li onClick={() => onSelectBook(book.id)}>
      <img src={book.picture} alt={`${book.title} cover`} />

      <h3>{book.title}</h3>

      <div>
        <p>
          <span>✍️</span>

          <span style={style}>{book.author}</span>
        </p>
      </div>
    </li>
  );
}

/* =========================
   Book Details
========================= */

function BookDetails({
  selectedBookId,
  onCloseBook,
  onAddBorrowed,
  borrowedBooks,
}) {
  const [book, setBook] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  // تعداد روز امانت
  const [userRating, setUserRating] = useState(0);

  const isBorrowed = borrowedBooks
    .map((book) => book.id)
    .includes(selectedBookId);

  const { title, author, picture, precis } = book;

  /* =========================
     Add Book
  ========================= */

  function handleAdd() {
    const borrowedDate = new Date();

    // محاسبه تاریخ بازگشت
    const returnDate = new Date(
      borrowedDate.getTime() + Number(userRating) * 24 * 60 * 60 * 1000,
    );

    const newBorrowedBook = {
      id: selectedBookId,

      title,
      author,
      picture,
      precis,

      // تعداد روز امانت
      userRating: Number(userRating),

      // تاریخ امانت
      borrowedAt: borrowedDate.toISOString(),

      // تاریخ بازگشت
      returnDate: returnDate.toISOString(),
    };

    onAddBorrowed(newBorrowedBook);

    onCloseBook();
  }

  /* =========================
     Fetch Book
  ========================= */

  useEffect(
    function () {
      async function getBookDetails() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `http://localhost:9000/books/${selectedBookId}`,
          );

          if (!res.ok) throw new Error("خطا در دریافت اطلاعات کتاب");

          const data = await res.json();

          setBook(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }

      getBookDetails();
    },
    [selectedBookId],
  );

  /* =========================
     Page Title
  ========================= */

  useEffect(
    function () {
      if (!title) return;

      document.title = `کتاب | ${title}`;

      return function () {
        document.title = "کتابخانه";
      };
    },
    [title],
  );

  /* =========================
     Escape Key
  ========================= */

  useKey("Escape", onCloseBook);

  /* =========================
     Render
  ========================= */

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseBook}>
              &larr;
            </button>

            <img src={picture} alt={`Cover of ${title}`} />

            <div className="details-overview">
              <h2>{title}</h2>

              <p>{author}</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isBorrowed ? (
                <>
                  <p>مدت زمان امانت (برحسب روز)</p>

                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      امانت گرفتن +
                    </button>
                  )}
                </>
              ) : (
                <p>این کتاب قبلاً امانت گرفته شده است</p>
              )}
            </div>

            <div>
              <h2>خلاصه کتاب:</h2>

              <p>
                <em>{precis}</em>
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* =========================
   Borrowed Summary
========================= */

function BorrowedSummary({ borrowedBooks }) {
  const avgBorrowDays =
    borrowedBooks.length > 0
      ? average(borrowedBooks.map((book) => Number(book.userRating)))
      : 0;

  return (
    <div className="summary">
      <h2>کتاب‌های امانت گرفته شده</h2>

      <div>
        <p>
          <span>#️⃣</span>

          <span>{borrowedBooks.length} کتاب</span>
        </p>

        <p>
          {/* <span>⭐</span>

          <span>{avgBorrowDays.toFixed(1)} روز</span> */}
        </p>
      </div>
    </div>
  );
}

/* =========================
   Borrowed List
========================= */

function BorrowedBooksList({ borrowedBooks, onDeleteBorrowed }) {
  return (
    <ul className="list">
      {borrowedBooks.map((book) => (
        <BorrowedBook
          key={book.id}
          book={book}
          onDeleteBorrowed={onDeleteBorrowed}
        />
      ))}
    </ul>
  );
}

/* =========================
   Borrowed Item
========================= */

function BorrowedBook({ book, onDeleteBorrowed }) {
  return (
    <li>
      <img src={book.picture} alt={`${book.title} cover`} />

      <h3>{book.title}</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {/* تعداد روز امانت */}

        <p>
          <span>⭐</span>

          <span>{book.userRating} روز</span>
        </p>

        {/* تاریخ بازگشت */}

        <p>
          <span>📅</span>

          <span>
            {book.returnDate ? formatPersianDate(book.returnDate) : "نامشخص"}
          </span>
        </p>

        {/* حذف */}

        <button
          className="btn-delete"
          onClick={() => onDeleteBorrowed(book.id)}
        >
          X
        </button>
      </div>
    </li>
  );
}
