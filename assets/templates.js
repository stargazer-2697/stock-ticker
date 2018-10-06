angular.module('prx.stockTickerApp').run([ '$templateCache', function($templateCache) {
	$templateCache.put('stock-ticker/stock-ticker.component.html', '<div class="stock-ticker"><h2>{{::$ctrl.stock.symbol}}</h2><h4>{{$ctrl.stock.lastSalePrice | currency}}</h4><div>{{$ctrl.stockDelta}}</div><div>{{$ctrl.stockPerc}}</div><div><strong>Last Trade</strong></div><div>{{$ctrl.stock.lastSaleTime | date:\'mediumTime\'}}</div><h5>{{$ctrl.stock.volume}}</h5></div>')
}])
