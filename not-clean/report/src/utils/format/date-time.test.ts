import { describe, expect, test } from "vitest";
import { ExtractOnlyDate } from "./date-time";

describe("ExtractOnlyDate", () => {
  test("should return the same date as yyyy-MM-dd", () => {
    expect(ExtractOnlyDate("2025-01-31")).toBe("2025-01-31");
  });

  test("should return the yyyy-MM-dd from yyyy-MM-dd with T00:00:00 (UTC)", () => {
    expect(ExtractOnlyDate("2025-01-31T16:25:20.603Z")).toBe("2025-01-31");
  });

  test("should return the yyyy-MM-dd from yyyy-MM-dd with T04:00:00", () => {
    expect(ExtractOnlyDate("2025-01-31T04:00:00.000Z")).toBe("2025-01-31");
  });

  test("should return the yyyy-MM-dd from yyyy-MM-dd with T20:00:00", () => {
    expect(ExtractOnlyDate("2025-01-31T20:00:00.000Z")).toBe("2025-01-31");
  });
});
