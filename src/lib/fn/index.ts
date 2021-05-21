export function pairwise<T, R>(fn: (state: T, prevState?: T) => R) {
  let curr: T;
  return (input: T) => {
    let prev = curr;
    curr = input;
    fn((curr = input), prev);
  };
}
