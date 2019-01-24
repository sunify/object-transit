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
var rgbColorRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
var rgbaColorRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+(?:\.\d+)?)\)$/;

var lerp = function lerp(start, end, percent) {
  return start + (end - start) * percent;
};

var lerpArray = function lerpArray(start, end, percent) {
  return start.map(function (n, i) {
    return lerp(n, end[i], percent);
  });
};

var types = {
  number: {
    test: function test(n) {
      return typeof n === 'number';
    },
    parse: function parse(a) {
      return a;
    },
    prepare: function prepare(a) {
      return a;
    },
    interpolate: lerp
  },
  hexColor: {
    test: function test(c) {
      return hexColorRegex.test(c);
    },
    parse: function parse(v) {
      return (0, _hexRgb.default)(v, {
        format: 'array'
      }).slice(0, 3);
    },
    prepare: function prepare(v) {
      return "#" + _rgbHex.default.apply(void 0, v);
    },
    interpolate: lerpArray
  },
  rgbColor: {
    test: function test(c) {
      return rgbColorRegex.test(c);
    },
    parse: function parse(v) {
      return v.match(rgbColorRegex).slice(1, 4).map(Number);
    },
    prepare: function prepare(v) {
      return "rgb(" + v.map(Math.round).join(', ') + ")";
    },
    interpolate: lerpArray
  },
  rgbaColor: {
    test: function test(c) {
      return rgbaColorRegex.test(c);
    },
    parse: function parse(v) {
      return v.match(rgbaColorRegex).slice(1, 5).map(Number);
    },
    prepare: function prepare(v) {
      return "rgba(" + v.slice(0, 3).map(Math.round).join(', ') + ", " + v[3] + ")";
    },
    interpolate: lerpArray
  }
};

var getValueType = function getValueType(v) {
  return Object.keys(types).find(function (key) {
    return types[key].test(v);
  });
};

function transit(source, cb) {
  var state = _extends({}, source);

  var currentTweeen;
  var proxy = new Proxy(state, {
    get: function get(obj, prop) {
      if (obj.hasOwnProperty(prop)) {
        return obj[prop];
      }

      return instance[prop];
    }
  });
  var instance = {
    assign: function assign(target) {
      Object.assign(state, target);

      if (typeof cb === 'function') {
        cb(state);
      }

      return proxy;
    },
    stop: function stop() {
      if (currentTweeen) {
        currentTweeen();
        currentTweeen = undefined;
      }
    },
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
      var keyTypes = keys.reduce(function (acc, key) {
        var type = getValueType(state[key]);
        acc[key] = {
          type: type,
          start: types[type].parse(state[key]),
          end: types[type].parse(target[key])
        };
        return acc;
      }, {});
      this.stop();
      currentTweeen = (0, _tweeen.default)(0, 1, function (percent) {
        var patch = {};
        keys.forEach(function (key) {
          var _keyTypes$key = keyTypes[key],
              type = _keyTypes$key.type,
              start = _keyTypes$key.start,
              end = _keyTypes$key.end;
          patch[key] = types[type].prepare(types[type].interpolate(start, end, percent));
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
      return proxy;
    }
  };
  return proxy;
}