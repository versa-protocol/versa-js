import { formatDateTime } from "@versaprotocol/belt";
import styles from "./itemized-car-rental.module.css";
import { CarRental } from "versa_unstable_sdk";

export function ItemizedCarRental({ car_rental }: { car_rental: CarRental }) {
  return (
    <div className={styles.carRentalWrap}>
      <div className={styles.carGridWrap}>
        <div className={styles.carLabel}>{car_rental.vehicle?.description}</div>
        <div className={styles.carGrid}>
          <div className={styles.carPhotoWrap}>
            {!!car_rental.vehicle?.image && (
              <img
                src={car_rental.vehicle.image}
                width={2460}
                height={1156}
                alt=""
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.rentalReturn}>
        <div className={styles.keyValue}>
          <div className={styles.value}>{car_rental.rental_location.name}</div>
        </div>
        <div className={styles.dateRange}>
          <div className={styles.start}>
            <div>Rental</div>
            <div className={styles.time}>
              {formatDateTime(car_rental.rental_at, false, false, true)}
            </div>
          </div>
          <div className={styles.end}>
            <div>Return</div>
            <div className={styles.time}>
              {formatDateTime(car_rental.return_at, false, false, true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
