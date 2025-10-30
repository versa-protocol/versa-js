export interface StructuredAddress {
  street_address?: string;
  city?: string;
  region?: string;
  country?: string;
  postal_code?: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Geocode using Mapbox Geocoding v6 structured input.
 * Maps our address fields to Mapbox params: address_line1, place, region, postcode, country.
 */
export async function geocodeAddressToCoordinates(
  address: StructuredAddress,
  accessToken: string,
  options?: { signal?: AbortSignal }
): Promise<Coordinates | null> {
  const hasAnyField = Boolean(
    address.street_address ||
      address.city ||
      address.region ||
      address.postal_code ||
      address.country
  );
  if (!hasAnyField) return null;

  const url = new URL("https://api.mapbox.com/search/geocode/v6/forward");
  // Structured input params per Mapbox Geocoding v6
  if (address.street_address)
    url.searchParams.set("address_line1", address.street_address);
  if (address.city) url.searchParams.set("place", address.city);
  if (address.region) url.searchParams.set("region", address.region);
  if (address.postal_code)
    url.searchParams.set("postcode", address.postal_code);
  if (address.country) url.searchParams.set("country", address.country);
  url.searchParams.set("limit", "1");
  url.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(url.toString(), {
      signal: options?.signal,
    });
    if (!response.ok) return null;
    const data = await response.json();
    const feature = data?.features?.[0];
    const coordinates: number[] | undefined = feature?.geometry?.coordinates;
    if (
      Array.isArray(coordinates) &&
      coordinates.length >= 2 &&
      typeof coordinates[0] === "number" &&
      typeof coordinates[1] === "number"
    ) {
      return { lon: coordinates[0], lat: coordinates[1] };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Factory for a composable geocoder function bound to an access token.
 */
export function createMapboxGeocoder(accessToken: string) {
  return (address: StructuredAddress, options?: { signal?: AbortSignal }) =>
    geocodeAddressToCoordinates(address, accessToken, options);
}
