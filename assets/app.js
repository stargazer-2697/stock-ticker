(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Export modules
module.exports = require("./src/app.module");

},{"./src/app.module":3}],2:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
const symbols_1 = require("./symbols");
class AppController {
    constructor(prxWebSocket, $scope) {
        this.prxWebSocket = prxWebSocket;
        this.$scope = $scope;
        this.available = symbols_1.default.slice();
        this.stocks = [];
        this.quotes = {};
        this.selectNew = false;
        this.channels = {};
    }
    $onInit() {
        this.prxWebSocket.openSocket('wss://api.bitfinex.com/ws/2', {
            message: (message) => this.handleMessage(angular.fromJson(message))
        }).then(socket => {
            if (this.$scope.$root == null) {
                socket.close(); // Controller was destroyed before the socket finished connecting, so close it now
            }
            else {
                this.socket = socket;
                ['BTC', 'ETH', 'LTC', 'DSH', 'XRP'].forEach(symbol => this.add(symbol));
            }
        });
    }
    $onDestroy() {
        if (this.socket != null) {
            this.socket.close();
        }
    }
    add(symbol) {
        if (symbol != null) {
            this.selectNew = false;
            this.available.splice(this.available.indexOf(symbol), 1);
            this.socket.send(angular.toJson({
                event: 'subscribe',
                channel: 'ticker',
                symbol: 't' + symbol + 'USD'
            }));
        }
    }
    remove(symbol) {
        let index = this.stocks.indexOf(symbol);
        if (index >= 0) {
            this.selectNew = false;
            let shortName = symbol.slice(0, 3);
            this.available.splice(this.findSymbolIndex(shortName), 0, shortName);
            this.stocks.splice(index, 1);
            this.socket.send(angular.toJson({
                event: "unsubscribe",
                chanId: this.channels[symbol]
            }));
        }
    }
    findSymbolIndex(symbol) {
        for (let i = 0; i < this.available.length; ++i) {
            if (this.available[i] > symbol) {
                return i;
            }
        }
        return this.available.length;
    }
    handleMessage(message) {
        if (message.event) {
            this.handleEvent(message);
        }
        else if (angular.isArray(message) && message[0] in this.channels && message[1] !== "hb") {
            let symbol = this.channels[message[0]];
            this.quotes[symbol] = new BitFinexQuote(message[1]);
        }
    }
    handleEvent(message) {
        switch (message.event) {
            case "subscribed":
                this.stocks.push(message.pair);
                this.channels[message.pair] = message.chanId;
                this.channels[message.chanId] = message.pair;
                break;
            case "unsubscribed":
                if (message.status === "OK") {
                    let symbol = this.channels[message.chanId];
                    delete this.channels[message.chanId];
                    delete this.channels[symbol];
                    delete this.quotes[symbol];
                }
        }
    }
}
AppController.$inject = ["prxWebSocket", "$scope"];
exports.default = AppController;
class BitFinexQuote {
    constructor(data) {
        this.data = data;
    }
    get bid() {
        return this.data[0];
    }
    get bidSize() {
        return this.data[1];
    }
    get ask() {
        return this.data[2];
    }
    get askSize() {
        return this.data[3];
    }
    get dailyChange() {
        return this.data[4];
    }
    get dailyChangePerc() {
        return this.data[5];
    }
    get lastPrice() {
        return this.data[6];
    }
    get volume() {
        return this.data[7];
    }
    get high() {
        return this.data[8];
    }
    get low() {
        return this.data[9];
    }
}
exports.BitFinexQuote = BitFinexQuote;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./symbols":6}],3:[function(require,module,exports){
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
},{"./app.ctrl":2,"./stock-ticker/stock-ticker.module":5,"./web-socket/web-socket.module":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StockTickerComponent {
    constructor() {
        this.templateUrl = "stock-ticker/stock-ticker.component.html";
        this.bindings = {
            symbol: '<',
            price: '<',
            delta: '<',
            deltaPerc: '<perc',
            time: '<',
            volume: '<'
        };
        this.controller = StockTickerComponentController;
    }
}
class StockTickerComponentController {
    constructor($timeout) {
        this.$timeout = $timeout;
    }
    $onChanges(changes) {
        if (changes.price && changes.price.previousValue != null && !changes.price.isFirstChange()) {
            this.tick = changes.price.currentValue > changes.price.previousValue ? "up" : "down";
            this.flash = false;
            this.$timeout(() => this.flash = true);
            if (!changes.time) {
                this.time = Date.now();
            }
        }
    }
}
StockTickerComponentController.$inject = ["$timeout"];
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    'ABS', 'AGI', 'AID', 'AIO', 'ANT', 'ATM', 'AUC', 'AVT',
    'BAT', 'BBN', 'BCH', 'BCI', 'BFT', 'BNT', 'BOX', 'BTC', 'BTG',
    'CBT', 'CFI', 'CND', 'CNN', 'CTX',
    'DAD', 'DAI', 'DAT', 'DGX', 'DSH', 'DTA', 'DTH',
    'EDO', 'ELF', 'EOS', 'ESS', 'ETC', 'ETH', 'ETP',
    'FSN', 'FUN',
    'GNT', 'GOT',
    'HOT',
    'IOS', 'IOT', 'IQX',
    'KNC',
    'LRC', 'LTC', 'LYM',
    'MAN', 'MGO', 'MIT', 'MKR', 'MNA', 'MTN',
    'NCA', 'NEO', 'NIO',
    'ODE', 'OMG', 'ORS',
    'PAI', 'POA', 'POY',
    'QSH', 'QTM',
    'RCN', 'RDN', 'REP', 'REQ', 'RLC', 'RRT', 'RTE',
    'SAN', 'SEE', 'SEN', 'SNG', 'SNT', 'SPK', 'STJ',
    'TKN', 'TNB', 'TRX',
    'UTK', 'UTN',
    'VEE', 'VET',
    'WAX', 'WPR',
    'XLM', 'XMR', 'XRA', 'XRP', 'XTZ', 'XVG',
    'YYW',
    'ZCN', 'ZEC', 'ZIL', 'ZRX'
];

},{}],7:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
const web_socket_service_1 = require("./web-socket.service");
exports.default = angular.module("prx.stockTickerApp.webSocket", [])
    .provider("prxWebSocket", web_socket_service_1.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./web-socket.service":8}],8:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
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
        let socket = new WebSocket(url), defer = this.$q.defer();
        socket.addEventListener("open", () => defer.resolve(socket));
        if (callbacks != null) {
            let $scope = this.$rootScope;
            angular.forEach(callbacks, (callback, eventName) => {
                socket.addEventListener(eventName, (e) => {
                    console.log(e.data);
                    $scope.$apply(() => callback.call(this, e.data));
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
