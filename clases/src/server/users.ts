import { Express } from "express";

import { getUsers } from "./persistence/user";

export const users = (app: Express) => {
  app.get("/users", async (req, res) => {
    const usernameContains = req.query.usernameContains as string | undefined;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : undefined;
    const cursor = (req.query.cursor as string | undefined) || null;
    const getTeachersInfo = req.query.getTeachersInfo === "true";
    const onlyTeachers = req.query.onlyTeachers === "true";

    const result = await getUsers(
      { usernameContains, onlyTeachers },
      { pageSize, cursor, getTeachersInfo }
    );

    res.json(result);
  });
};
