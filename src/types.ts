import rgbHex from 'rgb-hex';
import hexRgb from 'hex-rgb';
import { keys } from './utils';

const hexColorRegex = /^#(?=[0-9a-fA-F]*$)(?:.{3}|.{6})$/;
const rgbColorRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
const rgbaColorRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+(?:\.\d+)?)\)$/;

const lerp = (start: number, end: number, percent: number) => {
  if (start === end) {
    return start;
  }

  return start + (end - start) * percent;
};
const lerpArray = (start: number[], end: number[], percent: number) =>
  start.map((n, i) => lerp(n, end[i], percent));

export enum Types {
  number,
  color
}

export type Type<P> = {
  test: (value: unknown) => boolean;
  interpolate: (start: P, end: P, percent: number) => P | undefined;
};

const parseColor = (color: string) => {
  if (hexColorRegex.test(color)) {
    return hexRgb(color, { format: 'array' })
      .slice(0, 3)
      .concat([1]);
  }

  if (rgbColorRegex.test(color)) {
    const match = color.match(rgbColorRegex);
    if (match) {
      return match
        .slice(1, 4)
        .map(Number)
        .concat([1]);
    }
  }

  if (rgbaColorRegex.test(color)) {
    const match = color.match(rgbaColorRegex);
    if (match) {
      return match.slice(1, 5).map(Number);
    }
  }

  return undefined;
};

const stringifyColor = (color: number[], source: string, target: string) => {
  const [r, g, b] = color.slice(0, 3).map(Math.round);
  const a = color[3];

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
};

const types: {
  [Types.number]: Type<number>;
  [Types.color]: Type<string>;
} = {
  [Types.number]: {
    test: (n: any) => typeof n === 'number',
    interpolate: lerp
  } as Type<number>,
  [Types.color]: {
    test: (c: string) =>
      hexColorRegex.test(c) || rgbColorRegex.test(c) || rgbaColorRegex.test(c),
    interpolate: (start, end, percent) => {
      const startColor = parseColor(start);
      const endColor = parseColor(end);

      if (startColor && endColor) {
        return stringifyColor(
          lerpArray(startColor, endColor, percent),
          start,
          end
        );
      }

      return undefined;
    }
  } as Type<string>
};

export const getValueType = (v: any) => {
  return keys(types).find(key => types[key].test(v));
};

export default types;
