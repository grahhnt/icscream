# ICScream

A Typescript library to parse iCalendar/ICS files in accordance with [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545)

## Usage

```bash
npm install icscream
```

```typescript
import { parseICS } from "icscream";

const icsData = await fetch("https://example.com/calendar.ics").then(res => res.text());
const vcalendar = parseICS("VCALENDAR", icsData);
```

## Examples

Check the [/examples/README.md](https://sc07.dev/grant/icscream/-/blob/main/examples/README.md?ref_type=heads)

## Contributing

Source is available and contributable on [sc07.dev/grant/icscream](https://sc07.dev/grant/icscream) and a **read-only** mirror is available on [github.com/grahhnt/icscream](https://github.com/grahhnt/icscream)
