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

var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];

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

var position = {
  x: getRandomInRange(POSITION_X.MIN, POSITION_X.MAX),
  y: getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX)
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

var detectHousingType = function (type) {
  var housingType = type;
  switch (housingType) {
    case 0:
    case 1:
      housingType = HOUSING_TYPES[1];
      break;
    case 2:
    case 3:
      housingType = HOUSING_TYPES[0];
      break;
    case 4:
    case 5:
      housingType = HOUSING_TYPES[2];
      break;
    case 6:
    case 7:
      housingType = HOUSING_TYPES[3];
      break;
  }
  return housingType;
};

var similarCards = [];

for (var i = 0; i < CARDS_NUMBER; i++) {
  var card = {
    'author': {'avatar': 'img/avatars/user0' + (i + 1) + '.png'},
    'offer': {
      title: OFFER_TITLES[i],
      address: '\'' + position.x + '\, ' + position.y + '\'',
      price: getRandomInRange(PRICE.MIN, PRICE.MAX),
      type: detectHousingType(i),
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
  similarCards.push(card);
}

document.querySelector('.map').classList.remove('map--faded');

var renderPin = function (i) {
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
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < CARDS_NUMBER; i++) {
    fragment.appendChild(renderPin(i));
  }
  container.appendChild(fragment);
};

renderSimilarPins(document.querySelector('.map__pins'));

var adTemplate = document.querySelector('template').content.querySelector('.map__card');
var similarAd = adTemplate.cloneNode(true);

var fragment = document.createDocumentFragment();
fragment.appendChild(similarAd);

similarAd.querySelector('.popup__title').textContent = similarCards[0].offer.title;
similarAd.querySelector('.popup__text--address').textContent = similarCards[0].offer.address;
similarAd.querySelector('.popup__text--price').innerHTML = similarCards[0].offer.price + ' &#x20bd;/ночь';

var translateHousingType = function (i) {
  var housingTypeTranslation;
  switch (i) {
    case 'flat':
      housingTypeTranslation = 'Квартира';
      break;
    case 'bungalo':
      housingTypeTranslation = 'Бунгало';
      break;
    case 'house':
      housingTypeTranslation = 'Дом';
      break;
    case 'palace':
      housingTypeTranslation = 'Дворец';
      break;
  }
  return housingTypeTranslation;
};
similarAd.querySelector('.popup__type').textContent = translateHousingType(similarCards[0].offer.type);

var wordEnding;
var getWordEndingRooms = function (i) {
  switch (i) {
    case 1:
      wordEnding = 'а';
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
  return wordEnding = (i === 1) ? 'я' : 'ей';
};

similarAd.querySelector('.popup__text--capacity').textContent = similarCards[0].offer.rooms + ' комнат' + getWordEndingRooms(similarCards[0].offer.rooms) + ' для ' + similarCards[0].offer.guests + ' гост' + getWordEndingGuests(similarCards[0].offer.guests);

similarAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + similarCards[0].offer.checkin + '\, выезд до ' + similarCards[0].offer.checkout;

for (var i = 0; i < FEATURES.length; i++) {
  var oldLi = similarAd.querySelector('.popup__features li:first-child');
  oldLi.remove();
}

for (var i = 0; i < similarCards[0].offer.features.length; i++) {
  var newLi = document.createElement('li');
  newLi.classList.add('popup__feature');
  var selector = 'popup__feature--' + similarCards[0].offer.features[i];
  newLi.classList.add(selector);
  similarAd.querySelector('.popup__features').appendChild(newLi);
}

similarAd.querySelector('.popup__description').textContent = similarCards[0].offer.description;

var photoImg = similarAd.querySelector('.popup__photos img');
photoImg.remove();

for (var i = 0; i < PHOTOS_HREFS.length; i++) {
  var newImg = photoImg.cloneNode(true);
  newImg.src = similarCards[0].offer.photo[i];
  similarAd.querySelector('.popup__photos').appendChild(newImg);
}

similarAd.querySelector('.popup__avatar').src = similarCards[0].author.avatar;

document.querySelector('.map__filters-container').before(fragment);
