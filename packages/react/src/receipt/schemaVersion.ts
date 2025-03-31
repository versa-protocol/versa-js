export const compareSchemaVersions = (
  baseVersion: string,
  comparisonVersion: string
) => {
  const aParts = baseVersion.split(".").map((x) => {
    if (x === "") {
      return 0;
    } else return parseInt(x);
  });
  const bParts = comparisonVersion.split(".").map((x) => {
    if (x === "") {
      return 0;
    } else return parseInt(x);
  });

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    if (aParts[i] < bParts[i]) {
      return -1;
    }
    if (aParts[i] > bParts[i]) {
      return 1;
    }
  }

  return 0;
};
