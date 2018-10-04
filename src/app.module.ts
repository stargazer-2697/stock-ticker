import * as angular from "angular";

import StockTickerModule from "./stock-ticker/stock-ticker.module";

export default angular.module("prx.stockTickerApp", [
    StockTickerModule.name
]);