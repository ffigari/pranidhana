import { errorCodes } from "@shared/me";
import { Express } from "express";

import { getUserById } from "./persistence";

export const me = (app: Express) => {
  app.get("/me", async (req, res) => {
    const userID = req.session.userID;

    if (!userID) {
      res.status(401).json({ errors: [errorCodes.notLoggedIn] });
      return;
    }

    const user = await getUserById(userID);

    if (!user) {
      res.status(401).json({ errors: [errorCodes.notLoggedIn] });
      return;
    }

    res.json(user);
  });
};
