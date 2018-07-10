'use strict';

(function () {
  var HOUSING_MIN_PRICES = {
    'palace': '10000',
    'flat': '1000',
    'house': '5000',
    'bungalo': '0'
  };

  var formHousingTypeElement = document.querySelector('#type');
  var formPriceElement = document.querySelector('#price');
  var formCheckinElement = document.querySelector('#timein');
  var formCheckoutElement = document.querySelector('#timeout');
  var formRoomsQuantityElement = document.querySelector('#room_number');
  var formGuestsQuantityElement = document.querySelector('#capacity');

  var onFormHousingTypeElementChange = function () {
    setHousingMinPrice(formHousingTypeElement.value);
  };

  var setHousingMinPrice = function (selectedHousingType) {
    formPriceElement.setAttribute('placeholder', HOUSING_MIN_PRICES[selectedHousingType]);
    formPriceElement.setAttribute('min', HOUSING_MIN_PRICES[selectedHousingType]);
  };

  var onFormCheckinElementChange = function () {
    formCheckoutElement.value = formCheckinElement.value;
  };

  var onFormCheckoutElementChange = function () {
    formCheckinElement.value = formCheckoutElement.value;
  };

  var setCapacityLimitations = function (roomsQuantity, guestsQuantity) {
    formGuestsQuantityElement.setCustomValidity('');
    roomsQuantity = Number(roomsQuantity);
    guestsQuantity = Number(guestsQuantity);
    if (roomsQuantity === 1 && guestsQuantity !== 1) {
      formGuestsQuantityElement.setCustomValidity('1 комната - для 1 гостя');
    } else if (roomsQuantity === 2 && guestsQuantity !== 1 && guestsQuantity !== 2) {
      formGuestsQuantityElement.setCustomValidity('2 комнаты - для 1 или 2 гостей');
    } else if (roomsQuantity === 3 && guestsQuantity !== 1 && guestsQuantity !== 2 && guestsQuantity !== 3) {
      formGuestsQuantityElement.setCustomValidity('3 комнаты - для 1, 2 или 3 гостей');
    } else if (roomsQuantity === 100 && guestsQuantity !== 0) {
      formGuestsQuantityElement.setCustomValidity('100 комнат - не для гостей');
    } else {
      formGuestsQuantityElement.setCustomValidity('');
    }
  };

  var onFormRoomsQuantityElementChange = function () {
    setCapacityLimitations(formRoomsQuantityElement.value, formGuestsQuantityElement.value);
  };

  var onFormGuestsQuantityElementChange = function () {
    setCapacityLimitations(formRoomsQuantityElement.value, formGuestsQuantityElement.value);
  };

  formHousingTypeElement.addEventListener('change', onFormHousingTypeElementChange);
  formCheckinElement.addEventListener('change', onFormCheckinElementChange);
  formCheckoutElement.addEventListener('change', onFormCheckoutElementChange);
  formRoomsQuantityElement.addEventListener('change', onFormRoomsQuantityElementChange);
  formGuestsQuantityElement.addEventListener('change', onFormGuestsQuantityElementChange);
})();
