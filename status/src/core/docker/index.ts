import Docker from "dockerode";

export type ImageName = string

export const docker = new (class {
  public sdk: Docker;

  constructor() {
    this.sdk = new Docker();
  }

  async isUp(): Promise<boolean> {
    try {
      await this.sdk.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
})();
