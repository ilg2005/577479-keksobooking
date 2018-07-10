'use strict';

var ESC_KEYCODE = 27;

var generateSimilarPin = function (card) {
  var similarPin = window.util.pinTemplateElement.cloneNode(true);

  var imgElement = similarPin.querySelector('img');

  imgElement.src = card.author.avatar;
  imgElement.alt = card.offer.title;

  similarPin.style = 'left: ' + card.location.x + 'px; top: ' + card.location.y + 'px;';

  return similarPin;
};

var renderSimilarPins = function (container) {
  var fragmentPin = document.createDocumentFragment();

  window.cards.forEach(function (card) {
    fragmentPin.appendChild(generateSimilarPin(card));
  });
  container.appendChild(fragmentPin);
};

var onPinMousedown = function () {
  window.pageActivate();
  renderSimilarPins(document.querySelector('.map__pins'));
  window.util.pinMainElement.removeEventListener('mousedown', onPinMousedown);
};

window.util.pinMainElement.addEventListener('mousedown', onPinMousedown);


