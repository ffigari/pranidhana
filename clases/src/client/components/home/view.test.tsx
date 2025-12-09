/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { HomeView } from "./view";

describe("HomeView", () => {
  test("shows 'Ver mis clases' button for logged in teachers", () => {
    const user = {
      id: "123",
      username: "teacher-user",
      isTeacher: true,
    };

    render(<HomeView user={user} />);

    expect(screen.getByText("Ver mis clases")).toBeInTheDocument();
    expect(screen.queryByText("Registrate como profe")).not.toBeInTheDocument();
  });

  test("shows 'Registrate como profe' button for logged in non-teachers", () => {
    const user = {
      id: "123",
      username: "regular-user",
      isTeacher: false,
    };

    render(<HomeView user={user} />);

    expect(screen.getByText("Registrate como profe")).toBeInTheDocument();
    expect(screen.queryByText("Ver mis clases")).not.toBeInTheDocument();
  });

  test("shows 'Registrate como profe' button for logged out users", () => {
    render(<HomeView user={null} />);

    expect(screen.getByText("Registrate como profe")).toBeInTheDocument();
    expect(screen.queryByText("Ver mis clases")).not.toBeInTheDocument();
  });
});
