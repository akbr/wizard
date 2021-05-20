import { Task } from "../task";

export default function createMeter<T>(listener: (state: T) => void) {
  let queue: T[] = [];
  let locked = false;
  let pending: Task<unknown>[] = [];

  function next() {
    if (locked) return;
    if (pending.length) return;
    if (queue.length) {
      locked = true;
      listener(queue.shift()!);
    }
  }

  function push(x: T) {
    queue.push(x);
    next();
  }

  function release() {
    // Async is needed for the stream transition scheme
    setTimeout(() => {
      locked = false;
      next();
    }, 0);
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
