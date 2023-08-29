import { Pipe, PipeTransform } from '@angular/core';
import { applyUtcOffset, formatDate, formatTime } from "../helpers";

type FormattedData = {
  fullName: string;
  shortName: string;
  localTime: string;
  localDate: string;
  summertime: string;
};

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(response: any, field: keyof FormattedData): string {
    const offsetDate = applyUtcOffset(new Date(response.datetime), response.utc_offset);

    const formattedData: FormattedData = {
      fullName: response.timezone,
      shortName: `${response.abbreviation} (UTC${response.utc_offset})`,
      localTime: formatTime(offsetDate),
      localDate: formatDate(offsetDate),
      summertime: !response.dst ? 'No DST' :
        `${formatDate(new Date(response.dst_from))} - ${formatDate(new Date(response.dst_until))}`
    };

    if (field in formattedData) {
      return formattedData[field as keyof FormattedData] || '-';
    } else {
      throw new Error(`Field ${field} not found in FormattedData type`);
    }
  }
}
