import { paths } from "@shared/paths";
import { Express } from "express";
import path from "path";

export const dojos = (app: Express, entrypointsDir: string) => {
  app.get(paths.dojoSignupLoginRequest, (_, res) => {
    res.sendFile(path.join(entrypointsDir, "dojo-signup-login-request.html"));
  });

  app.get(paths.dojoSignup, (req, res) => {
    if (!req.session.userID) {
      res.redirect("/dojo-signup-login-request");
      return;
    }

    res.sendFile(path.join(entrypointsDir, "dojo-signup.html"));
  });

  app.get(paths.dojos, (_, res) => {
    res.sendFile(path.join(entrypointsDir, "dojos.html"));
  });
};
