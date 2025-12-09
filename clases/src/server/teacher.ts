import { paths } from "@shared/paths";
import { Express } from "express";
import path from "path";

import { registerTeacher } from "./persistence";

export const teacher = (app: Express, entrypointsDir: string) => {
  app.get(paths.teacherSignupLoginRequest, (_, res) => {
    res.sendFile(
      path.join(entrypointsDir, "teacher-signup-login-request.html")
    );
  });

  app.get(paths.teacherSignup, (req, res) => {
    if (!req.session.userID) {
      res.redirect(paths.teacherSignupLoginRequest);
      return;
    }

    res.sendFile(path.join(entrypointsDir, "teacher-signup.html"));
  });

  app.post(paths.apiTeachers, async (req, res) => {
    const userID = req.session.userID;

    if (!userID) {
      res.status(401).json({ errors: ["not-logged-in"] });
      return;
    }

    await registerTeacher(userID);

    res.sendStatus(204);
  });
};
