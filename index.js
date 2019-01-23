"use strict";

exports.__esModule = true;
exports.default = transit;

var _tweeen = _interopRequireDefault(require("tweeen"));

var _rgbHex = _interopRequireDefault(require("rgb-hex"));

var _hexRgb = _interopRequireDefault(require("hex-rgb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var hexColorRegex = /^#(?=[0-9a-fA-F]*$)(?:.{3}|.{6})$/;

var isNumber = function isNumber(n) {
  return typeof n === 'number';
};

var isColor = function isColor(c) {
  return hexColorRegex.test(c);
};

var getValueType = function getValueType(v) {
  if (isNumber(v)) {
    return 'number';
  }

  if (isColor(v)) {
    return 'color';
  }

  return undefined;
};

var parseValue = function parseValue(value, type) {
  if (type === 'color') {
    return (0, _hexRgb.default)(value, {
      format: 'array'
    });
  }

  return value;
};

var newNumber = function newNumber(start, end, percent) {
  return start + (end - start) * percent;
};

var newValue = function newValue(keyType, percent) {
  if (keyType.type === 'color') {
    var value = keyType.start.slice(0, 3).map(function (n, i) {
      return newNumber(n, keyType.end[i], percent);
    });
    return "#" + _rgbHex.default.apply(void 0, value);
  }

  return newNumber(keyType.start, keyType.end, percent);
};

function transit(source, cb) {
  var state = _extends({}, source);

  var currentTweeen;
  return {
    to: function to(target, _temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          _ref$duration = _ref.duration,
          duration = _ref$duration === void 0 ? 300 : _ref$duration,
          easing = _ref.easing,
          end = _ref.end,
          options = _objectWithoutPropertiesLoose(_ref, ["duration", "easing", "end"]);

      var targetKeys = Object.keys(target).filter(function (key) {
        return getValueType(target[key]) !== undefined;
      });
      var keys = targetKeys.filter(function (key) {
        return getValueType(state[key]) !== undefined;
      });
      targetKeys.filter(function (key) {
        return getValueType(state[key]) === undefined;
      }).forEach(function (key) {
        state[key] = target[key];
      });
      var keyTypes = keys.reduce(function (types, key) {
        var type = getValueType(state[key]);
        types[key] = {
          type: type,
          start: parseValue(state[key], type),
          end: parseValue(target[key], type)
        };
        return types;
      }, {});

      if (currentTweeen) {
        currentTweeen();
      }

      currentTweeen = (0, _tweeen.default)(0, 1, function (percent) {
        var patch = {};
        keys.forEach(function (key) {
          patch[key] = newValue(keyTypes[key], percent);
        });
        Object.assign(state, patch);

        if (typeof cb === 'function') {
          cb(state);
        }
      }, _extends({}, options, {
        duration: duration,
        easing: easing,
        end: typeof end === 'function' && function () {
          end(state);
        }
      }));
      return currentTweeen;
    }
  };
}