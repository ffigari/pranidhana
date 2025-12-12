import { errorCodes } from "@shared/me";
import { Express } from "express";

import { getUser } from "./persistence/user";

export const me = (app: Express) => {
  app.get("/me", async (req, res) => {
    const userID = req.session.userID;

    if (!userID) {
      res.status(401).json({ errors: [errorCodes.notLoggedIn] });
      return;
    }

    const user = await getUser({ id: userID }, { getTeacher: true });

    if (!user) {
      res.status(401).json({ errors: [errorCodes.notLoggedIn] });
      return;
    }

    res.json(user);
  });
};
