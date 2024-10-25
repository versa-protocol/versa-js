export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatTType = (ttype: string) => {
  if (ttype === "ach") {
    return "ACH";
  }
  if (ttype === "us_domestic_wire") {
    return "Wire";
  }
  if (ttype === "stripe_fa_transfer") {
    return "Instant Transfer";
  }
  return capitalize(ttype);
};

export const formatGracePeriod = (rotation_grace_seconds: number) => {
  let hours = Math.floor(rotation_grace_seconds / 3600);
  if (hours > 1) {
    return `${hours} hours`;
  }
  return `${hours} hour`;
};

const USDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatUSD(amount: number) {
  return USDFormatter.format(amount);
}

export function formatTransactionValue(
  tx: { amount: number; currency_code: string },
  abs: boolean = false
) {
  const signedAmount = abs ? Math.abs(tx.amount) : tx.amount;
  return tx.currency_code.toUpperCase() === "USD"
    ? formatUSD(signedAmount / 100)
    : `${(signedAmount / 100).toFixed(2)} ${tx.currency_code.toUpperCase()}`;
}

export function formatDateTime(
  secondsSinceEpoch: number,
  utc: boolean = false,
  includeTime: boolean = false,
  includeDOW: boolean = false,
  iataTimezone?: string | null
) {
  var d = new Date(secondsSinceEpoch * 1000);
  var options: Intl.DateTimeFormatOptions;
  if (d.getFullYear() === new Date().getFullYear()) {
    options = {
      month: "short",
      day: "numeric",
    };
  } else {
    options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  }
  if (utc) {
    options.timeZone = "UTC";
  } else if (iataTimezone) {
    options.timeZone = iataTimezone;
  }
  if (includeTime) {
    options.hour = "numeric";
    options.minute = "numeric";
    return d.toLocaleString("en-US", options);
  }
  if (includeDOW) {
    options.weekday = "short";
    return d.toLocaleDateString("en-US", options);
  }
  return d.toLocaleDateString("en-US", options);
}

export function formatTime(secondsSinceEpoch: number) {
  var d = new Date(secondsSinceEpoch * 1000);
  var options: Intl.DateTimeFormatOptions;
  options = {
    hour: "numeric",
    minute: "numeric",
  };
  return d.toLocaleTimeString("en-US", options);
}

export function sameDay(d1: number, d2: number) {
  const d1_d = new Date(d1 * 1000);
  const d2_d = new Date(d2 * 1000);
  return (
    d1_d.getFullYear() === d2_d.getFullYear() &&
    d1_d.getMonth() === d2_d.getMonth() &&
    d1_d.getDate() === d2_d.getDate()
  );
}

export function formatTimeRange(
  secondsSinceEpochStart: number,
  secondsSinceEpochEnd: number
) {
  var ds = new Date(secondsSinceEpochStart * 1000);
  var de = new Date(secondsSinceEpochEnd * 1000);
  var datesShareYear = ds.getFullYear() === de.getFullYear();
  var datesShareMonth = ds.getMonth() === de.getMonth();
  var datesShareDay = ds.getDay() === de.getDay();
  var firstDateOptions: Intl.DateTimeFormatOptions;
  var secondDateOptions: Intl.DateTimeFormatOptions;
  if (datesShareYear && datesShareMonth && datesShareDay) {
    if (new Date().getFullYear() === ds.getFullYear()) {
      firstDateOptions = {
        month: "short",
        day: "numeric",
      };
    } else {
      firstDateOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
    }
    return ds.toLocaleDateString("en-US", firstDateOptions);
  }
  if (datesShareYear) {
    if (new Date().getFullYear() === ds.getFullYear()) {
      if (datesShareMonth) {
        firstDateOptions = {
          month: "short",
          day: "numeric",
        };
        secondDateOptions = {
          day: "numeric",
        };
      } else {
        firstDateOptions = {
          month: "short",
          day: "numeric",
        };
        secondDateOptions = {
          month: "short",
          day: "numeric",
        };
      }
    } else {
      if (datesShareMonth) {
        firstDateOptions = {
          month: "short",
          day: "numeric",
        };
        secondDateOptions = {
          day: "numeric",
          year: "numeric",
        };
      } else {
        firstDateOptions = {
          month: "short",
          day: "numeric",
        };
        secondDateOptions = {
          month: "short",
          day: "numeric",
          year: "numeric",
        };
      }
    }
  } else {
    firstDateOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    secondDateOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
  }
  return (
    ds.toLocaleDateString("en-US", firstDateOptions) +
    " - " +
    de.toLocaleDateString("en-US", secondDateOptions)
  );
}

