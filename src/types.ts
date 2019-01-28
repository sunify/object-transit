import { keys, lerp } from './utils';
import { interpolateColor, isColor } from './colors';

export enum Types {
  number,
  color
}

export type Type<P> = {
  test: (value: unknown) => boolean;
  interpolate: (start: P, end: P, percent: number) => P | undefined;
};

const types = {
  [Types.number]: {
    test: (n: any) => typeof n === 'number',
    interpolate: lerp
  },
  [Types.color]: {
    test: isColor,
    interpolate: interpolateColor
  }
};

export const getValueType = (v: any) => {
  return keys(types).find(key => types[key].test(v));
};

export default types;
