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
                    iataTimezone:
                      s.service_location?.address?.tz ||
                      header.location?.address?.tz ||
                      null,
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
                      <div className={styles.datetime}>
                        <div>
                          {formatDateTime(s.current_period_start_at, {
                            iataTimezone:
                              s.service_location?.address?.tz ||
                              header.location?.address?.tz ||
                              null,
                          })}
                        </div>
                        {s.current_period_end_at - s.current_period_start_at <=
                          48 * 60 * 60 && (
                          <div className="secondaryText">
                            {formatDateTime(s.current_period_start_at, {
                              timeOnly: true,
                              iataTimezone:
                                s.service_location?.address?.tz ||
                                header.location?.address?.tz ||
                                null,
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.end}>
                      <div className={styles.header}>To</div>
                      <div className={styles.datetime}>
                        <div>
                          {formatDateTime(s.current_period_end_at, {
                            iataTimezone:
                              s.service_location?.address?.tz ||
                              header.location?.address?.tz ||
                              null,
                          })}
                        </div>
                        {s.current_period_end_at - s.current_period_start_at <=
                          48 * 60 * 60 && (
                          <div className="secondaryText">
                            {formatDateTime(s.current_period_end_at, {
                              timeOnly: true,
                              iataTimezone:
                                s.service_location?.address?.tz ||
                                header.location?.address?.tz ||
                                null,
                            })}
                          </div>
                        )}
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
