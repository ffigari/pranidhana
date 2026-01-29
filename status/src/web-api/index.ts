import express from "express";
import { statusChecker } from "@core/status";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  try {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());

    // API endpoint
    app.get("/api/status", async (_, res) => {
      try {
        const status = await statusChecker.getStatus();
        const dto = status.toDTO();
        res.json(dto);
      } catch (error) {
        console.error("Error fetching status:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Serve static files in production
    const distPath = resolve(__dirname, "../../dist");
    app.use(express.static(distPath));

    // Catch-all route for client-side routing (must be last)
    app.use((req, res) => {
      if (req.path.startsWith("/api")) {
        res.status(404).json({ error: "API endpoint not found" });
      } else {
        res.sendFile(resolve(distPath, "index.html"));
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

main();
