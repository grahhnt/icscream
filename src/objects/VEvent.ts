import { CoreObject } from "../lib/CoreObject";

export class VEvent extends CoreObject<"VEVENT"> {
  get uid() {
    return this.get("UID", true)?.get();
  }

  get summary() {
    return this.get("SUMMARY", true)?.get();
  }

  get description() {
    return this.get("DESCRIPTION", true)?.get();
  }
}
