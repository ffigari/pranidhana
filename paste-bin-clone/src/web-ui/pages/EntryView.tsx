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
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!entry) {
    return <div>Entry not found</div>;
  }

  return (
    <div>
      <h1>Entry {id}</h1>
      <div>
        <h2>Text:</h2>
        <p>{entry.text}</p>
      </div>
      <div>
        <h2>Created At:</h2>
        <p>{new Date(entry.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default EntryView;
