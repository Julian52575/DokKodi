import { expect, it } from "vitest";

import { cn } from "./utils";

it("joins class names and drops falsy values", () => {
  expect(cn("a", false, undefined, "b")).toBe("a b");
});
