'use strict';

(function () {
  var templateElement = document.querySelector('template').content;

  window.util = {
    advertTemplateElement: templateElement.querySelector('.map__card'),
    pinTemplateElement: templateElement.querySelector('.map__pin'),
    pinMainElement: document.querySelector('.map__pin--main'),

    POSITION_X: {
      MIN: 0,
      MAX: document.querySelector('.map').offsetWidth
    },
    POSITION_Y: {
      MIN: 130,
      MAX: 630
    }
  };
})();
