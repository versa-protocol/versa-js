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
