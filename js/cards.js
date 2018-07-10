'use strict';

(function () {
  var CARDS_QUANTITY = 8;

  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

  var copyTitles = OFFER_TITLES.slice();

  var SIMILAR_PIN_SIZE = {
    WIDTH: 50,
    HEIGHT: 70
  };

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

  var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];

  var CONTROL_HOURS = ['12:00', '13:00', '14:00'];

  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var PHOTOS_HREFS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var cards = [];

  var getRandomInRange = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  var getRandomValue = function (array) {
    return array[Math.round(Math.random() * (array.length - 1))];
  };

  var shuffleArray = function (array) {
    var newArray = array.slice();
    for (var i = 0; i < newArray.length; i++) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var temp = newArray[i];
      newArray[i] = newArray[randomIndex];
      newArray[randomIndex] = temp;
    }
    return newArray;
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
    return '\'' + (getRandomInRange(window.util.POSITION_X.MIN, window.util.POSITION_X.MAX) - SIMILAR_PIN_SIZE.WIDTH / 2) + '\, ' + (getRandomInRange(window.util.POSITION_Y.MIN, window.util.POSITION_Y.MAX) - SIMILAR_PIN_SIZE.HEIGHT) + '\'';
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
        type: getRandomValue(HOUSING_TYPES),
        rooms: getRandomInRange(ROOMS_QUANTITY.MIN, ROOMS_QUANTITY.MAX),
        guests: getRandomInRange(GUESTS_QUANTITY.MIN, GUESTS_QUANTITY.MAX),
        checkin: getRandomValue(CONTROL_HOURS),
        checkout: getRandomValue(CONTROL_HOURS),
        features: getRandomFeaturesArray(FEATURES),
        description: '',
        photos: shuffleArray(PHOTOS_HREFS)
      },
      'location': {
        x: getRandomInRange(window.util.POSITION_X.MIN, window.util.POSITION_X.MAX) - SIMILAR_PIN_SIZE.WIDTH / 2,
        y: getRandomInRange(window.util.POSITION_Y.MIN, window.util.POSITION_Y.MAX) - SIMILAR_PIN_SIZE.HEIGHT
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

  window.cards = generateCards(CARDS_QUANTITY);
})();
