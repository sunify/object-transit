import { TweenParams } from 'tweeen';
declare module 'object-transit' {
  export type Obj = { [key: string]: string | number };
  export type Params = {
    end?: (result: Obj) => void;
  } & TweenParams;
  export type Stop = () => void;
  export type Methods = {
    to: (target: Obj, params: Params) => Stop;
  };

  function transit(object: Obj, cb: (object: Obj) => void): Methods;

  export default transit;
}