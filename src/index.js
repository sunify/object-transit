import tweeen from 'tweeen';
import rgbHex from 'rgb-hex';
import hexRgb from 'hex-rgb';

const hexColorRegex = /^#(?=[0-9a-fA-F]*$)(?:.{3}|.{6})$/;
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

export default function transit(source, cb) {
  const state = { ...source };
  let currentTweeen;

  return {
    to(target, { duration = 300, easing, end, ...options } = {}) {
      const targetKeys = Object.keys(target).filter(key => getValueType(target[key]) !== undefined);
      const keys = targetKeys.filter(key => getValueType(state[key]) !== undefined);

      targetKeys.filter(key => getValueType(state[key]) === undefined).forEach(key => {
        state[key] = target[key];
      });

      const keyTypes = (
        keys
          .reduce((types, key) => {
            const type = getValueType(state[key]);
            types[key] = {
              type,
              start: parseValue(state[key], type),
              end: parseValue(target[key], type),
            }

            return types;
          }, {})
      );

      if (currentTweeen) {
        currentTweeen();
      }

      currentTweeen = tweeen(0, 1, (percent) => {
        const patch = {};
        keys.forEach(key => {
          patch[key] = newValue(keyTypes[key], percent);
        });
        Object.assign(state, patch);
        if (typeof cb === 'function') {
          cb(state);
        }
      }, {
        ...options,
        duration,
        easing,
        end: typeof end === 'function' && (() => {
          end(state);
        }),
      });

      return currentTweeen;
    }
  };
}