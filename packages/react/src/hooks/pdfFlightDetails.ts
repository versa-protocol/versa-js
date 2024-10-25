import {
  aggregateTicketFares,
  airportLookup,
  formatDateComparison,
  formatDateTime,
  formatUSD,
  GroupedItinerary,
  organizeFlightTickets,
} from "@versaprotocol/belt";
import { Flight } from "@versaprotocol/schema";
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import autoTable from "jspdf-autotable";

export async function FlightDetails(
  doc: jsPDF,
  flight: Flight,
  margin: number,
  cursor: { y: number; page: number }
) {
  const docWidth = doc.internal.pageSize.getWidth();
  const docHeight = doc.internal.pageSize.getHeight();
  const organizedFlightTickets = organizeFlightTickets(flight);
  const segmentLeftRightPad = margin * 0.5;
  const segmentTopBottomPad = margin * 0.375;
  const linePad = margin * 0.1875;
  const bigFontSize = 15;
  const regFontSize = 10;
  let iconCoordinates: { x: number; y: number; page: number }[] = [];
  organizedFlightTickets.forEach((ticketGroup) => {
    let ticketSummary: Record<
      string,
      { content: string; styles?: { [key: string]: any } }
    >[] = [];
    const segmentHeight = getSegmentHeight(
      ticketGroup.itineraries,
      segmentTopBottomPad,
      linePad,
      bigFontSize,
      regFontSize
    );
    cursor.y += margin / 2;
    ticketGroup.itineraries.forEach((itinerary) => {
      doc.setPage(cursor.page);
      let itineraryString = "";
      if (itinerary.departure_at) {
        itineraryString += formatDateTime(itinerary.departure_at);
      }
      itineraryString +=
        "  -  " + itinerary.departure_city + " to " + itinerary.arrival_city;
      cursor.y += margin;
      doc.setFontSize(regFontSize);
      doc.setFont("helvetica", "normal");
      doc.text(itineraryString, margin, cursor.y);
      cursor.y += margin / 2;
      let segmentCount = 0;
      itinerary.segments.forEach((s) => {
        doc.setPage(cursor.page);
        doc.setDrawColor(210);
        const leftOffset =
          margin +
          ((docWidth - 2 * margin) / 2 + margin / 4) * (segmentCount % 2);
        const width = (docWidth - 2 * margin) / 2 - margin / 4;
        doc.rect(leftOffset, cursor.y, width, segmentHeight);
        iconCoordinates.push({
          x: leftOffset + width / 2,
          y: cursor.y + margin * 0.5,
          page: doc.getCurrentPageInfo().pageNumber,
        });
        doc.setFontSize(15);
        doc.text(
          s.departure_airport_code,
          segmentLeftRightPad + leftOffset,
          cursor.y + segmentTopBottomPad + bigFontSize / 72
        );
        doc.text(
          s.arrival_airport_code,
          leftOffset + width - segmentLeftRightPad,
          cursor.y + segmentTopBottomPad + bigFontSize / 72,
          { align: "right" }
        );
        doc.setFontSize(10);
        if (
          s.departure_airport_code !==
          airportLookup(s.departure_airport_code).municipality
        ) {
          doc.text(
            airportLookup(s.departure_airport_code).municipality,
            segmentLeftRightPad + leftOffset,
            cursor.y +
              segmentTopBottomPad +
              bigFontSize / 72 +
              linePad +
              regFontSize / 72
          );
        }
        if (s.departure_at) {
          let departureTime = "";
          if (
            itinerary.departure_at &&
            itinerary.departure_tz &&
            s.departure_tz
          ) {
            departureTime = formatDateComparison(
              itinerary.departure_at,
              itinerary.departure_tz,
              s.departure_at,
              s.departure_tz
            );
          } else {
            departureTime = formatDateTime(
              s.departure_at,
              false,
              true,
              false,
              s.departure_tz
            );
          }
          doc.text(
            departureTime,
            segmentLeftRightPad + leftOffset,
            cursor.y +
              segmentTopBottomPad +
              bigFontSize / 72 +
              2 * linePad +
              2 * (regFontSize / 72)
          );
        }
        if (s.arrival_at) {
          let arrivatlTime = "";
          if (
            itinerary.departure_at &&
            itinerary.departure_tz &&
            s.arrival_tz
          ) {
            arrivatlTime = formatDateComparison(
              itinerary.departure_at,
              itinerary.departure_tz,
              s.arrival_at,
              s.arrival_tz
            );
          } else {
            arrivatlTime = formatDateTime(
              s.arrival_at,
              false,
              true,
              false,
              s.arrival_tz
            );
          }
          doc.text(
            arrivatlTime,
            leftOffset + width - segmentLeftRightPad,
            cursor.y +
              segmentTopBottomPad +
              bigFontSize / 72 +
              2 * linePad +
              2 * (regFontSize / 72),
            { align: "right" }
          );
        }
        if (s.flight_number) {
          doc.text(
            s.flight_number,
            segmentLeftRightPad + leftOffset,
            cursor.y +
              segmentTopBottomPad +
              bigFontSize / 72 +
              3 * linePad +
              3 * (regFontSize / 72)
          );
        }
        if (
          s.arrival_airport_code !==
          airportLookup(s.arrival_airport_code).municipality
        ) {
          doc.text(
            airportLookup(s.arrival_airport_code).municipality,
            leftOffset + width - segmentLeftRightPad,
            cursor.y +
              segmentTopBottomPad +
              bigFontSize / 72 +
              linePad +
              regFontSize / 72,
            { align: "right" }
          );
        }
        segmentCount++;
        if (segmentCount % 2 === 0) {
          cursor.y += segmentHeight + margin / 2;
          if (
            cursor.y +
              segmentHeight +
              margin / 2 +
              margin +
              regFontSize / 72 +
              margin / 2 >
            docHeight
          ) {
            doc.addPage();
            cursor.y = margin;
            cursor.page = cursor.page + 1;
          }
        }
      });
      if (segmentCount % 2 === 1) {
        cursor.y += segmentHeight + margin / 2;
        if (
          cursor.y +
            segmentHeight +
            margin / 2 +
            margin +
            regFontSize / 72 +
            margin / 2 >
          docHeight
        ) {
          doc.addPage();
          cursor.y = margin;
          cursor.page = cursor.page + 1;
        }
      }
    });
    ticketGroup.passengers.forEach((p) =>
      ticketSummary.push({
        passenger: { content: p.passenger ? p.passenger : "" },
        ticket: { content: ticketGroup.number ? ticketGroup.number : "" },
        fare: {
          content: formatUSD(aggregateTicketFares(ticketGroup) / 100),
          styles: {
            halign: "right",
            cellPadding: { top: 0.125, right: 0, bottom: 0.125, left: 0 },
          },
        },
      })
    );

    // Ticket Summary
    autoTable(doc, {
      head: [
        {
          passenger: { content: "Passenger" },
          ticket: { content: "Ticket" },
          fare: {
            content: "Fare",
            styles: {
              halign: "right",
              cellPadding: {
                top: 0.09375,
                right: 0,
                bottom: 0.09375,
                left: 0,
              },
            },
          },
        },
      ],
      body: ticketSummary,
      startY: cursor.y + margin / 2,
      margin: {
        top: margin,
        right: margin,
        bottom: 2 * margin,
        left: margin,
      },
      theme: "plain",
      headStyles: {
        lineColor: 120,
        lineWidth: {
          bottom: (1 / 72) * 0.75,
        },
        fontSize: 8,
        cellPadding: {
          top: 0.09375,
          right: 0.125,
          bottom: 0.09375,
          left: 0,
        },
      },
      bodyStyles: {
        lineColor: 240,
        lineWidth: {
          bottom: (1 / 72) * 0.75,
        },
        fontSize: 10,
        cellPadding: { top: 0.125, right: 0.125, bottom: 0.125, left: 0 },
      },
    });

    cursor = {
      y: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY,
      page: doc.getCurrentPageInfo().pageNumber,
    };
    if (
      cursor.y +
        segmentHeight +
        margin / 2 +
        margin +
        regFontSize / 72 +
        margin / 2 >
      docHeight
    ) {
      doc.addPage();
      cursor.y = margin;
      cursor.page = cursor.page + 1;
    }
  });

  const svgString = planeIcon();
  const svgElement = createSVGElement(svgString);
  const svgLength = 0.25;
  for (let i = 0; i < iconCoordinates.length; i++) {
    doc.setPage(iconCoordinates[i].page);
    await doc.svg(svgElement, {
      x: iconCoordinates[i].x - svgLength / 2,
      y: iconCoordinates[i].y,
      width: svgLength,
      height: svgLength,
    });
    doc.line(
      iconCoordinates[i].x - svgLength - svgLength,
      iconCoordinates[i].y + svgLength / 2,
      iconCoordinates[i].x - svgLength,
      iconCoordinates[i].y + svgLength / 2
    );
    doc.line(
      iconCoordinates[i].x + svgLength,
      iconCoordinates[i].y + svgLength / 2,
      iconCoordinates[i].x + svgLength + svgLength,
      iconCoordinates[i].y + svgLength / 2
    );
  }
}

