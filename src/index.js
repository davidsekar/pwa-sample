import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css';
import './css/styles.css';
import $ from 'jquery';

var popupIndex = 0;

/**
 * Used to show the popup with the message; and triggers callback when option is selected.
 * @param {*} callback 
 */
function showMessage(callback, message, okText, dismissText) {
    var elemName = 'sw-notification-' + popupIndex;
    popupIndex++;

    var elem = '<div id="' + elemName + '" class="sw-notification" style="display:none"></div>';
    var jqElem = $(elem);
    if (!message) message = 'Your message';
    if (!okText) okText = 'Ok';
    if (!dismissText) dismissText = 'Dismiss';

    var messageTemplate = '<p class="sw-notification-message">' + message + '</p>' +
        '<button type="button" class="pure-button button-success" id="sw-notification-enable" ' +
        'href="javascript:void(0)">' + okText + '</button> &nbsp; ' +
        '<button type="button" class="pure-button button-error" id="sw-notification-close" ' +
        'href="javascript:void(0)">' + dismissText + '</button>';

    jqElem.html(messageTemplate);

    jqElem.find('#sw-notification-enable').on('click', function () {
        jqElem.hide();
        callback(true);
    });
    jqElem.find('#sw-notification-close').on('click', function () {
        jqElem.remove();
        callback(false);
    });

    $('body').append(jqElem);
    jqElem.show();
}

/**
 * This callback is triggered on a successful ServiceWorker registration.
 * @param {*} registration 
 */
function serviceWorkerRegCallback(registration) {
    function canSkipWaiting(canSkip) {
        if (canSkip)
            registration.waiting.postMessage('skipWaiting');
    }

    function promptUserToRefresh() {
        showMessage(canSkipWaiting, 'New version of content available!', '<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Refresh');
    }

    function listenForWaitingServiceWorker(callback) {
        function awaitStateChange() {
            registration.installing.addEventListener('statechange', function () {
                if (this.state === 'installed') callback();
            });
        }
        if (!registration) return;
        if (registration.waiting) return callback();
        if (registration.installing) awaitStateChange();
        registration.addEventListener('updatefound', awaitStateChange);
    }

    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    listenForWaitingServiceWorker(promptUserToRefresh);
}

$(function () {
    // reload once when the new Service Worker starts activating
    var refreshing;

    function enableServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(
                serviceWorkerRegCallback,
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
    }

    function init() {
        try {
            enableServiceWorker();
        } catch (err) {
            console.log(err);
        }
    }

    init();
});