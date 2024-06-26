// This comes from https://github.com/cipchk/ngx-countdown/blob/master/src/app/components/more-than-24-hours.component.ts

import { CountdownFormatFn } from "ngx-countdown";

const CountdownTimeUnits: Array<[string, number]> = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];

export const moreThan24HoursDateFormatter: CountdownFormatFn = ({ date, formatStr }) => {
  let duration = Number(date || 0);

  return CountdownTimeUnits.reduce((current, [name, unit]) => {
    if (current.indexOf(name) !== -1) {
      const v = Math.floor(duration / unit);
      duration -= v * unit;
      return current.replace(new RegExp(`${name}+`, 'g'), (match: string) => {
        return v.toString().padStart(match.length, '0');
      });
    }
    return current;
  }, formatStr);
}


