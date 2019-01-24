"use strict";

exports.__esModule = true;
exports.default = transit;

var _tweeen = _interopRequireDefault(require("tweeen"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

      var keyTypes = (0, _utils.buildKeyTypes)(state, target);
      (0, _utils.applyNewKeys)(state, target);
      this.stop();
      currentTweeen = (0, _tweeen.default)(0, 1, function (percent) {
        (0, _utils.updateValues)(state, keyTypes, percent);

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