import {
  formatDateComparison,
  formatDateTime,
  formatTransactionValue,
  lts_v1_11_0,
} from "@versa/belt";
import styles from "../../../../receipt-blocks/itemized-flight/itemized-flight.module.css";
import { lts } from "@versa/schema";

function PlaneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 -960 960 960"
    >
      <path d="M340-80v-60l80-60v-220L80-320v-80l340-200v-220q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v220l340 200v80L540-420v220l80 60v60l-140-40-140 40z"></path>
    </svg>
  );
}

export function ItemizedFlight({
  flight,
  header,
}: {
  flight: lts.v1_11_0.Flight;
  header: lts.v1_11_0.Receipt["header"];
}) {
  return (
    <>
      {lts_v1_11_0.organizeFlightTickets(flight).map((t, index) => (
        <div key={`flight-${index}`} className={styles.flightWrap}>
          {t.itineraries.map((itinerary, itinerary_index) => (
            <div key={itinerary_index} className={styles.itineraryWrap}>
              <div className={styles.itineraryHead}>
                {!!itinerary.departure_at && (
                  <span>{formatDateTime(itinerary.departure_at)} - </span>
                )}
                <span>
                  {itinerary.departure_city} to {itinerary.arrival_city}
                </span>
              </div>
              {itinerary.segments.map((s, index) => {
                const previousEpoch: number =
                  itinerary.segments[index - 1]?.arrival_at ||
                  itinerary.departure_at ||
                  0;
                const previousTz: string =
                  itinerary.segments[index - 1]?.arrival_tz ||
                  itinerary.departure_tz ||
                  "";
                return (
                  <div className={styles.segmentWrap} key={`segment-${index}`}>
                    <div className={styles.inAir}>
                      <div className={styles.line}></div>
                      <PlaneIcon />
                    </div>
                    <div className={styles.segment}>
                      <div className={styles.location}>
                        <div>{s.departure_airport_code}</div>
                        {s.departure_at && (
                          <div className={styles.time}>
                            {itinerary.departure_at &&
                            itinerary.departure_tz &&
                            s.departure_tz ? (
                              <>
                                {formatDateComparison(
                                  itinerary.departure_at,
                                  itinerary.departure_tz,
                                  previousEpoch,
                                  previousTz,
                                  s.departure_at,
                                  s.departure_tz
                                )}
                              </>
                            ) : (
                              <>
                                {formatDateTime(s.departure_at, {
                                  includeTime: true,
                                  iataTimezone: s.departure_tz,
                                })}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={styles.stretcher}></div>
                      <div className={styles.location}>
                        <div>{s.arrival_airport_code}</div>
                        {s.arrival_at && (
                          <div className={styles.time}>
                            {itinerary.departure_at &&
                            itinerary.departure_tz &&
                            s.arrival_tz ? (
                              <>
                                {formatDateComparison(
                                  itinerary.departure_at,
                                  itinerary.departure_tz,
                                  previousEpoch,
                                  previousTz,
                                  s.arrival_at,
                                  s.arrival_tz
                                )}
                              </>
                            ) : (
                              <>
                                {formatDateTime(s.arrival_at, {
                                  includeTime: true,
                                  iataTimezone: s.arrival_tz,
                                })}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {t.passenger_count > 1 && (
            <div className={styles.keyValuePairs}>
              <div className={styles.row}>
                <div className={styles.key}>Passengers</div>
                <div className={styles.value}>{t.passenger_count}</div>
              </div>
            </div>
          )}
          {t.passengers.map((p, index) => (
            <div key={index} className={styles.passengerKeyValuePairs}>
              <div>
                <div className={styles.key}>Passenger</div>
                <div className={styles.value}>{p.passenger || ""}</div>
              </div>
              {p.passenger_metadata.map((m, metadataindex) => {
                return (
                  <div key={metadataindex}>
                    <div className={styles.key}>{m.key}</div>
                    <div className={styles.value}>{m.value}</div>
                  </div>
                );
              })}
              <div>
                <div className={styles.key}>Fare</div>
                <div className={styles.value}>
                  {formatTransactionValue(p.fare, header.currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
