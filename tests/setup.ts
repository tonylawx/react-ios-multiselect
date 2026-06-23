import { Window } from "happy-dom";

// happy-dom 20.x removed GlobalRegistrator. Create a Window and copy its
// globals onto globalThis so bun:test + @testing-library/react can use them.
const window = new Window();

// Copy enumerable window globals (document, navigator, etc.).
const descriptors = Object.getOwnPropertyDescriptors(window);
for (const key of Object.keys(descriptors)) {
  if (key === "window" || key === "globalThis" || key === "self") continue;
  if (key.startsWith("_") || key.endsWith("Symbol")) continue;
  const lowerKey = key;
  if (!(lowerKey in globalThis)) {
    try {
      Object.defineProperty(globalThis, lowerKey, descriptors[lowerKey]);
    } catch {
      // some props are read-only on globalThis; skip them
    }
  }
}

// Ensure window/self/globalThis point at our window-like for libraries that
// check `typeof window`.
try {
  Object.defineProperty(globalThis, "window", {
    value: window,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "self", {
    value: window,
    configurable: true,
    writable: true,
  });
} catch {
  // ignore
}

// --- Web APIs happy-dom does not fully implement; stub them. ---
const g = globalThis as unknown as Window & typeof globalThis;

if (!g.matchMedia) {
  g.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof g.matchMedia;
}

if (!g.ResizeObserver) {
  // Test-only stub; the class shape is intentionally minimal.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  g.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

if (!g.visualViewport) {
  Object.defineProperty(g, "visualViewport", {
    value: {
      height: 800,
      width: 400,
      offsetTop: 0,
      offsetLeft: 0,
      scale: 1,
      addEventListener: () => {},
      removeEventListener: () => {},
    },
    configurable: true,
  });
}
