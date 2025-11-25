import { ensureTz } from "./place";
import { Place } from "@versa/schema";

describe("ensureTz", () => {
  it("should add timezone when lat/lon are present and tz is missing", () => {
    const place: Place = {
      address: {
        lat: 40.7128,
        lon: -74.006,
      },
    };

    const result = ensureTz(place);

    expect(result.address?.tz).toBe("America/New_York");
  });

  it("should not overwrite existing timezone", () => {
    const place: Place = {
      address: {
        lat: 40.7128,
        lon: -74.006,
        tz: "America/Chicago",
      },
    };

    const result = ensureTz(place);

    expect(result.address?.tz).toBe("America/Chicago");
  });

  it("should return place unchanged when lat is missing", () => {
    const place: Place = {
      address: {
        lon: -74.006,
      },
    };

    const result = ensureTz(place);

    expect(result.address?.tz).toBeUndefined();
  });

  it("should return place unchanged when lon is missing", () => {
    const place: Place = {
      address: {
        lat: 40.7128,
      },
    };

    const result = ensureTz(place);

    expect(result.address?.tz).toBeUndefined();
  });

  it("should return place unchanged when address is missing", () => {
    const place: Place = {};

    const result = ensureTz(place);

    expect(result.address).toBeUndefined();
  });

  it("should handle Los Angeles coordinates", () => {
    const place: Place = {
      address: {
        lat: 34.0522,
        lon: -118.2437,
      },
    };

    const result = ensureTz(place);

    expect(result.address?.tz).toBe("America/Los_Angeles");
  });

  it("should handle London coordinates", () => {
    const place: Place = {
      address: {
        lat: 51.5074,
        lon: -0.1278,
      },
    };

    const result = ensureTz(place);

    expect(result.address?.tz).toBe("Europe/London");
  });

  it("should handle Tokyo coordinates", () => {
    const place: Place = {
      address: {
        lat: 35.6762,
        lon: 139.6503,
      },
    };

    const result = ensureTz(place);

    expect(result.address?.tz).toBe("Asia/Tokyo");
  });

  it("should return the same place object reference", () => {
    const place: Place = {
      address: {
        lat: 40.7128,
        lon: -74.006,
      },
    };

    const result = ensureTz(place);

    expect(result).toBe(place);
  });
});
