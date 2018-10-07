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

    static $inject = ["$scope"];
    constructor(private $scope: IScope) { }

    $onChanges(changes: IOnChangesObject) {
        if (changes.price && changes.price.previousValue != null && !changes.price.isFirstChange()) {
            let tick = changes.price.currentValue > changes.price.previousValue ? "up" : "down";
            // We need to clear the tick class before updating it so that the flash animation fires each time
            requestAnimationFrame(() => {
                this.setTick(null);
                requestAnimationFrame(() => this.setTick(tick));
            });
            
            if (!changes.time) {
                this.time = Date.now();
            }
        }
    }

    // Optimised for updating the tick class from outside the digest loop
    private setTick(tick: string) {
        this.tick = tick;
        this.$scope.$digest();
    }
}

export default new StockTickerComponent();