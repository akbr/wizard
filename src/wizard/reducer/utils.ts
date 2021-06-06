export function edit<T>(input: T, fn: (copy: T) => T | void): T {
  let copy: T = JSON.parse(JSON.stringify(input));
  return fn(copy) || copy;
}

export function slideIndex(length: number, index: number, steps = 1) {
  let modSteps = Math.abs(steps) > length - 1 ? steps % length : steps;
  let nextIndex = index + modSteps;

  if (nextIndex < 0) {
    return nextIndex + length;
  }

  if (nextIndex > length - 1) {
    return nextIndex - length;
  }

  return nextIndex;
}

export function indexOfMax(arr: number[]) {
  if (arr.length === 0) return -1;

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}
