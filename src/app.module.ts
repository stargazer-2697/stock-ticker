import * as angular from "angular";

import StockTickerModule from "./stock-ticker/stock-ticker.module";
import WebSocketModule from "./web-socket/web-socket.module";
import AppController from "./app.ctrl";

export default angular.module("prx.stockTickerApp", [
    StockTickerModule.name,
    WebSocketModule.name
]).controller("AppController", AppController);