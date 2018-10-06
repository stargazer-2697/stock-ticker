import * as ng from "angular";
import { IScope, IComponentController, IOnChangesObject, IAugmentedJQuery, ITimeoutService } from "angular";

class StockTickerComponent implements ng.IComponentOptions {
    templateUrl = "stock-ticker/stock-ticker.component.html";
    bindings = {
        symbol: '<',
        price: '<',
        delta: '<',
        deltaPerc: '<perc',
        time: '<',
        volume: '<'
    };
    controller = StockTickerComponentController
}

class StockTickerComponentController implements IComponentController {
    symbol: string;
    price: number;
    delta: number;
    deltaPerc: number;
    time: number;
    volume: number;
    tick: string;
    flash: boolean;

    static $inject = ["$timeout"];
    constructor(private $timeout: ITimeoutService) { }

    $onChanges(changes: IOnChangesObject) {
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

export default new StockTickerComponent();