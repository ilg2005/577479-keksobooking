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

var copyTitles = OFFER_TITLES.slice();
var getUniqueRandomTitle = function (titles) {
  var uniqueRandomTitle = getRandomValue(titles);
  titles.splice(titles.indexOf(uniqueRandomTitle), 1);
  return uniqueRandomTitle;
};

var generateAddress = function () {
  var address = '\'' + getRandomInRange(POSITION_X.MIN, POSITION_X.MAX) + '\, ' + getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX) + '\'';
  return address;
};

var generateCard = function (cardIndex) {
  var card = {
    'author': {'avatar': 'img/avatars/user0' + (cardIndex + 1) + '.png'},
    'offer': {
      title: getUniqueRandomTitle(copyTitles),
      address: generateAddress(),
      price: getRandomInRange(PRICE.MIN, PRICE.MAX),
      type: getRandomValue(Object.keys(HOUSING_TYPES)),
      rooms: getRandomInRange(ROOMS_NUMBER.MIN, ROOMS_NUMBER.MAX),
      guests: getRandomInRange(GUESTS_NUMBER.MIN, GUESTS_NUMBER.MAX),
      checkin: getRandomValue(CONTROL_HOURS),
      checkout: getRandomValue(CONTROL_HOURS),
      features: getRandomFeaturesArray(FEATURES),
      description: '',
      photo: shuffleArray(PHOTOS_HREFS)
    },
    'location': {
      x: getRandomInRange(POSITION_X.MIN, POSITION_X.MAX),
      y: getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX)
    }
  };
  return card;
};

var generateCards = function (cardsNumber) {
  var cards = [];
  for (var i = 0; i < cardsNumber; i++) {
    var card = generateCard(i);
    cards.push(card);
  }
  return cards;
};

var generatePin = function (i) {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var similarPin = pinTemplate.cloneNode(true);

  var pinWidth = pinTemplate.querySelector('img').width;
  var pinHeight = pinTemplate.querySelector('img').height;

  pinTemplate.style = 'left: ' + (cards[i].location.x - pinWidth / 2) + 'px; top: ' + (cards[i].location.y - pinHeight) + 'px;';
  pinTemplate.querySelector('img').src = cards[i].author.avatar;
  pinTemplate.querySelector('img').alt = cards[i].offer.title;

  return similarPin;
};

var renderSimilarPins = function (container) {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < CARDS_NUMBER; i++) {
    fragmentPin.appendChild(generatePin(i));
  }
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

var generateSelectedAd = function (cardIndex) {

  var adTemplate = document.querySelector('template').content.querySelector('.map__card');
  var selectedAd = adTemplate.cloneNode(true);

  selectedAd.querySelector('.popup__avatar').src = cards[cardIndex].author.avatar;
  selectedAd.querySelector('.popup__title').textContent = cards[cardIndex].offer.title;
  selectedAd.querySelector('.popup__text--address').textContent = cards[cardIndex].offer.address;
  selectedAd.querySelector('.popup__text--price').innerHTML = cards[cardIndex].offer.price + ' &#x20bd;/ночь';
  selectedAd.querySelector('.popup__type').textContent = HOUSING_TYPES[cards[cardIndex].offer.type];
  selectedAd.querySelector('.popup__text--capacity').textContent = cards[cardIndex].offer.rooms + ' комнат' + getWordEndingRooms(cards[cardIndex].offer.rooms) + ' для ' + cards[cardIndex].offer.guests + ' гост' + getWordEndingGuests(cards[cardIndex].offer.guests);
  selectedAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + cards[cardIndex].offer.checkin + '\, выезд до ' + cards[cardIndex].offer.checkout;
  selectedAd.querySelector('.popup__description').textContent = cards[cardIndex].offer.description;

  for (var i = 0; i < FEATURES.length; i++) {
    var oldLi = selectedAd.querySelector('.popup__features li:first-child');
    oldLi.remove();
  }
  for (i = 0; i < cards[cardIndex].offer.features.length; i++) {
    var newLi = document.createElement('li');
    newLi.classList.add('popup__feature');
    var selector = 'popup__feature--' + cards[cardIndex].offer.features[i];
    newLi.classList.add(selector);
    selectedAd.querySelector('.popup__features').appendChild(newLi);
  }

  var photoImg = selectedAd.querySelector('.popup__photos img');
  photoImg.remove();
  for (i = 0; i < PHOTOS_HREFS.length; i++) {
    var newImg = photoImg.cloneNode(true);
    newImg.src = cards[cardIndex].offer.photo[i];
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
var cards = generateCards(CARDS_NUMBER);
renderSimilarPins(document.querySelector('.map__pins'));
var selectedAd = generateSelectedAd(0);
renderAd(selectedAd);
