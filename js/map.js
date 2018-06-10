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

var randomizeNumber = function (min, max) {
  return min + Math.floor(Math.random() * max);
};

var randomizeHours = function (hours) {
  return hours[Math.round(Math.random() * (hours.length - 1))];
};

var getRandomValue = function (array) {
  return array[Math.round(Math.random() * (array.length - 1))];
};

var position = {
  x: randomizeNumber(POSITION_X.MIN, POSITION_X.MAX), // случайное число, координата x метки на карте от 300 до 900,
  y: randomizeNumber(POSITION_Y.MIN, POSITION_Y.MAX) // случайное число, координата y метки на карте от 130 до 630
};

var getRandomFeaturesArray = function (features) {
  var randomFeatures = [];
  var tempArray = features;

  var randomFeatureLength = randomizeNumber(0, features.length);
  if (randomFeatureLength) {
    for (var i = 0; i < randomFeatureLength; i++) {
      var randomValue = getRandomValue(tempArray);
      randomFeatures.push(randomValue);
      tempArray.splice(tempArray.indexOf(randomValue), 1);
    }
  }
  return randomFeatures;
};
console.log(getRandomFeaturesArray(FEATURES));

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

// 1. Создайте массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку.

var similarCards = [];
for (var i = 0; i < CARDS_NUMBER; i++) {

  var card = {
    'author': {'avatar': 'img/avatars/user0' + (i + 1) + '.png'},
    'offer': {
      title: OFFER_TITLES[i],
      address: '\'' + position.x + '\, ' + position.y + '\'',
      price: randomizeNumber(PRICE.MIN, PRICE.MAX),
      type: detectHousingType(i), // строка с одним из четырёх фиксированных значений: palace, flat, house или bungalo
      rooms: randomizeNumber(ROOMS_NUMBER.MIN, ROOMS_NUMBER.MAX),
      guests: randomizeNumber(GUESTS_NUMBER.MIN, GUESTS_NUMBER.MAX),
      checkin: randomizeHours(CONTROL_HOURS), // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
      checkout: randomizeHours(CONTROL_HOURS), // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
      features: getRandomFeaturesArray(FEATURES), // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
      description: '', // пустая строка,
      photo: PHOTOS_HREFS
    },
    'location': {
      x: randomizeNumber(POSITION_X.MIN, POSITION_X.MAX),
      y: randomizeNumber(POSITION_Y.MIN, POSITION_Y.MAX)
    }
  };
  similarCards.push(card);
}

console.log(similarCards);

// 2.У блока .map уберите класс .map--faded:

document.querySelector('.map').classList.remove('map--faded');

/*
На основе данных, созданных в первом пункте, создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива. Итоговую разметку метки .map__pin можно взять из шаблона .map__card.

    У метки должны быть следующие данные:
    Координаты:style="left: {{location.x}}px; top: {{location.y}}px;"
    src="{{author.avatar}}"
    alt="{{заголовок объявления}}"

Обратите внимание

Координаты X и Y, которые вы вставите в разметку, это не координаты левого верхнего угла блока метки, а координаты, на которые указывает метка своим острым концом. Чтобы найти эту координату нужно учесть размеры элемента с меткой.
 */

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

// 4.Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.

var renderSimilarPins = function (container) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < CARDS_NUMBER; i++) {
    fragment.appendChild(renderPin(i));
  }
  container.appendChild(fragment);
};

renderSimilarPins(document.querySelector('.map__pins'));

/* 5. На основе первого по порядку элемента из сгенерированного массива и шаблона .map__card создайте DOM-элемент объявления, заполните его данными из объекта и вставьте полученный DOM-элемент в блок .map перед блоком.map__filters-container:*/
var adTemplate = document.querySelector('template').content.querySelector('.map__card');
var similarAd = adTemplate.cloneNode(true);

var fragment = document.createDocumentFragment();
fragment.appendChild(similarAd);


// - Выведите заголовок объявления offer.title в заголовок .popup__title:

similarAd.querySelector('.popup__title').textContent = similarCards[0].offer.title;

// Выведите адрес offer.address в блок .popup__text--address:

similarAd.querySelector('.popup__text--address').textContent = similarCards[0].offer.address;

// Выведите цену offer.price в блок .popup__text--price строкой вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.

similarAd.querySelector('.popup__text--price').innerHTML = similarCards[0].offer.price + ' &#x20bd;/ночь';

// В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace:
var translatePopupType = function (i) {
  var popupTypeTranslation;
  switch (i) {
    case 'flat':
      popupTypeTranslation = 'Квартира';
      break;
    case 'bungalo':
      popupTypeTranslation = 'Бунгало';
      break;
    case 'house':
      popupTypeTranslation = 'Дом';
      break;
    case 'palace':
      popupTypeTranslation = 'Дворец';
      break;
  }
  return popupTypeTranslation;
};
similarAd.querySelector('.popup__type').textContent = translatePopupType(similarCards[0].offer.type);

// Выведите количество гостей и комнат offer.rooms и offer.guests в блок .popup__text--capacity строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например, 2 комнаты для 3 гостей:
var wordEnding;
var getWordEndingRooms = function (i) {
  switch (i) {
    case 1:
      wordEnding = 'а';
      break;
    case 5:
      wordEnding = '';
      break;
    default:
      wordEnding = 'ы';
      break;
  }
  return wordEnding;
};

var getWordEndingGuests = function (i) {
  (i === 1) ? (wordEnding = 'я') : (wordEnding = 'ей');
  return wordEnding;
};

similarAd.querySelector('.popup__text--capacity').textContent = similarCards[0].offer.rooms + ' комнат' + getWordEndingRooms(similarCards[0].offer.rooms) + ' для ' + similarCards[0].offer.guests + ' гост' + getWordEndingGuests(similarCards[0].offer.guests);

// Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}. Например, заезд после 14:00, выезд до 12:00:

similarAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + similarCards[0].offer.checkin + '\, выезд до ' + similarCards[0].offer.checkout;

// В список .popup__features выведите все доступные удобства в объявлении:

for (var i = 0; i < FEATURES.length; i++) {
  similarAd.querySelector('.popup__features li').remove();
}

for (var i = 0; i < similarCards[0].offer.features.length; i++) {
  var newLi = document.createElement('li');
  newLi.classList.add('popup__feature');
  var selector = 'popup__feature--' + similarCards[0].offer.features[i];
  newLi.classList.add(selector);
  similarAd.querySelector('.popup__features').appendChild(newLi);
}
console.log(similarAd.querySelector('.popup__features'));

// В блок .popup__description выведите описание объекта недвижимости offer.description:
similarAd.querySelector('.popup__description').textContent = similarCards[0].offer.description;


//     В блок .popup__photos выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения.


var photoImg = similarAd.querySelector('.popup__photos img');
photoImg.remove();

for (var i = 0; i < 3; i++) {
  var newImg = photoImg.cloneNode(true);
  newImg.src = similarCards[0].offer.photo[i];
  similarAd.querySelector('.popup__photos').appendChild(newImg);
}

// Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
similarAd.querySelector('.popup__avatar').src = similarCards[0].author.avatar;

// console.log(similarAd.querySelector('.popup__avatar').src);

// Отрисовка popup:


document.querySelector('.map__filters-container').before(fragment);

