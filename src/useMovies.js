import { useEffect, useState } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoding, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://moviesapi.ir/api/v1/movies?q=${query}`,
            { signal: controller.signal },
          );

          if (!res.ok)
            throw new Error("something went wrong with fetching movies");

          const data = await res.json();

          if (data.Responce === "False") throw new Error("Movie not found");

          setMovies(data.data);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query) {
        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }
      }

      // if we want to close the movie details before searching.
      // handelCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );
  return { movies, isLoding, error };
}
