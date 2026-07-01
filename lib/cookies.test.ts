import { describe, it, expect, beforeEach } from "vitest";
import { getCookie, setCookie, eraseCookie } from "./cookies";

describe("Cookies Helper Utilities", () => {
	beforeEach(() => {
		// Mock document.cookie in the Node test runner global scope
		const store: Record<string, string> = {};

		global.document = {
			get cookie() {
				return Object.entries(store)
					.map(([k, v]) => `${k}=${v}`)
					.join("; ");
			},
			set cookie(str: string) {
				const parts = str.split(";")[0].split("=");
				const key = parts[0].trim();
				const val = parts.slice(1).join("=").trim();

				// Handle cookie deletion by expiration date matching 1970
				if (str.includes("1970") || str.includes("Thu, 01 Jan 1970")) {
					delete store[key];
				} else {
					store[key] = val;
				}
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any;
	});

	it("should successfully set and retrieve a cookie", () => {
		setCookie("session_token", "jwt_example_xyz", 1);
		expect(getCookie("session_token")).toBe("jwt_example_xyz");
	});

	it("should return null for non-existent cookies", () => {
		expect(getCookie("non_existent")).toBeNull();
	});

	it("should correctly delete a cookie on eraseCookie", () => {
		setCookie("temp_cookie", "to_be_removed", 1);
		expect(getCookie("temp_cookie")).toBe("to_be_removed");

		eraseCookie("temp_cookie");
		expect(getCookie("temp_cookie")).toBeNull();
	});
});
