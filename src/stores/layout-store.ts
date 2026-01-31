import { createStore } from 'zustand/vanilla';

export type LayoutState = 'one' | 'two' | 'three' | 'twoIndex';

export type LayoutActions = {
  setLayout: (layout: LayoutState) => void;
};

export type LayoutStore = {
  layout: LayoutState;
} & LayoutActions;

export const defaultInitState: LayoutState = 'three';

export const createLayoutStore = (
  initialState: LayoutState = defaultInitState,
) => {
  return createStore<LayoutStore>()((set) => ({
    layout: initialState,
    setLayout: (layout: LayoutState) => {
      set((state) => ({ ...state, layout }));
    },
  }));
};
