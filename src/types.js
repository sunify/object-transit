import rgbHex from 'rgb-hex';
import hexRgb from 'hex-rgb';

const hexColorRegex = /^#(?=[0-9a-fA-F]*$)(?:.{3}|.{6})$/;
const rgbColorRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
const rgbaColorRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+(?:\.\d+)?)\)$/;

const lerp = (start, end, percent) => start + (end - start) * percent;
const lerpArray = (start, end, percent) => start.map((n, i) => lerp(n, end[i], percent));

const types = {
  number: {
    test: n => typeof n === 'number',
    parse: a => a,
    prepare: a => a,
    interpolate: lerp,
  },
  hexColor: {
    test: c => hexColorRegex.test(c),
    parse: v => hexRgb(v, { format: 'array' }).slice(0, 3),
    prepare: v => `#${rgbHex(...v)}`,
    interpolate: lerpArray,
  },
  rgbColor: {
    test: c => rgbColorRegex.test(c),
    parse: v => v.match(rgbColorRegex).slice(1, 4).map(Number),
    prepare: v => `rgb(${v.map(Math.round).join(', ')})`,
    interpolate: lerpArray,
  },
  rgbaColor: {
    test: c => rgbaColorRegex.test(c),
    parse: v => v.match(rgbaColorRegex).slice(1, 5).map(Number),
    prepare: v => `rgba(${v.slice(0, 3).map(Math.round).join(', ')}, ${v[3]})`,
    interpolate: lerpArray,
  },
};

export const getValueType = v => {
  return Object.keys(types).find(key => types[key].test(v));
};

export default types;
