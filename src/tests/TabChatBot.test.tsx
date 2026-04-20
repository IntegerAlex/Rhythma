import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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
import TabChatBot, { getBotResponse } from "../pages/TabChatBot";

// ── Component tests ─────────────────────────────────────────────────────────

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

// ── getBotResponse keyword routing tests ────────────────────────────────────
// The real getBotResponse returns full sentences. We verify it returns
// a non-empty string and that the content comes from the expected category
// by checking for characteristic words from each response pool.

it("getBotResponse routes period keywords and returns a response string", () => {
  const res1 = getBotResponse("I have a period question");
  const res2 = getBotResponse("menstrual health");
  const res3 = getBotResponse("I am bleeding");
  // All should be non-empty strings from the period pool
  expect(typeof res1).toBe("string");
  expect(res1.length).toBeGreaterThan(0);
  expect(typeof res2).toBe("string");
  expect(typeof res3).toBe("string");
  // Period pool contains "menstrual" somewhere
  expect(res1.toLowerCase()).toMatch(/period|menstrual|flow|bleed/);
});

it("getBotResponse routes cycle/phase keywords and returns a response string", () => {
  const res = getBotResponse("my cycle is irregular");
  expect(typeof res).toBe("string");
  expect(res.length).toBeGreaterThan(0);
  expect(res.toLowerCase()).toMatch(/cycle|phase|days/);
});

it("getBotResponse routes ovulation keywords and returns a response string", () => {
  const res = getBotResponse("when do I ovulate?");
  expect(typeof res).toBe("string");
  expect(res.toLowerCase()).toMatch(/ovulat|fertile|lh/);
});

it("getBotResponse routes PMS keywords and returns a response string", () => {
  const res = getBotResponse("I have pms");
  expect(typeof res).toBe("string");
  expect(res.toLowerCase()).toMatch(/pms|premenstrual|pmdd|mood/);
});

it("getBotResponse routes pain keywords and returns a response string", () => {
  const res = getBotResponse("bad cramps today");
  expect(typeof res).toBe("string");
  expect(res.toLowerCase()).toMatch(/cramp|pain|heat|relief/);
});

it("getBotResponse routes flow keywords and returns a response string", () => {
  const res = getBotResponse("heavy flow this month");
  expect(typeof res).toBe("string");
  expect(res.toLowerCase()).toMatch(/flow|blood|pad|tampon|ml/);
});

it("getBotResponse routes pregnancy keywords and returns a response string", () => {
  const res = getBotResponse("can I get pregnant now?");
  expect(typeof res).toBe("string");
  expect(res.toLowerCase()).toMatch(/pregnan|conceiv|fertile|period/);
});

it("getBotResponse routes nutrition keywords and returns a response string", () => {
  const res = getBotResponse("what food to eat today");
  expect(typeof res).toBe("string");
  expect(res.toLowerCase()).toMatch(/food|iron|magnesium|diet|vitamin/);
});

it("getBotResponse routes exercise keywords and returns a response string", () => {
  const res = getBotResponse("can I exercise today");
  expect(typeof res).toBe("string");
  expect(res.toLowerCase()).toMatch(/exercise|workout|yoga|energy|body/);
});

it("getBotResponse routes mood keywords and returns a response string", () => {
  const res = getBotResponse("my mood is terrible");
  expect(typeof res).toBe("string");
  expect(res.toLowerCase()).toMatch(/mood|hormone|estrogen|emotion/);
});

it("getBotResponse returns a default response for unrecognised input", () => {
  const res1 = getBotResponse("hello there");
  const res2 = getBotResponse("what is your name");
  const res3 = getBotResponse("");
  expect(typeof res1).toBe("string");
  expect(res1.length).toBeGreaterThan(0);
  // Default responses mention "Rhythma" or "cycle" or "health"
  expect(res1.toLowerCase()).toMatch(/rhythma|cycle|health|assistant/);
  expect(typeof res2).toBe("string");
  expect(typeof res3).toBe("string");
});
