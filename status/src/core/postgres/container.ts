import { Container } from "@core/docker/container";

import { postgresContainerName } from "@domain/postgres"

export const container = new Container(postgresContainerName);
