import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css';
import './css/styles.css';
import 'file-loader?name=[name].[ext]!../src/offline.html';
import $ from 'jquery';

var messageBox = {};

(function (m) {
    var popupIndex = 0;

    /**
     * Used to show the popup with the message; and triggers callback when option is selected.
     * @param {*} callback 
     */
    m.showMessage = function (callback, message, okText, dismissText) {
        var elemName = 'sw-notification-' + popupIndex;
        popupIndex++;

        var elem = '<div id="' + elemName + '" class="sw-notification" style="display:none"></div>';
        var jqElem = $(elem);
        if (!message) message = 'Your message';
        if (!okText) okText = 'Ok';
        if (!dismissText) dismissText = 'Dismiss';

        var messageTemplate = '<p class="sw-notification-message">' + message + '</p>' +
            '<button type="button" class="pure-button button-success sw-notification-enable" ' +
            'href="javascript:void(0)">' + okText + '</button> &nbsp; ' +
            '<button type="button" class="pure-button button-error sw-notification-close" ' +
            'href="javascript:void(0)">' + dismissText + '</button>';

        jqElem.html(messageTemplate);

        jqElem.find('.sw-notification-enable').on('click', function () {
            jqElem.hide();
            callback(true);
        });

        jqElem.find('.sw-notification-close').on('click', function () {
            jqElem.remove();
            callback(false);
        });

        $('body').append(jqElem);
        jqElem.show();
    }
}(messageBox));

var svcWorker = {};
(function (s) {
    var swRegistration;

    function messageCallBack(canSkip) {
        if (canSkip)
            swRegistration.waiting.postMessage('skipWaiting');
    }

    function promptUserToRefresh() {
        messageBox.showMessage(messageCallBack,
            'New version of content available!',
            '<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Refresh');
    }

    function listenForWaitingServiceWorker(callback) {
        function awaitStateChange() {
            swRegistration.installing.addEventListener('statechange', function () {
                if (this.state === 'installed') callback();
            });
        }

        if (!swRegistration) return;
        if (swRegistration.waiting) return callback();
        if (swRegistration.installing) awaitStateChange();
        swRegistration.addEventListener('updatefound', awaitStateChange);
    }

    /**
     * This callback is triggered on a successful ServiceWorker registration.
     * @param {*} registration 
     */
    s.serviceWorkerRegCallback = function (registration) {
        swRegistration = registration;

        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', swRegistration.scope);
        listenForWaitingServiceWorker(promptUserToRefresh);
    }
}(svcWorker));

var notifyService = {};
(function (n) {
    n.init = function () {
        $('#initiate-notify-demo').on('click', function () {
            messageBox.showMessage(notifyService.requestNotificationPermission,
                'Let us notify when the job completes!', 'Allow', 'Cancel');
        });

        $('#notify-alert-demo').on('click', function () {
            setTimeout(notifyService.displayNotification, 5000);
        });
    }

    n.requestNotificationPermission = function (canAsk) {
        if (canAsk) {
            Notification.requestPermission(function (status) {
                console.log('Notification permission status:', status);
            });
        }
    }

    n.displayNotification = function () {
        if (Notification.permission == 'granted') {
            navigator.serviceWorker.getRegistration().then(function (reg) {
                var options = {
                    body: 'Your report is ready!',
                    icon: 'img/report-icon.png',
                    vibrate: [100, 50, 100],
                    data: {
                        url: window.location.href,
                        dateOfArrival: Date.now(),
                        primaryKey: 1
                    },
                    actions: [{
                            action: 'view-report',
                            title: 'View your report',
                            icon: 'img/view.png'
                        },
                        {
                            action: 'close',
                            title: 'Close notification',
                            icon: 'img/close.png'
                        },
                    ]
                };
                reg.showNotification('PWA-Sample!', options);
            });
        }
    }
})(notifyService);

var pushService = {};

(function (p) {
    var base64VAPID = 'BK1OYgqZSmIBqwFvx4zGOOfkR7JnF300MIo3gdoK1F-pPgqgIbENRWmdthtqcsFdhnRRzhF1z5LSvH8J9KQ1puA';
    var urlBase64ToUint8Array = function (base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    p.init = function () {
        $('#initiate-push-demo').on('click', function () {
            messageBox.showMessage(pushService.requestNotificationPermission,
                'Let us notify when news are publised!', 'Allow', 'Cancel');
        });

        $('#push-alert-demo').on('click', pushService.displayNotification);
    }

    p.requestNotificationPermission = function (canAsk) {
        if (canAsk) {
            Notification.requestPermission(function (status) {
                console.log('Notification permission status:', status);
            });
        }
    }

    p.displayNotification = function () {
        navigator.serviceWorker.ready.then(function (reg) {
            reg.pushManager.getSubscription().then(function (sub) {
                if (sub === null) {
                    // Update UI to ask user to register for Push
                    console.log('Not subscribed to push service!');
                    messageBox.showMessage(pushService.subscribeUser,
                        'Let us notify when news are publised!', 'Allow', 'Cancel');
                } else {
                    // We have a subscription, update the database
                    console.log('Subscription object: ', sub);
                    $('#push-channel-detail').html(JSON.stringify(sub));
                }
            });
        });
    }

    p.subscribeUser = function () {
        var subscribeParam = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(base64VAPID)
        };
        navigator.serviceWorker.ready.then(function (reg) {
            reg.pushManager.subscribe(subscribeParam).then(function (sub) {
                console.log('Endpoint URL: ', sub);
                $('#push-channel-detail').html(JSON.stringify(sub));
            }).catch(function (e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for notifications was denied');
                } else {
                    console.error('Unable to subscribe to push', e);
                }
            });
        });
    }

})(pushService);

$(function () {

    // reload once when the new Service Worker starts activating
    var refreshing;

    function enableServiceWorker() {
        navigator.serviceWorker.register('sw.js')
            .then(svcWorker.serviceWorkerRegCallback,
                function (err) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed: ', err);
                });

        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) return;
            refreshing = true;

            window.location.reload();
        });
    }

    function init() {
        try {
            if ('serviceWorker' in navigator) {
                enableServiceWorker();
                notifyService.init();
                pushService.init();
            }
        } catch (err) {
            console.log(err);
        }
    }

    init();
});