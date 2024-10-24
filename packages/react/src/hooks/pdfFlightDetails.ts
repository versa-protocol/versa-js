import {
  aggregateTicketFares,
  formatDateTime,
  formatUSD,
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
  const organizedFlightTickets = organizeFlightTickets(flight);
  organizedFlightTickets.forEach((ticketGroup) => {
    let ticketSummary: Record<
      string,
      { content: string; styles?: { [key: string]: any } }
    >[] = [];
    ticketGroup.itineraries.forEach((itinerary) => {
      let itineraryString = "";
      if (itinerary.departure_at) {
        itineraryString += formatDateTime(itinerary.departure_at);
      }
      itineraryString +=
        "    " + itinerary.departure_city + " - " + itinerary.arrival_city;
      cursor.y += margin;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(itineraryString, margin, cursor.y);
      cursor.y += 10 / 72 + margin / 4;
      let segmentCount = 0;
      itinerary.segments.forEach((s) => {
        doc.setDrawColor(200);
        const leftOffset =
          margin + ((docWidth - 2 * margin) / 2 + margin / 4) * segmentCount;
        const width = (docWidth - 2 * margin) / 2 - margin / 4;
        doc.rect(leftOffset, cursor.y, width, 1);
        let segmentString =
          s.departure_airport_code + " - " + s.arrival_airport_code;
        doc.text(
          segmentString,
          margin * 0.25 + leftOffset,
          cursor.y + margin * 0.25 + 10 / 72
        );
        cursor.y += 1 * Math.ceil(segmentCount / 2);
        segmentCount++;
      });
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
      startY: cursor.y + margin,
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
  });

  // const svgString = planeIcon();
  // const svgElement = createSVGElement(svgString);
  // await doc.svg(svgElement, {
  //   x: 0,
  //   y: 0,
  //   width: 1,
  //   height: 1,
  // });
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
      <path d="M340-80v-60l80-60v-220L80-320v-80l340-200v-220q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v220l340 200v80L540-420v220l80 60v60l-140-40-140 40z"></path>
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
