import { useEffect, useState } from "react";

export function HUD() {
    const [status, setStatus] = useState("initializing");

    useEffect(() => {
        // Access shared state
        const { sharedState } = window;

        // Update status from shared state
        setStatus(sharedState.status);

        // Poll for status changes (in a real app, you'd use a more sophisticated state management)
        const interval = setInterval(() => {
            setStatus(sharedState.status);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-4 right-4 pointer-events-auto bg-black/70 text-white p-4 rounded-lg shadow-lg">
                Status: {status}
            </div>
        </div>
    );
}
