// Shared scoped variables
let formattedAddress = '',
    house_number = '',
    street = '',
    address_line1 = '',
    address_line2 = '',
    city = '',
    state = '',
    postalCode = '';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

$(function () {
  (function ($, window, document, undefined) {
    'use strict';

    const form = '.application',
          className = 'submit_button_active',
          submit = 'input[type="submit"]',
          storage = window.localStorage;

    $(form).each(function () {
      const $form = $(this),
            $submit = $form.find(submit),
            $app_first_name = $form.find('#app_first_name'),
            $app_last_name = $form.find('#app_last_name'),
            $app_home_address = $form.find('#app_home_address'),
            $app_house_number = $form.find('#app_house_number'),
            $app_street = $form.find('#app_street'),
            $app_address_line1 = $form.find('#app_address_line1'),
            $app_address_line2 = $form.find('#app_address_line2'),
            $app_city = $form.find('#app_city'),
            $app_state = $form.find('#app_state'),
            $app_zip = $form.find('#app_zip'),
            $app_email_address = $form.find('#app_email_address'),
            $app_phone_number = $form.find('#app_phone_number'),
            $app_source_category = $form.find('#app_source_category');

      document.getElementById('submit_button').disabled = true;

      $app_home_address.attr('autocomplete', 'off');
      $app_phone_number.mask('(000) 000-0000');

      $app_phone_number.on('input.True', function () {
        if ($(this).val().length > 14) {
          $(this).val($(this).val().slice(0, 14));
        }
      });

      const gpaInput = document.getElementById('app_home_address');
      if (!gpaInput) {
        console.error("Element with ID 'app_home_address' not found");
        return;
      }

      const autocomplete = new google.maps.places.Autocomplete(gpaInput, {
        types: ['geocode'],
        componentRestrictions: { country: 'US' },
        fields: ['address_components', 'formatted_address']
      });

      autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();

        formattedAddress = place.formatted_address || '';
        house_number = '';
        street = '';
        address_line1 = '';
        address_line2 = '';
        city = '';
        state = '';
        postalCode = '';

        storage.setItem('app_formatted_address', formattedAddress);

        if (place && place.address_components) {
          for (let i = 0; i < place.address_components.length; i++) {
            const component = place.address_components[i];
            const types = component.types;

            if (types.includes('street_number')) house_number = component.long_name;
            if (types.includes('route')) street = component.long_name;
            if (types.includes('subpremise')) address_line2 = component.long_name;
            if (types.includes('locality')) city = component.long_name;
            if (types.includes('administrative_area_level_1')) state = component.short_name;
            if (types.includes('postal_code')) postalCode = component.long_name;
          }
        }

        if (house_number && street) {
          address_line1 = `${house_number} ${street}`;
        }

        $app_house_number.val(house_number);
        storage.setItem('app_house_number', house_number);

        $app_street.val(street);
        storage.setItem('app_street', street);

        $app_address_line1.val(address_line1);
        storage.setItem('app_address_line1', address_line1);

        $app_address_line2.val(address_line2);
        storage.setItem('app_address_line2', address_line2);

        $app_city.val(city);
        storage.setItem('app_city', city);

        $app_state.val(state);
        storage.setItem('app_state', state);

        $app_zip.val(postalCode);
        storage.setItem('app_zip', postalCode);

        validateAddress();
        submitButtonCheck();
        $app_home_address.focus();
      });

      function validateAddress() {
        const validStates = ["IL", "CA", "FL", "MI", "NJ", "NY", "PA", "TX", "OH"];

        if (
          formattedAddress && address_line1 && city && state && postalCode
        ) {
          $('#error-address-not-valid').hide(500);
          $('#error-address-required').hide(500);

          if (validStates.includes(state)) {
            $('#zip-alert-state').hide(500);
            $app_home_address.css('border-color', '#C5C5C5');
          } else {
            $('#zip-alert-state').show(500);
            $app_home_address.css('border-color', '#AC0036');
          }
        } else if (
          formattedAddress && (!address_line1 || !city || !state || !postalCode)
        ) {
          $('#zip-alert-state').hide(500);
          $('#error-address-required').hide(500);
          $('#error-address-not-valid').show(500);
          $app_home_address.css('border-color', '#AC0036');
        } else {
          $('#zip-alert-state').hide(500);
          $('#error-address-required').show(500);
          $('#error-address-not-valid').hide(500);
          $app_home_address.css('border-color', '#AC0036');
        }
      }

      function submitButtonCheck() {
        const isValidEmail = emailRegex.test($app_email_address.val());

        const allValid =
          $app_first_name.val() &&
          $app_last_name.val() &&
          $app_home_address.val() &&
          formattedAddress &&
          $app_address_line1.val() &&
          $app_city.val() &&
          $app_state.val() &&
          $app_zip.val() &&
          $app_email_address.val() &&
          isValidEmail &&
          $app_phone_number.val().length === 14 &&
          $app_source_category.val();

        if (allValid) {
          document.getElementById('submit_button').disabled = false;
          $submit.addClass(className);
        } else {
          document.getElementById('submit_button').disabled = true;
          $submit.removeClass(className);
        }
      }
    });
  })(jQuery, window, document);
});
