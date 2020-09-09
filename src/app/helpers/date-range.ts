import * as moment from 'moment';

export function getRanges(data, startDate, stopDate) {
  function generateDates(start, stop) {
    let currentDate = moment(start);
    const endDate = moment(stop);
    let date;

    while (currentDate <= endDate) {
      date = moment(currentDate).format('YYYY-MM-DD');
      hash[date] = {date};
      dateArray.push(hash[date]);
      currentDate = moment(currentDate).add(1, 'days');
    }
  }

  const dateArray = [];
  const hash = {};

  generateDates(startDate, stopDate);

  data.forEach((entity) => {
    let currentDate = moment(entity.from);
    const currentStopDate = moment(entity.to);
    let d;
    while (currentDate <= currentStopDate) {
      d = moment(currentDate).format('YYYY-MM-DD');
      // hash[d].activities = hash[d].activities || [];
      // hash[d].activities.push(generateActivitiesForUser());
      currentDate = moment(currentDate).add(1, 'days');
    }
  });
  return dateArray;
}

export function randomDate(start, end) {
  return moment(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))).format('YYYY-MM-DD');
}

export function sortArray(arr: string[]) {
  return arr.sort((a: any, b: any) => {
    return (new Date(a) as any) - (new Date(b) as any);
  });
}

function generateActivitiesForUser() {
  const activities = [];

  for (let i = 0; i < 75; i++) {
    const startMonth = Math.floor(Math.random() * (6 - 1) + 1);
    const endMonth = Math.floor(Math.random() * (10 - (startMonth - 1)) + (startMonth - 1));

    const start = Math.floor(Math.random() * (28 - 1) + 1);
    const end = Math.floor(Math.random() * (28 - (start - 1)) + (start - 1));

    const formattedStart = moment().month(startMonth).date(start).toDate();
    const formattedEnd = moment().month(endMonth).date(end).toDate();

    activities.push({
      clockedIn: '9:18 am',
      clockedOut: '5:15pm',
      productiveTime: 2,
      unproductiveTime: 3,
      date: randomDate(formattedStart, formattedEnd)
    });
  }

  return activities;
}
