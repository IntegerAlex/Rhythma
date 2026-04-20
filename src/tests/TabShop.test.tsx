import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Framer motion mocks
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, key) => {
        const tag = String(key);
        // eslint-disable-next-line react/display-name
        const Comp = (props: Record<string, unknown>) => {
          const { children, ...rest } = props as {
            children?: React.ReactNode;
            [k: string]: unknown;
          };
          const htmlProps: Record<string, unknown> = {};
          for (const k of Object.keys(rest)) {
            if (
              ![
                "initial",
                "animate",
                "exit",
                "transition",
                "whileTap",
                "whileHover",
                "layout",
                "variants",
              ].includes(k)
            ) {
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
import TabShop from "../pages/TabShop";

it("renders TabShop without crashing", () => {
  const { baseElement } = render(<TabShop />);
  expect(baseElement).toBeDefined();
});

it("shows the Wellness Shop heading", () => {
  render(<TabShop />);
  expect(screen.getByText(/Wellness Shop/i)).toBeDefined();
});

it("renders product cards", () => {
  render(<TabShop />);
  expect(screen.getByText("Organic Menstrual Cup")).toBeDefined();
  expect(screen.getByText("Organic Cotton Tampons")).toBeDefined();
  expect(screen.getByText("Biodegradable Bamboo Pads")).toBeDefined();
});

it("renders category filter chips", () => {
  render(<TabShop />);
  expect(screen.getByText("All")).toBeDefined();
  expect(screen.getByText("Supplements")).toBeDefined();
  expect(screen.getByText("Cups & Discs")).toBeDefined();
  expect(screen.getByText("Pads & Tampons")).toBeDefined();
  expect(screen.getByText("Wellness")).toBeDefined();
});

it("shows demo disclaimer", () => {
  render(<TabShop />);
  expect(screen.getByText(/demo shop/i)).toBeDefined();
});
