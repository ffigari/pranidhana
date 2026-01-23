import express from "express";
import { Entries } from "@core/entries";

const app = express();
const port = process.env.PORT || 3000;

const entries = new Entries();

app.use(express.json());

app.get("/api/entries/:id", (req, res) => {
  const { id } = req.params;
  const entry = entries.getByID(id);

  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  res.json(entry);
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
