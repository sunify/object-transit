import types, { getValueType } from './types';

export const updateValues = (state, keyTypes, percent) => {
  const patch = {};
  Object.keys(keyTypes).forEach(key => {
    const { type, start, end } = keyTypes[key];
    patch[key] = types[type].prepare(
      types[type].interpolate(start, end, percent)
    );
  });
  Object.assign(state, patch);
}

export const buildKeyTypes = (source, target) => {
  const targetKeys = Object.keys(target).filter(key => getValueType(target[key]) !== undefined);

  return (
    targetKeys.filter(key => getValueType(source[key]) !== undefined)
      .reduce((acc, key) => {
        const type = getValueType(source[key]);
        acc[key] = {
          type,
          start: types[type].parse(source[key]),
          end: types[type].parse(target[key]),
        }

        return acc;
      }, {})
  );
}

export const applyNewKeys = (state, target) => {
  Object.keys(target)
    .filter(key => getValueType(target[key]) !== undefined)
    .filter(key => getValueType(state[key]) === undefined)
    .forEach(key => {
      state[key] = target[key];
    });
}
