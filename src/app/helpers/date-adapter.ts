export function transform(date: Date): string {
  let day: string = date.getDate().toString();
  day = +day < 10 ? '0' + day : day;
  let month: string = (date.getMonth() + 1).toString();
  month = +month < 10 ? '0' + month : month;
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
