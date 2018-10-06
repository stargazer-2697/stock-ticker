import * as angular from "angular";

import { IController } from "angular";
import { WebSocketFactory } from "./web-socket/web-socket.service";

export default class AppController implements IController {
    stocks = ["SNAP", "FB", "AIG+"];
    quotes = {} as { [symbol: string]: IexStock };

    private socket: SocketIOClient.Socket;

    static $inject = ["prxWebSocket"];
    constructor(private prxWebSocket: WebSocketFactory) {}

    $onInit() {
        this.prxWebSocket.openSocket('https://ws-api.iextrading.com/1.0/tops', {
            message: (message: string) => this.handleMessage(angular.fromJson(message) as IexStock),
        }).then(socket => {
            this.socket = socket;
            socket.emit('subscribe', this.stocks.join(','));
        });
    }

    $onDestroy() {
        this.socket.close();
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