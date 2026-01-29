import { Container } from "@core/docker/container";

import { App } from "./app";

const name = "web-personal";

export const webPersonal = new App(name, new Container(name));
