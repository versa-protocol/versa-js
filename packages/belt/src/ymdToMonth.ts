function toMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString("en-US", {
    month: "long",
  });
}

export const ymdToMonth = (ymd: string | undefined) => {
  if (!ymd) {
    return "No Date";
  }
  let month_str = ymd.split("-")[1];
  let month_num = Number.parseInt(month_str);
  return toMonthName(month_num);
};
