import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Entry } from "@domain/entry";

function EntryView() {
    const { id } = useParams<{ id: string }>();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/entries/${id}`);

                if (!response.ok) {
                    throw new Error("Entry not found");
                }

                const data = await response.json();
                setEntry(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEntry();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6">
                        <div className="alert alert-danger">Error: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6">
                        <div className="alert alert-warning">
                            Entry not found
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <h1 className="mb-4">Entry {id}</h1>
                    <div className="mb-4">
                        <h2 className="h5">Text:</h2>
                        <p className="text-break">{entry.text}</p>
                    </div>
                    <div>
                        <h2 className="h5">Created At:</h2>
                        <p>{new Date(entry.createdAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EntryView;
