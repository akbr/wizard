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

export function slideArray<T>(array: T[], numSteps: number) {
  return array.reduce((slidArray, value, oldIdx) => {
    slidArray[slideIndex(array.length, oldIdx, numSteps)] = value;
    return slidArray;
  }, Array.from({ length: array.length }) as T[]);
}
