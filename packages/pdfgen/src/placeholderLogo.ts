import type { Receipt } from "@versa/schema";
import {
  airPngBase64,
  busPngBase64,
  carPngBase64,
  ferryPngBase64,
  lodgingPngBase64,
  railPngBase64,
  taxiPngBase64,
} from "./placeholderPngData";

/** Base64 PNG for the header when no merchant/third-party logo URL is present. */
export function getPlaceholderLogoBase64(receipt: Receipt): string | null {
  const item = receipt.itemization;
  if (item.flight) return airPngBase64;
  if (item.lodging) return lodgingPngBase64;
  if (item.car_rental) return carPngBase64;
  if (item.transit_route?.transit_route_items?.length) {
    const mode = item.transit_route.transit_route_items[0].mode;
    if (mode === "car") return carPngBase64;
    if (mode === "taxi") return taxiPngBase64;
    if (mode === "rail") return railPngBase64;
    if (mode === "bus") return busPngBase64;
    if (mode === "ferry") return ferryPngBase64;
  }
  return null;
}
