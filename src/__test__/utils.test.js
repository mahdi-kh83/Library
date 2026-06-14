// src/__tests__/utils.test.js
import { average, formatPersianDate } from "../App";

describe("Utility Functions", () => {
  test("average returns correct value", () => {
    expect(average([2, 4, 6])).toBe(4);
    expect(average([])).toBe(0);
    expect(average([10, 20, 30, 40])).toBe(25);
    expect(average([5])).toBe(5);
  });

  test("formatPersianDate works", () => {
    const date = "2025-06-15T00:00:00Z";
    const result = formatPersianDate(date);
    expect(result).toMatch(/۱۴۰۴/); // Should contain Persian year
  });
});
