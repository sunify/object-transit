parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"VCqk":[function(require,module,exports) {
module.exports=function(n,e){var t=1e3/e,o=Date.now(),a=!1;return requestAnimationFrame(function e(){a||requestAnimationFrame(e);var r=Date.now(),i=r-o;i>t&&!a&&(o=r-i%t,n(r))}),n(Date.now()),function(){a=!0}};
},{}],"+p/l":[function(require,module,exports) {
var n=require("run-with-fps");function t(n){return n}function r(r,e,o,u){var i=(u=u||{}).duration||300,a=u.easing||t,f=u.fps||60,c=u.end,p=!1,s=Date.now(),d=n(function(){var n=Math.min(Date.now()-s,i);o(r+(e-r)*a(n/i)),(n===i||p)&&(d(),"function"==typeof c&&c())},f);return function(){p=!0}}module.exports=r;
},{"run-with-fps":"VCqk"}],"VgR0":[function(require,module,exports) {
"use strict";module.exports=((e,t,r,o)=>{const n=(e+(o||"")).toString().includes("%");if("string"==typeof e){const n=e.match(/(0?\.?\d{1,3})%?\b/g).map(Number);e=n[0],t=n[1],r=n[2],o=n[3]}else void 0!==o&&(o=parseFloat(o));if("number"!=typeof e||"number"!=typeof t||"number"!=typeof r||e>255||t>255||r>255)throw new TypeError("Expected three numbers below 256");if("number"==typeof o){if(!n&&o>=0&&o<=1)o=Math.round(255*o);else{if(!(n&&o>=0&&o<=100))throw new TypeError("Expected alpha value (".concat(o,") as a fraction or percentage"));o=Math.round(255*o/100)}o=(256|o).toString(16).slice(1)}else o="";return(r|t<<8|e<<16|1<<24).toString(16).slice(1)+o});
},{}],"LJ5r":[function(require,module,exports) {
"use strict";var e="a-f\\d",t="#?[".concat(e,"]{3}[").concat(e,"]?"),r="#?[".concat(e,"]{6}([").concat(e,"]{2})?"),n=new RegExp("[^#".concat(e,"]"),"gi"),a=new RegExp("^".concat(t,"$|^").concat(r,"$"),"i");module.exports=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("string"!=typeof e||n.test(e)||!a.test(e))throw new TypeError("Expected a valid hex string");var r=255;8===(e=e.replace(/^#/,"")).length&&(r=parseInt(e.slice(6,8),16)/255,e=e.substring(0,6)),4===e.length&&(r=parseInt(e.slice(3,4).repeat(2),16)/255,e=e.substring(0,3)),3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]);var c=parseInt(e,16),s=c>>16,o=c>>8&255,i=255&c;return"array"===t.format?[s,o,i,r]:{red:s,green:o,blue:i,alpha:r}};
},{}],"Omma":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.getValueType=void 0;var r=e(require("rgb-hex")),t=e(require("hex-rgb"));function e(r){return r&&r.__esModule?r:{default:r}}function n(r){return a(r)||u(r)||o()}function o(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function u(r){if(Symbol.iterator in Object(r)||"[object Arguments]"===Object.prototype.toString.call(r))return Array.from(r)}function a(r){if(Array.isArray(r)){for(var t=0,e=new Array(r.length);t<r.length;t++)e[t]=r[t];return e}}var i=/^#(?=[0-9a-fA-F]*$)(?:.{3}|.{6})$/,c=/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,p=/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+(?:\.\d+)?)\)$/,f=function(r,t,e){return r+(t-r)*e},s=function(r,t,e){return r.map(function(r,n){return f(r,t[n],e)})},l={number:{test:function(r){return"number"==typeof r},parse:function(r){return r},prepare:function(r){return r},interpolate:f},hexColor:{test:function(r){return i.test(r)},parse:function(r){return(0,t.default)(r,{format:"array"}).slice(0,3)},prepare:function(t){return"#".concat(r.default.apply(void 0,n(t)))},interpolate:s},rgbColor:{test:function(r){return c.test(r)},parse:function(r){return r.match(c).slice(1,4).map(Number)},prepare:function(r){return"rgb(".concat(r.map(Math.round).join(", "),")")},interpolate:s},rgbaColor:{test:function(r){return p.test(r)},parse:function(r){return r.match(p).slice(1,5).map(Number)},prepare:function(r){return"rgba(".concat(r.slice(0,3).map(Math.round).join(", "),", ").concat(r[3],")")},interpolate:s}},d=function(r){return Object.keys(l).find(function(t){return l[t].test(r)})};exports.getValueType=d;var b=l;exports.default=b;
},{"rgb-hex":"VgR0","hex-rgb":"LJ5r"}],"K0yk":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.applyNewKeys=exports.buildKeyTypes=exports.updateValues=void 0;var e=t(require("./types"));function t(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}var r=function(t,r,n){var u={};Object.keys(r).forEach(function(t){var o=r[t],a=o.type,p=o.start,i=o.end;u[t]=e.default[a].prepare(e.default[a].interpolate(p,i,n))}),Object.assign(t,u)};exports.updateValues=r;var n=function(t,r){return Object.keys(r).filter(function(t){return void 0!==(0,e.getValueType)(r[t])}).filter(function(r){return void 0!==(0,e.getValueType)(t[r])}).reduce(function(n,u){var o=(0,e.getValueType)(t[u]);return n[u]={type:o,start:e.default[o].parse(t[u]),end:e.default[o].parse(r[u])},n},{})};exports.buildKeyTypes=n;var u=function(t,r){Object.keys(r).filter(function(t){return void 0!==(0,e.getValueType)(r[t])}).filter(function(r){return void 0===(0,e.getValueType)(t[r])}).forEach(function(e){t[e]=r[e]})};exports.applyNewKeys=u;
},{"./types":"Omma"}],"H99C":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=f;var e=n(require("tweeen")),t=require("./utils");function n(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(null==e)return{};var n,r,u=o(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(u[n]=e[n])}return u}function o(e,t){if(null==e)return{};var n,r,o={},u=Object.keys(e);for(r=0;r<u.length;r++)n=u[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function f(n,o){var i,f=u({},n),c=new Proxy(f,{get:function(e,t){return e.hasOwnProperty(t)?e[t]:a[t]}}),a={assign:function(e){return Object.assign(f,e),"function"==typeof o&&o(f),c},stop:function(){i&&(i(),i=void 0)},to:function(n){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},l=a.duration,s=void 0===l?300:l,p=a.easing,y=a.end,b=r(a,["duration","easing","end"]),d=(0,t.buildKeyTypes)(f,n);return(0,t.applyNewKeys)(f,n),this.stop(),i=(0,e.default)(0,1,function(e){(0,t.updateValues)(f,d,e),"function"==typeof o&&o(f)},u({},b,{duration:s,easing:p,end:"function"==typeof y&&function(){y(f)}})),c}};return c}
},{"tweeen":"+p/l","./utils":"K0yk"}],"Focm":[function(require,module,exports) {
"use strict";var e=t(require("./src/index"));function t(e){return e&&e.__esModule?e:{default:e}}var n=document.getElementById("obj"),c=document.getElementById("json"),a=document.getElementById("result"),o=document.getElementById("grad"),r=function(e){n.style.transform="translate(".concat(e.left,"px, 40px) scale(").concat(e.scale,")"),n.style.color=e.color||"#000",n.style.background="linear-gradient(".concat(e.bg1,", ").concat(e.bg2,")"),n.innerText=Math.round(e.count),a.value=JSON.stringify(e,void 0,2)},l=JSON.parse(c.value),u=(0,e.default)(l,r);r(l),console.log(u);var d={duration:300,fps:60,easing:function(e){return e<.5?2*e*e:(4-2*e)*e-1}},i=c.value;c.addEventListener("keyup",function(){i!==c.value&&(u.to(JSON.parse(c.value),d),i=c.value)});var s=-1,f=["#cf0","#0fc","#ff0","#f0c","#fc0"],g=(0,e.default)({c1:f[f.length-1],c2:f[0]},function(e){var t=e.c1,n=e.c2;o.style.backgroundImage="linear-gradient(".concat(t,", ").concat(n,")")}),v=function e(){var t=((s=(s+1)%f.length)+1)%f.length;g.to({c1:f[s],c2:f[t]},{end:e,duration:2e3})};v();
},{"./src/index":"H99C"}]},{},["Focm"], null)
//# sourceMappingURL=object-transit.be052fae.map