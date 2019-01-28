import types, { getValueType } from './types';

type Target<T> = { [key in keyof T]?: T[keyof T] };

export function keys<T>(object: T): Array<keyof T> {
  return Object.keys(object) as any;
}

export const updateValues = <T>(
  state: T,
  source: T,
  target: T,
  percent: number
) => {
  const targetKeys = keys(target).filter(
    key => getValueType(target[key]) !== undefined
  );
  const patch = {} as T;

  targetKeys.forEach(key => {
    const type = getValueType(source[key]);
    if (type) {
      patch[key] = types[type].interpolate(
        source[key] as any,
        target[key] as any,
        percent
      ) as any;
    }
  });
  Object.assign(state, patch);
};

export const applyNewKeys = <T>(state: Target<T>, target: T) => {
  keys(target)
    .filter(key => getValueType(target[key]) !== undefined)
    .filter(key => getValueType(state[key]) === undefined)
    .forEach(key => {
      state[key] = target[key];
    });
};
