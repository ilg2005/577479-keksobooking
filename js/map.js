'use strict';

var ESC_KEYCODE = 27;

var templateElement = document.querySelector('template').content;
var advertTemplateElement = templateElement.querySelector('.map__card');
var pinTemplateElement = templateElement.querySelector('.map__pin');
var formFieldsElement = document.querySelectorAll('fieldset');
var popupCloseElement;

var inactiveState = {
  'classToggle': 'add',
  'attributeToggle': 'set'
};

var activeState = {
  'classToggle': 'remove',
  'attributeToggle': 'remove'
};

var generateSimilarPin = function (card) {
  var similarPin = pinTemplateElement.cloneNode(true);

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

var togglePageState = function (state) {
  document.querySelector('.map').classList[state.classToggle]('map--faded');
  document.querySelector('.ad-form').classList[state.classToggle]('ad-form--disabled');
  formFieldsElement.forEach(function (element) {
    element[state.attributeToggle + 'Attribute']('disabled', 'disabled');
  });
  advertTemplateElement.classList[state.classToggle]('hidden');
  pinTemplateElement.classList[state.classToggle]('hidden');
};

var init = function () {
  togglePageState(inactiveState);

};
init();

var onPinMousedown = function () {
  togglePageState(activeState);
  renderSimilarPins(document.querySelector('.map__pins'));
  window.util.pinMainElement.removeEventListener('mousedown', onPinMousedown);
};

window.util.pinMainElement.addEventListener('mousedown', onPinMousedown);


