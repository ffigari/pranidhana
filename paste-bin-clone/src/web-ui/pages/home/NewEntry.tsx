import { useState, FormEvent } from "react";
import { API } from "./types";
import { Navigator } from "@web-ui/types";

interface Props {
    api: API;
    navigator: Navigator;
}

export function NewEntry({ api, navigator }: Props) {
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const id = await api.create({ text });
            navigator.navigate(`/entries/${id}`);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section>
            <h2 className="h5 mb-3">new</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Enter your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </form>
        </section>
    );
}
