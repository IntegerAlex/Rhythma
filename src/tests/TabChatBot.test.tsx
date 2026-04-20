import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Framer motion mocks to avoid animation-related issues in tests
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, key) => {
        const tag = String(key);
        // eslint-disable-next-line react/display-name
        const Comp = (props: Record<string, unknown>) => {
          const { children, ...rest } = props as { children?: React.ReactNode; [k: string]: unknown };
          // Filter out framer-specific props that are not valid HTML attributes
          const htmlProps: Record<string, unknown> = {};
          for (const k of Object.keys(rest)) {
            if (!["initial", "animate", "exit", "transition", "whileTap", "whileHover", "layout", "variants"].includes(k)) {
              htmlProps[k] = rest[k];
            }
          }
          return React.createElement(tag, htmlProps, children);
        };
        return Comp;
      },
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({ start: vi.fn() }),
  useMotionValue: (v: unknown) => ({ get: () => v, set: vi.fn() }),
}));

import React from "react";
import TabChatBot from "../pages/TabChatBot";

it("renders TabChatBot without crashing", () => {
  const { baseElement } = render(<TabChatBot />);
  expect(baseElement).toBeDefined();
});

it("displays the Rhythma Assistant heading", () => {
  render(<TabChatBot />);
  expect(screen.getByText("Rhythma Assistant")).toBeDefined();
});

it("shows an initial greeting message from the bot", () => {
  render(<TabChatBot />);
  // The bot sends a greeting on mount
  const messages = screen.getAllByText(/Rhythma/i);
  expect(messages.length).toBeGreaterThan(0);
});

it("renders quick-prompt chips", () => {
  render(<TabChatBot />);
  expect(screen.getByText("How long is a normal period?")).toBeDefined();
  expect(screen.getByText("When do I ovulate?")).toBeDefined();
});
