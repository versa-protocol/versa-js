import { compareSchemaVersions } from "./schemaVersion";

describe("schema version helper functions", () => {
  /// Uses sorting rules (-1 indicates the base version should come before the comparison version)
  it("should tell an older version from a newer version and vice versa", () => {
    expect(compareSchemaVersions("1.2.0", "1.3.0")).toBe(-1);
    expect(compareSchemaVersions("1.3.0", "1.2.0")).toBe(1);
  });

  it("should tell the same version from the same version", () => {
    expect(compareSchemaVersions("1.2.0", "1.2.0")).toBe(0);
  });
  it("should treat an empty string as 0", () => {
    expect(compareSchemaVersions("1.2.0", "1..0")).toBe(1);
  });
});
