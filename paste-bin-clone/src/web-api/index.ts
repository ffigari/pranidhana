import express from "express";
import { bootstrap } from "@bootstrap";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
    const { entries } = await bootstrap();

    // API routes
    app.get("/api/entries/:id", async (req, res) => {
        const { id } = req.params;
        const entry = await entries.getByID(id);

        if (!entry) {
            return res.status(404).json({ error: "Entry not found" });
        }

        res.json(entry);
    });

    app.post("/api/entries", async (req, res) => {
        try {
            const id = await entries.create(req.body);
            res.status(200).json({ id });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    });

    // Serve static files from React build (production only)
    const staticPath = path.resolve(__dirname, "../web-ui");
    app.use(express.static(staticPath));

    // Catch-all route for client-side routing (serve index.html)
    app.get("*", (_req, res) => {
        res.sendFile(path.join(staticPath, "index.html"));
    });

    app.listen(port, () => {
        console.log(`API server listening on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
