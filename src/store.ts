import create from "./lib/premix/zustand";

export const [api, hook] = create(() => ({
  name: "Aaron",
  num: 0,
}));

const set = api.setState;
export const actions = {
  randomize: () => set({ num: Math.random() }),
};

export const useStore = hook;
