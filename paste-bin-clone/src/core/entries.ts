import { Entry } from "@domain/entry";

export class Entries {
  getByID(_id: string): Entry | null {
    return {
      text: "foo, hardcoded entry",
      createdAt: new Date(),
    };
  }
}
