'use strict';

(function () {
  var POSITION_X = {
    MIN: 0,
    MAX: document.querySelector('.map').offsetWidth
  };

  var POSITION_Y = {
    MIN: 130,
    MAX: 630
  };

  var MAIN_PIN_SIZE = {
    WIDTH: 62,
    HEIGHT: 84
  };

  var pinMainElement = document.querySelector('.map__pin--main');
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

  var initialNeedlepointCoordinates = getNeedlepointCoordinates(MAIN_PIN_SIZE, pinMainElement);
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
        x: pinMainElement.offsetLeft + shift.x,
        y: pinMainElement.offsetTop + shift.y
      };

      if (newPinMainCoordinates.x >= (POSITION_X.MIN - MAIN_PIN_SIZE.WIDTH / 2) && newPinMainCoordinates.x <= (POSITION_X.MAX - MAIN_PIN_SIZE.WIDTH / 2) && newPinMainCoordinates.y >= (POSITION_Y.MIN - MAIN_PIN_SIZE.HEIGHT) && newPinMainCoordinates.y <= (POSITION_Y.MAX - MAIN_PIN_SIZE.HEIGHT)) {
        pinMainElement.style.left = newPinMainCoordinates.x + 'px';
        pinMainElement.style.top = newPinMainCoordinates.y + 'px';
        var newNeedlepointCoordinates = getNeedlepointCoordinates(MAIN_PIN_SIZE, pinMainElement);
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

  pinMainElement.addEventListener('mousedown', onPinMousedown);
})();
