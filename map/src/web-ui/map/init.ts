import maplibregl from "maplibre-gl";

// Access shared state initialized in shared.ts
const { sharedState } = window;

// Initialize the map centered on Buenos Aires
const map = new maplibregl.Map({
    container: "map-container",
    style: {
        version: 8,
        sources: {
            osm: {
                type: "raster",
                tiles: [
                    "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                ],
                tileSize: 256,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
        },
        layers: [
            {
                id: "osm-tiles",
                type: "raster",
                source: "osm",
                minzoom: 0,
                maxzoom: 19,
            },
        ],
    },
    center: [-58.3816, -34.6037], // Buenos Aires coordinates
    zoom: 12,
});

// Update shared state with map instance
sharedState.mapInstance = map;
sharedState.status = "ok";

// Add navigation controls
map.addControl(new maplibregl.NavigationControl(), "top-left");

export {};
