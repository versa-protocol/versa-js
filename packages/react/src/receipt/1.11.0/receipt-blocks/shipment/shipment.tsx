import { Circle } from "react-feather";
import styles from "../../../../receipt-blocks/shipment/shipment.module.css";
import { formatDateTime, Optional } from "@versa/belt";
import { lts } from "@versa/schema";

export function ShipmentWidget({
  data,
  header,
  brandColor,
}: {
  data: lts.v1_11_0.Shipment[];
  header: lts.v1_11_0.Receipt["header"];
  brandColor: any;
}) {
  return (
    <div className={styles.shipmentWrap}>
      {data.map((s, index: number) => {
        const showDestination = !!(
          s.destination_address?.city || s.destination_address?.region
        );
        return (
          <div className={styles.shipmentCard} key={index}>
            <div className={styles.subwayWrap}>
              <div className={styles.subwayGrid}>
                <div className={styles.status}>
                  <div className={styles.leftStem}></div>
                  <Circle
                    size={18}
                    style={{
                      fill:
                        statusLevel(s.shipment_status) > 0
                          ? brandColor
                          : "var(--background)",
                      stroke:
                        statusLevel(s.shipment_status) > 0
                          ? brandColor
                          : "var(--light-stroke)",
                    }}
                  />
                  <div
                    className={styles.rightStem}
                    style={{
                      backgroundColor:
                        statusLevel(s.shipment_status) > 0
                          ? brandColor
                          : "var(--light-stroke)",
                    }}
                  ></div>
                </div>
                <div className={styles.status}>
                  <div
                    className={styles.leftStem}
                    style={{
                      backgroundColor:
                        statusLevel(s.shipment_status) > 1
                          ? brandColor
                          : "var(--light-stroke)",
                    }}
                  ></div>
                  <Circle
                    size={18}
                    style={{
                      fill:
                        statusLevel(s.shipment_status) > 1
                          ? brandColor
                          : "var(--background)",
                      stroke:
                        statusLevel(s.shipment_status) > 1
                          ? brandColor
                          : "var(--light-stroke)",
                    }}
                  />
                  <div
                    className={styles.rightStem}
                    style={{
                      backgroundColor:
                        statusLevel(s.shipment_status) > 1
                          ? brandColor
                          : "var(--light-stroke)",
                    }}
                  ></div>
                </div>
                <div className={styles.status}>
                  <div
                    className={styles.leftStem}
                    style={{
                      backgroundColor:
                        statusLevel(s.shipment_status) > 2
                          ? brandColor
                          : "var(--light-stroke)",
                    }}
                  ></div>
                  <Circle
                    size={18}
                    style={{
                      fill:
                        statusLevel(s.shipment_status) > 2
                          ? brandColor
                          : "var(--background)",
                      stroke:
                        statusLevel(s.shipment_status) > 2
                          ? brandColor
                          : "var(--light-stroke)",
                    }}
                  />
                  <div className={styles.rightStem}></div>
                </div>
              </div>
              <div className={styles.subwayGrid}>
                <div>Order placed</div>
                <div>Shipped</div>
                <div>Delivered</div>
              </div>
            </div>
            <div className={styles.keyValuePairs}>
              {s.shipment_status == "delivered" ? (
                <>
                  {!!s.expected_delivery_at && (
                    <div className={styles.summary}>
                      Delivered on{" "}
                      {formatDateTime(s.expected_delivery_at, {
                        includeTime: true,
                        iataTimezone:
                          s.destination_address?.tz ||
                          header.location?.address?.tz,
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {showDestination && (
                    <div className={styles.keyValue}>
                      <div className={styles.key}>On its way</div>
                      <div className={styles.value}>
                        to {s.destination_address?.city}
                        {!!s.destination_address?.region &&
                          `, ${s.destination_address?.region}`}
                      </div>
                    </div>
                  )}
                  {s.tracking_number && (
                    <div className={styles.keyValue}>
                      <div className={styles.key}>Tracking Number</div>
                      <div className={styles.value}>{s.tracking_number}</div>
                    </div>
                  )}
                  <div className={styles.keyValue}>
                    <div className={styles.key}>Expected Delivery</div>

                    {!!s.expected_delivery_at && (
                      <div className={styles.value}>
                        {formatDateTime(s.expected_delivery_at, {
                          iataTimezone:
                            s.destination_address?.tz ||
                            header.location?.address?.tz,
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function statusLevel(status: Optional<string>) {
  let output = 1;
  if (status == "in_transit") {
    output = 2;
  }
  if (status == "delivered") {
    output == 3;
  }
  return output;
}
