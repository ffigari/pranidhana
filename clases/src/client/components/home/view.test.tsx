/**
 * @vitest-environment jsdom
 */
import { User } from "@shared/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { HomeView } from "./view";

vi.mock("../../shared/me", async () => {
  const actual = await vi.importActual("../../shared/me");
  return {
    ...actual,
    useMe: vi.fn(() => ({ status: "unauthenticated" })),
  };
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe("HomeView", () => {
  test("shows 'Ver mis clases' button for logged in teachers", () => {
    const fetchedUser = {
      status: "authenticated" as const,
      user: {
        id: "123",
        username: "teacher-user",
        teacher: {},
      } as User,
    };

    renderWithQueryClient(<HomeView fetchedUser={fetchedUser} />);

    expect(screen.getByText("Ver mis clases")).toBeInTheDocument();
    expect(screen.queryByText("Registrate como profe")).not.toBeInTheDocument();
  });

  test("shows 'Registrate como profe' button for logged in non-teachers", () => {
    const fetchedUser = {
      status: "authenticated" as const,
      user: {
        id: "123",
        username: "regular-user",
        teacher: null,
      } as User,
    };

    renderWithQueryClient(<HomeView fetchedUser={fetchedUser} />);

    expect(screen.getByText("Registrate como profe")).toBeInTheDocument();
    expect(screen.queryByText("Ver mis clases")).not.toBeInTheDocument();
  });

  test("shows 'Registrate como profe' button for logged out users", () => {
    const fetchedUser = {
      status: "unauthenticated" as const,
    };

    renderWithQueryClient(<HomeView fetchedUser={fetchedUser} />);

    expect(screen.getByText("Registrate como profe")).toBeInTheDocument();
    expect(screen.queryByText("Ver mis clases")).not.toBeInTheDocument();
  });
});
