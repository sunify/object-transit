"use strict";

exports.__esModule = true;
exports.default = exports.getValueType = void 0;

var _rgbHex = _interopRequireDefault(require("rgb-hex"));

var _hexRgb = _interopRequireDefault(require("hex-rgb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

exports.getValueType = getValueType;
var _default = types;
exports.default = _default;