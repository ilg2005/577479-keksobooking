'use strict';

var CARDS_QUANTITY = 8;

var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var copyTitles = OFFER_TITLES.slice();

var PRICE = {
  MIN: 1000,
  MAX: 1000000
};

var ROOMS_QUANTITY = {
  MIN: 1,
  MAX: 5
};

var GUESTS_QUANTITY = {
  MIN: 1,
  MAX: 30
};

var HOUSING_TYPES = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var HOUSING_MIN_PRICES = {
  'palace': '10000',
  'flat': '1000',
  'house': '5000',
  'bungalo': '0'
};

var CONTROL_HOURS = ['12:00', '13:00', '14:00'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var PHOTOS_HREFS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var POSITION_X = {
  MIN: 300,
  MAX: 900
};

var POSITION_Y = {
  MIN: 130,
  MAX: 630
};

var ESC_KEYCODE = 27;

var templateElement = document.querySelector('template').content;
var advertTemplateElement = templateElement.querySelector('.map__card');
var pinTemplateElement = templateElement.querySelector('.map__pin');
var formFieldsElement = document.querySelectorAll('fieldset');
var pinMainElement = document.querySelector('.map__pin--main');
var formTitleElement = document.querySelector('#title');
var formAddressElement = document.querySelector('#address');
var formHousingTypeElement = document.querySelector('#type');
var formPriceElement = document.querySelector('#price');
var formCheckinElement = document.querySelector('#timein');
var formCheckoutElement = document.querySelector('#timeout');
var formRoomsQuantityElement = document.querySelector('#room_number');
var formGuestsQuantityElement = document.querySelector('#capacity');
var popupCloseElement;

var cards = [];

var inactiveState = {
  'classToggle': 'add',
  'attributeToggle': 'set'
};

var activeState = {
  'classToggle': 'remove',
  'attributeToggle': 'remove'
};

var getRandomInRange = function (min, max) {
  return min + Math.round(Math.random() * max);
};

var getRandomValue = function (array) {
  return array[Math.round(Math.random() * (array.length - 1))];
};

var shuffleArray = function (array) {
  for (var i = 0; i < array.length; i++) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
};

var getRandomFeaturesArray = function (features) {
  var randomFeatures = [];

  var quantity = getRandomInRange(0, features.length);
  if (quantity !== 0) {
    while (randomFeatures.length < quantity) {
      var randomValue = getRandomValue(features);
      if (randomFeatures.indexOf(randomValue) === -1) {
        randomFeatures.push(randomValue);
      }
    }
  }
  return randomFeatures;
};

var getUniqueRandomTitle = function (titles) {
  var uniqueRandomTitle = getRandomValue(titles);
  titles.splice(titles.indexOf(uniqueRandomTitle), 1);
  return uniqueRandomTitle;
};

var generateAddress = function () {
  return '\'' + getRandomInRange(POSITION_X.MIN, POSITION_X.MAX) + '\, ' + getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX) + '\'';
};

var getAvatarImgAddress = function (i) {
  return 'img/avatars/user0' + i + '.png';
};

var generateCard = function (cardIndex) {
  var card = {
    'author': {'avatar': getAvatarImgAddress(cardIndex)},
    'offer': {
      title: getUniqueRandomTitle(copyTitles),
      address: generateAddress(),
      price: getRandomInRange(PRICE.MIN, PRICE.MAX),
      type: getRandomValue(Object.keys(HOUSING_TYPES)),
      rooms: getRandomInRange(ROOMS_QUANTITY.MIN, ROOMS_QUANTITY.MAX),
      guests: getRandomInRange(GUESTS_QUANTITY.MIN, GUESTS_QUANTITY.MAX),
      checkin: getRandomValue(CONTROL_HOURS),
      checkout: getRandomValue(CONTROL_HOURS),
      features: getRandomFeaturesArray(FEATURES),
      description: '',
      photos: shuffleArray(PHOTOS_HREFS)
    },
    'location': {
      x: getRandomInRange(POSITION_X.MIN, POSITION_X.MAX),
      y: getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX)
    }
  };
  return card;
};

