import { Circle } from "react-feather";
import styles from "./shipment.module.css";
import { formatDateTime } from "@versaprotocol/belt";

export function Shipment({ data, brandColor }: { data: any; brandColor: any }) {
  return (
    <div className={styles.shipmentWrap}>
      {data.map((s: any, index: number) => (
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
              <div className={styles.summary}>
                Delivered on{" "}
                {formatDateTime(s.expected_delivery_at, { includeTime: true })}
              </div>
            ) : (
              <>
                <div className={styles.keyValue}>
                  <div className={styles.key}>On it's way</div>
                  <div className={styles.value}>
                    to {s.destination_address.city},{" "}
                    {s.destination_address.region}
                  </div>
                </div>
                {data.tracking_number && (
                  <div className={styles.keyValue}>
                    <div className={styles.key}>Tracking Number</div>
                    <div className={styles.value}>{s.tracking_number}</div>
                  </div>
                )}
                <div className={styles.keyValue}>
                  <div className={styles.key}>Expected Delivery</div>
                  <div className={styles.value}>
                    {formatDateTime(s.expected_delivery_at)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function statusLevel(status: string) {
  let output = 1;
  if (status == "in_transit") {
    output = 2;
  }
  if (status == "delivered") {
    output == 3;
  }
  return output;
}
