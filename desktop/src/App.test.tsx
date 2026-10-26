import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { invoke } from "@tauri-apps/api/core";

import App from "./App";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

beforeEach(() => {
  vi.mocked(invoke).mockReset();
});

it("renders the title and the greeting form", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: /welcome to tauri/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Enter a name...")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Greet" })).toBeInTheDocument();
});

it("links to the Vite, Tauri and React sites", () => {
  render(<App />);

  const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
  expect(hrefs).toEqual(["https://vite.dev", "https://tauri.app", "https://react.dev"]);
});

it("calls the Rust greet command with the typed name and shows its answer", async () => {
  vi.mocked(invoke).mockResolvedValue("Hello, Ada!");
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByPlaceholderText("Enter a name..."), "Ada");
  await user.click(screen.getByRole("button", { name: "Greet" }));

  expect(invoke).toHaveBeenCalledWith("greet", { name: "Ada" });
  expect(await screen.findByText("Hello, Ada!")).toBeInTheDocument();
});
