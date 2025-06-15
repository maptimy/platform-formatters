import { getLocale } from "./getLocale";

type UnitStyle = "short" | "long";

type DurationUnit = "days" | "hours" | "minutes" | "seconds";

type CalculatedResult = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type DistanceSystem = "metric" | "imperial" | "imperialWithYards";

const METERS_PER_MILE = 1609.344
const FEET_PER_METER = 3.28084
const YARDS_PER_METER = 1.093613

enum MeasureUnit {
  METER = 'meter',
  KILOMETER = 'kilometer',
  FOOT = 'foot',
  YARD = 'yard',
  MILE = 'mile'
}

export type DurationFormatter = {
  format(input: number): string;
};

export type DistanceFormatter = {
  format(input: number, system?: DistanceSystem, maximumFractionDigits?: number): string;
}

export function LocalizedDurationFormatter(): DurationFormatter {
  const units: DurationUnit[] = ["days", "hours", "minutes", "seconds"];
  const unitStyle: UnitStyle = "short";

  function calculate(durationSeconds: number): CalculatedResult {
    let remainingDuration = durationSeconds;
    const result: CalculatedResult = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    // Extract the days from the duration
    if (units.find((u) => u === "days")) {
      const days = parseInt(
        (remainingDuration / (24 * 60 * 60)).toFixed(0),
        10,
      );
      remainingDuration %= 24 * 60 * 60;
      result.days = days;
    }

    // Extract the hours from the duration
    if (units.find((u) => u === "hours")) {
      const hours = parseInt((remainingDuration / (60 * 60)).toFixed(0), 10);
      remainingDuration %= 60 * 60;
      result.hours = hours;
    }

    // Extract the minutes from the duration
    if (units.find((u) => u === "minutes")) {
      const minutes = parseInt((remainingDuration / 60).toFixed(0), 10);
      remainingDuration %= 60;
      result.minutes = minutes;
    }

    // Extract the seconds from the duration
    if (units.find((u) => u === "seconds")) {
      const seconds = parseInt(remainingDuration.toFixed(0), 10);
      result.seconds = seconds;
    }

    return result;
  }

  function getUnitString(unit: DurationUnit, value: number): string {
    const plural = value != 1 ? "s" : "";

    switch (unitStyle) {
      case "short":
        switch (unit) {
          case "seconds":
            return "s";
          case "minutes":
            return "m";
          case "hours":
            return "h";
          case "days":
            return "d";
        }
        break;
      case "long":
        switch (unit) {
          case "seconds":
            return `${value} ${unit}${plural}`;
          case "minutes":
            return `${value} ${unit}${plural}`;
          case "hours":
            return `${value} ${unit}${plural}`;
          case "days":
            return `${value} ${unit}${plural}`;
        }
        break;
      default:
        return "";
    }
  }

  function format(input: number): string {
    const durationRecord = calculate(input);

    return Object.entries(durationRecord)
      .filter((it) => it[1] > 0)
      .flatMap((it) => `${it[1]}${getUnitString(it[0] as DurationUnit, it[1])}`)
      .join(" ");
  }

  return {
    format,
  };
}

export function LocalizedDistanceFormatter(): DistanceFormatter {
  const locale = getLocale().replace("_", "-");
  function format(
    distanceInMeters: number,
    system: DistanceSystem = "metric",
    maximumFractionDigits: number = 0,
  ): string {
    let unit: MeasureUnit;
    let distance: number;

    switch (system) {
      case "imperial":
        if (distanceInMeters > 289) {
          unit = MeasureUnit.MILE;
          distance = distanceInMeters / METERS_PER_MILE;
        } else {
          unit = MeasureUnit.FOOT;
          distance = distanceInMeters * FEET_PER_METER;
        }
        break;

      case "imperialWithYards":
        if (distanceInMeters > 300) {
          unit = MeasureUnit.MILE;
          distance = distanceInMeters / METERS_PER_MILE;
        } else {
          unit = MeasureUnit.YARD;
          distance = distanceInMeters * YARDS_PER_METER;
        }
        break;

      case "metric":
        if (distanceInMeters > 1_000) {
          unit = MeasureUnit.KILOMETER;
          distance = distanceInMeters / 1_000;
        } else {
          unit = MeasureUnit.METER;
          distance = distanceInMeters
        }
        break;

      default:
        throw new Error("Unsupported measurement system");
    }

    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit,
      unitDisplay: "short",
      maximumFractionDigits,
    }).format(distance);
  }

  return { format };
}
