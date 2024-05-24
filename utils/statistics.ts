

export function filterOutliers(someArray: Record<string, any>[], property: string): Record<string, any>[] {
  if(someArray.length < 4) return someArray;

  let q1, q3, iqr, maxValue, minValue;

  let values: Record<string, any>[] = someArray.slice().sort( (a, b) => a[property] - b[property]);//copy array fast and sort

  if((values.length / 4) % 1 === 0){//find quartiles
    q1 = 1/2 * (values[(values.length / 4)][property] + values[(values.length / 4) + 1][property]);
    q3 = 1/2 * (values[(values.length * (3 / 4))][property] + values[(values.length * (3 / 4)) + 1][property]);
  } else {
    q1 = values[Math.floor(values.length / 4 + 1)][property];
    q3 = values[Math.ceil(values.length * (3 / 4) + 1)][property];
  }

  iqr = q3 - q1;
  maxValue = q3 + iqr * 4.5;
  minValue = q1 - iqr * 4.5;

  return values.filter((x) => (x[property] >= minValue) && (x[property] <= maxValue));
}