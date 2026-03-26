import { docker, ImageName } from "./";

import { ContainerName } from "@domain/docker"
import { errorMessage } from "@domain/errors"

export class Container {
  constructor(public name: ContainerName) {}

  async isUp(): Promise<boolean> {
    try {
      const containers = await docker.sdk.listContainers();

      const container = containers.find((c) =>
        c.Names.some((name) => name === `/${this.name}` || name === this.name)
      );

      return container !== undefined && container.State === "running";
    } catch (error) {
      return false;
    }
  }

  async exists(): Promise<boolean> {
    try {
      const container = docker.sdk.getContainer(this.name);
      await container.inspect();
      return true;
    } catch (err: any) {
      if (err.statusCode === 404) {
        return false;
      }
      throw err;
    }
  }

  async start(): Promise<void> {
    if (!(await this.exists())) {
      throw new Error(`Container '${this.name}' does not exist`);
    }

    try {
      const container = docker.sdk.getContainer(this.name);
      await container.start();
    } catch (err) {
      throw new Error(`Failed to start container '${this.name}': ${errorMessage(err)}`);
    }
  }

  isDeployedWith(_imageName: ImageName): boolean {
    throw new Error("not implemented")
    return false
  }
}
