import * as moment from 'moment';

export function randomDate(start, end) {
  return moment(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))).format('YYYY-MM-DD');
}

export function sortArray(arr: string[]) {
  return arr.sort((a: any, b: any) => {
    return (new Date(a) as any) - (new Date(b) as any);
  });
}

export function generateActivitiesForUser() {
  const a = [];
  const limit = randFromGivenRange(75, 120);

  for (let i = 0; i < limit; i++) {
    // generate random date from random range
    const startMonth = Math.floor(Math.random() * (6 - 1) + 1);
    const endMonth = Math.floor(Math.random() * (10 - (startMonth - 1)) + (startMonth - 1));
    const start = Math.floor(Math.random() * (28 - 1) + 1);
    const end = Math.floor(Math.random() * (28 - (start - 1)) + (start - 1));
    const formattedStart = moment().month(startMonth).date(start).toDate();
    const formattedEnd = moment().month(endMonth).date(end).toDate();
    const randomDateFromRange = randomDate(formattedStart, formattedEnd);

    // generate random values in range which are depending on each other subsequently
    const clockedIn = Math.floor(Math.random() * (24 - 10) + 10);
    const clockedOut = Math.floor(Math.random() * (24 - clockedIn) + clockedIn);
    const total = clockedOut - clockedIn;
    const productive = Math.floor(Math.random() * (total - 1) + 1);
    const left = total - productive;
    const unproductive = Math.floor(Math.random() * (left - 1) + 1);

    a.push({
      date: randomDateFromRange,
      clockedIn: moment().hours(clockedIn).format('LT'),
      clockedOut: moment().hours(clockedOut).format('LT'),
      productiveTime: productive,
      unproductiveTime: unproductive,
      neutral: total - (unproductive + productive),
    });
  }

  return a;
}

function randFromGivenRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
