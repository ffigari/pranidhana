import { errorCodes } from "@shared/login";
import { Express } from "express";
import path from "path";

import { getUser } from "./persistence";

export const login = (app: Express, entrypointsDir: string) => {
  app.get("/login", (_, res) => {
    res.sendFile(path.join(entrypointsDir, "login.html"));
  });

  app.post("/login", async (req, res) => {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ errors: [errorCodes.usernameRequired] });
      return;
    }

    const user = await getUser(username);

    if (!user) {
      res.status(401).json({ errors: [errorCodes.userNotFound] });
      return;
    }

    req.session.userID = user.id;

    res.sendStatus(204);
  });
};
