import * as angular from "angular";
import {IDeferred, IPromise, IQService, IScope, IServiceProvider} from "angular";
import * as io from "socket.io-client";

export default class WebSocketProvider implements IServiceProvider {
    $get = WebSocketFactory;
}

export class WebSocketFactory {
    static $inject = ['$q', '$rootScope'];
    constructor(
        private $q: IQService,
        private $rootScope: IScope
    ) {}

    openSocket(url: string, callbacks?: Callbacks, forceNew?: boolean): IPromise<SocketIOClient.Socket> {
        let socket = io(url, { forceNew: forceNew }),
            defer = this.$q.defer() as IDeferred<SocketIOClient.Socket>;
        socket.on("connect", () => defer.resolve(socket));

        if (callbacks != null) {
            let $scope = this.$rootScope;
            angular.forEach(callbacks, (callback: Function, eventName: string) => {
                socket.on(eventName, function() {
                    let args = arguments;
                    $scope.$apply(() => callback.apply(this, args));
                });
            });
        }

        return defer.promise;
    }
}

type Callbacks = { [eventName: string]: Function };