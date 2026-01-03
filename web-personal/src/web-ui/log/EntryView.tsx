import { Entry } from "@log/models";

interface EntryViewProps {
    entry: Entry;
}

function EntryView({ entry }: EntryViewProps) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                {entry.year}/{entry.month}/{entry.day}
            </div>
            <div className="card-body">
                {entry.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex} className="card-text">
                        {paragraph.map((line, lIndex) => (
                            <span key={lIndex}>
                                {line}
                                {lIndex < paragraph.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default EntryView;
