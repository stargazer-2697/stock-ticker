import * as angular from "angular";

import WebSocketProvider from "./web-socket.service";

export default angular.module("prx.stockTickerApp.webSocket", [])
    .provider("prxWebSocket", WebSocketProvider);