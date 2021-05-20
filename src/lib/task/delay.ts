import createTask from "./";

export default function delay<T>(value: () => T, ms = 0) {
  return createTask<T>((done) => {
    let timeout = setTimeout(() => {
      done(value());
    }, ms);

    return () => {
      clearTimeout(timeout);
      return value();
    };
  });
}
