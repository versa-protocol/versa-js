import {
  formatDateComparison,
  formatDateTime,
  formatUSD,
} from "@versaprotocol/belt";
import styles from "./itemized-flight.module.css";
import { lts } from "@versaprotocol/schema";

import { lts_v1_5_1 } from "@versaprotocol/belt";

const { aggregateTicketFares, organizeFlightTickets } = lts_v1_5_1;

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

export function ItemizedFlight({ flight }: { flight: lts.v1_5_1.Flight }) {
  return (
    <>
      {organizeFlightTickets(flight).map((t, index) => (
        <div key={`flight-${index}`} className={styles.flightWrap}>
          {t.itineraries.map((itinerary, itinerary_index) => (
            <div key={itinerary_index} className={styles.itineraryWrap}>
              <div className={styles.itineraryHead}>
                <div>
                  {!!itinerary.departure_at &&
                    formatDateTime(itinerary.departure_at)}
                </div>
                <span> - </span>
                <div className={styles.startAndEndCity}>
                  <span>{itinerary.departure_city}</span>
                  <span> to </span>
                  <span>{itinerary.arrival_city}</span>
                </div>
              </div>
              {itinerary.segments.map((s, index) => {
                let previousEpoch: number =
                  itinerary.segments[index - 1]?.arrival_at ||
                  itinerary.departure_at ||
                  0;
                let previousTz: string =
                  itinerary.segments[index - 1]?.arrival_tz ||
                  itinerary.departure_tz ||
                  "";
                return (
                  <div className={styles.segmentWrap} key={`segment-${index}`}>
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
                                {formatDateTime(
                                  s.departure_at,
                                  false,
                                  true,
                                  false,
                                  s.departure_tz
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={styles.inAir}>
                        <PlaneIcon />
                      </div>
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
                                {formatDateTime(
                                  s.arrival_at,
                                  false,
                                  true,
                                  false,
                                  s.arrival_tz
                                )}
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
                <div className={styles.value}>{p.passenger}</div>
              </div>
              <div>
                <div className={styles.key}>Fare</div>
                <div className={styles.value}>
                  {formatUSD(aggregateTicketFares(t) / 100)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
