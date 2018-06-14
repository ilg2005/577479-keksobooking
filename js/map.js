'use strict';

var CARDS_NUMBER = 8;

var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var PRICE = {
  MIN: 1000,
  MAX: 1000000
};

var ROOMS_NUMBER = {
  MIN: 1,
  MAX: 5
};

var GUESTS_NUMBER = {
  MIN: 1,
  MAX: 30
};

var HOUSING_TYPES = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
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

var getRandomInRange = function (min, max) {
  return min + Math.round(Math.random() * max);
};

var getRandomValue = function (array) {
  return array[Math.round(Math.random() * (array.length - 1))];
};

var getRandomFeaturesArray = function (features) {
  var randomFeatures = [];

  var randomFeatureLength = getRandomInRange(0, features.length);
  if (randomFeatureLength !== 0) {
    while (randomFeatures.length < randomFeatureLength) {
      var randomValue = getRandomValue(features);
      if (randomFeatures.indexOf(randomValue) === -1) {
        randomFeatures.push(randomValue);
      }
    }
  }
  return randomFeatures;
};

/* var store = {};
for (var i = 0; i < 6; i++) {
  store[i] = true;
}
var j = 9;
if (store.hasOwnProperty([j])) {
  console.log(store);
}
debugger;*/

/* var getUniqueRandomValue = function (array) { // получаем уникальное случайное значение
  var store = {};
  var randomKey = getRandomInRange(0, array.length - 1); // получаем случайный ключ

  while (store.hasOwnProperty([newRandomKey])) { // пока store содержит ключ [randomKey]
    var newRandomKey = getRandomInRange(0, array.length - 1); // получаем случайный ключ
    if (newRandomKey !== randomKey) {
      store[newRandomKey] = true;
    }
  }
  store[randomKey] = true;
  return array[randomKey];
};*/

/* var getUniqueRandomValue = function (array) {
  var randomValue = getRandomValue(array);
  array.splice(array.indexOf(randomValue), 1);
  return randomValue;
};

for (var i = 0; i < OFFER_TITLES.length; i++) {
  var uniqueRandomValue = getUniqueRandomValue(OFFER_TITLES.slice());
  console.log(uniqueRandomValue);
}*/
var generateAddress = function () {
  var address = '\'' + getRandomInRange(POSITION_X.MIN, POSITION_X.MAX) + '\, ' + getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX) + '\'';
  return address;
};

var generateCard = function (cardIndex) {
  var card = {
    'author': {'avatar': 'img/avatars/user0' + (cardIndex + 1) + '.png'},
    'offer': {
      title: OFFER_TITLES[cardIndex],
      address: generateAddress(),
      price: getRandomInRange(PRICE.MIN, PRICE.MAX),
      type: getRandomValue(Object.keys(HOUSING_TYPES)),
      rooms: getRandomInRange(ROOMS_NUMBER.MIN, ROOMS_NUMBER.MAX),
      guests: getRandomInRange(GUESTS_NUMBER.MIN, GUESTS_NUMBER.MAX),
      checkin: getRandomValue(CONTROL_HOURS),
      checkout: getRandomValue(CONTROL_HOURS),
      features: getRandomFeaturesArray(FEATURES),
      description: '',
      photo: PHOTOS_HREFS
    },
    'location': {
      x: getRandomInRange(POSITION_X.MIN, POSITION_X.MAX),
      y: getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX)
    }
  };
  return card;
};

var generateCards = function (cardsNumber) {
  var similarCards = [];
  for (var i = 0; i < cardsNumber; i++) {
    var card = generateCard(i);
    similarCards.push(card);
  }
  return similarCards;
};

var generatePin = function (i) {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var similarPin = pinTemplate.cloneNode(true);

  var pinWidth = pinTemplate.querySelector('img').width;
  var pinHeight = pinTemplate.querySelector('img').height;

  pinTemplate.style = 'left: ' + (similarCards[i].location.x - pinWidth / 2) + 'px; top: ' + (similarCards[i].location.y - pinHeight) + 'px;';
  pinTemplate.querySelector('img').src = similarCards[i].author.avatar;
  pinTemplate.querySelector('img').alt = similarCards[i].offer.title;

  return similarPin;
};

var renderSimilarPins = function (container) {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < CARDS_NUMBER; i++) {
    fragmentPin.appendChild(generatePin(i));
  }
  container.appendChild(fragmentPin);
};

var getWordEndingRooms = function (i) {
  switch (i) {
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

var getWordEndingGuests = function (i) {
  return (i === 1) ? 'я' : 'ей';
};

var generateSelectedAd = function (cardIndex) {

  var adTemplate = document.querySelector('template').content.querySelector('.map__card');
  var selectedAd = adTemplate.cloneNode(true);

  selectedAd.querySelector('.popup__avatar').src = similarCards[cardIndex].author.avatar;
  selectedAd.querySelector('.popup__title').textContent = similarCards[cardIndex].offer.title;
  selectedAd.querySelector('.popup__text--address').textContent = similarCards[cardIndex].offer.address;
  selectedAd.querySelector('.popup__text--price').innerHTML = similarCards[cardIndex].offer.price + ' &#x20bd;/ночь';
  selectedAd.querySelector('.popup__type').textContent = HOUSING_TYPES[similarCards[cardIndex].offer.type];
  selectedAd.querySelector('.popup__text--capacity').textContent = similarCards[cardIndex].offer.rooms + ' комнат' + getWordEndingRooms(similarCards[cardIndex].offer.rooms) + ' для ' + similarCards[cardIndex].offer.guests + ' гост' + getWordEndingGuests(similarCards[cardIndex].offer.guests);
  selectedAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + similarCards[cardIndex].offer.checkin + '\, выезд до ' + similarCards[cardIndex].offer.checkout;
  selectedAd.querySelector('.popup__description').textContent = similarCards[cardIndex].offer.description;

  for (var i = 0; i < FEATURES.length; i++) {
    var oldLi = selectedAd.querySelector('.popup__features li:first-child');
    oldLi.remove();
  }
  for (i = 0; i < similarCards[cardIndex].offer.features.length; i++) {
    var newLi = document.createElement('li');
    newLi.classList.add('popup__feature');
    var selector = 'popup__feature--' + similarCards[cardIndex].offer.features[i];
    newLi.classList.add(selector);
    selectedAd.querySelector('.popup__features').appendChild(newLi);
  }

  var photoImg = selectedAd.querySelector('.popup__photos img');
  photoImg.remove();
  for (i = 0; i < PHOTOS_HREFS.length; i++) {
    var newImg = photoImg.cloneNode(true);
    newImg.src = similarCards[cardIndex].offer.photo[i];
    selectedAd.querySelector('.popup__photos').appendChild(newImg);
  }
  return selectedAd;
};

var renderAd = function (selectedAd) {
  var fragmentAd = document.createDocumentFragment();
  fragmentAd.appendChild(selectedAd);
  document.querySelector('.map__filters-container').before(fragmentAd);
};

document.querySelector('.map').classList.remove('map--faded');
var similarCards = generateCards(CARDS_NUMBER);
renderSimilarPins(document.querySelector('.map__pins'));
var selectedAd = generateSelectedAd(0);
renderAd(selectedAd);
