# Utility for object values transition

## Usage

```es6
import transit from 'object-transit';

const object = transit({ a: 0 }, console.log);

object.to(
  { a: 100 },
  {
    duration: 300
  }
);
```

## Demo

https://sunify.github.io/object-transit/

## Params

### List of params

- `duration` — duration in ms, defaults to `300`
- `easing` — simple easing function that takes one argument — time (from 0 to 1). Defaults to `linear`. You can use functions from [eases](https://www.npmjs.com/package/eases) or similar package
- `fps` — defaults to `60`
- `end` — transition end callback
