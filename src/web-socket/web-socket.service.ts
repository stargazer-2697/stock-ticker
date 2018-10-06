import * as angular from "angular";
import {IDeferred, IPromise, IQService, IScope, IServiceProvider} from "angular";

export default class WebSocketProvider implements IServiceProvider {
    $get = WebSocketFactory;
}

export class WebSocketFactory {
    static $inject = ['$q', '$rootScope'];
    constructor(
        private $q: IQService,
        private $rootScope: IScope
    ) {}

    openSocket(url: string, callbacks?: Callbacks, forceNew?: boolean): IPromise<WebSocket> {
        let socket = new WebSocket(url),
            defer = this.$q.defer() as IDeferred<WebSocket>;
        socket.addEventListener("open", () => defer.resolve(socket));

        if (callbacks != null) {
            let $scope = this.$rootScope;
            angular.forEach(callbacks, (callback: Function, eventName: string) => {
                socket.addEventListener(eventName, (e: MessageEvent) => {
                    console.log(e.data);
                    $scope.$apply(() => callback.call(this, e.data));
                });
            });
        }

        return defer.promise;
    }
}

type Callbacks = { [eventName: string]: Function };