// Polyfill TextEncoder/TextDecoder for jsdom (needed by fast-png via jsPDF 4.x)
import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextEncoder, TextDecoder });
