'use strict';

(function () {
  var onSuccessLoad = function (loadedCards) {
    window.cards = loadedCards;
  };

  var onErrorLoad = function (message) {
    window.util.serverResponseMessage(message, 'red');
  };

  window.backend.load(onSuccessLoad, onErrorLoad);
})();
