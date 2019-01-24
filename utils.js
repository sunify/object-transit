"use strict";

exports.__esModule = true;
exports.applyNewKeys = exports.buildKeyTypes = exports.updateValues = void 0;

var _types = _interopRequireWildcard(require("./types"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var updateValues = function updateValues(state, keyTypes, percent) {
  var patch = {};
  Object.keys(keyTypes).forEach(function (key) {
    var _keyTypes$key = keyTypes[key],
        type = _keyTypes$key.type,
        start = _keyTypes$key.start,
        end = _keyTypes$key.end;
    patch[key] = _types.default[type].prepare(_types.default[type].interpolate(start, end, percent));
  });
  Object.assign(state, patch);
};

exports.updateValues = updateValues;

var buildKeyTypes = function buildKeyTypes(source, target) {
  var targetKeys = Object.keys(target).filter(function (key) {
    return (0, _types.getValueType)(target[key]) !== undefined;
  });
  return targetKeys.filter(function (key) {
    return (0, _types.getValueType)(source[key]) !== undefined;
  }).reduce(function (acc, key) {
    var type = (0, _types.getValueType)(source[key]);
    acc[key] = {
      type: type,
      start: _types.default[type].parse(source[key]),
      end: _types.default[type].parse(target[key])
    };
    return acc;
  }, {});
};

exports.buildKeyTypes = buildKeyTypes;

var applyNewKeys = function applyNewKeys(state, target) {
  Object.keys(target).filter(function (key) {
    return (0, _types.getValueType)(target[key]) !== undefined;
  }).filter(function (key) {
    return (0, _types.getValueType)(state[key]) === undefined;
  }).forEach(function (key) {
    state[key] = target[key];
  });
};

exports.applyNewKeys = applyNewKeys;