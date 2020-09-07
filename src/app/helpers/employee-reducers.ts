function totalClockedInTimeReducer(accumulator: number, {totalClockedInTime}): number {
  return accumulator + (totalClockedInTime || 4);
}

function productiveTimeReducer(accumulator: number, {totalProductiveTime}): number {
  return accumulator + (totalProductiveTime || 2);
}

function unproductiveTimeReducer(accumulator: number, {totalUnproductiveTime}): number {
  return accumulator + (totalUnproductiveTime || 3);
}

export {productiveTimeReducer, unproductiveTimeReducer, totalClockedInTimeReducer};
