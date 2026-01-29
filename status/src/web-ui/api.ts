import { Status, StatusDTO, parseStatusDTO } from "@domain/status";

export class API {
  private baseURL: string;

  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }

  async getStatus(): Promise<Status> {
    const response = await fetch(`${this.baseURL}/api/status`);
    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }
    const dto = (await response.json()) as StatusDTO;
    return parseStatusDTO(dto);
  }
}

export const api = new API();
