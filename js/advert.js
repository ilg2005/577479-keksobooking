'use strict';

(function () {
  var popupCloseElement;

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
  var getTranslatedHousingType = function (type) {
    switch (type) {
      case 'palace':
        var translation = 'Дворец';
        break;
      case 'house':
        translation = 'Дом';
        break;
      case 'flat':
        translation = 'Квартира';
        break;
      case 'bungalo':
        translation = 'Бунгало';
        break;
    }
    return translation;
  };

  var generateAdvert = function (card) {

    var advert = window.util.advertTemplateElement.cloneNode(true);

    advert.querySelector('.popup__avatar').src = card.author.avatar;
    advert.querySelector('.popup__title').textContent = card.offer.title;
    advert.querySelector('.popup__text--address').textContent = card.offer.address;
    advert.querySelector('.popup__text--price').innerHTML = card.offer.price + ' &#x20bd;/ночь';
    advert.querySelector('.popup__type').textContent = getTranslatedHousingType(card.offer.type);
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
})();
