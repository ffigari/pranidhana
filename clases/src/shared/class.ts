import { Teacher } from "./teachers";

export class Class {
  constructor(
    public id: number,
    public teachers?: Teacher[]
  ) {}
}

export class PaginatedClasses {
  constructor(
    public page: Class[],
    public endCursor: string,
    public hasNextPage: boolean
  ) {}
}
