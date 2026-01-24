// @vitest-environment happy-dom

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { NewEntry } from "./NewEntry";
import { API } from "./types";
import { Navigator } from "@web-ui/types";

describe("NewEntry", () => {
    it("should render input box on first render", () => {
        const mockApi: API = {
            create: vi.fn(),
        };
        const mockNavigator: Navigator = {
            navigate: vi.fn(),
        };

        render(<NewEntry api={mockApi} navigator={mockNavigator} />);

        expect(
            screen.getByPlaceholderText("Enter your text here...")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /submit/i })
        ).toBeInTheDocument();
    });

    it("should call api.create on submit and navigate on success", async () => {
        const user = userEvent.setup();
        const mockCreate = vi.fn().mockResolvedValue("test-id-123");
        const mockNavigate = vi.fn();
        const mockApi: API = {
            create: mockCreate,
        };
        const mockNavigator: Navigator = {
            navigate: mockNavigate,
        };

        render(<NewEntry api={mockApi} navigator={mockNavigator} />);

        const textarea = screen.getByPlaceholderText("Enter your text here...");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(textarea, "Hello world");
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreate).toHaveBeenCalledWith({ text: "Hello world" });
            expect(mockNavigate).toHaveBeenCalledWith("/entries/test-id-123");
        });
    });

    it("should display error box when api.create throws an error", async () => {
        const user = userEvent.setup();
        const mockCreate = vi
            .fn()
            .mockRejectedValue(new Error("Network error"));
        const mockNavigate = vi.fn();
        const mockApi: API = {
            create: mockCreate,
        };
        const mockNavigator: Navigator = {
            navigate: mockNavigate,
        };

        render(<NewEntry api={mockApi} navigator={mockNavigator} />);

        const textarea = screen.getByPlaceholderText("Enter your text here...");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(textarea, "Test content");
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "Network error"
            );
        });

        expect(mockCreate).toHaveBeenCalledWith({ text: "Test content" });
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
