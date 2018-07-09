'use strict';

var HOUSING_TYPES = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};


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

var getWordEndingRooms = function (count) {
  switch (count) {
    case 1:
      var wordEnding = 'а';
      break;
    case 2:
    case 3:
    case 4:
      wordEnding = 'ы';
      break;
    default:
      wordEnding = '';
      break;
  }
  return wordEnding;
};

var getWordEndingGuests = function (count) {
  return (count === 1) ? 'я' : 'ей';
};

var generateFeaturesFragment = function (features) {
  var featuresFragment = document.createDocumentFragment();
  features.forEach(function (feature) {
    var newLi = document.createElement('li');
    newLi.classList.add('popup__feature');
    newLi.classList.add('popup__feature--' + feature);
    featuresFragment.appendChild(newLi);
  });
  return featuresFragment;
};

var generatePhotosFragment = function (hrefs, imgTemplate) {
  var photosFragment = document.createDocumentFragment();
  hrefs.forEach(function (href) {
    var newLi = imgTemplate.cloneNode(true);
    newLi.src = href;
    photosFragment.appendChild(newLi);
  });
  return photosFragment;
};

var generateAdvert = function (card) {

  var advert = advertTemplateElement.cloneNode(true);

  advert.querySelector('.popup__avatar').src = card.author.avatar;
  advert.querySelector('.popup__title').textContent = card.offer.title;
  advert.querySelector('.popup__text--address').textContent = card.offer.address;
  advert.querySelector('.popup__text--price').innerHTML = card.offer.price + ' &#x20bd;/ночь';
  advert.querySelector('.popup__type').textContent = HOUSING_TYPES[card.offer.type];
  advert.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнат' + getWordEndingRooms(card.offer.rooms) + ' для ' + card.offer.guests + ' гост' + getWordEndingGuests(card.offer.guests);
  advert.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + '\, выезд до ' + card.offer.checkout;
  advert.querySelector('.popup__description').textContent = card.offer.description;

  advert.querySelector('.popup__features').innerHTML = '';
  advert.querySelector('.popup__features').appendChild(generateFeaturesFragment(card.offer.features));

  var photoImg = advert.querySelector('.popup__photos img');
  advert.querySelector('.popup__photos').innerHTML = '';
  advert.querySelector('.popup__photos').appendChild(generatePhotosFragment(card.offer.photos, photoImg));

  return advert;
};

var renderAdvert = function (advert) {
  document.querySelector('.map__filters-container').before(advert);
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

var getSelectedCardIndex = function (target) {
  if (target.className === 'map__pin') {
    var src = target.querySelector('img').getAttribute('src');
  } else {
    src = target.getAttribute('src');
  }
  var searchPattern = /[1-9]\d*/;
  return src.match(searchPattern);
};

var onPopupClose = function (evt) {
  if (evt.type === 'click' && evt.target === document.querySelector('.popup__close') || evt.type === 'keydown' && evt.keyCode === ESC_KEYCODE) {
    popupCloseElement.removeEventListener('click', onPopupClose);
    document.removeEventListener('keydown', onPopupClose);
    document.querySelector('.popup').remove();
  }
};

document.addEventListener('click', function (evt) {
  if ((evt.target.className === 'map__pin') || (evt.target.parentNode.className === 'map__pin')) {
    if (document.querySelector('.popup')) {
      document.querySelector('.popup').remove();
    }
    var selectedCardIndex = getSelectedCardIndex(evt.target);
    var selectedAdvert = generateAdvert(window.cards[selectedCardIndex - 1]);
    renderAdvert(selectedAdvert);
    popupCloseElement = document.querySelector('.popup__close');
    popupCloseElement.addEventListener('click', onPopupClose);
    document.addEventListener('keydown', onPopupClose);
  }
});
