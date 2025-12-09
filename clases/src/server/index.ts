import { Class, PaginatedClasses } from "@shared/class";
import { Teacher } from "@shared/teachers";

import { createWebServer } from "./api";

class HardcodedClasses {
  private teacher1 = new Teacher(1);
  private teacher2 = new Teacher(2);
  private teacher3 = new Teacher(3);

  get(filters: {
    limit: number;
    cursor?: string;
    includeTeachers?: boolean;
  }): PaginatedClasses {
    if (filters.cursor === "a1") {
      return new PaginatedClasses(
        [
          new Class(3, filters.includeTeachers ? [this.teacher1] : undefined),
          new Class(
            4,
            filters.includeTeachers ? [this.teacher2, this.teacher3] : undefined
          ),
        ],
        "a2",
        true
      );
    }

    if (filters.cursor === "a2") {
      return new PaginatedClasses(
        [
          new Class(5, undefined),
          new Class(6, filters.includeTeachers ? [this.teacher2] : undefined),
        ],
        "a3",
        false
      );
    }

    return new PaginatedClasses(
      [
        new Class(
          1,
          filters.includeTeachers ? [this.teacher1, this.teacher2] : undefined
        ),
        new Class(2, filters.includeTeachers ? [this.teacher3] : undefined),
      ],
      "a1",
      true
    );
  }
}

const port = 3000;
createWebServer(new HardcodedClasses()).listen(port, () => {
  console.log(`starting "clases" at port ${port}`);
});
