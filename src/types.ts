import rgbHex from 'rgb-hex';
import hexRgb from 'hex-rgb';
import { keys } from './utils';

const hexColorRegex = /^#(?=[0-9a-fA-F]*$)(?:.{3}|.{6})$/;
const rgbColorRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
const rgbaColorRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+(?:\.\d+)?)\)$/;

const lerp = (start: number, end: number, percent: number) =>
  start + (end - start) * percent;
const lerpArray = (start: number[], end: number[], percent: number) =>
  start.map((n, i) => lerp(n, end[i], percent));

export type Interpolate<T extends number | number[]> = (
  start: T,
  end: T,
  percent: number
) => T;
const interpolate = <T extends number | number[]>(
  start: T,
  end: T,
  percent: number
) => {
  if (Array.isArray(start)) {
    return lerpArray(start as number[], end as number[], percent);
  }

  return lerp(start as number, end as number, percent);
};

export enum Types {
  number,
  color
}

export type Type<T extends number | number[], P> = {
  test: (value: any) => boolean;
  parse: (value: P) => T;
  prepare: (value: T, source?: P, target?: P) => P;
  interpolate: Interpolate<T>;
};

const types = {
  [Types.number]: {
    test: (n: any) => typeof n === 'number',
    parse: Number,
    prepare: Number,
    interpolate: interpolate as Interpolate<number>
  } as Type<number, number>,
  [Types.color]: {
    test: (c: string) =>
      hexColorRegex.test(c) || rgbColorRegex.test(c) || rgbaColorRegex.test(c),
    parse: (v: string) => {
      if (hexColorRegex.test(v)) {
        return hexRgb(v, { format: 'array' })
          .slice(0, 3)
          .concat([1]);
      }

      if (rgbColorRegex.test(v)) {
        const match = v.match(rgbColorRegex);
        if (match) {
          return match
            .slice(1, 4)
            .map(Number)
            .concat([1]);
        }
      }

      if (rgbaColorRegex.test(v)) {
        const match = v.match(rgbaColorRegex);
        if (match) {
          return match.slice(1, 5).map(Number);
        }
      }

      return undefined;
    },
    prepare: (v: number[], source, target) => {
      const [r, g, b] = v.slice(0, 3).map(Math.round);
      const a = v[3];

      if (source && target) {
        if (!rgbaColorRegex.test(source) && hexColorRegex.test(target)) {
          return `#${rgbHex(r, g, b)}`;
        }

        if (!rgbaColorRegex.test(source) && rgbColorRegex.test(target)) {
          return `rgb(${r}, ${g}, ${b})`;
        }

        if (rgbaColorRegex.test(source) && !rgbaColorRegex.test(target)) {
          if (a === 1) {
            if (hexColorRegex.test(target)) {
              return `#${rgbHex(r, g, b)}`;
            }

            if (rgbColorRegex.test(target)) {
              return `rgb(${r}, ${g}, ${b})`;
            }
          }
        }
      }

      return `rgba(${r}, ${g}, ${b}, ${a})`;
    },
    interpolate: interpolate as Interpolate<number[]>
  } as Type<number[], string>
};

export const getValueType = (v: any) => {
  return keys(types).find(key => types[key].test(v));
};

export default types;
