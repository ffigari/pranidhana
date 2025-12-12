import { PaginatedDojosDTO, errorCodes } from "@shared/dojo";
import { Express } from "express";
import path from "path";

import { createDojo, getDojo, getDojos, updateDojo } from "./persistence/dojo";

export const dojos = (app: Express, entrypointsDir: string) => {
  app.get("/dojo-signup-login-request", (_, res) => {
    res.sendFile(path.join(entrypointsDir, "dojo-signup-login-request.html"));
  });

  app.get("/dojo-signup", (req, res) => {
    if (!req.session.userID) {
      res.redirect("/dojo-signup-login-request");
      return;
    }

    res.sendFile(path.join(entrypointsDir, "dojo-signup.html"));
  });

  app.get("/dojos", (_, res) => {
    res.sendFile(path.join(entrypointsDir, "dojos.html"));
  });

  app.get("/dojos/:id", (_, res) => {
    res.sendFile(path.join(entrypointsDir, "dojo.html"));
  });

  app.get("/api/dojos", async (req, res) => {
    const pageSizeParam = req.query.pageSize as string | undefined;
    const beforeCursor = req.query.beforeCursor as string | undefined;
    const afterCursor = req.query.afterCursor as string | undefined;

    const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 8;

    if (isNaN(pageSize) || pageSize <= 0) {
      res.status(400).json({ errors: ["invalid-page-size"] });
      return;
    }

    let afterID: string | undefined;
    let beforeID: string | undefined;

    try {
      if (afterCursor && beforeCursor) {
        afterID = Buffer.from(afterCursor, "base64").toString("utf-8");
      } else if (afterCursor) {
        afterID = Buffer.from(afterCursor, "base64").toString("utf-8");
      } else if (beforeCursor) {
        beforeID = Buffer.from(beforeCursor, "base64").toString("utf-8");
      }
    } catch (error) {
      res.status(400).json({ errors: ["invalid-cursor"] });
      return;
    }

    try {
      const result = await getDojos({ pageSize, afterID, beforeID });

      const response: PaginatedDojosDTO = {
        page: result.page,
        beforeCursor:
          result.hasPreviousPage && result.page.length > 0
            ? Buffer.from(result.page[0].id).toString("base64")
            : null,
        afterCursor:
          result.hasNextPage && result.page.length > 0
            ? Buffer.from(result.page[result.page.length - 1].id).toString(
                "base64"
              )
            : null,
      };

      console.log(response);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ errors: ["internal-server-error"] });
    }
  });

  app.post("/api/dojos", async (req, res) => {
    const { name, teacherIds, adminIds } = req.body;

    try {
      const result = await createDojo({ name, teacherIds, adminIds });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case errorCodes.nameRequired:
            res.status(400).json({ errors: [errorCodes.nameRequired] });
            return;
          case errorCodes.invalidNameFormat:
            res.status(400).json({ errors: [errorCodes.invalidNameFormat] });
            return;
          case errorCodes.nameTaken:
            res.status(400).json({ errors: [errorCodes.nameTaken] });
            return;
          case errorCodes.invalidTeacherId:
            res.status(400).json({ errors: [errorCodes.invalidTeacherId] });
            return;
          case errorCodes.noAdmins:
            res.status(400).json({ errors: [errorCodes.noAdmins] });
            return;
          case errorCodes.invalidAdminId:
            res.status(400).json({ errors: [errorCodes.invalidAdminId] });
            return;
        }
      }

      res.status(500).json({ errors: ["internal-server-error"] });
    }
  });

  app.get("/api/dojos/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const dojo = await getDojo(id);
      res.status(200).json(dojo);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === errorCodes.dojoNotFound) {
          res.status(404).json({ errors: [errorCodes.dojoNotFound] });
          return;
        }
      }

      res.status(500).json({ errors: ["internal-server-error"] });
    }
  });

  app.patch("/api/dojos/:id", async (req, res) => {
    const { id } = req.params;
    const { name, teacherIds, adminIds } = req.body;

    if (!req.session.userID) {
      res.status(401).json({ errors: [errorCodes.notAuthorized] });
      return;
    }

    try {
      const dojo = await getDojo(id);
      const isAdmin = dojo.admins.some(
        (admin) => admin.id === req.session.userID
      );

      if (!isAdmin) {
        res.status(403).json({ errors: [errorCodes.notAuthorized] });
        return;
      }

      await updateDojo({ dojoId: id, name, teacherIds, adminIds });
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case errorCodes.dojoNotFound:
            res.status(404).json({ errors: [errorCodes.dojoNotFound] });
            return;
          case errorCodes.nameRequired:
            res.status(400).json({ errors: [errorCodes.nameRequired] });
            return;
          case errorCodes.invalidNameFormat:
            res.status(400).json({ errors: [errorCodes.invalidNameFormat] });
            return;
          case errorCodes.nameTaken:
            res.status(400).json({ errors: [errorCodes.nameTaken] });
            return;
          case errorCodes.invalidTeacherId:
            res.status(400).json({ errors: [errorCodes.invalidTeacherId] });
            return;
          case errorCodes.noAdmins:
            res.status(400).json({ errors: [errorCodes.noAdmins] });
            return;
          case errorCodes.invalidAdminId:
            res.status(400).json({ errors: [errorCodes.invalidAdminId] });
            return;
        }
      }

      res.status(500).json({ errors: ["internal-server-error"] });
    }
  });
};
