import {Employee} from '../dashboard/models/employee';

function totalClockedInTimeReducer(accumulator: number, employee: Employee): number {
  return accumulator + employee.activities.reduce(clockedInReducer, 0);
}

function totalProductiveTimeReducer(accumulator: number, employee: Employee): number {
  return accumulator + employee.activities.reduce(productiveTimeReducer, 0);
}

function totalUnproductiveTimeReducer(accumulator: number, employee: Employee): number {
  return accumulator + employee.activities.reduce(unproductiveTimeReducer, 0);
}

function clockedInReducer(accumulator: number, {clockedIn}): number {
  const parts = clockedIn.split(':');
  const res = parseFloat(`${parts[0]}.${1 / parts[1]}`);
  return accumulator + res;
}

function productiveTimeReducer(accumulator: number, {productiveTime}): number {
  return accumulator + productiveTime;
}

function unproductiveTimeReducer(accumulator: number, {unproductiveTime}): number {
  return accumulator + unproductiveTime;
}

export {
  productiveTimeReducer,
  unproductiveTimeReducer,
  totalProductiveTimeReducer,
  totalUnproductiveTimeReducer,
  totalClockedInTimeReducer
};
