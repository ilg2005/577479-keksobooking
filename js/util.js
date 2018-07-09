'use strict';

(function () {
  window.util = {
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
