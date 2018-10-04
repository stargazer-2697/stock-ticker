import * as angular from "angular";

import StockTickerComponent from "./stock-ticker.component";

export default angular.module("prx.stockTickerApp.stockTicker", [])
    .component("prxStockTicker", StockTickerComponent);