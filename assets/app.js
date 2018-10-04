(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Export modules
module.exports = require("./src/app.module");

},{"./src/app.module":2}],2:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
const stock_ticker_module_1 = require("./stock-ticker/stock-ticker.module");
exports.default = angular.module("prx.stockTickerApp", [
    stock_ticker_module_1.default.name
]);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./stock-ticker/stock-ticker.module":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StockTickerComponent {
}
exports.default = new StockTickerComponent();

},{}],4:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
const stock_ticker_component_1 = require("./stock-ticker.component");
exports.default = angular.module("prx.stockTickerApp.stockTicker", [])
    .component("prxStockTicker", stock_ticker_component_1.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./stock-ticker.component":3}]},{},[1]);
