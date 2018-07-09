'use strict';

(function () {

  var MAIN_PIN_SIZE = {
    WIDTH: 62,
    HEIGHT: 84
  };

  var formAddressElement = document.querySelector('#address');

  var getNeedlepointCoordinates = function (PIN_SIZE, pinElement) {
    var needlepointCoordinates = {
      x: Math.round(pinElement.offsetLeft + PIN_SIZE.WIDTH / 2),
      y: Math.round(pinElement.offsetTop + PIN_SIZE.HEIGHT)
    };
    return needlepointCoordinates;
  };

  var insertNeedlepointAddress = function (coordinates) {
    formAddressElement.value = coordinates.x + '\, ' + coordinates.y;
    formAddressElement.setAttribute('readonly', 'readonly');
  };

  var initialNeedlepointCoordinates = getNeedlepointCoordinates(MAIN_PIN_SIZE, window.util.pinMainElement);
  insertNeedlepointAddress(initialNeedlepointCoordinates);

  var onPinMousedown = function (evtDown) {

    var startMouseCoordinates = {
      x: evtDown.x,
      y: evtDown.y
    };

    var onDocumentMousemove = function (evtMove) {
      var shift = {
        x: evtMove.x - startMouseCoordinates.x,
        y: evtMove.y - startMouseCoordinates.y
      };

      startMouseCoordinates = {
        x: evtMove.x,
        y: evtMove.y
      };

      var newPinMainCoordinates = {
        x: window.util.pinMainElement.offsetLeft + shift.x,
        y: window.util.pinMainElement.offsetTop + shift.y
      };

      if (newPinMainCoordinates.x >= (window.util.POSITION_X.MIN - MAIN_PIN_SIZE.WIDTH / 2) && newPinMainCoordinates.x <= (window.util.POSITION_X.MAX - MAIN_PIN_SIZE.WIDTH / 2) && newPinMainCoordinates.y >= (window.util.POSITION_Y.MIN - MAIN_PIN_SIZE.HEIGHT) && newPinMainCoordinates.y <= (window.util.POSITION_Y.MAX - MAIN_PIN_SIZE.HEIGHT)) {
        window.util.pinMainElement.style.left = newPinMainCoordinates.x + 'px';
        window.util.pinMainElement.style.top = newPinMainCoordinates.y + 'px';
        var newNeedlepointCoordinates = getNeedlepointCoordinates(MAIN_PIN_SIZE, window.util.pinMainElement);
        insertNeedlepointAddress(newNeedlepointCoordinates);
      }
    };
    document.addEventListener('mousemove', onDocumentMousemove);

    var onDocumentMouseup = function () {
      document.removeEventListener('mousemove', onDocumentMousemove);
      document.removeEventListener('mouseup', onDocumentMouseup);
    };
    document.addEventListener('mouseup', onDocumentMouseup);
  };

  window.util.pinMainElement.addEventListener('mousedown', onPinMousedown);
})();
