!function(f){function e(e){for(var n,r,t=e[0],o=e[1],i=e[2],c=0,u=[];c<t.length;c++)a[r=t[c]]&&u.push(a[r][0]),a[r]=0;for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(f[n]=o[n]);for(p&&p(e);u.length;)u.shift()();return s.push.apply(s,i||[]),l()}function l(){for(var e,n=0;n<s.length;n++){for(var r=s[n],t=!0,o=1;o<r.length;o++)0!==a[r[o]]&&(t=!1);t&&(s.splice(n--,1),e=i(i.s=r[0]))}return e}var r={},a={0:0},s=[];function i(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return f[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=f,i.c=r,i.d=function(e,n,r){i.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(n,e){if(1&e&&(n=i(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var t in n)i.d(r,t,function(e){return n[e]}.bind(null,t));return r},i.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="/pwa-sample/";var n=window.webpackJsonp=window.webpackJsonp||[],t=n.push.bind(n);n.push=e,n=n.slice();for(var o=0;o<n.length;o++)e(n[o]);var p=t;s.push([1,1]),l()}([,function(e,n,r){"use strict";r.r(n),r(2),r(3);var t=r(0),o=r.n(t);o()(function(){o()("#sw-notification-close").off().on("click",function(){o()("#sw-notification").slideToggle()}),o()("#sw-notification-enable").on("click",function(){"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(function(e){console.log("ServiceWorker registration successful with scope: ",e.scope)},function(e){console.log("ServiceWorker registration failed: ",e)})})})},,function(e,n,r){}]);