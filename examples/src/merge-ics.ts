/**
 * merge-ics.ts
 *
 * Example of icscream to merge/update CalDav ICS with new event data from a separate ICS document
 */

import { parseICS } from "icscream";
import {
  createCalendarObject,
  DAVClient,
  fetchCalendarObjects,
  updateCalendarObject,
} from "tsdav";
import { Config } from "./env";

const getNewEvents = () => fetch(Config.source_ics).then((a) => a.text());

const client = new DAVClient({
  serverUrl: Config.caldav.host,
  credentials: {
    username: Config.caldav.username,
    password: Config.caldav.password,
  },
  authMethod: "Basic",
  defaultAccountType: "caldav",
});

const login = () =>
  client
    .login()
    .then(() => client.fetchCalendars())
    .then(async (calendars) => {
      const cal = calendars.find(
        (c) => c.displayName === Config.target.calendar_name,
      );
      if (!cal) {
        console.error(
          "Failed to find calendar by the name",
          Config.target.calendar_name,
        );
        process.exit(1);
      }
      return cal;
    });

login().then(async (cal) => {
  const existingSync = await fetchCalendarObjects({
    calendar: cal,
    objectUrls: [
      new URL(Config.target.target_ics_filename, cal.url).toString(),
    ],
    headers: client.authHeaders,
  });

  const shifts = await getNewEvents();

  if (existingSync[0].etag && existingSync[0].etag !== "undefined") {
    const object = existingSync[0];
    const mergeICS = parseICS("VCALENDAR", object.data);
    mergeICS.mergeWith(parseICS("VCALENDAR", shifts));

    await updateCalendarObject({
      calendarObject: {
        url: object.url,
        etag: object.etag,
        data: mergeICS.toString(),
      },
      headers: client.authHeaders,
    }).then((data) => {
      console.log("Updated ics", data);
    });
  } else {
    await createCalendarObject({
      calendar: cal,
      filename: Config.target.target_ics_filename,
      iCalString: shifts,
      headers: client.authHeaders,
    }).then((data) => {
      console.log("Created ics", data);
    });
  }
});
