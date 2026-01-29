import { Container } from "@core/docker/container";

import { App } from "./app";

const name = "bin-paste";

export const binPaste = new App(name, new Container(name));
