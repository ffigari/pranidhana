import { AppName } from "@domain/app";
import { Container } from "@core/docker/container";

export class App {
  constructor(
    public name: AppName,
    public container: Container
  ) {}
}
