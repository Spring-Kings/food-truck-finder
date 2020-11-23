export const utcTimeStringToDate = (str: string): Date | null => {
  const split = str.split(":");
  if (split.length !== 3)
    return null;
  let date = new Date(Date.now());
  date.setUTCHours(Number(split[0]), Number(split[1]), Number(split[2]));
  return date;
}

export const toTimeString = (date: Date) => {
  return new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}