// Helpers

function planeIcon() {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 -960 960 960"
    >
      <path d="M340-80v-60l80-60v-220L80-320v-80l340-200v-220q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v220l340 200v80L540-420v220l80 60v60l-140-40-140 40z" fill="LightGray"></path>
    </svg>
  `;
}

function createSVGElement(svgString: string): SVGElement {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;
  if (svgElement.nodeName !== "svg") {
    throw new Error("Error parsing SVG string: not an SVG element");
  }
  return svgElement as unknown as SVGElement;
}

function getSegmentHeight(
  itineraries: GroupedItinerary[],
  segmentTopBottomPad: number,
  linePad: number,
  bigFontSize: number,
  regFontSize: number
): number {
  let maxHeight = 0;
  let thisHeight = 0;
  itineraries.forEach((i) => {
    i.segments.forEach((s) => {
      thisHeight = 0;
      thisHeight += segmentTopBottomPad * 2;
      thisHeight += bigFontSize / 72;
      thisHeight += 0.1; // Lines plus grace
      if (
        s.departure_airport_code !==
        airportLookup(s.departure_airport_code).municipality
      ) {
        thisHeight += linePad + regFontSize / 72;
      }
      if (s.departure_at) {
        thisHeight += linePad + regFontSize / 72;
      }
      if (s.flight_number) {
        thisHeight += linePad + regFontSize / 72;
      }
      maxHeight = Math.max(maxHeight, thisHeight);
    });
  });
  return maxHeight;
}
