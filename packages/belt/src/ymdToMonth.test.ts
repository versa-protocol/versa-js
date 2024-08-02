import { ymdToMonth } from "./ymdToMonth";

describe("ymdToMonth", () => {
  it("should return August for August 1st", () => {
    let result = ymdToMonth("2022-08-01");
    expect(result).toBe("August");
  });
  it("should return August for August 31st", () => {
    let result = ymdToMonth("2022-08-31");
    expect(result).toBe("August");
  });
});
