/** A part of a help text: a heading, or a paragraph. */
export interface TextBlock { heading: boolean; text: string }

/**
 * A help text's paragraphs and headings: the source separates paragraphs with a blank line, and a
 * paragraph that starts with `## ` is a heading over the paragraphs after it.
 */
export function blocks(text: string): TextBlock[] {
  return text.split(/\n\s*\n/).map(part => part.replace(/\s+/g, ' ').trim()).filter(Boolean)
    .map(part => /^##(\s|$)/.test(part) ? { heading: true, text: part.slice(2).trim() } : { heading: false, text: part })
    .filter(block => block.text)
}
