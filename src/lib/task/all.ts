import createTask, { Task, isTask } from "./";

type TaskFns<T> = () => Task<T> | T;

export function all<T>(arr: TaskFns<T>[]) {
  return createTask<T[]>((done) => {
    let finished = 0;
    let length = arr.length;
    let tasks: Task<T>[] = [];
    let results: T[] = [];
    results.length = length;

    function notch(result: T, index: number) {
      results[index] = result;
      finished += 1;
      if (finished === length) done(results);
    }

    arr.forEach((fn, index) => {
      let result = fn();
      if (isTask(result)) {
        tasks.push(result);
        result.onDone((result) => notch(result, index));
      } else {
        notch(result, index);
      }
    });

    return () => {
      tasks.forEach((task) => task.skip());
      return results;
    };
  });
}
