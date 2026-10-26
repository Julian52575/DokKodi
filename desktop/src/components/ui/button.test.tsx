import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

import { Button } from "./button";

it("renders its children as a button", () => {
  render(<Button>Save</Button>);

  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});

it("applies the variant and size classes", () => {
  render(
    <Button variant="destructive" size="lg">
      Delete
    </Button>,
  );

  const button = screen.getByRole("button", { name: "Delete" });
  expect(button).toHaveAttribute("data-variant", "destructive");
  expect(button).toHaveAttribute("data-size", "lg");
});

it("calls onClick, and not when disabled", async () => {
  const onClick = vi.fn();
  const user = userEvent.setup();
  const { rerender } = render(<Button onClick={onClick}>Go</Button>);

  await user.click(screen.getByRole("button", { name: "Go" }));
  expect(onClick).toHaveBeenCalledTimes(1);

  rerender(
    <Button onClick={onClick} disabled>
      Go
    </Button>,
  );
  await user.click(screen.getByRole("button", { name: "Go" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

it("renders the child element instead of a button with asChild", () => {
  render(
    <Button asChild>
      <a href="https://tauri.app">Docs</a>
    </Button>,
  );

  expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "https://tauri.app");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
