'use strict';

var CARDS_QUANTITY = 8;

var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

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
  return '\'' + getRandomInRange(POSITION_X.MIN, POSITION_X.MAX) + '\, ' + getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX) + '\'';
};

var getAvatarImgAddress = function (i) {
  return 'img/avatars/user0' + (i + 1) + '.png';
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
      photo: shuffleArray(PHOTOS_HREFS)
    },
    'location': {
      x: getRandomInRange(POSITION_X.MIN, POSITION_X.MAX),
      y: getRandomInRange(POSITION_Y.MIN, POSITION_Y.MAX)
    }
  };
  return card;
};

var generateCards = function (quantity) {
  var cards = [];
  for (var i = 0; i < quantity; i++) {
    var card = generateCard(i);
    cards.push(card);
  }
  return cards;
};

var generatePin = function (card) {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var similarPin = pinTemplate.cloneNode(true);

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

var generateAd = function (card) {

  var adTemplate = document.querySelector('template').content.querySelector('.map__card');
  var ad = adTemplate.cloneNode(true);

  ad.querySelector('.popup__avatar').src = card.author.avatar;
  ad.querySelector('.popup__title').textContent = card.offer.title;
  ad.querySelector('.popup__text--address').textContent = card.offer.address;
  ad.querySelector('.popup__text--price').innerHTML = card.offer.price + ' &#x20bd;/ночь';
  ad.querySelector('.popup__type').textContent = HOUSING_TYPES[card.offer.type];
  ad.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнат' + getWordEndingRooms(card.offer.rooms) + ' для ' + card.offer.guests + ' гост' + getWordEndingGuests(card.offer.guests);
  ad.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + '\, выезд до ' + card.offer.checkout;
  ad.querySelector('.popup__description').textContent = card.offer.description;

  var adFeatures = ad.querySelector('.popup__features');
  while (adFeatures.firstChild) {
    adFeatures.removeChild(adFeatures.firstChild);
  }

  for (i = 0; i < card.offer.features.length; i++) {
    var newLi = document.createElement('li');
    newLi.classList.add('popup__feature');
    var selector = 'popup__feature--' + card.offer.features[i];
    newLi.classList.add(selector);
    adFeatures.appendChild(newLi);
  }

  var photoImg = ad.querySelector('.popup__photos img');
  photoImg.remove();
  for (var i = 0; i < PHOTOS_HREFS.length; i++) {
    var newImg = photoImg.cloneNode(true);
    newImg.src = card.offer.photo[i];
    ad.querySelector('.popup__photos').appendChild(newImg);
  }
  return ad;
};

var renderAd = function (ad) {
  var fragmentAd = document.createDocumentFragment();
  fragmentAd.appendChild(ad);
  document.querySelector('.map__filters-container').before(fragmentAd);
};

document.querySelector('.map').classList.remove('map--faded');
var cards = generateCards(CARDS_QUANTITY);
renderSimilarPins(document.querySelector('.map__pins'));
var selectedAd = generateAd(cards[0]);
renderAd(selectedAd);
