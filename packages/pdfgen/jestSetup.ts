// Mock canvas for jsPDF
import "jest-canvas-mock";

// Mock DOMParser and document for PDF generation
global.DOMParser = window.DOMParser;

// Suppress console warnings during tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    args[0]?.includes?.("jsPDF") ||
    args[0]?.includes?.("Cannot read properties of undefined")
  ) {
    return;
  }
  originalWarn.apply(console, args);
};
