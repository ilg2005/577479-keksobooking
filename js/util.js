'use strict';

(function () {
  var templateElement = document.querySelector('template').content;

  var serverResponseMessage = function (message, backgroundColor) {
    var MESSAGE_TIMEOUT = 1000;
    var node = document.createElement('div');
    node.style = 'z-index: 100; width: 300px; min-height: 50px; border-radius: 50px; margin: auto; text-align: center; background-color: ' + backgroundColor;
    node.style.display = 'inline-flex';
    node.style.justifyContent = 'center';
    node.style.alignItems = 'center';
    node.style.position = 'fixed';
    node.style.top = '50%';
    node.style.bottom = '50%';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '18px';

    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      node.remove();
    }, MESSAGE_TIMEOUT);
  };

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
    },
    serverResponseMessage: serverResponseMessage
  };
})();
