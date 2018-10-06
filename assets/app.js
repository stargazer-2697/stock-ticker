(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Export modules
module.exports = require("./src/app.module");

},{"./src/app.module":3}],2:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
class AppController {
    constructor(prxWebSocket) {
        this.prxWebSocket = prxWebSocket;
        this.stocks = ["SNAP", "FB", "AIG+"];
        this.quotes = {};
    }
    $onInit() {
        this.prxWebSocket.openSocket('https://ws-api.iextrading.com/1.0/tops', {
            message: (message) => this.handleMessage(angular.fromJson(message)),
        }).then(socket => {
            this.socket = socket;
            socket.emit('subscribe', this.stocks.join(','));
        });
    }
    $onDestroy() {
        this.socket.close();
    }
    handleMessage(message) {
        this.quotes[message.symbol] = message;
    }
}
AppController.$inject = ["prxWebSocket"];
exports.default = AppController;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
const stock_ticker_module_1 = require("./stock-ticker/stock-ticker.module");
const web_socket_module_1 = require("./web-socket/web-socket.module");
const app_ctrl_1 = require("./app.ctrl");
exports.default = angular.module("prx.stockTickerApp", [
    stock_ticker_module_1.default.name,
    web_socket_module_1.default.name
]).controller("AppController", app_ctrl_1.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app.ctrl":2,"./stock-ticker/stock-ticker.module":5,"./web-socket/web-socket.module":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StockTickerComponent {
    constructor() {
        this.templateUrl = "stock-ticker/stock-ticker.component.html";
        this.bindings = {
            stock: '<'
        };
    }
}
exports.default = new StockTickerComponent();

},{}],5:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
const stock_ticker_component_1 = require("./stock-ticker.component");
exports.default = angular.module("prx.stockTickerApp.stockTicker", [])
    .component("prxStockTicker", stock_ticker_component_1.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./stock-ticker.component":4}],6:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
const web_socket_service_1 = require("./web-socket.service");
exports.default = angular.module("prx.stockTickerApp.webSocket", [])
    .provider("prxWebSocket", web_socket_service_1.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./web-socket.service":7}],7:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
const io = (typeof window !== "undefined" ? window['io'] : typeof global !== "undefined" ? global['io'] : null);
class WebSocketProvider {
    constructor() {
        this.$get = WebSocketFactory;
    }
}
exports.default = WebSocketProvider;
class WebSocketFactory {
    constructor($q, $rootScope) {
        this.$q = $q;
        this.$rootScope = $rootScope;
    }
    openSocket(url, callbacks, forceNew) {
        let socket = io(url, { forceNew: forceNew }), defer = this.$q.defer();
        socket.on("connect", () => defer.resolve(socket));
        if (callbacks != null) {
            let $scope = this.$rootScope;
            angular.forEach(callbacks, (callback, eventName) => {
                socket.on(eventName, function () {
                    let args = arguments;
                    $scope.$apply(() => callback.apply(this, args));
                });
            });
        }
        return defer.promise;
    }
}
WebSocketFactory.$inject = ['$q', '$rootScope'];
exports.WebSocketFactory = WebSocketFactory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
