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

var controlHour = CONTROL_HOURS[0]; // временно для отладки


var position = {
  x: randomizeNumber(POSITION_X.MIN, POSITION_X.MAX), // случайное число, координата x метки на карте от 300 до 900,
  y: randomizeNumber(POSITION_Y.MIN, POSITION_Y.MAX) // случайное число, координата y метки на карте от 130 до 630
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
      checkin: controlHour, // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
      checkout: controlHour, // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
      features: FEATURES, // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
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

var renderPin = function (pin) {
  var pinTemplate = document.querySelector('template').content;
  var similarPin = pinTemplate.cloneNode(true);

  var pinWidth = similarPin.querySelector('.map__card img').width;
  var pinHeight = similarPin.querySelector('.map__card img').height;

  similarPin.querySelector('.map__card img').style = 'left: ' + (card['location'].x + pinWidth) + 'px; top: ' + (card['location'].y + pinHeight) + 'px;';
  similarPin.querySelector('.map__card img').src = card.author.avatar;
  similarPin.querySelector('.map__card img').alt = card.offer.title;
  similarPin.querySelector('.popup__title').textContent = card.offer.title;
  similarPin.querySelector('.popup__text--address').textContent = card.offer.address;
  similarPin.querySelector('.popup__text--price').innerHTML = card.offer.price + ' &#x20bd;/ночь';
  similarPin.querySelector('.popup__type').textContent = card.offer.type;


  console.log(similarPin.querySelector('.popup__type').textContent);

  return similarPin;
};
renderPin(4);
