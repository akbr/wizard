import { Task } from "../task";

export function createMeter<T>(emit: (state: T) => void) {
  let queue: T[] = [];
  let locked = false;
  let pending: Task<unknown>[] = [];

  function next() {
    if (locked) return;
    if (pending.length) return;
    if (queue.length) {
      locked = true;
      emit(queue.shift()!);
    }
  }

  function push(x: T) {
    queue.push(x);
    next();
  }

  function release() {
    locked = false;
    next();
  }

  function waitFor(t: Task<unknown>) {
    pending.push(t);
    t.onDone(() => {
      pending = pending.filter((task) => task !== t);
      next();
    });
  }

  next();

  return {
    push,
    release,
    waitFor,
  };
}
