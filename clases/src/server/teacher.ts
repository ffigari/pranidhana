import { Express } from "express";
import path from "path";

import { registerTeacher } from "./persistence/teacher";

export const teacher = (app: Express, entrypointsDir: string) => {
  app.get("/teacher-signup-login-request", (_, res) => {
    res.sendFile(
      path.join(entrypointsDir, "teacher-signup-login-request.html")
    );
  });

  app.get("/teacher-signup", (req, res) => {
    if (!req.session.userID) {
      res.redirect("/teacher-signup-login-request");
      return;
    }

    res.sendFile(path.join(entrypointsDir, "teacher-signup.html"));
  });

  app.post("/api/teachers", async (req, res) => {
    const userID = req.session.userID;

    if (!userID) {
      res.status(401).json({ errors: ["not-logged-in"] });
      return;
    }

    await registerTeacher(userID);

    res.sendStatus(204);
  });
};
