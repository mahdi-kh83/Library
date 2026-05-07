import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const data = [
  {
    id: 1,
    title: "پردازش تصویر با استفاده از مدل‌های کارچ",
    author: "مریم امیرمزلقانی",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/71d1b84d-9539-440a-9104-fef476484d45/7dbfbe39-b0f1-47e0-ad78-2a309002cc60.jpg",
  },
  {
    id: 2,
    title: "تحلیل شبکه‌های پیچیده",
    author: "نصرالله مقدم",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/5edfebc0-d90b-4508-9d3a-128928a3d674/0e4f91f5-dd3c-4b08-a05d-8455654d90a1.jpg",
  },
  {
    id: 3,
    title: "ارتباط‌ مدارهای مجتمع با نگاه به فناوری‌های نوظهور",
    author: "محمدحسین معیری",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/744847b2-8447-41c6-8af7-496163ad5146/b6f0bbd5-e76f-44c7-97d6-efd553afbc86.jpg",
  },
  {
    id: 4,
    title: "مبانی کامپیوتر و الگوریتم‌ها",
    author: "عین الله جعفرنژاد قمی",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/839f53c4-524a-44ca-ba9c-1bea73ea254b/24c956b0-695a-4a8a-b66f-77ee737703e1.jpg",
  },
  {
    id: 5,
    title: "برنامه‌نویسی براساس پروژه‌های واقعی",
    author: "اریک متس نشر",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/814ba014-3dab-4395-a36a-d16922b0bd41/6948fac6-438b-4b03-a2ca-0e3c201417b2.jpg",
  },
  {
    id: 6,
    title: "طراح و توسعه دهنده سیستم های مدیریت محتوا با ورد پرس",
    author: "حمیدرضا قنبری",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/f7f05d69-ce40-41f3-bf70-e7d0d655c201/54c52320-f15b-4e5b-9fe1-d89fab96708c.jpg",
  },
  {
    id: 7,
    title: "زبان برنامه نویسی پایتون",
    author: "مینو سلطانشاهی",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/1a3d49bd-09ad-4258-9295-127179aeba36/e9eabfcd-d11c-4950-9af4-4a1c031b4636.jpg",
  },
  {
    id: 8,
    title: "مطلب اهرمی برای مهندسان مکانیک",
    author: "منصور ترابی نشر",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/ff351504-165b-4003-851d-9ec84fe14102/853bc1d6-1e67-4d00-8c18-81462432aad5.jpg",
  },
  {
    id: 9,
    title: "مهندسی سیستم عامل ویندوز و برنامه نویسی سیستمی",
    author: "محمد گلشاهی نشر",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/45520409-6043-4296-a364-be3c5e56d2d8/726367d7-2d5d-47c5-93d4-0b9678a73a6c.jpg",
  },
  {
    id: 10,
    title: "معماری سیستم های کامپیوتری",
    author: "موریس مانو",
    picture:
      "https://cdn.fidibo.com/phoenixpub/content/169729e2-2e94-4396-924b-b0e7e5bee5b3/022e83bd-8d24-461c-be9c-246a9717d9d2.jpg",
  },
];

const style = {
  fontSize: "12px",
  color: "gray",
};

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  // const [watched, setWatched] = useState([]);
  const { movies, isLoding, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });

  function handelSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handelCloseMovie() {
    setSelectedId(null);
  }

  function handelAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]))
  }

  function handelDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdb_id !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoding ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoding && <Loader />}
          {!isLoding && !error && (
            <MovieList movies={data} onSelectMovie={handelSelectMovie} />
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

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (document.activeElement === inputEl.current) return;
  //       if (e.code === "Enter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }

  //     document.addEventListener("keydown", callback);
  //     return () => document.addEventListener("keydown", callback);
  //   },
  //   [setQuery],
  // );

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
      تعداد : <strong>{movies.length}</strong>
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

/*
function WatchedBox() {
  const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummery watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((data) => (
        // for key we have to pass movie.imdbID
        <Movie movie={data} key={data.id} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.id)}>
      {/* for the course api we should write the first letter in uppercase like Poster */}
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
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating],
  );

  const isWatched = watched.map((movie) => movie.imdb_id).includes(selectedId);
  const {
    title: title,
    year: year,
    poster: poster,
    runtime: runtime,
    plot: plot,
    released: released,
    actors: actors,
    director: director,
    genres: genres,
    imdb_rating: imdbRating,
  } = movie;

  function handelAdd() {
    const newWatchedMovie = {
      imdb_id: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://moviesapi.ir/api/v1/movies/${selectedId}`,
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId],
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Movie";
      };
    },
    [title],
  );

  useKey("Escape", onCloseMovie);

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         onCloseMovie();
  //       }
  //     }

  //     document.addEventListener("keydown", callback);
  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [onCloseMovie],
  // );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genres}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB
              </p>
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
                      + add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
          {/* {selectedId} */}
        </>
      )}
    </div>
  );
}

function WatchedSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>کتاب های امانت گرفته شده</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} تعداد</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime}</span>
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
          key={movie.imdb_id}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdb_id)}
        >
          X
        </button>
      </div>
    </li>
  );
}
