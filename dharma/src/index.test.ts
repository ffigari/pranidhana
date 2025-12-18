import { describe, it, expect } from '@jest/globals';

import { Monk, Teaching } from "./";

describe('Monk', () => {
    it('can meditate', () => {
        const monk = new Monk(true);
        expect(monk.isMeditating).toBe(true);
    });

    it("could not hear the teachings", () => {
        const monk = new Monk(true);
        const teaching: Teaching = new Teaching([]);
        expect(monk.heard(teaching)).toBe(false);
    })

    it("could hear the teachings", () => {
        const monk = new Monk(true);
        const teaching: Teaching = new Teaching([]);
        expect(monk.heard(teaching)).toBe(true);
    })
});
