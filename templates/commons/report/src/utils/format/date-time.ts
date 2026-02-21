import { TZDate, tz } from "@date-fns/tz";
import { formatDate } from "date-fns";
import { PLACEHOLDER_VOID, TIMEZONE_LOCAL } from "./common";

// ========================================================

export const ExtractOnlyDate = (date: string) => {
  const iso = date;

  const onlyDate = iso.slice(
    0,
    iso.includes("T") ? iso.indexOf("T") : undefined
  );

  return onlyDate;
};

// ========================================================

export const fmtDisplayDate = (date?: unknown) => {
  if (typeof date === "string") {
    return ExtractOnlyDate(date).split("-").reverse().join("/");
  }

  return "";
};

export const fmtRange = (
  start?: string | number | null | undefined,
  end?: string | number | null | undefined,
  options: {
    labels?: {
      from: string;
      upTo: string;
      between: string;
    };
  } = {}
) => {
  const {
    labels: {
      from: labelFrom = "de",
      upTo: labelUpTo = "até",
      between: labelBetween = "até",
    } = {},
  } = options;

  if (start && end) {
    if (start === end) {
      return start;
    }

    return `${start} ${labelBetween} ${end}`;
  }

  if (start) {
    return `${labelFrom} ${start}`;
  }

  if (end) {
    return `${labelUpTo} ${end}`;
  }
};

export const fmtDateRange = (
  startInput?: string | null | undefined,
  endInput?: string | null | undefined
) => {
  const [start, end] = [
    startInput && fmtDisplayDate(startInput),
    endInput && fmtDisplayDate(endInput),
  ];

  return fmtRange(start, end) ?? PLACEHOLDER_VOID;
};

export const fmtDisplayTime = (time: string) => {
  const match = time.match(/^(\d{2})[:|h](\d{2})$/);

  if (match) {
    const [, hours, minutes] = match;
    return `${hours}h${minutes}`;
  }

  return PLACEHOLDER_VOID;
};

export const fmtTimeRange = (
  startInput?: string | null | undefined,
  endInput?: string | null | undefined
) => {
  if (startInput && endInput) {
    const start = fmtDisplayTime(startInput);
    const end = fmtDisplayTime(endInput);

    if (start === end) {
      return start;
    }

    return `${start} até ${end}`;
  }

  if (startInput) {
    return `a partir de ${fmtDisplayTime(startInput)}`;
  }

  if (endInput) {
    return `até ${fmtDisplayTime(endInput)}`;
  }

  return PLACEHOLDER_VOID;
};

export const fmtDisplayDateTimeSplitted = (date?: string, time?: string) => {
  if (date && time) {
    return `${fmtDisplayDate(date)} às ${fmtDisplayTime(time)}`;
  }

  if (date) {
    return `${fmtDisplayDate(date)}`;
  }

  if (time) {
    return `às ${fmtDisplayTime(time)}`;
  }

  return PLACEHOLDER_VOID;
};

export const fmtDateTimeISO = (datetime?: string | null) => {
  if (datetime) {
    const dateRepresentation = new TZDate(datetime, TIMEZONE_LOCAL);

    return formatDate(dateRepresentation, "dd/MM/yyyy 'às' HH'h'mm", {
      in: tz(TIMEZONE_LOCAL),
    });
  }

  return PLACEHOLDER_VOID;
};

export const fmtOrdinal = (position?: string | number) => {
  if (position) {
    return `${position}º`;
  }

  return PLACEHOLDER_VOID;
};

export const fmtOrdinalRange = (
  start?: string | number,
  end?: string | number
) => {
  return fmtRange(fmtOrdinal(start), fmtOrdinal(end), {
    labels: {
      from: "do",
      upTo: "até o",
      between: "ao",
    },
  });
};
