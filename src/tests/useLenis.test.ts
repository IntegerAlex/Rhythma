import { it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";

// Mock lenis to avoid real RAF / DOM dependencies in unit tests
vi.mock("lenis", () => {
  const MockLenis = vi.fn().mockImplementation(() => ({
    raf: vi.fn(),
    destroy: vi.fn(),
  }));
  return { default: MockLenis };
});

import { useLenis } from "../utils/useLenis";

beforeEach(() => {
  vi.useFakeTimers();
  // Provide a no-op requestAnimationFrame shim that never invokes the callback —
  // the hook queues an RAF loop but we don't want it to actually run in tests.
  vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(() => 42);
  vi.spyOn(globalThis, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

it("returns a ref object (lenisRef) on mount", () => {
  const { result } = renderHook(() => {
    const wrapperRef = useRef<HTMLDivElement>(document.createElement("div"));
    return useLenis(wrapperRef);
  });

  expect(result.current).toBeDefined();
  expect(typeof result.current).toBe("object");
});

it("does not throw when wrapper element is null", () => {
  expect(() => {
    renderHook(() => {
      const wrapperRef = useRef<HTMLElement | null>(null);
      return useLenis(wrapperRef);
    });
  }).not.toThrow();
});

it("calls cancelAnimationFrame on unmount", () => {
  const { unmount } = renderHook(() => {
    const wrapperRef = useRef<HTMLDivElement>(document.createElement("div"));
    return useLenis(wrapperRef);
  });

  unmount();
  expect(cancelAnimationFrame).toHaveBeenCalled();
});
