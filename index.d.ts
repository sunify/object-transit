import { TweenParams } from 'tweeen';
declare module 'object-transit' {
  export type Obj = { [key: string]: string | number };
  export type Params<T> = {
    end?: (result: T) => void;
  } & TweenParams;
  export type Stop = () => void;
  export type Instance<T extends Obj> = Methods<T> & T;
  export type Methods<T extends Obj> = {
    to(target: T, params: Params<T>): Instance<T>;
    assign(target: T): Instance<T>;
    stop(): Instance<T>;
  };

  function transit<T extends Obj>(object: T, cb: (object: T) => void): Instance<T>;

  export default transit;
}