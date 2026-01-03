import { Entries } from "@log";

import EntryView from "./EntryView";
import { loader } from "./loader";

function EntriesView() {
    const entries = new Entries(loader);
    const entryList = Array.from(entries.iterate());

    return (
        <div className="container my-4">
            {entryList.map((entry) => (
                <EntryView
                    key={`${entry.year}-${entry.month}-${entry.day}`}
                    entry={entry}
                />
            ))}
        </div>
    );
}

export default EntriesView;
