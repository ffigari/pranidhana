import { Express } from "express";
import path from "path";

export const classes = (app: Express, entrypointsDir: string) => {
  app.get("/classes", (_, res) => {
    res.sendFile(path.join(entrypointsDir, "classes.html"));
  });

  app.get("/my-classes", (_, res) => {
    res.sendFile(path.join(entrypointsDir, "my-classes.html"));
  });
};
