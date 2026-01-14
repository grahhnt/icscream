import { CoreObject, LineItem } from "../lib/CoreObject";
import { LineReader } from "../lib/LineReader";
import { VCalendar } from "./VCalendar";
import { VEvent } from "./VEvent";

export { VCalendar, VEvent };

export const CalendarObjects = {
  VCALENDAR: VCalendar,
  VEVENT: VEvent,
};

type TypeToObject<T> = T extends keyof typeof CalendarObjects
  ? InstanceType<(typeof CalendarObjects)[T]>
  : CoreObject;

export const parseICS = <T extends string | null>(
  type: T,
  input: string,
  isRoot = true
): TypeToObject<T> => {
  const Class =
    typeof type === "string" && type in CalendarObjects
      ? (CalendarObjects as Record<string, typeof CoreObject>)[type]
      : CoreObject;
  const reader = new LineReader(input);
  const lines: (LineItem | CoreObject)[] = [];

  let rawLine: string | null;
  while ((rawLine = reader.next())) {
    const line = LineItem.fromString(rawLine);
    if (line.get("name") === "BEGIN") {
      const sublines = reader.slurp("END:" + line.get());
      const object = parseICS(line.get(), sublines, false);

      // @ts-ignore
      if (isRoot) return object;

      lines.push(object);
    } else {
      lines.push(line);
    }
  }

  if (!type)
    throw new Error("CoreObject#fromString didn't find any object to parse");

  // @ts-ignore
  return new Class(type, lines);
};
