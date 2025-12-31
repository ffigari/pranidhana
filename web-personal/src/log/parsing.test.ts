import { describe, expect, it } from "vitest";

import { Entry } from "./models";
import { parseEntry } from "./parsing";

describe("parseLog", () => {
    it("should return empty array for empty string", () => {
        const result = parseEntry("", 2025, 1, 1);
        expect(result).toBeInstanceOf(Entry);
        expect(result.year).toBe(2025);
        expect(result.month).toBe(1);
        expect(result.day).toBe(1);
        expect(result.paragraphs).toEqual([]);
    });

    it("should return empty array for whitespace-only string", () => {
        const result = parseEntry("   \n\n  \n  ", 2025, 1, 1);
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([]);
    });

    it("should parse one paragraph with one line", () => {
        const result = parseEntry("hello world", 2025, 1, 1);
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([["hello world"]]);
    });

    it("should parse one paragraph with one line (with trailing newline)", () => {
        const result = parseEntry("hello world\n", 2025, 1, 1);
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([["hello world"]]);
    });

    it("should parse one paragraph with multiple lines", () => {
        const result = parseEntry("line 1\nline 2\nline 3", 2025, 1, 1);
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([["line 1", "line 2", "line 3"]]);
    });

    it("should work with multiple lines between paragraphs", () => {
        const result = parseEntry(
            "line 1\n\n\nline 2\n\n\n\nline 3",
            2025,
            1,
            1
        );
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([["line 1"], ["line 2"], ["line 3"]]);
    });

    it("should parse one paragraph with multiple lines (with trailing newline)", () => {
        const result = parseEntry("line 1\nline 2\nline 3\n", 2025, 1, 1);
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([["line 1", "line 2", "line 3"]]);
    });

    it("should parse multiple paragraphs with multiple lines each", () => {
        const result = parseEntry(
            "para 1 line 1\npara 1 line 2\n\npara 2 line 1\npara 2 line 2",
            2025,
            1,
            1
        );
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([
            ["para 1 line 1", "para 1 line 2"],
            ["para 2 line 1", "para 2 line 2"],
        ]);
    });

    it("should parse multiple paragraphs separated by multiple blank lines", () => {
        const result = parseEntry(
            "first paragraph\n\n\nsecond paragraph\n\n\n\nthird paragraph",
            2025,
            1,
            1
        );
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([
            ["first paragraph"],
            ["second paragraph"],
            ["third paragraph"],
        ]);
    });

    it("should handle leading and trailing whitespace", () => {
        const result = parseEntry("\n\nhello\nworld\n\n", 2025, 1, 1);
        expect(result).toBeInstanceOf(Entry);
        expect(result.paragraphs).toEqual([["hello", "world"]]);
    });
});
