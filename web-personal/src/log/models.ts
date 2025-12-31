export type Year = number;
export type Month = number;
export type Day = number;

export class Entry {
    year: Year;
    month: Month;
    day: Day;
    paragraphs: string[][];

    constructor(year: Year, month: Month, day: Day, paragraphs: string[][]) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.paragraphs = paragraphs;
    }
}

export type IndexedEntries = Map<Year, Map<Month, Map<Day, Entry>>>;
