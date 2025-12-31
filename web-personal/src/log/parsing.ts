import peggy from "peggy";

import { Day, Entry, Month, Year } from "./models";

// Define the PEG grammar for parsing log documents
const grammarDefinition = `
Document
  = p:Paragraph
    rest:(BlankLine+ pp:Paragraph { return pp; })*
    {
      return [p, ...rest];
    }

Paragraph
  = l:Line
    rest:(Newline !Newline ll:Line { return ll; })*
    {
      return [l, ...rest];
    }

BlankLine
  = Newline Newline+

Line
  = text:[^\\n]+ { return text.join(""); }

Newline
  = "\\n"
`;

// Generate parser from the grammar
const parser = peggy.generate(grammarDefinition);

export const parseEntry = (
    input: string,
    year: Year,
    month: Month,
    day: Day
): Entry => {
    const trimmed = input.trim();

    let paragraphs: string[][] = [];

    if (trimmed !== "") {
        try {
            paragraphs = parser.parse(trimmed);
        } catch (e) {
            throw new Error(`Failed to parse log: ${e}`);
        }
    }

    return new Entry(year, month, day, paragraphs);
};
