import { describe, expect, it } from "vitest";

import { loader } from "./loader";

describe("DiskLoader", () => {
    it("should load three existing entries and correctly parse at least one", () => {
        const entries = loader.getEntries();

        expect(entries.get(2025)?.get(12)?.get(29)).toBeDefined();
        expect(entries.get(2025)?.get(12)?.get(30)).toBeDefined();
        expect(entries.get(2026)?.get(1)?.get(1)).toBeDefined();

        const entry = entries.get(2025)?.get(12)?.get(29);
        expect(entry).toBeDefined();
        expect(entry?.year).toBe(2025);
        expect(entry?.month).toBe(12);
        expect(entry?.day).toBe(29);
        expect(entry?.paragraphs).toEqual([
            [
                "ronda de danza",
                "vibra el piso",
                "por instantes cada persona es un portal",
                "rapidamente se suceden mundos enteros",
            ],
            [
                "a lo lejos hay colosos y gigantes",
                "son aquellos que no tienen comienzo ni final",
                "son aquellos que dan forma al mundo",
            ],
            ["se recablean los recuerdos", "se recuerda el recuerdo feliz"],
            [
                "una y otra vez se abandonan las historias",
                "llegando siempre a otra historia",
            ],
        ]);
    });
});
