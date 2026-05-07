import { useState, useRef, useEffect } from "react";
import StarRating from "./StarRating";
import { useBooks } from "./useBooks"; // هوک اصلاح شده
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

// آرایه data حذف شد چون همه چیز از API می‌آید

const style = {
  fontSize: "12px",
  color: "gray",
};

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");

  // دریافت کتاب‌ها از هوک
  const { books, isLoading, error } = useBooks(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handelSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handelCloseMovie() {
    setSelectedId(null);
  }

  function handelAddWatched(movie) {
    // افزودن کتاب به لیست تماشای شده
    setWatched((watched) => [...watched, movie]);
  }

  function handelDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.id !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        {/* نمایش تعداد کتاب‌های فیلتر شده */}
        <Numresults movies={books} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            // مهم: اینجا باید books را پاس بدهیم
            <MovieList movies={books} onSelectMovie={handelSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handelCloseMovie}
              onAddWatched={handelAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handelDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// --- کامپوننت‌های کمکی ---

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}

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
      <span role="img">📕</span>
      <h1>کتابخانه</h1>
    </div>
  );
}

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
      placeholder="جستجو کتاب ..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Numresults({ movies }) {
  return (
    <p className="num-results">
      <strong>{movies.length}</strong>
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

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

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.id} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.id)}>
      <img src={movie.picture} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span> 🖊</span>
          <span style={style}>{movie.author}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  // پیدا کردن دیتای کامل کتاب از لیست watched یا یک لیست سراسری
  // چون در این ساختار ساده، دیتای کامل جزئیات (مثل پلات) در JSON Server نیست،
  // ما فرض می‌کنیم که selectedId یکی از کتاب‌های در لیست books است.
  // برای سادگی، ما دیتا را از لیست watched پیدا می‌کنیم اگر آنجا باشد، یا یک دیتای پیش‌فرض برمی‌گردانیم.

  const movie = watched.find((m) => m.id === selectedId) || {
    id: selectedId,
    title: "عنوان کتاب",
    author: "نویسنده",
    picture: "",
  };

  const isWatched = watched.map((m) => m.id).includes(selectedId);

  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  function handelAdd() {
    const newWatchedMovie = {
      ...movie,
      userRating: Number(userRating),
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        <img src={movie.picture} alt={`Poster of ${movie.title}`} />
        <div className="details-overview">
          <h2>{movie.title}</h2>
          <p>{movie.author}</p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handelAdd}>
                  + افزودن به لیست
                </button>
              )}
            </>
          ) : (
            <p>این کتاب در لیست شماست</p>
          )}
        </div>
      </section>
    </div>
  );
}

function WatchedSummery({ watched }) {
  const avgUserRating =
    watched.length > 0 ? average(watched.map((movie) => movie.userRating)) : 0;

  return (
    <div className="summary">
      <h2>کتاب های امانت گرفته شده</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} کتاب</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.id}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.picture} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.id)}
        >
          X
        </button>
      </div>
    </li>
  );
}
