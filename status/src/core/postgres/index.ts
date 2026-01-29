import { Container } from "@core/docker/container";

import { container } from "./container";
import { server, PostgresServer } from "./server";

export const postgres = new (class {
  constructor(
    public container: Container,
    public server: PostgresServer
  ) {}
})(container, server);
