export const parseValidDate = (date: Date | string | undefined) => {
  let asDate: Date | null = null;

  if (typeof date === "string") {
    asDate = new Date(date);
  } else if (date instanceof Date) {
    asDate = date;
  }

  if (asDate && !Number.isNaN(asDate.getTime())) {
    return asDate;
  }

  return null;
};
