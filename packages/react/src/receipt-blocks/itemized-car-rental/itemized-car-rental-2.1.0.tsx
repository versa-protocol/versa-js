import { formatDateTimeWithPlaces } from "@versa/belt";
import styles from "./itemized-car-rental.module.css";
import { Header, lts } from "@versa/schema";

export function ItemizedCarRental210({
  header,
  car_rental,
}: {
  header: Header;
  car_rental: lts.v2_1_0.CarRental;
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
          {car_rental.driver_name && (
            <div className={styles.keyValue}>
              <div className={styles.key}>Driver</div>
              <div className={styles.value}>{car_rental.driver_name}</div>
            </div>
          )}
        </div>
        <div className={styles.dateRange}>
          <div className={styles.start}>
            <div>Rental</div>
            <div className={styles.time}>
              {formatDateTimeWithPlaces(
                car_rental.rental_at,
                [car_rental.rental_location, header.location],
                {
                  includeDOW: true,
                }
              )}
            </div>
          </div>
          <div className={styles.end}>
            <div>Return</div>
            <div className={styles.time}>
              {formatDateTimeWithPlaces(
                car_rental.return_at,
                [car_rental.return_location, header.location],
                {
                  includeDOW: true,
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
