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

export function formatTransactionValue(amount: number, currency_code: string) {
  const supportedCurrencies = [
    "usd",
    "eur",
    "jpy",
    "gbp",
    "aud",
    "cad",
    "chf",
    "cny",
  ];
  const normalizedCurrency = currency_code.toLowerCase();
  if (!supportedCurrencies.includes(normalizedCurrency)) {
    return `${amount} ${currency_code.toUpperCase()}`;
  }
  let locale = "en-US";
  if (navigator.language) {
    locale = navigator.language;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: normalizedCurrency.toUpperCase(),
    minimumFractionDigits: normalizedCurrency === "jpy" ? 0 : 2,
    maximumFractionDigits: normalizedCurrency === "jpy" ? 0 : 2,
  }).format(amount / (normalizedCurrency === "jpy" ? 1 : 100));
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
  if (first.includes(flightClass.toUpperCase())) {
    return "First Class";
  }
  if (business.includes(flightClass.toUpperCase())) {
    return "Business Class";
  }
  if (economy.includes(flightClass.toUpperCase())) {
    return "Main Cabin";
  }
  return null;
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

import { aircraft } from "./aircraft";

export function aircraftLookup(icaoCode: string) {
  if (aircraft[icaoCode as keyof typeof aircraft]) {
    return aircraft[icaoCode as keyof typeof aircraft].model;
  } else {
    return icaoCode;
  }
}

/**
 * Formats a comparison timestamp relative to an initial timestamp, showing just the time if on the same day,
 * or including the date and a relative day indicator if on different days
 * @param originalEpoch - Initial timestamp in epoch milliseconds
 * @param originalTimezone - IANA timezone for initial date (e.g. "America/New_York")
 * @param targetEpoch - Comparison timestamp in epoch milliseconds
 * @param targetTimezone - IANA timezone for comparison date
 * @returns Formatted string indicating the time and relative day difference if applicable
 */
export function formatDateComparison(
  originalEpoch: number,
  originalTimezone: string,
  previousEpoch: number,
  previousTimezone: string,
  targetEpoch: number,
  targetTimezone: string
): string {
  if (targetEpoch < originalEpoch || targetEpoch < previousEpoch) {
    throw new Error("Target date must be after comparison dates");
  }

  // Create formatters with respective timezones
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: targetTimezone,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: targetTimezone,
  };

  // Get dates in their respective timezones
  const initialFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: originalTimezone,
  });

  // Get dates in their respective timezones
  const previousFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: previousTimezone,
  });

  const targetFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: targetTimezone,
  });

  const initialParts = initialFormatter.formatToParts(
    new Date(originalEpoch * 1000)
  );
  const previousParts = previousFormatter.formatToParts(
    new Date(previousEpoch * 1000)
  );
  const targetParts = targetFormatter.formatToParts(
    new Date(targetEpoch * 1000)
  );

  // Extract dates for comparison
  const getDateFromParts = (parts: Intl.DateTimeFormatPart[]) => {
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    return `${year}-${month}-${day}`;
  };

  const initialDateStr = getDateFromParts(initialParts);
  const previousDateStr = getDateFromParts(previousParts);
  const targetDateStr = getDateFromParts(targetParts);

  // Check if dates are on the same day
  if (initialDateStr === targetDateStr) {
    return new Intl.DateTimeFormat("en-US", timeOptions).format(
      new Date(targetEpoch * 1000)
    );
  }

  // Calculate days difference using the formatted dates to respect timezones
  const initialDate = new Date(initialDateStr);
  const previousDate = new Date(previousDateStr);
  const targetDate = new Date(targetDateStr);
  const daysDiff = Math.round(
    (targetDate.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const sequentialDiff = Math.round(
    (targetDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dateTimeStr = `${new Intl.DateTimeFormat("en-US", dateOptions).format(
    new Date(targetEpoch * 1000)
  )}, ${new Intl.DateTimeFormat("en-US", timeOptions).format(
    new Date(targetEpoch * 1000)
  )}`;

  return `${dateTimeStr} ${
    sequentialDiff === 0
      ? ""
      : sequentialDiff === 1
      ? "(next day)"
      : `(${sequentialDiff}d later)`
  }`;
}
