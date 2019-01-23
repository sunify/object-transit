import tweeen from 'tweeen';

export default function transit(source, target, { duration = 300, easing } = {}) {
  const start = { ...source };
  const keys = (
    Object.keys(start)
      .filter(key => typeof start[key] === 'number')
      .filter(key => typeof target[key] === 'number')
  );
  return tweeen(0, 1, (percent) => {
    keys.forEach(key => {
      source[key] = start[key] + (target[key] - start[key]) * percent
    });
  }, {
    duration,
    easing,
  });
}