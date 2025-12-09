import { paths } from "@shared/paths";
import { Express } from "express";
import path from "path";

export const classes = (app: Express, entrypointsDir: string) => {
  app.get(paths.classes, (_, res) => {
    res.sendFile(path.join(entrypointsDir, "classes.html"));
  });

  app.get(paths.myClasses, (_, res) => {
    res.sendFile(path.join(entrypointsDir, "my-classes.html"));
  });
};