export function flightClass(flightClass: string) {
  const first = ["F", "A"];
  const business = ["C", "J", "R", "D", "I"];
  const economy = [
    "Y",
    "H",
    "K",
    "M",
    "L",
    "G",
    "V",
    "S",
    "N",
    "Q",
    "O",
    "E",
    "B",
    "X",
  ];
  if (first.includes(flightClass)) {
    return "First Class";
  }
  if (business.includes(flightClass)) {
    return "Business Class";
  }
  if (economy.includes(flightClass)) {
    return "Main Cabin";
  }
}

import { airports } from "./airports";

export function airportLookup(iataCode: string) {
  if (airports[iataCode as keyof typeof airports]) {
    return airports[iataCode as keyof typeof airports];
  } else {
    return {
      municipality: iataCode,
      tz: "UTC",
    };
  }
}

/**
 * Formats a comparison timestamp relative to an initial timestamp, showing just the time if on the same day,
 * or including the date and a relative day indicator if on different days
 * @param initialEpoch - Initial timestamp in epoch milliseconds
 * @param initialTimezone - IANA timezone for initial date (e.g. "America/New_York")
 * @param comparisonEpoch - Comparison timestamp in epoch milliseconds
 * @param comparisonTimezone - IANA timezone for comparison date
 * @returns Formatted string indicating the time and relative day difference if applicable
 */
export function formatDateComparison(
  initialEpoch: number,
  initialTimezone: string,
  comparisonEpoch: number,
  comparisonTimezone: string
): string {
  if (comparisonEpoch < initialEpoch) {
    throw new Error("Comparison date must be after initial date");
  }

  // Create formatters with respective timezones
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: comparisonTimezone,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: comparisonTimezone,
  };

  // Get dates in their respective timezones
  const initialFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: initialTimezone,
  });

  const comparisonFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: comparisonTimezone,
  });

  const initialParts = initialFormatter.formatToParts(
    new Date(initialEpoch * 1000)
  );
  const comparisonParts = comparisonFormatter.formatToParts(
    new Date(comparisonEpoch * 1000)
  );

  // Extract dates for comparison
  const getDateFromParts = (parts: Intl.DateTimeFormatPart[]) => {
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    return `${year}-${month}-${day}`;
  };

  const initialDateStr = getDateFromParts(initialParts);
  const comparisonDateStr = getDateFromParts(comparisonParts);

  // Check if dates are on the same day
  if (initialDateStr === comparisonDateStr) {
    return new Intl.DateTimeFormat("en-US", timeOptions).format(
      new Date(comparisonEpoch * 1000)
    );
  }

  // Calculate days difference using the formatted dates to respect timezones
  const initialDate = new Date(initialDateStr);
  const comparisonDate = new Date(comparisonDateStr);
  const daysDiff = Math.round(
    (comparisonDate.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dateTimeStr = `${new Intl.DateTimeFormat("en-US", dateOptions).format(
    new Date(comparisonEpoch * 1000)
  )}, ${new Intl.DateTimeFormat("en-US", timeOptions).format(
    new Date(comparisonEpoch * 1000)
  )}`;

  return `${dateTimeStr} ${
    daysDiff === 1 ? "(next day)" : `(${daysDiff}d later)`
  }`;
}
