import { jsPDF } from "jspdf";
import { Lexer, Token, Tokens } from "marked";

const BASE_FONT_SIZE = 8;
const LINE_HEIGHT = 12 / 72; // inches per line, matches original

const HEADING_FONT_SIZES: Record<number, number> = {
  1: 14,
  2: 12,
  3: 10,
  4: 9,
  5: 8,
  6: 8,
};

interface Ctx {
  doc: jsPDF;
  margin: number;
  maxX: number;
  maxY: number;
  y: number;
}

interface TextSeg {
  text: string;
  bold: boolean;
  italic: boolean;
}

function applyStyle(doc: jsPDF, bold: boolean, italic: boolean, size: number) {
  const style =
    bold && italic
      ? "bolditalic"
      : bold
      ? "bold"
      : italic
      ? "italic"
      : "normal";
  doc.setFont("helvetica", style).setFontSize(size);
}

function checkPageBreak(ctx: Ctx) {
  if (ctx.y > ctx.maxY) {
    ctx.doc.addPage();
    ctx.y = ctx.margin;
  }
}

function extractSegs(tokens: Token[], bold = false, italic = false): TextSeg[] {
  const segs: TextSeg[] = [];
  for (const tok of tokens) {
    switch (tok.type) {
      case "text": {
        const t = tok as Tokens.Text;
        if (t.tokens && t.tokens.length > 0) {
          segs.push(...extractSegs(t.tokens, bold, italic));
        } else {
          segs.push({ text: t.text, bold, italic });
        }
        break;
      }
      case "strong":
        segs.push(
          ...extractSegs((tok as Tokens.Strong).tokens ?? [], true, italic)
        );
        break;
      case "em":
        segs.push(...extractSegs((tok as Tokens.Em).tokens ?? [], bold, true));
        break;
      case "del":
        segs.push(
          ...extractSegs((tok as Tokens.Del).tokens ?? [], bold, italic)
        );
        break;
      case "codespan":
        segs.push({ text: (tok as Tokens.Codespan).text, bold, italic });
        break;
      case "br":
        segs.push({ text: "\n", bold, italic });
        break;
      case "escape":
        segs.push({ text: (tok as Tokens.Escape).text, bold, italic });
        break;
      default:
        if ("tokens" in tok && Array.isArray((tok as Tokens.Generic).tokens)) {
          segs.push(
            ...extractSegs(
              (tok as Tokens.Generic).tokens as Token[],
              bold,
              italic
            )
          );
        } else if (
          "text" in tok &&
          typeof (tok as Tokens.Generic).text === "string"
        ) {
          segs.push({
            text: (tok as Tokens.Generic).text as string,
            bold,
            italic,
          });
        }
    }
  }
  return segs;
}

// Render inline text segments with word-wrapping.
// Rendering starts at (startX, ctx.y); wrapped lines continue from leftX.
// After return, ctx.y is at the last rendered line — callers must advance past it.
function renderSegs(
  ctx: Ctx,
  segs: TextSeg[],
  fontSize: number,
  leftX: number,
  startX: number
) {
  const { doc, maxX } = ctx;

  type Word = { text: string; bold: boolean; italic: boolean };
  const words: Word[] = [];

  for (const seg of segs) {
    if (seg.text === "\n") {
      words.push({ text: "\n", bold: seg.bold, italic: seg.italic });
      continue;
    }
    const parts = seg.text.split(/(\s+)/);
    for (const p of parts) {
      if (p) words.push({ text: p, bold: seg.bold, italic: seg.italic });
    }
  }

  let curX = startX;

  for (const word of words) {
    if (word.text === "\n") {
      ctx.y += LINE_HEIGHT;
      checkPageBreak(ctx);
      curX = leftX;
      continue;
    }

    applyStyle(doc, word.bold, word.italic, fontSize);
    const w = doc.getTextWidth(word.text);

    // Skip leading whitespace at start of a line
    if (word.text.trim() === "" && curX === leftX) continue;

    // Wrap if the word would overflow
    if (curX + w > maxX && curX > leftX) {
      ctx.y += LINE_HEIGHT;
      checkPageBreak(ctx);
      curX = leftX;
      if (word.text.trim() === "") continue;
    }

    doc.text(word.text, curX, ctx.y);
    curX += w;
  }
}

