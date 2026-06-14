import { renderHook, act } from "@testing-library/react";
import { useLocalStorageState } from "../useLocalStorageState";

describe("useLocalStorageState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("uses initial value and saves to localStorage", () => {
    const { result } = renderHook(() => useLocalStorageState([], "test-key"));

    act(() => {
      result.current[1]([1, 2, 3]);
    });

    expect(result.current[0]).toEqual([1, 2, 3]);
    expect(JSON.parse(localStorage.getItem("test-key"))).toEqual([1, 2, 3]);
  });
});
