import { it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Mock the Stack auth module so tests don't require real project credentials
vi.mock("../stack", () => ({
  stackClientApp: {
    useUser: () => null,
    useStackApp: () => ({}),
  },
}));

// Mock @stackframe/react to avoid StackClientApp constructor throwing
vi.mock("@stackframe/react", () => ({
  StackProvider: ({ children }: { children: React.ReactNode }) => children,
  StackTheme: ({ children }: { children: React.ReactNode }) => children,
  StackHandler: () => null,
  StackClientApp: vi.fn().mockImplementation(() => ({})),
}));

import App from "../App";

it("renders without crashing", () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
