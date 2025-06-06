import { JSDOM } from "jsdom";

// Set up DOM globals for pdfjs-dist
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
  resources: "usable",
});

// Set up global DOM APIs - use Object.defineProperty for read-only properties
const globals: Record<string, any> = {
  DOMParser: dom.window.DOMParser,
  document: dom.window.document,
  window: dom.window,
  navigator: dom.window.navigator,
  DOMMatrix:
    dom.window.DOMMatrix ||
    class DOMMatrix {
      constructor() {}
    },
  Image: dom.window.Image,
  HTMLCanvasElement: dom.window.HTMLCanvasElement,
  HTMLImageElement: dom.window.HTMLImageElement,
};

// Define properties on global
for (const [key, value] of Object.entries(globals)) {
  if (!(key in global)) {
    (global as any)[key] = value;
  } else {
    // If property exists and is read-only, try to redefine it
    try {
      Object.defineProperty(global, key, {
        value: value,
        writable: true,
        configurable: true,
      });
    } catch (e) {
      // If we can't redefine it, that's okay - it might already be set
    }
  }
}
