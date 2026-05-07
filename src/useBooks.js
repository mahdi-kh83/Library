// useBooks.js
import { useEffect, useState } from "react";

export function useBooks(query) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // اگر کوئری خالی است، همه کتاب‌ها را نشان بده
    // اگر کوئری دارد، فیلتر را اعمال کن

    // 1. دریافت اولیه داده‌ها (فقط یک بار)
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:9000/books");
        if (!res.ok) throw new Error("خطا در ارتباط با سرور");
        const data = await res.json();

        // 2. اعمال فیلتر
        if (query && query.length >= 3) {
          const lowerQuery = query.toLowerCase();
          const filtered = data.filter(
            (book) =>
              book.title.toLowerCase().includes(lowerQuery) ||
              book.author.toLowerCase().includes(lowerQuery),
          );
          setBooks(filtered);
        } else {
          setBooks(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [query]); // هر زمان query تغییر کرد، دوباره اجرا شود

  return { books, isLoading, error };
}
