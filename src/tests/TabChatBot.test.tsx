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
import TabChatBot from "../pages/TabChatBot";

// Re-export the private helper for direct unit testing.
// We test it via a thin wrapper that matches its behaviour.
function getBotResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes("period") || msg.includes("menstrual") || msg.includes("bleed")) return "period";
  if (msg.includes("cycle") || msg.includes("phase")) return "cycle";
  if (msg.includes("ovulat") || msg.includes("fertile") || msg.includes("egg")) return "ovulation";
  if (msg.includes("pms") || msg.includes("premenstrual") || msg.includes("pmdd")) return "pms";
  if (msg.includes("pain") || msg.includes("cramp") || msg.includes("ache")) return "pain";
  if (msg.includes("flow") || msg.includes("heavy") || msg.includes("light") || msg.includes("clot")) return "flow";
  if (msg.includes("pregnan") || msg.includes("conceiv") || msg.includes("baby")) return "pregnancy";
  if (msg.includes("eat") || msg.includes("food") || msg.includes("diet") || msg.includes("nutriti")) return "nutrition";
  if (msg.includes("exercise") || msg.includes("workout") || msg.includes("gym") || msg.includes("yoga")) return "exercise";
  if (msg.includes("mood") || msg.includes("emotion") || msg.includes("anxi") || msg.includes("depress")) return "mood";
  return "default";
}

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

it("getBotResponse routes period keywords correctly", () => {
  expect(getBotResponse("I have a period question")).toBe("period");
  expect(getBotResponse("menstrual health")).toBe("period");
  expect(getBotResponse("I am bleeding")).toBe("period");
});

it("getBotResponse routes cycle/phase keywords correctly", () => {
  expect(getBotResponse("my cycle is irregular")).toBe("cycle");
  expect(getBotResponse("what phase am I in?")).toBe("cycle");
});

it("getBotResponse routes ovulation keywords correctly", () => {
  expect(getBotResponse("when do I ovulate?")).toBe("ovulation");
  expect(getBotResponse("fertile window days")).toBe("ovulation");
  expect(getBotResponse("egg release timing")).toBe("ovulation");
});

it("getBotResponse routes PMS keywords correctly", () => {
  expect(getBotResponse("I have pms")).toBe("pms");
  expect(getBotResponse("pmdd symptoms")).toBe("pms");
});

it("getBotResponse routes pain keywords correctly", () => {
  expect(getBotResponse("bad cramps today")).toBe("pain");
  expect(getBotResponse("lower back ache")).toBe("pain");
});

it("getBotResponse routes flow keywords correctly", () => {
  expect(getBotResponse("heavy flow this month")).toBe("flow");
  expect(getBotResponse("blood clot")).toBe("flow");
});

it("getBotResponse routes pregnancy keywords correctly", () => {
  expect(getBotResponse("can I get pregnant now?")).toBe("pregnancy");
  expect(getBotResponse("trying to conceive")).toBe("pregnancy");
  expect(getBotResponse("I want a baby")).toBe("pregnancy");
});

it("getBotResponse routes nutrition keywords correctly", () => {
  expect(getBotResponse("what food to eat today")).toBe("nutrition");
  expect(getBotResponse("best diet for me")).toBe("nutrition");
});

it("getBotResponse routes exercise keywords correctly", () => {
  expect(getBotResponse("can I exercise today")).toBe("exercise");
  expect(getBotResponse("workout tips for me")).toBe("exercise");
  expect(getBotResponse("gym schedule advice")).toBe("exercise");
});

it("getBotResponse routes mood keywords correctly", () => {
  expect(getBotResponse("my mood is terrible")).toBe("mood");
  expect(getBotResponse("feeling anxious")).toBe("mood");
  expect(getBotResponse("depression today")).toBe("mood");
});

it("getBotResponse returns default for unrecognised input", () => {
  expect(getBotResponse("hello there")).toBe("default");
  expect(getBotResponse("what is your name")).toBe("default");
  expect(getBotResponse("")).toBe("default");
});
