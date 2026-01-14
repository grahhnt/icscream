import { CoreObject } from "../lib/CoreObject";
import { VEvent } from "./VEvent";

export class VCalendar extends CoreObject<"VCALENDAR"> {
  getEvents() {
    return this.lines.filter((l) => l instanceof VEvent);
  }

  /**
   * Update this instance with the second instance
   */
  mergeWith(second: VCalendar) {
    const existingEvents = this.getEvents();
    for (const event of second.getEvents()) {
      const existingEvent = existingEvents.find(
        (e) => e.uid && e.uid === event.uid
      );
      if (existingEvent) {
        this.delete(existingEvent);
      }
      this.add(event);
    }
    return this;
  }
}
