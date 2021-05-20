export interface Task<T> {
  onDone: (listener: Listener<T>) => Task<T>;
  skip: () => Task<T>;
  getStatus: () => boolean;
  getValue: () => T | void;
}
type Listener<T> = (value: T) => void;
type onSkip<T> = () => T;

export function isTask(x: any): x is Task<any> {
  return x && x.onDone;
}

export default function createTask<T>(
  createFn: (done: Listener<T>) => onSkip<T>
) {
  let finished = false;
  let value: T;
  let listeners: Function[] = [];

  let done = (arg: T) => {
    if (finished === true) return;
    value = arg;
    finished = true;
    listeners.forEach((fn) => fn(value));
    listeners = [];
  };

  let onSkip = createFn(done);

  let task: Task<T> = {
    onDone: (fn) => {
      if (!finished) listeners.push(fn);
      if (finished) fn(value);
      return task;
    },
    skip: () => {
      if (!finished) done(onSkip());
      return task;
    },
    getStatus: () => finished,
    getValue: () => value,
  };

  return task;
}
