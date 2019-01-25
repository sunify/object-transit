import tweeen, { TweenParams } from 'tweeen';
import { updateValues, applyNewKeys } from './utils';

export type Params<T> = {
  end?: (result: T) => void;
} & TweenParams;

export default function transit<T extends Object>(
  initial: T,
  cb: (state: T) => void
) {
  const state = Object.assign({}, initial);
  let currentTweeen: any;

  const instance = {
    assign<R>(target: R) {
      Object.assign(state, target);
      if (typeof cb === 'function') {
        cb(state);
      }
      return proxy as T & R & typeof instance;
    },
    stop() {
      if (currentTweeen) {
        currentTweeen();
        currentTweeen = undefined;
      }
    },
    to<R>(target: R, options: Params<T & R> = {}) {
      const source = Object.assign({}, state);
      applyNewKeys(state, target);
      this.stop();

      currentTweeen = tweeen(
        0,
        1,
        percent => {
          updateValues(state, source, target, percent);
          if (typeof cb === 'function') {
            cb(state as T & R);
          }
        },
        Object.assign({}, options, {
          end: () => {
            if (typeof options.end === 'function') {
              options.end(state as T & R);
            }
          }
        })
      );

      return proxy as T & R & typeof instance;
    }
  };

  const proxy = new Proxy<T & typeof instance>(state as any, {
    get(obj, prop) {
      if (obj.hasOwnProperty(prop)) {
        return (obj as any)[prop as string];
      }

      return (instance as any)[prop];
    }
  });

  return proxy;
}
