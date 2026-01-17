const {
  CALDAV_HOST,
  CALDAV_USER,
  CALDAV_PASS,
  CALENDAR_NAME,
  ICS_SOURCE,
  ICS_TARGET,
} = process.env;

const isValidURL = (input: string) => {
  try {
    new URL(input);
  } catch (_) {
    return false;
  }

  return true;
};

if (typeof CALDAV_HOST !== "string" || !isValidURL(CALDAV_HOST)) {
  throw new Error("CALDAV_HOST is not a valid URL");
}

if (typeof CALDAV_USER !== "string") {
  throw new Error("CALDAV_USER is not valid");
}

if (typeof CALDAV_PASS !== "string") {
  throw new Error("CALDAV_PASS is not valid");
}

if (typeof CALENDAR_NAME !== "string") {
  throw new Error("CALENDAR_NAME is not valid");
}

if (typeof ICS_SOURCE !== "string" || !isValidURL(ICS_SOURCE)) {
  throw new Error("ICS_SOURCE is not a valid URL");
}

if (typeof ICS_TARGET !== "string") {
  throw new Error("ICS_TARGET is not valid");
}

export const Config = {
  caldav: {
    host: CALDAV_HOST,
    username: CALDAV_USER,
    password: CALDAV_PASS,
  },
  source_ics: ICS_SOURCE,
  target: {
    calendar_name: CALENDAR_NAME,
    target_ics_filename: ICS_TARGET,
  },
};
