import * as angular from "angular";

import {WebSocketFactory} from "./web-socket/web-socket.service";

export default class AppController {
    stocks: Array<string>;
    quotes: { [symbol: string]: IexStock } = {};

    static $inject = ["prxWebSocket"];
    constructor(prxWebSocket: WebSocketFactory) {
        this.stocks = ["SNAP", "FB", "AIG+"];

        prxWebSocket.openSocket('https://ws-api.iextrading.com/1.0/tops', {
            message: (message: string) => this.handleMessage(angular.fromJson(message) as IexStock),
        }).then(socket => {
            socket.emit('subscribe', this.stocks.join(','));
        });
    }

    private handleMessage(message: IexStock) {
        this.quotes[message.symbol] = message;
    }
}

export interface IexStock {
    "symbol": string,
    "marketPercent": number,
    "bidSize": number,
    "bidPrice": number,
    "askSize": number,
    "askPrice": number,
    "volume": number,
    "lastSalePrice": number,
    "lastSaleSize": number,
    "lastSaleTime": number,
    "lastUpdated": number,
    "sector": string,
    "securityType": string
}