import tweeen from 'tweeen';
import { updateValues, buildKeyTypes, applyNewKeys } from './utils';

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
      const keyTypes = buildKeyTypes(state, target);
      applyNewKeys(state, target);
      this.stop();

      currentTweeen = tweeen(0, 1, (percent) => {
        updateValues(state, keyTypes, percent);
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