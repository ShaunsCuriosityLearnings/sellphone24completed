/**
 * Markdown & Plain Text to HTML Converter for SellPhoneCash Blog Posts.
 * Converts raw markdown or unformatted plain text into rich, beautifully formatted HTML
 * with support for headings, paragraphs, bullet lists, numbered lists, blockquotes, callout boxes,
 * bold/italic emphasis, and auto-generated Table of Contents.
 */

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractTableOfContents(rawContent: string): TocHeading[] {
  if (!rawContent) return [];
  const headings: TocHeading[] = [];
  const lines = rawContent.split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    // Markdown headers: #, ##, ###
    const mdMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (mdMatch) {
      const level = mdMatch[1].length;
      const text = mdMatch[2].replace(/[\*\_\`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      headings.push({ id, text, level });
      return;
    }

    // Heuristic: Standalone title-like lines ending with ? or short title lines (under 80 chars) without punctuation at end
    if (
      trimmed.length > 5 &&
      trimmed.length < 85 &&
      !trimmed.startsWith("*") &&
      !trimmed.startsWith("-") &&
      !trimmed.match(/^\d+\./) &&
      !trimmed.includes("<") &&
      (trimmed.endsWith("?") || /^(Why|How|What|Where|Benefits|Steps|Conclusion|Factors|Tips|Overview)/i.test(trimmed))
    ) {
      const text = trimmed.replace(/[\*\_\`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (!headings.some((h) => h.id === id)) {
        headings.push({ id, text, level: 2 });
      }
    }
  });

  return headings;
}

export function parseMarkdownToHtml(content: string): string {
  if (!content) return "";

  // If content is already valid rich HTML with <p> or <h2> tags, return it directly
  if (/<p\b[^>]*>/i.test(content) || /<h[1-6]\b[^>]*>/i.test(content)) {
    return content;
  }

  // Normalize line endings
  let text = content.replace(/\r\n/g, "\n");

  // Step 1: Format Markdown headings
  text = text.replace(/^(#{1,4})\s+(.+)$/gm, (_, hashes, headingText) => {
    const level = hashes.length;
    const cleanText = headingText.trim();
    const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    if (level === 1 || level === 2) {
      return `<h2 id="${id}" class="text-xl md:text-2xl font-extrabold text-slate-800 mt-8 mb-4 border-l-4 border-emerald-500 pl-3.5 py-0.5 tracking-tight flex items-center gap-2 group">${cleanText}<a href="#${id}" class="opacity-0 group-hover:opacity-100 text-emerald-500 text-sm font-normal transition">#</a></h2>`;
    }
    return `<h3 id="${id}" class="text-lg md:text-xl font-bold text-slate-800 mt-6 mb-3 tracking-tight">${cleanText}</h3>`;
  });

  // Step 2: Auto-detect plain text lines that act as Headings (e.g., "Why Sell Your iPhone 17 in Dubai?")
  text = text.replace(/^(?![#*<-\d])([A-Z0-9][A-Za-z0-9\s\-\:\?\'\"]{5,80})(?:\n|\r)/gm, (match, titleLine) => {
    const cleanText = titleLine.trim();
    // Only turn into heading if it looks like a section header (e.g. ends with ?, starts with question words, or title casing)
    if (
      cleanText.endsWith("?") ||
      /^(Why|How|What|Where|Benefits|Steps|Conclusion|Factors|Tips|Overview|Sell|Get|Important)/i.test(cleanText)
    ) {
      const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return `<h2 id="${id}" class="text-xl md:text-2xl font-extrabold text-slate-800 mt-8 mb-4 border-l-4 border-emerald-500 pl-3.5 py-0.5 tracking-tight">${cleanText}</h2>\n`;
    }
    return match;
  });

  // Step 3: Format Bullet Lists (* Item or - Item)
  // Split block into paragraphs/blocks first
  const blocks = text.split(/\n{2,}/);
  const formattedBlocks = blocks.map((block) => {
    const lines = block.trim().split("\n");

    // Check if block is an unordered list
    if (lines.every((l) => /^\s*[\*\-]\s+/.test(l))) {
      const items = lines.map((l) => {
        const itemContent = l.replace(/^\s*[\*\-]\s+/, "").trim();
        const formattedItem = formatInlineFormatting(itemContent);
        return `<li class="flex items-start gap-2.5 text-slate-700 text-sm md:text-base leading-relaxed mb-2.5"><span class="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span><div>${formattedItem}</div></li>`;
      });
      return `<ul class="my-4 space-y-1 pl-1">${items.join("")}</ul>`;
    }

    // Check if block is a numbered list (1. Item, 2. Item)
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      const items = lines.map((l, index) => {
        const itemContent = l.replace(/^\s*\d+\.\s+/, "").trim();
        const formattedItem = formatInlineFormatting(itemContent);
        return `<li class="flex items-start gap-3 text-slate-700 text-sm md:text-base leading-relaxed mb-3"><span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center shrink-0 border border-emerald-300 shadow-2xs">${index + 1}</span><div class="pt-0.5">${formattedItem}</div></li>`;
      });
      return `<ol class="my-5 space-y-2">${items.join("")}</ol>`;
    }

    // Check if block is a Blockquote (> text)
    if (lines.every((l) => l.trim().startsWith(">"))) {
      const quoteText = lines.map((l) => l.replace(/^\s*>\s*/, "").trim()).join(" ");
      return `<blockquote class="my-6 border-l-4 border-emerald-500 bg-emerald-50/70 p-4 sm:p-5 rounded-r-2xl italic text-slate-700 shadow-2xs text-sm sm:text-base leading-relaxed">${formatInlineFormatting(quoteText)}</blockquote>`;
    }

    // If block starts with HTML header tag (<h2 ...> or <h3 ...>), don't wrap in <p>
    if (/^\s*<h[1-6]\b/i.test(block.trim())) {
      return block.trim();
    }

    // Standard Paragraph block: process inline formatting & join lines with <br />
    const innerText = lines.map((l) => formatInlineFormatting(l.trim())).join("<br />");
    return `<p class="text-slate-700 text-sm md:text-base leading-relaxed mb-5 font-normal">${innerText}</p>`;
  });

  return formattedBlocks.join("\n");
}

function formatInlineFormatting(str: string): string {
  let res = str;
  // Bold **text**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>');
  // Italics *text*
  res = res.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic text-slate-800">$1</em>');
  // Links [text](url)
  res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2">$1</a>');
  // Code `code`
  res = res.replace(/`(.*?)`/g, '<code class="bg-slate-100 text-emerald-600 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-200">$1</code>');
  return res;
}

/**
 * Utility to automatically transform raw unformatted text (like copy-pasted drafts)
 * into nicely formatted Markdown with headers, lists, and spacing for Admin editor.
 */
export function autoFormatPlainTextToMarkdown(rawText: string): string {
  if (!rawText) return "";
  let text = rawText.replace(/\r\n/g, "\n").trim();

  // 1. Convert bullet points like "* item" or "- item" on separate lines into clear Markdown list
  text = text.replace(/(?:\s*\*|\s*-)\s+([^\n]+)/g, "\n* $1");

  // 2. Convert numbered lists like "1. Item" or "2. Item"
  text = text.replace(/(\d+)\.\s+([^\n]+)/g, "\n$1. $2");

  // 3. Detect major section questions / headers and prefix with "## "
  text = text.replace(/^(Why\s+[^\n\?]+\?|How\s+[^\n\?]+\?|What\s+[^\n\?]+\?|Sell\s+[^\n:]+:?)/gm, "\n\n## $1\n");

  // 4. Double space between paragraphs
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}