var generateCards = function (quantity) {
  for (var i = 1; i <= quantity; i++) {
    cards.push(generateCard(i));
  }
  return cards;
};

var generatePin = function (card) {
  var similarPin = pinTemplateElement.cloneNode(true);

  var imgElement = similarPin.querySelector('img');
  var pinWidth = imgElement.width;
  var pinHeight = imgElement.height;

  imgElement.src = card.author.avatar;
  imgElement.alt = card.offer.title;

  similarPin.style = 'left: ' + (card.location.x - pinWidth / 2) + 'px; top: ' + (card.location.y - pinHeight) + 'px;';

  return similarPin;
};

var renderSimilarPins = function (container) {
  var fragmentPin = document.createDocumentFragment();

  cards.forEach(function (card) {
    fragmentPin.appendChild(generatePin(card));
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


var insertPinAddress = function () {
  var pinCoordinates = pinMainElement.getBoundingClientRect();
  var pinX = Math.round(pinCoordinates.left + pinCoordinates.width / 2);
  var pinY = Math.round(pinCoordinates.bottom);
  formAddressElement.value = pinX + '\, ' + pinY;
  formAddressElement.setAttribute('readonly', 'readonly');
};

var init = function () {
  togglePageState(inactiveState);
  insertPinAddress();
  cards = generateCards(CARDS_QUANTITY);
  formPriceElement.setAttribute('min', HOUSING_MIN_PRICES[formHousingTypeElement.value]);
};
init();

var onPinMouseup = function () {
  togglePageState(activeState);
  insertPinAddress();
  renderSimilarPins(document.querySelector('.map__pins'));
  pinMainElement.removeEventListener('mouseup', onPinMouseup);
  formHousingTypeElement.addEventListener('change', onFormHousingTypeElementChange);
  formCheckinElement.addEventListener('change', onFormCheckinElementChange);
  formCheckoutElement.addEventListener('change', onFormCheckoutElementChange);
};

pinMainElement.addEventListener('mouseup', onPinMouseup);

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
    var selectedCardIndex = getSelectedCardIndex(evt.target);
    var selectedAdvert = generateAdvert(cards[selectedCardIndex - 1]);
    renderAdvert(selectedAdvert);
    popupCloseElement = document.querySelector('.popup__close');
    popupCloseElement.addEventListener('click', onPopupClose);
    document.addEventListener('keydown', onPopupClose);
  }
});

var onFormHousingTypeElementChange = function () {
  setHousingMinPrice(formHousingTypeElement.value);
};

var setHousingMinPrice = function (selectedHousingType) {
  formPriceElement.setAttribute('placeholder', HOUSING_MIN_PRICES[selectedHousingType]);
  formPriceElement.setAttribute('min', HOUSING_MIN_PRICES[selectedHousingType]);
};

var onFormCheckinElementChange = function () {
  setCorrespondingTime(formCheckinElement.value);
};

var onFormCheckoutElementChange = function () {
  setCorrespondingTime(formCheckoutElement.value);
};

var setCorrespondingTime = function (selectedTime) {
  formCheckinElement.value = selectedTime;
  formCheckoutElement.value = selectedTime;
};

var setCapacityLimitations = function (roomsQuantity, guestsQuantity) {
  if (roomsQuantity === 1 && guestsQuantity !== 1) {
    formGuestsQuantityElement.setCustomValidity('1 комната - для 1 гостя');
  } else if ((roomsQuantity === 2) && (guestsQuantity !== 1 || guestsQuantity !== 2)) {
    formGuestsQuantityElement.setCustomValidity('2 комнаты - для 1 или 2 гостей');
  } else if ((roomsQuantity === 3) && (guestsQuantity !== 1 || guestsQuantity !== 2 || guestsQuantity !== 3)) {
    formGuestsQuantityElement.setCustomValidity('3 комнаты - для 1, 2 или 3 гостей');
  } else if (roomsQuantity === 0 && guestsQuantity !== 0) {
    formGuestsQuantityElement.setCustomValidity('100 комнат - не для гостей');
  }
};

setCapacityLimitations(formRoomsQuantityElement.value, formGuestsQuantityElement.value);
