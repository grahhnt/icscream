# icscream Examples

## merge-ics.ts

*The main example, ripped from another tiny project*

This script takes a source ICS and a target CalDav ICS resource and merges/updates the CalDav resource

**Environment Variables Used**
| Environment | Required | Example | |
| --- | --- | --- | --- |
| `CALDAV_HOST` | Yes | `https://caldav.icloud.com` | The CalDav host to update |
| `CALDAV_USER` | Yes | `example@icloud.com` | The CalDav username to login under |
| `CALDAV_PASS` | Yes | [`abc-000-xyz-111`](https://support.apple.com/en-us/102654) | The CalDav password to login under |
| `CALENDAR_NAME` | Yes | `Work Schedule` | Target calendar to update |
| `ICS_SOURCE` | Yes | `https://example.org/schedule.ics` | Source ICS file to fetch from |
| `ICS_TARGET` | Yes | `scheduling-app.ics` | Target ICS filename in CalDav to store under. This resource will be created if it does not exist server-side |

**Running**
Run this example by building the parent project & running `yarn merge-ics` with the proper environment variables