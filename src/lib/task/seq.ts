import createTask, { Task, isTask } from "./";

type TaskCreator<T> = (arg0: T) => Task<T> | T;

export function seq<T>(arr: TaskCreator<T>[]) {
  return createTask<T>((done) => {
    let queue = [...arr];
    let skipping = false;
    let task: Task<T> | void;
    let lastValue: T;

    function next() {
      if (queue.length === 0) return done(lastValue);
      let fn = queue.shift() as TaskCreator<T>;
      let result = fn(lastValue);
      if (!isTask(result)) {
        task = undefined;
        lastValue = result;
        next();
      } else {
        task = result;
        result.onDone((value) => {
          lastValue = value;
          next();
        });
        if (skipping) task.skip();
      }
    }

    next();

    return () => {
      skipping = true;
      if (task) task.skip();
      return lastValue;
    };
  });
}
