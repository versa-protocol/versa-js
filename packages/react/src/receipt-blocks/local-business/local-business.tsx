import styles from "./local-business.module.css";
import { Place } from "@versa/schema";
import { VersaContext } from "../../context";
import { formatPhoneNumber } from "@versa/belt";
import { useContext, useEffect, useState } from "react";
import { Coordinates, createMapboxGeocoder } from "../../helpers/geocoding";

export function LocalBusiness({
  location,
  theme,
  brandColor: _brandColor,
}: {
  location: Place;
  theme: any;
  brandColor: any;
}) {
  const config = useContext(VersaContext);
  const [resolvedCoords, setResolvedCoords] = useState<Coordinates | null>(
    null
  );

  useEffect(() => {
    if (!location.address) return;
    const hasLatLon =
      typeof location.address.lat === "number" &&
      typeof location.address.lon === "number";
    if (hasLatLon) return; // prefer existing coordinates
    if (!config?.mapbox_token) return;

    const hasStreetAndPostal = Boolean(
      location.address.street_address && location.address.postal_code
    );
    if (!hasStreetAndPostal) return;

    const controller = new AbortController();
    const geocode = createMapboxGeocoder(config.mapbox_token);
    geocode(
      {
        street_address: location.address.street_address || undefined,
        city: location.address.city || undefined,
        region: (location.address.region as string) || undefined,
        country: (location.address.country as string) || undefined,
        postal_code: location.address.postal_code || undefined,
      },
      { signal: controller.signal }
    )
      .then((coords) => setResolvedCoords(coords))
      .catch(() => setResolvedCoords(null));

    return () => controller.abort();
  }, [location.address, config?.mapbox_token]);

  const displayLat =
    resolvedCoords?.lat ?? (location.address?.lat as number | undefined);
  const displayLon =
    resolvedCoords?.lon ?? (location.address?.lon as number | undefined);

  const shouldRenderMap =
    !!displayLat &&
    typeof displayLat === "number" &&
    !!displayLon &&
    typeof displayLon === "number";

  return (
    <>
      <div className={styles.localBusinessWrap}>
        <div className={styles.localBusiness}>
          <div>
            {shouldRenderMap && (
              <div className={styles.mapWrap}>
                {config?.mapbox_token && (
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/${
                      theme == "light" ? "light-v11" : "dark-v11"
                    }/static/pin-s+555555(${displayLon},${displayLat})/${displayLon},${displayLat},14,0/400x140@2x?logo=false&attribution=false&access_token=${
                      config.mapbox_token
                    }`}
                    width={400}
                    height={140}
                    alt=""
                  />
                )}
              </div>
            )}
            <div className={styles.localBusinessProfile}>
              {location.address && (
                <div>
                  {location.address.street_address}
                  <br />
                  {location.address.city}, {location.address.region}{" "}
                  {location.address.postal_code}
                </div>
              )}
              {location.phone && <div>{formatPhoneNumber(location.phone)}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
