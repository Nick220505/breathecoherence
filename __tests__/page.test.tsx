import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import TestPage from "./TestPage";

test("Page", () => {
  render(<TestPage />);
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
