import { ymdToMonth } from "./ymdToMonth";

describe("ymdToMonth", () => {
  it("should return August for August 1st", () => {
    const result = ymdToMonth("2022-08-01");
    expect(result).toBe("August");
  });
  it("should return August for August 31st", () => {
    const result = ymdToMonth("2022-08-31");
    expect(result).toBe("August");
  });
});
