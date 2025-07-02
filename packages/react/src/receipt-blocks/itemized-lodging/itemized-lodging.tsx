import { formatDateTime, formatPhoneNumber } from "@versa/belt";
import styles from "./itemized-lodging.module.css";
import { VersaContext } from "../../context";
import { Header, Lodging } from "@versa/schema";

export function ItemizedLodging({
  lodging,
  header,
  theme,
}: {
  lodging: Lodging;
  header: Header;
  theme: any;
}) {
  return (
    <VersaContext.Consumer>
      {(config) => (
        <>
          <div className={styles.lodgingWrap}>
            <div className={styles.lodgingBlock}>
              {lodging.location.image &&
                lodging.location?.address?.lon &&
                lodging.location?.address?.lat && (
                  <div className={styles.mapWrap}>
                    <div className={styles.photoImage}>
                      <img
                        src={lodging.location.image}
                        width={200}
                        height={140}
                        alt=""
                      />
                    </div>
                    {config?.mapbox_token && (
                      <div className={styles.mapImage}>
                        <img
                          src={`https://api.mapbox.com/styles/v1/mapbox/${
                            theme == "light" ? "light-v11" : "dark-v11"
                          }/static/pin-s+555555(${
                            lodging.location.address.lon
                          },${lodging.location.address.lat})/${
                            lodging.location.address.lon
                          },${
                            lodging.location.address.lat
                          },14,0/200x140@2x?logo=false&attribution=false&access_token=${
                            config.mapbox_token
                          }`}
                          width={200}
                          height={140}
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                )}
              <div
                className={
                  lodging.location.image &&
                  lodging.location?.address?.lon &&
                  lodging.location?.address?.lat
                    ? styles.localBusinessProfile
                    : styles.localBusinessProfileNoLodgingHeader
                }
              >
                <div className={styles.locationName}>
                  {lodging.location.name}
                </div>
                <div>
                  {lodging.location?.address?.street_address}
                  <br />
                  {lodging.location?.address?.city},{" "}
                  {lodging.location?.address?.region}{" "}
                  {lodging.location?.address?.postal_code}
                </div>
                {lodging.location?.phone && (
                  <div>{formatPhoneNumber(lodging.location.phone)}</div>
                )}
                {lodging.room && <div>Room number: {lodging.room}</div>}
                <div className={styles.dateRange}>
                  <div className={styles.start}>
                    <div className={styles.header}>Check-in</div>
                    <div className={styles.time}>
                      {formatDateTime(lodging.check_in, {
                        includeDOW: true,
                        iataTimezone:
                          lodging.location?.address?.tz ||
                          header.location?.address?.tz ||
                          null,
                      })}
                    </div>
                  </div>
                  <div className={styles.end}>
                    <div className={styles.header}>Checkout</div>
                    <div className={styles.time}>
                      {formatDateTime(lodging.check_out, {
                        includeDOW: true,
                        iataTimezone:
                          lodging.location?.address?.tz ||
                          header.location?.address?.tz ||
                          null,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </VersaContext.Consumer>
  );
}
