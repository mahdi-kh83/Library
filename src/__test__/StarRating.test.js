// src/__tests__/StarRating.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import StarRating from "../StarRating";
import "@testing-library/jest-dom";

describe("StarRating Component", () => {
  test("renders correct number of stars", () => {
    render(<StarRating maxRating={10} />);
    const stars = screen.getAllByRole("button");
    expect(stars).toHaveLength(10);
  });

  test("calls onSetRating when star is clicked", () => {
    const onSetRating = jest.fn();
    render(<StarRating maxRating={5} onSetRating={onSetRating} />);

    const stars = screen.getAllByRole("button");
    fireEvent.click(stars[3]); // click 4th star

    expect(onSetRating).toHaveBeenCalledWith(4);
  });

  test("shows temporary rating on hover", () => {
    render(<StarRating maxRating={5} />);
    const stars = screen.getAllByRole("button");

    fireEvent.mouseEnter(stars[2]);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
