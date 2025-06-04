import {
  formatDateTime,
  formatTime,
  formatTransactionValue,
  Optional,
  sameDay,
} from "@versaprotocol/belt";
import styles from "./itemized-transit-route.module.css";
import {
  Metadatum,
  Receipt,
  TransitRoute,
  Person,
} from "@versaprotocol/schema";
import { organizeTransitRoutes } from "@versaprotocol/belt";
import { VersaContext } from "../../context";

function formatPassengerName(passenger: Optional<Person>): string {
  if (!passenger) return "";
  if (typeof passenger === "string") return passenger;

  // Handle Person object
  const parts = [];
  if (passenger.preferred_first_name) {
    parts.push(passenger.preferred_first_name);
  } else if (passenger.first_name) {
    parts.push(passenger.first_name);
  }
  if (passenger.last_name) {
    parts.push(passenger.last_name);
  }

  return parts.join(" ") || passenger.email || "";
}

export function ItemizedTransitRoute({
  transit_route,
  header,
  theme,
}: {
  transit_route: TransitRoute;
  header: Receipt["header"];
  theme: any;
}) {
  const multi = transit_route.transit_route_items.length > 1;
  let allSameDay = true;
  for (let i = 0; i < transit_route.transit_route_items.length; i++) {
    if (
      !sameDay(
        header.invoiced_at,
        transit_route.transit_route_items[i].departure_at || 0
      )
    ) {
      allSameDay = false;
      break;
    }
    if (
      !sameDay(
        header.invoiced_at,
        transit_route.transit_route_items[i].arrival_at || 0
      )
    ) {
      allSameDay = false;
      break;
    }
  }
  return (
    <VersaContext.Consumer>
      {(config) => (
        <>
          {organizeTransitRoutes(transit_route).map((item, index) => (
            <div className={styles.routeOutter} key={index}>
              {!multi &&
                config?.mapbox_token &&
                item.departure_location?.address &&
                item.arrival_location?.address && (
                  <div className={styles.routeWrap}>
                    <img
                      src={`https://api.mapbox.com/styles/v1/mapbox/${
                        theme == "light" ? "light-v11" : "dark-v11"
                      }/static/pin-s+555555(${
                        item.departure_location.address.lon
                      },${item.departure_location.address.lat}),pin-s+555555(${
                        item.arrival_location.address.lon
                      },${item.arrival_location.address.lat}),path-4(${
                        item.polyline
                      })/auto/400x200@2x?padding=30&logo=false&attribution=false&access_token=${
                        config.mapbox_token
                      }`}
                      width={400}
                      height={200}
                      alt=""
                    />
                  </div>
                )}
              <div className={styles.routeDescription}>
                <div className={styles.fromTo}>
                  <div className={styles.routePoint}>
                    <div className={styles.routeAddress}>
                      <div className={styles.routeLabel}>From</div>
                      {item.departure_location?.name && (
                        <>{item.departure_location.name}, </>
                      )}
                      {item.departure_location?.address &&
                        item.arrival_location?.address && (
                          <>
                            {item.departure_location.address.street_address},{" "}
                            {item.departure_location.address.city},{" "}
                            {item.departure_location.address.region}{" "}
                          </>
                        )}
                      {item.departure_at && (
                        <>
                          {allSameDay ? (
                            <span className={styles.time}>
                              {formatTime(item.departure_at)}
                            </span>
                          ) : (
                            <div className={styles.datetime}>
                              {formatDateTime(item.departure_at, {
                                includeTime: true,
                                iataTimezone:
                                  item.departure_location?.address?.tz ||
                                  header.location?.address?.tz ||
                                  null,
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.routePoint}>
                    <div className={styles.routeAddress}>
                      <div className={styles.routeLabel}>To</div>{" "}
                      {item.arrival_location?.name && (
                        <>{item.arrival_location.name}, </>
                      )}
                      {item.arrival_location?.address &&
                        item.arrival_location?.address && (
                          <>
                            {item.arrival_location.address.street_address},{" "}
                            {item.arrival_location.address.city},{" "}
                            {item.arrival_location.address.region}{" "}
                          </>
                        )}
                      {item.arrival_at && (
                        <>
                          {allSameDay ? (
                            <span className={styles.time}>
                              {formatTime(item.arrival_at)}
                            </span>
                          ) : (
                            <div className={styles.datetime}>
                              {formatDateTime(item.arrival_at, {
                                includeTime: true,
                                iataTimezone:
                                  item.arrival_location?.address?.tz ||
                                  header.location?.address?.tz ||
                                  null,
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.keyValuePairs}>
                  {item.passenger_count > 1 && (
                    <div className={styles.row}>
                      <div className={styles.key}>Passengers</div>
                      <div className={styles.value}>{item.passenger_count}</div>
                    </div>
                  )}
                  {item.shared_metadata &&
                    item.shared_metadata.map((m: Metadatum, index) => (
                      <div className={styles.row} key={index}>
                        <div className={styles.key}>{m.key}</div>
                        <div className={styles.value}>{m.value}</div>
                      </div>
                    ))}
                  {item.passenger_count == 1 && (
                    <>
                      <div className={styles.row}>
                        <div className={styles.key}>Trip Fare</div>
                        <div className={styles.value}>
                          {formatTransactionValue(
                            item.passengers[0].fare,
                            header.currency
                          )}
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.key}>Passenger</div>
                        <div className={styles.value}>
                          {formatPassengerName(item.passengers[0].passenger)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {item.passenger_count > 1 && (
                  <>
                    {item.passengers.map((item, index) => (
                      <div
                        key={index}
                        className={styles.passengerKeyValuePairs}
                      >
                        {item.passenger && (
                          <div className={styles.row}>
                            <div className={styles.key}>Passenger</div>
                            <div className={styles.value}>
                              {formatPassengerName(item.passenger)}
                            </div>
                          </div>
                        )}
                        {item.passenger_metadata &&
                          item.passenger_metadata.map((m: Metadatum, index) => (
                            <div className={styles.row} key={index}>
                              <div className={styles.key}>{m.key}</div>
                              <div className={styles.value}>{m.value}</div>
                            </div>
                          ))}
                        <div className={styles.row}>
                          <div className={styles.key}>Fare</div>
                          <div className={styles.value}>
                            {formatTransactionValue(item.fare, header.currency)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </VersaContext.Consumer>
  );
}
