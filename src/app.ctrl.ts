/// <reference path="../node_modules/@types/angular-cookies/index.d.ts" />
import * as angular from "angular";

import { IController, IScope, cookies as ngCookies, ITimeoutService } from "angular";
import { WebSocketFactory } from "./web-socket/web-socket.service";
import availableSymbols from "./symbols";

const COOKIE_NAME = "prxAppController.symbols";
const DEFAULT_SYMBOLS = ['BTC', 'ETH', 'LTC', 'XRP', 'BCH', 'DSH', 'NEO', 'MGO', 'ELF', 'ZEC'];

export default class AppController implements IController {
    available = availableSymbols.slice();
    symbols = [] as string[];
    quotes = {} as { [symbol: string]: BitFinexQuote };
    init = true;
    loading = false;
    selectNew = false;

    private socket: WebSocket;
    private channels = {} as {[symbol: string]: number} & {[channelId: number]: string};

    static $inject = ["prxWebSocket", "$cookies", "$scope", "$timeout"];
    constructor(
        private prxWebSocket: WebSocketFactory,
        private $cookies: ngCookies.ICookiesService,
        private $scope: IScope,
        private $timeout: ITimeoutService
    ) { }

    $onInit() {
        this.prxWebSocket.openSocket('wss://api.bitfinex.com/ws/2', {
            message: (message: string) => this.handleMessage(angular.fromJson(message))
        }).then(socket => {
            if (this.$scope.$root == null) {
                socket.close(); // Controller was destroyed before the socket finished connecting, so close it now
            } else {
                this.socket = socket;

                let initSymbols: string[] = this.$cookies.getObject(COOKIE_NAME) || DEFAULT_SYMBOLS;
                initSymbols.forEach(symbol => this.add(symbol));
                let cancelWatch = this.$scope.$watch(() => this.symbols.length, (length: number) => {
                    if (length >= initSymbols.length) {
                        this.init = false;
                        cancelWatch();
                    }
                });
            }
        });
    }

    $onDestroy() {
        if (this.socket != null) {
            this.socket.close();
        }
    }

    add(symbol: string) {
        if (symbol != null) {
            this.selectNew = false;
            this.available.splice(this.available.indexOf(symbol), 1);
            this.socket.send(angular.toJson({
                event: 'subscribe',
                channel: 'ticker',
                symbol: 't' + symbol + 'USD'
            }));
            this.$scope.$applyAsync(() => this.loading = true);
        }
    }

    remove(symbol: string) {
        let index = this.symbols.indexOf(symbol);
        if (index >= 0) {
            this.selectNew = false;
            let shortName = symbol.slice(0, 3);
            this.available.splice(this.findSymbolIndex(shortName), 0, shortName);

            this.symbols.splice(index, 1);
            this.storeSymbols();

            this.socket.send(angular.toJson({
                event: "unsubscribe",
                chanId: this.channels[symbol]
            }));
        }
    }

    private storeSymbols() {
        this.$cookies.putObject(COOKIE_NAME, this.symbols.map((symbol: string) => symbol.slice(0, 3)));
    }

    private findSymbolIndex(symbol: string) {
        for (let i = 0; i < this.available.length; ++i) {
            if (this.available[i] > symbol) {
                return i;
            }
        }

        return this.available.length;
    }

    private handleMessage(message: any) {
        if (message.event) {
            this.handleEvent(message);
        } else if (angular.isArray(message) && message[0] in this.channels && message[1] !== "hb") {
            let symbol = this.channels[message[0]];
            this.quotes[symbol] = new BitFinexQuote(message[1]);
        }
    }

    private handleEvent(message: any) {
        switch (message.event) {
            case "subscribed":
                this.channels[message.pair] = message.chanId;
                this.channels[message.chanId] = message.pair;

                this.$timeout(() => {
                    this.symbols.push(message.pair);
                    this.storeSymbols();
                    this.loading = false;
                }, 400); // Pad a small delay to smoothen the transition
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

export class BitFinexQuote {
    readonly time: number;

    constructor(private data: any[]) {}

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