export function incrementTime(data: any, seconds: number): any {
  const incrementISOString = (isoString: string, sec: number) => {
    const date = new Date(isoString);
    date.setSeconds(date.getSeconds() + sec);
    return date.toISOString();
  };

  return {
    ...data,
    unixtime: data.unixtime + seconds,
    datetime: incrementISOString(data.datetime, seconds),
    dst_from: incrementISOString(data.dst_from, seconds),
    dst_until: incrementISOString(data.dst_until, seconds),
    utc_datetime: incrementISOString(data.utc_datetime, seconds)
  };
}
