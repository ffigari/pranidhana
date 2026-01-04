import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HUD } from "./HUD";

// Access shared state initialized in shared.ts
const { sharedState } = window;

// Initialize React app for HUD overlay
const container = document.getElementById("overlay-container");
if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <HUD />
        </StrictMode>,
    );
}

// Log shared state to verify access
console.log("HUD initialized with shared state:", sharedState);

export {};
