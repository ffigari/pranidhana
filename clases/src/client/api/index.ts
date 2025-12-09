import { PaginatedClasses } from "@shared/class";
import axios from "axios";

export class API {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getClasses(
    cursor: string | null,
    includeTeachers: boolean
  ): Promise<PaginatedClasses> {
    let params: { limit: number; cursor?: string; include?: string } = {
      limit: 2,
    };

    if (cursor) {
      params.cursor = cursor;
    }

    if (includeTeachers) {
      params.include = "teachers";
    }

    const response = await axios.get(`${this.baseURL}/api/classes`, { params });

    return response.data;
  }
}
