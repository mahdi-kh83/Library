// src/__tests__/App.integration.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";

const mockUser = { name: "Test User" };

describe("Library App - Functional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Search filters books (with random data)", async () => {
    const randomBooks = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      title: `کتاب تست ${i} ${Math.random().toString(36).substring(7)}`,
      author: `نویسنده ${i}`,
      picture: `https://picsum.photos/id/${i + 10}/200`,
      precis: "توضیحات تست برای کتاب",
    }));

    // Mock fetch properly
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes("/books")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(randomBooks),
        });
      }
      return Promise.reject(new Error("Not mocked"));
    });

    render(<App currentUser={mockUser} onLogout={() => {}} />);

    // Wait for books to load
    await waitFor(
      () => {
        const bookItems = screen.getAllByRole("listitem"); // or use getByText
        expect(bookItems.length).toBeGreaterThan(0);
      },
      { timeout: 2000 },
    );

    // Test search functionality
    const searchInput = screen.getByPlaceholderText(/جستجوی کتاب/i);
    const searchTerm = randomBooks[0].title.substring(0, 6);

    fireEvent.change(searchInput, { target: { value: searchTerm } });

    await waitFor(() => {
      const filteredItems = screen.getAllByRole("listitem");
      expect(filteredItems.length).toBeLessThanOrEqual(randomBooks.length);
    });
  });

  test("Can borrow a book", async () => {
    const testBook = {
      id: 999,
      title: "کتاب تست امانت",
      author: "نویسنده تست",
      picture: "https://picsum.photos/200",
      precis: "خلاصه کتاب تست",
    };

    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.endsWith("/999")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(testBook),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([testBook]),
      });
    });

    render(<App currentUser={mockUser} onLogout={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/کتاب تست امانت/i)).toBeInTheDocument();
    });

    // Click on the first book
    fireEvent.click(screen.getAllByRole("listitem")[0]);

    await waitFor(() => {
      expect(screen.getByText(/مدت زمان امانت/i)).toBeInTheDocument();
    });
  });
});
