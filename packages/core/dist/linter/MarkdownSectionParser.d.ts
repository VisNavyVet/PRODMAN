import type { ParsedSection } from './types';
/**
 * Normalise a heading string: lowercase, trim, strip parenthetical suffixes and non-alphanumeric.
 * e.g. "Out of scope (do not touch)" → "out of scope"
 */
export declare function normaliseHeading(text: string): string;
/**
 * Parse H2 (##) and H3 (###) headings from a Markdown file into a section map.
 *
 * - Keys are canonical section names (normalised + alias-resolved)
 * - Sub-headings (###) under a ## are included in the parent's content
 *   AND also stored as their own entries in the map
 * - Duplicate keys: last one wins
 * - Empty file or no headings: returns empty Map (does not throw)
 */
export declare function parseMarkdownSections(text: string): Map<string, ParsedSection>;
/**
 * Count bullet list items in a section's content.
 * Matches: - item, * item, • item, 1. item, - [ ] item, - [x] item
 */
export declare function countBulletItems(section: ParsedSection): number;
/**
 * Extract bullet list items from a section as an array of strings.
 * Strips the list marker and trims each item.
 */
export declare function extractBulletItems(section: ParsedSection): string[];
/**
 * Extract a Markdown table from a section as an array of row objects.
 * Returns rows as { [colHeader]: cellValue } records.
 * Skips header and separator rows.
 */
export declare function extractTableRows(section: ParsedSection): Array<Record<string, string>>;
//# sourceMappingURL=MarkdownSectionParser.d.ts.map