function renderBlock(ctx: Ctx, token: Token) {
  switch (token.type) {
    case "heading": {
      const t = token as Tokens.Heading;
      const fontSize = HEADING_FONT_SIZES[t.depth] ?? BASE_FONT_SIZE;
      ctx.y += LINE_HEIGHT * 0.5;
      checkPageBreak(ctx);
      renderSegs(
        ctx,
        extractSegs(t.tokens ?? [], true, false),
        fontSize,
        ctx.margin,
        ctx.margin
      );
      ctx.y += LINE_HEIGHT * 1.25;
      break;
    }

    case "paragraph": {
      const t = token as Tokens.Paragraph;
      checkPageBreak(ctx);
      renderSegs(
        ctx,
        extractSegs(t.tokens ?? []),
        BASE_FONT_SIZE,
        ctx.margin,
        ctx.margin
      );
      ctx.y += LINE_HEIGHT * 1.5;
      break;
    }

    case "list": {
      const t = token as Tokens.List;
      const startNum = typeof t.start === "number" ? t.start : 1;
      for (let i = 0; i < t.items.length; i++) {
        const item = t.items[i];
        checkPageBreak(ctx);

        const prefix = t.ordered ? `${startNum + i}. ` : "• ";
        applyStyle(ctx.doc, false, false, BASE_FONT_SIZE);
        ctx.doc.text(prefix, ctx.margin, ctx.y);
        const prefixW = ctx.doc.getTextWidth(prefix);
        const itemLeftX = ctx.margin + prefixW;

        const itemSegs: TextSeg[] = [];
        for (const tok of item.tokens) {
          if (tok.type === "text") {
            const tt = tok as Tokens.Text;
            itemSegs.push(
              ...(tt.tokens && tt.tokens.length > 0
                ? extractSegs(tt.tokens)
                : [{ text: tt.text, bold: false, italic: false }])
            );
          } else if (tok.type === "paragraph") {
            itemSegs.push(
              ...extractSegs((tok as Tokens.Paragraph).tokens ?? [])
            );
          } else if (tok.type === "list") {
            // Nested list: render inline as indented continuation
            const nested = tok as Tokens.List;
            const nestedStart =
              typeof nested.start === "number" ? nested.start : 1;
            for (let j = 0; j < nested.items.length; j++) {
              const nestedItem = nested.items[j];
              const nestedPrefix = nested.ordered
                ? `${nestedStart + j}. `
                : "◦ ";
              applyStyle(ctx.doc, false, false, BASE_FONT_SIZE);
              ctx.doc.text(nestedPrefix, itemLeftX, ctx.y);
              const nestedPrefixW = ctx.doc.getTextWidth(nestedPrefix);
              const nestedLeftX = itemLeftX + nestedPrefixW;
              const nestedSegs: TextSeg[] = [];
              for (const ntok of nestedItem.tokens) {
                if (ntok.type === "text") {
                  const tt = ntok as Tokens.Text;
                  nestedSegs.push(
                    ...(tt.tokens && tt.tokens.length > 0
                      ? extractSegs(tt.tokens)
                      : [{ text: tt.text, bold: false, italic: false }])
                  );
                }
              }
              renderSegs(
                ctx,
                nestedSegs,
                BASE_FONT_SIZE,
                nestedLeftX,
                nestedLeftX
              );
              ctx.y += LINE_HEIGHT;
            }
          }
        }

        if (itemSegs.length > 0) {
          renderSegs(ctx, itemSegs, BASE_FONT_SIZE, itemLeftX, itemLeftX);
          ctx.y += LINE_HEIGHT;
        }
      }
      ctx.y += LINE_HEIGHT * 0.25;
      break;
    }

    case "blockquote": {
      const t = token as Tokens.Blockquote;
      ctx.y += LINE_HEIGHT * 0.25;
      for (const tok of t.tokens ?? []) {
        renderBlock(ctx, tok);
      }
      ctx.y += LINE_HEIGHT * 0.25;
      break;
    }

    case "code": {
      const t = token as Tokens.Code;
      ctx.y += LINE_HEIGHT * 0.25;
      applyStyle(ctx.doc, false, false, BASE_FONT_SIZE - 1);
      for (const line of t.text.split("\n")) {
        checkPageBreak(ctx);
        ctx.doc.text(line, ctx.margin, ctx.y);
        ctx.y += LINE_HEIGHT;
      }
      ctx.y += LINE_HEIGHT * 0.25;
      break;
    }

    case "hr": {
      ctx.y += LINE_HEIGHT * 0.5;
      ctx.doc.setLineWidth(0.005);
      ctx.doc.line(ctx.margin, ctx.y, ctx.maxX, ctx.y);
      ctx.y += LINE_HEIGHT * 0.5;
      break;
    }

    case "space": {
      ctx.y += LINE_HEIGHT * 0.5;
      break;
    }

    default: {
      if (
        "text" in token &&
        typeof (token as Tokens.Generic).text === "string"
      ) {
        applyStyle(ctx.doc, false, false, BASE_FONT_SIZE);
        const split = ctx.doc.splitTextToSize(
          (token as Tokens.Generic).text as string,
          ctx.maxX - ctx.margin
        );
        for (const line of split) {
          checkPageBreak(ctx);
          ctx.doc.text(line, ctx.margin, ctx.y);
          ctx.y += LINE_HEIGHT;
        }
      }
    }
  }
}

export function SupplementalText(
  doc: jsPDF,
  supplemental_text: string,
  margin: number
) {
  const docWidth = doc.internal.pageSize.getWidth();
  const docHeight = doc.internal.pageSize.height;
  const startY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + margin;

  const ctx: Ctx = {
    doc,
    margin,
    maxX: docWidth * 0.75,
    maxY: docHeight - margin * 2,
    y: startY + LINE_HEIGHT,
  };

  const tokens = Lexer.lex(supplemental_text);
  for (const tok of tokens) {
    renderBlock(ctx, tok);
  }
}
