import { formatDateTime } from "@versa/belt";
import styles from "./itemized-service.module.css";
import { Header, Service } from "@versa/schema";
import React from "react";
import { BlockWrap } from "../block-wrap";

export function ItemizedService({
  service,
  header,
}: {
  service: Service;
  header: Header;
}) {
  return (
    <>
      {service.service_items.length === 1 &&
        service.service_items.map((s: any, index: number) => (
          <React.Fragment key={index}>
            {s.recurring && (
              <BlockWrap>
                <div className={styles.serviceNote}>
                  Your service was renewed for your team of {s.quantity}. Your
                  next bill will be on{" "}
                  {formatDateTime(s.current_period_end_at, {
                    iataTimezone: header.location?.address?.tz,
                  })}
                  .
                </div>
              </BlockWrap>
            )}
            {!s.recurring &&
              s.current_period_start_at &&
              s.current_period_end_at && (
                <BlockWrap>
                  <div className={styles.dateRange}>
                    <div className={styles.start}>
                      <div className={styles.header}>From</div>
                      <div className={styles.time}>
                        {formatDateTime(s.current_period_start_at, {
                          includeTime:
                            s.current_period_end_at -
                              s.current_period_start_at <=
                            48 * 60 * 60,
                          iataTimezone: header.location?.address?.tz || null,
                        })}
                      </div>
                    </div>
                    <div className={styles.end}>
                      <div className={styles.header}>To</div>
                      <div className={styles.time}>
                        {formatDateTime(s.current_period_end_at, {
                          includeTime:
                            s.current_period_end_at -
                              s.current_period_start_at <=
                            48 * 60 * 60,
                          iataTimezone: header.location?.address?.tz || null,
                        })}
                      </div>
                    </div>
                  </div>
                </BlockWrap>
              )}
          </React.Fragment>
        ))}
    </>
  );
}
