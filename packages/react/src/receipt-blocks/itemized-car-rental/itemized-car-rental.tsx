import { formatDateTime } from "@versa/belt";
import styles from "./itemized-car-rental.module.css";
import { CarRental, Header } from "@versa/schema";

export function ItemizedCarRental({
  header,
  car_rental,
}: {
  header: Header;
  car_rental: CarRental;
}) {
  return (
    <div className={styles.carRentalWrap}>
      <div className={styles.carGridWrap}>
        <div
          className={
            car_rental.vehicle?.image
              ? `${styles.carLabel} ${styles.carLabelRelative}`
              : styles.carLabel
          }
        >
          {car_rental.vehicle?.description}
        </div>
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
        <div className={styles.keyValueWrap}>
          <div className={styles.keyValue}>
            <div className={styles.key}>Location</div>
            <div className={styles.value}>
              {car_rental.rental_location.name}
            </div>
          </div>
          {car_rental.vehicle?.license_plate_number && (
            <div className={styles.keyValue}>
              <div className={styles.key}>License Plate</div>
              <div className={styles.value}>
                {car_rental.vehicle.license_plate_number}
              </div>
            </div>
          )}
          {car_rental.vehicle?.vehicle_class && (
            <div className={styles.keyValue}>
              <div className={styles.key}>Class</div>
              <div className={styles.value}>
                {car_rental.vehicle.vehicle_class}
              </div>
            </div>
          )}
        </div>
        <div className={styles.dateRange}>
          <div className={styles.start}>
            <div>Rental</div>
            <div className={styles.time}>
              {formatDateTime(car_rental.rental_at, {
                includeDOW: true,
                iataTimezone:
                  car_rental.rental_location?.address?.tz ||
                  header.location?.address?.tz ||
                  null,
              })}
            </div>
          </div>
          <div className={styles.end}>
            <div>Return</div>
            <div className={styles.time}>
              {formatDateTime(car_rental.return_at, {
                includeDOW: true,
                iataTimezone:
                  car_rental.return_location?.address?.tz ||
                  header.location?.address?.tz ||
                  null,
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
