import tweeen from 'tweeen';
import rgbHex from 'rgb-hex';
import hexRgb from 'hex-rgb';

const hexColorRegex = /^#(?=[0-9a-f]*$)(?:.{3}|.{6})$/;
const isNumber = n => typeof n === 'number';
const isColor = c => hexColorRegex.test(c);

const getValueType = v => {
  if (isNumber(v)) {
    return 'number';
  }

  if (isColor(v)) {
    return 'color';
  }

  return undefined;
}

const parseValue = (value, type) => {
  if (type === 'color') {
    return hexRgb(value, { format: 'array' });
  }

  return value;
}

const newNumber = (start, end, percent) => {
  return start + (end - start) * percent;
}

const newValue = (keyType, percent) => {
  if (keyType.type === 'color') {
    const value = keyType.start.slice(0, 3).map((n, i) => newNumber(n, keyType.end[i], percent))
    return `#${rgbHex(...value)}`;
  }
  return newNumber(keyType.start, keyType.end, percent);
}

export default function transit(source, target, cb, { duration = 300, easing } = {}, end) {
  const result = { ...source };
  const keys = (
    Object.keys(source)
      .filter(key => getValueType(source[key]) !== undefined)
      .filter(key => getValueType(target[key]) !== undefined)
  );
  const keyTypes = (
    keys
      .reduce((types, key) => {
        const type = getValueType(source[key]);
        types[key] = {
          type,
          start: parseValue(source[key], type),
          end: parseValue(target[key], type),
        }

        return types;
      }, {})
  );

  return tweeen(0, 1, (percent) => {
    const patch = {};
    keys.forEach(key => {
      patch[key] = newValue(keyTypes[key], percent);
    });
    Object.assign(result, patch);
    if (typeof cb === 'function') {
      cb(result);
    }
  }, {
    duration,
    easing,
    end: typeof end === 'function' && (() => {
      end(result);
    })
  });
}