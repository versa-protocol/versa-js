import { formatDateTimeWithPlaces } from "@versa/belt";
import styles from "./itemized-subscription.module.css";
import { Header, Subscription } from "@versa/schema";
import React from "react";
import { BlockWrap } from "../block-wrap";

export function ItemizedSubscription({
  subscription,
  header,
}: {
  subscription: Subscription;
  header: Header;
}) {
  return (
    <>
      {subscription.subscription_items.length === 1 &&
        subscription.subscription_items.map((s: any, index: number) => (
          <React.Fragment key={index}>
            {s.subscription_type == "recurring" && (
              <BlockWrap>
                <div className={styles.subscriptionNote}>
                  Your subscription was renewed for your team of {s.quantity}.
                  Your next bill will be on{" "}
                  {formatDateTimeWithPlaces(s.current_period_end_at, [
                    s.service_location,
                    header.location,
                  ])}
                  .
                </div>
              </BlockWrap>
            )}
            {s.subscription_type == "one_time" &&
              s.current_period_start_at &&
              s.current_period_end_at && (
                <BlockWrap>
                  <div className={styles.dateRange}>
                    <div className={styles.start}>
                      <div className={styles.header}>From</div>
                      <div className={styles.datetime}>
                        <div>
                          {formatDateTimeWithPlaces(s.current_period_start_at, [
                            s.service_location,
                            header.location,
                          ])}
                        </div>
                        {s.current_period_end_at - s.current_period_start_at <=
                          48 * 60 * 60 && (
                          <div className="secondaryText">
                            {formatDateTimeWithPlaces(
                              s.current_period_start_at,
                              [s.service_location, header.location],
                              {
                                timeOnly: true,
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.end}>
                      <div className={styles.header}>To</div>
                      <div className={styles.datetime}>
                        <div>
                          {formatDateTimeWithPlaces(s.current_period_end_at, [
                            s.service_location,
                            header.location,
                          ])}
                        </div>
                        {s.current_period_end_at - s.current_period_start_at <=
                          48 * 60 * 60 && (
                          <div className="secondaryText">
                            {formatDateTimeWithPlaces(
                              s.current_period_end_at,
                              [s.service_location, header.location],
                              {
                                timeOnly: true,
                              }
                            )}
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
