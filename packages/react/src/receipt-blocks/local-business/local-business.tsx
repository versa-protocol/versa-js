import styles from "./local-business.module.css";
import { Place } from "@versaprotocol/schema";
import { VersaContext } from "../../context";

export function LocalBusiness({
  location,
  theme,
  brandColor: _brandColor,
}: {
  location: Place;
  theme: any;
  brandColor: any;
}) {
  return (
    <VersaContext.Consumer>
      {(config) => (
        <>
          <div className={styles.localBusinessWrap}>
            <div className={styles.localBusiness}>
              <div>
                {location.address && (
                  <div className={styles.mapWrap}>
                    {config?.mapbox_token && (
                      <img
                        src={`https://api.mapbox.com/styles/v1/mapbox/${
                          theme == "light" ? "light-v11" : "dark-v11"
                        }/static/pin-s+555555(${location.address.lon},${
                          location.address.lat
                        })/${location.address.lon},${
                          location.address.lat
                        },14,0/400x140@2x?logo=false&attribution=false&access_token=${
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
                  <div>{location.phone}</div>
                  {/* <div>
              <span
                style={{
                  color: brandColor,
                }}
              >
                {location.hours_summary}
              </span>{" "}
              &nbsp;·&nbsp;{" "}
              <span className={styles.modifierText}>Show more</span>
            </div> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </VersaContext.Consumer>
  );
}
