import { formatDateTime } from "@versaprotocol/belt";
import styles from "./itemized-lodging.module.css";
import { VersaContext } from "../../context";

export function ItemizedLodging({ data, theme }: { data: any; theme: any }) {
  return (
    <VersaContext.Consumer>
      {(config) => (
        <>
          {data.lodging_items.map((data: any) => (
            <div className={styles.lodgingWrap}>
              <div className={styles.lodgingBlock}>
                {data.location.image &&
                  data.location.address.lon &&
                  data.location.address.lat && (
                    <div className={styles.mapWrap}>
                      <div className={styles.photoImage}>
                        <img
                          src={data.location.image}
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
                              data.location.address.lon
                            },${data.location.address.lat})/${
                              data.location.address.lon
                            },${
                              data.location.address.lat
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
                    data.location.image &&
                    data.location.address.lon &&
                    data.location.address.lat
                      ? styles.localBusinessProfile
                      : styles.localBusinessProfileNoLodgingHeader
                  }
                >
                  <div className={styles.locationName}>
                    {data.location.name}
                  </div>
                  <div>
                    {data.location.address.street_address}
                    <br />
                    {data.location.address.city}, {data.location.address.region}{" "}
                    {data.location.address.postal_code}
                  </div>
                  <div>{data.phone}</div>
                  {data.room && <div>Room number: {data.room}</div>}
                  <div className={styles.dateRange}>
                    <div className={styles.start}>
                      <div className={styles.header}>Check-in</div>
                      <div className={styles.time}>
                        {formatDateTime(data.check_in, false, false, true)}
                      </div>
                    </div>
                    <div className={styles.end}>
                      <div className={styles.header}>Checkout</div>
                      <div className={styles.time}>
                        {formatDateTime(data.check_out, false, false, true)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </VersaContext.Consumer>
  );
}
