'use strict';

(function () {
  var formFieldsElement = document.querySelectorAll('fieldset');

  var inactiveState = {
    'classToggle': 'add',
    'attributeToggle': 'set'
  };

  var activeState = {
    'classToggle': 'remove',
    'attributeToggle': 'remove'
  };

  var togglePageState = function (state) {
    document.querySelector('.map').classList[state.classToggle]('map--faded');
    document.querySelector('.ad-form').classList[state.classToggle]('ad-form--disabled');
    formFieldsElement.forEach(function (element) {
      element[state.attributeToggle + 'Attribute']('disabled', 'disabled');
    });
    window.util.advertTemplateElement.classList[state.classToggle]('hidden');
    window.util.pinTemplateElement.classList[state.classToggle]('hidden');
  };

  togglePageState(inactiveState);

  window.pageActivate = function () {
    togglePageState(activeState);
  };

})();
