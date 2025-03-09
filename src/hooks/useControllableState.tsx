import { useState } from "react";
type UseControllableStateArgs<T> = {
  state?: T;
  setState?: (v: T) => void;
  initial: T;
};

export function useControllableState<T>(
  args: UseControllableStateArgs<T>
): [state: T, setState: (v: T) => void] {
  const { state, setState, initial } = args;
  const isControlled = setState != null;
  const [controlledState, setControlledState] = useState<T>(initial);
  return isControlled
    ? [state!, setState]
    : [controlledState, setControlledState];
}
