import tweeen from 'tweeen';
import rgbHex from 'rgb-hex';
import hexRgb from 'hex-rgb';

const hexColorRegex = /^#(?=[0-9a-fA-F]*$)(?:.{3}|.{6})$/;

const types = {
  number: {
    test: n => typeof n === 'number',
    parse: a => a,
    prepare: a => a,
    lerp: (start, end, percent) => start + (end - start) * percent,
  },
  color: {
    test: c => hexColorRegex.test(c),
    parse: v => hexRgb(v, { format: 'array' }),
    prepare: v => `#${rgbHex(...v)}`,
    lerp: (start, end, percent) => start.slice(0, 3).map((n, i) => types.number.lerp(n, end[i], percent)),
  }
}

const getValueType = v => {
  return Object.keys(types).find(key => types[key].test(v));
}

export default function transit(source, cb) {
  const state = { ...source };
  let currentTweeen;

  const proxy = new Proxy(state, {
    get(obj, prop) {
      if (obj.hasOwnProperty(prop)) {
        return obj[prop];
      }

      return instance[prop];
    }
  });

  const instance = {
    assign(target) {
      Object.assign(state, target);
      if (typeof cb === 'function') {
        cb(state);
      }
      return proxy;
    },
    stop() {
      if (currentTweeen) {
        currentTweeen();
        currentTweeen = undefined;
      }
    },
    to(target, { duration = 300, easing, end, ...options } = {}) {
      const targetKeys = Object.keys(target).filter(key => getValueType(target[key]) !== undefined);
      const keys = targetKeys.filter(key => getValueType(state[key]) !== undefined);

      targetKeys.filter(key => getValueType(state[key]) === undefined).forEach(key => {
        state[key] = target[key];
      });

      const keyTypes = (
        keys
          .reduce((acc, key) => {
            const type = getValueType(state[key]);
            acc[key] = {
              type,
              start: types[type].parse(state[key]),
              end: types[type].parse(target[key]),
            }

            return acc;
          }, {})
      );

      this.stop();

      currentTweeen = tweeen(0, 1, (percent) => {
        const patch = {};
        keys.forEach(key => {
          const { type, start, end } = keyTypes[key];
          patch[key] = types[type].prepare(
            types[type].lerp(start, end, percent)
          );
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

      return proxy;
    }
  };

  return proxy;
}