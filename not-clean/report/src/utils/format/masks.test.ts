import { describe, expect, test } from "vitest";
import { fmtKeepOnlyNumbers } from "./masks";

describe("fmtKeepOnlyNumbers", () => {
  test("it should keep only numbers as string", () => {
    expect(fmtKeepOnlyNumbers("123.456.789-93")).toBe("12345678993");
  });
  test("it should accept numeric input and always return string", () => {
    expect(fmtKeepOnlyNumbers(123)).toBe("123");
  });
});
