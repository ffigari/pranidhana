// Shared state accessible to both map and HUD
// This is initialized first and available globally

interface SharedState {
    mapInstance: maplibregl.Map | null;
    status: string;
}

// Declare global window extension
declare global {
    interface Window {
        sharedState: SharedState;
    }
}

// Initialize shared state
window.sharedState = {
    mapInstance: null,
    status: "initializing",
};

export {};
