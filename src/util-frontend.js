import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import timezones from "timezones-list";
import { localeDirection, currentLocale } from "./i18n";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Returns the offset from UTC in hours for the current locale.
 * @returns {number} The offset from UTC in hours.
 *
 * Generated by Trelent
 */
function getTimezoneOffset(timeZone) {
    const now = new Date();
    const tzString = now.toLocaleString("en-US", {
        timeZone,
    });
    const localString = now.toLocaleString("en-US");
    const diff = (Date.parse(localString) - Date.parse(tzString)) / 3600000;
    const offset = diff + now.getTimezoneOffset() / 60;
    return -offset;
}

/**
* Returns a list of timezones sorted by their offset from UTC.
* @param {Array} timezones - An array of timezone objects.
* @returns {Array} A list of the given timezones sorted by their offset from UTC.
*
* Generated by Trelent
*/
export function timezoneList() {
    let result = [];

    for (let timezone of timezones) {
        try {
            let display = dayjs().tz(timezone.tzCode).format("Z");

            result.push({
                name: `(UTC${display}) ${timezone.tzCode}`,
                value: timezone.tzCode,
                time: getTimezoneOffset(timezone.tzCode),
            });
        } catch (e) {
            // Skipping not supported timezone.tzCode by dayjs
        }
    }

    result.sort((a, b) => {
        if (a.time > b.time) {
            return 1;
        }

        if (b.time > a.time) {
            return -1;
        }

        return 0;
    });

    return result;
}

export function setPageLocale() {
    const html = document.documentElement;
    html.setAttribute("lang", currentLocale() );
    html.setAttribute("dir", localeDirection() );
}

/**
 * Mainly used for dev, because the backend and the frontend are in different ports.
 */
export function getResBaseURL() {
    const env = process.env.NODE_ENV;
    if (env === "development" || localStorage.dev === "dev") {
        return location.protocol + "//" + location.hostname + ":3001";
    } else {
        return "";
    }
}
