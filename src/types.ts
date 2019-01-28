import lerp from 'lerp';
import { keys } from './utils';
import lerpColor, { isColor } from '@sunify/lerp-color';

export enum Types {
  number,
  color
}

export type Type<P> = {
  test: (value: unknown) => boolean;
  interpolate: (start: P, end: P, percent: number) => P | undefined;
};

export const types = {
  [Types.number]: {
    test: (n: any) => typeof n === 'number',
    interpolate: lerp
  },
  [Types.color]: {
    test: isColor,
    interpolate: lerpColor
  }
};

export const getValueType = (v: any) => {
  return keys(types).find(key => types[key].test(v));
};
