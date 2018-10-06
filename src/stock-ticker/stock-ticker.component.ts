import * as ng from "angular";

class StockTickerComponent implements ng.IComponentOptions {
    templateUrl = "stock-ticker/stock-ticker.component.html";
    bindings = {
        stock: '<'
    }
}

export default new StockTickerComponent();