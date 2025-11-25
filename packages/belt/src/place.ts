import { Place } from "@versa/schema";
import find from "@photostructure/tz-lookup";

export function ensureTz(place: Place): Place {
  if (place.address?.lat && place.address?.lon && !place.address.tz) {
    const tz = find(place.address.lat, place.address.lon);
    place.address.tz = tz;
  }
  return place;
}
