import { Person, Receipt } from "@versa/schema";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { stringifyPlace } from "@versa/belt";

function personToName(person: Person, index: number): string {
  if (!person.first_name && !person.preferred_first_name) {
    if (!person.last_name) {
      return person.email || `Guest ${index + 1}`;
    }
    return person.last_name;
  }
  if (!person.last_name) {
    return (
      person.preferred_first_name || person.first_name || `Guest ${index + 1}`
    );
  }
  return `${person.preferred_first_name || person.first_name} ${
    person.last_name
  }`;
}

export function TypeSubHeader(
  doc: jsPDF,
  receipt: Receipt,
  margin: number,
  cursor: { y: number; page: number }
) {
  if (receipt.itemization.car_rental || receipt.itemization.lodging) {
    const typeSubHeaderData: (string | number)[][] = [];

    // Lodging
    if (receipt.itemization.lodging) {
      typeSubHeaderData.push([
        "Check In:",
        new Date(
          receipt.itemization.lodging.check_in * 1000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ]);
      typeSubHeaderData.push([
        "Check Out:",
        new Date(
          receipt.itemization.lodging.check_out * 1000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ]);
      if (receipt.itemization.lodging.guests) {
        typeSubHeaderData.push([
          "Guests:",
          receipt.itemization.lodging.guests.map(personToName).join(", "),
        ]);
      }
      if (receipt.itemization.lodging.room) {
        typeSubHeaderData.push([
          "Room Number:",
          receipt.itemization.lodging.room,
        ]);
      }
      if (receipt.itemization.lodging.metadata) {
        receipt.itemization.lodging.metadata.forEach((m) => {
          typeSubHeaderData.push([m.key + ":", m.value]);
        });
      }
    }

    // Car Rental
    if (receipt.itemization.car_rental) {
      typeSubHeaderData.push([
        "Rental:",
        new Date(
          receipt.itemization.car_rental.rental_at * 1000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      ]);
      typeSubHeaderData.push([
        "Return:",
        new Date(
          receipt.itemization.car_rental.return_at * 1000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      ]);
      if (
        receipt.itemization.car_rental.rental_location ==
        receipt.itemization.car_rental.return_location
      ) {
        typeSubHeaderData.push([
          "Location:",
          stringifyPlace(receipt.itemization.car_rental.rental_location),
        ]);
      } else {
        typeSubHeaderData.push([
          "Rental Location:",
          stringifyPlace(receipt.itemization.car_rental.rental_location),
        ]);
        typeSubHeaderData.push([
          "Return Location:",
          stringifyPlace(receipt.itemization.car_rental.return_location),
        ]);
      }
      if (receipt.itemization.car_rental.driver_name) {
        typeSubHeaderData.push([
          "Driver:",
          receipt.itemization.car_rental.driver_name,
        ]);
      }
      if (receipt.itemization.car_rental.vehicle?.description) {
        typeSubHeaderData.push([
          "Vehicle:",
          receipt.itemization.car_rental.vehicle.description,
        ]);
      }
      if (receipt.itemization.car_rental.vehicle?.license_plate_number) {
        typeSubHeaderData.push([
          "License Plate Number:",
          receipt.itemization.car_rental.vehicle.license_plate_number,
        ]);
      }
      if (receipt.itemization.car_rental.vehicle?.vehicle_class) {
        typeSubHeaderData.push([
          "License Plate Number:",
          receipt.itemization.car_rental.vehicle.vehicle_class,
        ]);
      }
      if (receipt.itemization.car_rental.odometer_reading_in) {
        typeSubHeaderData.push([
          "Odometer Reading In:",
          receipt.itemization.car_rental.odometer_reading_in,
        ]);
      }
      if (receipt.itemization.car_rental.odometer_reading_out) {
        typeSubHeaderData.push([
          "Odometer Reading Out:",
          receipt.itemization.car_rental.odometer_reading_out,
        ]);
      }
    }

    doc.setPage(cursor.page);
    autoTable(doc, {
      body: typeSubHeaderData,
      startY: cursor.y + margin,
      margin: {
        top: margin,
        right: margin,
        bottom: 2 * margin,
        left: margin,
      },
      theme: "plain",
      tableWidth: "wrap",
      styles: {
        fontSize: 10,
        cellPadding: {
          top: 0,
          right: 0.125,
          bottom: 0.0625,
          left: 0,
        },
      },
    });
  }

  // Update cursor
  return {
    y: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY,
    page: doc.getCurrentPageInfo().pageNumber,
  };
}
