import 'purecss';
import './css/styles.css';

import $ from 'jquery';

$(function () {
    function hideSwNotification() {
        $('#sw-notification').slideToggle();
    }

    function enableServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        }
    }

    function bindEvents() {
        $('#sw-notification-close').off().on('click', hideSwNotification);
        $('#sw-notification-enable').on('click', enableServiceWorker);
    }

    function init(){
        bindEvents();
    }

    init();
});