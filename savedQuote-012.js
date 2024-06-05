$(document).ready(function() {
    var storage = window.localStorage;

    storage.clear();
    var email = document.querySelector('#email').textContent,
        basics_gender = document.querySelector('#basics-gender').textContent,
        gender = basics_gender.slice(0,1).toLowerCase(),
        basics_age = document.querySelector('#basics-age').textContent,
        health_profile_smoker = document.querySelector('#health-profile-smoker').textContent,
        basics_location = document.querySelector('#basics-location').textContent,
        risk_rating = document.querySelector('#risk-rating').textContent,
        risk_class = risk_rating,
        health_profile_body_type = document.querySelector('#health-profile-body-type').textContent,
        basics_income = document.querySelector('#basics-income').textContent,
        coverage_recommendation = document.querySelector('#coverage-recommendation').textContent,
        recommended_term = document.querySelector('#recommended-term').textContent,
        health_profile_health_conditions = document.querySelector('#health-profile-health-conditions').textContent,
        header_details = document.querySelector('#header-details').textContent,
        calculated_fields = document.querySelector('#calculated-fields').textContent,
        needs_goals = document.querySelector('#needs-goals').textContent,
        needs_dependents = document.querySelector('#needs-dependents').textContent,
        needs_help = document.querySelector('#needs-help').textContent,
        needs_home = document.querySelector('#needs-home').textContent,
        needs_financial = document.querySelector('#needs-financial').textContent,
        needs_children = document.querySelector('#needs-children').textContent,
        basics_citizenship = document.querySelector('#basics-citizenship').textContent,
        health_profile_driving_risk = document.querySelector('#health-profile-driving-risk').textContent,
        health_details_tobacco_use = document.querySelector('#health-details-tobacco-use').textContent,
        health_details_asthma = document.querySelector('#health-details-asthma').textContent,
        health_details_cancer = document.querySelector('#health-details-cancer').textContent,
        health_details_depression = document.querySelector('#health-details-depression').textContent,
        health_details_diabetes = document.querySelector('#health-details-diabetes').textContent,
        health_details_heart = document.querySelector('#health-details-heart').textContent,
        health_details_sleep_apnea = document.querySelector('#health-details-sleep-apnea').textContent,
        health_details_stroke = document.querySelector('#health-details-stroke').textContent,
        health_details_driving_risk = document.querySelector('#health-details-driving-risk').textContent;

    parseField(basics_age); // basics_age has two components that need to be parsed: age;dob
    parseField(basics_location); // basics_location has three components that need to be parsed: city;state;zip
    parseField(health_profile_body_type); // health_profile_body_type has three components: height_feet;height_inches;weight
    parseField(health_profile_health_conditions);
    parseField(header_details);
    parseField(calculated_fields);
    parseField(needs_goals);
    parseField(needs_dependents);
    parseField(needs_home);
    parseField(needs_financial);
    parseField(needs_children);
    parseField(basics_citizenship);
    parseField(health_details_tobacco_use);
    parseField(health_details_asthma);
    parseField(health_details_cancer);
    parseField(health_details_depression);
    parseField(health_details_diabetes);
    parseField(health_details_heart);
    parseField(health_details_sleep_apnea);
    parseField(health_details_stroke);
    parseField(health_details_driving_risk);

    // Add delay to ensure storage is populated before reading
    setTimeout(function() {
        var age = storage.getItem('age');

        storage.setItem('quote_email_address', email);
        storage.setItem('gender', basics_gender);
        storage.setItem('tobacco', health_profile_smoker);
        storage.setItem('risk_class', risk_rating);
        storage.setItem('annual_income', basics_income);
        storage.setItem('coverage_recommendation', coverage_recommendation);
        storage.setItem('recommended_term', recommended_term);
        storage.setItem('needs_help', needs_help);
        storage.setItem('license', health_profile_driving_risk);

        // Continue with the rest of the code that depends on the storage being populated
        $('#login-link').click(function(e) {
            $('.login-modal').css('display', 'flex').show(450);
            $('.login-modal').css('opacity', 1);
        });

        $('#create-account-link').click(function(e) {
            $('.login-modal').css('display', 'none').show(450);
            $('.login-modal').css('opacity', 0);
        });

        var catArray = document.querySelectorAll('.w-dyn-item .categ');
        catArray.forEach(function(elem) {
            var text = elem.innerText || elem.innerContent;
            var className = conv(text);
            if (!isNaN(parseInt(className.charAt(0), 10))) {
                className = ("_" + className);
            }
            elem.closest(".mix").classList.add(className);
        });

        var mixer10 = mixitup('#container-10'),
            mixer15 = mixitup('#container-15'),
            mixer20 = mixitup('#container-20'),
            mixer25 = mixitup('#container-25'),
            mixer30 = mixitup('#container-30');

        var coverageAmountInput = document.querySelector('[id="coverage_amount"]');
        document.getElementById("coverage_amount").value = storage.getItem('coverage_recommendation');

        var coverage_slider = document.getElementById("coverage_amount");
        var coverage_output = document.getElementById("coverage_amount_value");
        const min = coverage_slider.min;
        const max = coverage_slider.max;
        const value = coverage_slider.value;
        var rec_txt_offset = (-57.5 + 20 - (20 * ((value / max) * 2)));

        $('#slider_1_companion').css('left', 'calc(' + ((value - min) / (max - min)) + '* (100% - 35px))');
        $('#slider_1_companion').css('display', 'block');
        $('#slider_2_companion').css('left', 'calc((' + ((value - min) / (max - min)) + '* 100%) + ' + rec_txt_offset + 'px)');
        $('#slider_2_companion').css('display', 'block');

        coverage_slider.style.background = "linear-gradient(to right, #253B5F 0%, #253B5F " + ((value - min) / (max - min) * 100) + "%, #D9D9D9 " + ((value - min) / (max - min) * 100) + "%, #D9D9D9 100%)";
        coverage_output.innerHTML = formatter.format(coverage_slider.value).slice(0, formatter.format(coverage_slider.value).length - 3);
        storage.setItem('coverage_selected', conv(coverage_output.innerHTML));
        getQuotes(document);

        coverage_slider.oninput = function() {
            coverage_output.innerHTML = formatter.format(this.value).slice(0, formatter.format(this.value).length - 3);
            this.style.background = "linear-gradient(to right, #253B5F 0%, #253B5F " + ((this.value - this.min) / (this.max - this.min) * 100) + "%, #D9D9D9 " + ((this.value - this.min) / (this.max - this.min) * 100) + "%, #D9D9D9 100%)";
            storage.setItem('coverage_selected', conv(coverage_output.innerHTML));
        }

        coverage_slider.addEventListener('change', function() {
            $('#quote_detail_10').hide(500);
            $('#quote_detail_15').hide(500);
            $('#quote_detail_20').hide(500);
            $('#quote_detail_25').hide(500);
            $('#quote_detail_30').hide(500);
            getQuotes(document);
        });

        var coverageAmount = document.getElementById("coverage_amount");

        coverageAmount.addEventListener("input", function() {
            var value = parseInt(coverageAmount.value);
            if (value < 1000000) {
                coverageAmount.step = 50000;
            } else {
                coverageAmount.step = 100000;
            }
        });

        function newFocus(e) {
            const activeObject = document.activeElement;
            storage.setItem('app_coverage_selected', formatter.format(document.getElementById("coverage_amount").value).slice(0, formatter.format(document.getElementById("coverage_amount").value).length - 3));
            storage.setItem('app_term_selected', $(this).parents('.child-set_content').find('.policy_length').text());
            storage.setItem('app_carrier_selected', $(this).parents('.child-set_content').find('.carrier_header').text());
            storage.setItem('app_product_selected', $(this).parents('.child-set_content').find('.product_header').text());
            storage.setItem('app_premium_selected', "$" + $(this).parents('.child-set_content').find('.premium_dollars').text() + $(this).parents('.child-set_content').find('.premium_cents').text());
        }

        var quote_container = document.querySelectorAll("#quote_result");
        quote_container.forEach(function(quote_container) {
            quote_container.addEventListener('click', newFocus, false);
        });

        function toggleDetail(e) {
            const activeObject = document.activeElement;
            $(this).parents('.child-set_content').find('.carriers_container').slideToggle();
            $(this).parents('.child-set_content').find('#expander').slideToggle();
            $(this).parents('.child-set_content').find('#collapser').slideToggle();
        }

        var expander = document.querySelectorAll("#expander");
        expander.forEach(function(expander) {
            expander.addEventListener('click', toggleDetail, false);
        });
        var collapser = document.querySelectorAll("#collapser");
        collapser.forEach(function(collapser) {
            collapser.addEventListener('click', toggleDetail, false);
        });

        $(function() {
            (function($, window, document, undefined) {
                'use strict';
                var storage = window.localStorage;

                var commitPointItem = storage.getItem('commit_point');
                var numericPartOfCommitPoint = commitPointItem ? parseInt(commitPointItem.split('-')[0]) : null;

                if (numericPartOfCommitPoint > 13) {
                    $('#commit_point').val(commitPointItem);
                } else {
                    storage.setItem('commit_point', "13-quotes");
                    $('#commit_point').val("13-quotes");
                }
                storage.setItem('navigation_from', "13-quotes");

                $('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
                $('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
                $('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

                var income_replacement_multiple = storage.getItem('income_replacement_multiple');

                if (income_replacement_multiple !== null && income_replacement_multiple !== "" && Number(income_replacement_multiple) > 0) {
                    $('#coverage_multiple').text(income_replacement_multiple + "x");
                } else {
                    $('#coverage_multiple').text("7x");
                }

            })(jQuery, window, document);
        });

    }, 100); // 100 milliseconds delay

    function parseField(field) {
        var pairs = field.split(";");
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            var keyValue = pair.split("=");
            var key = keyValue[0];
            var value = keyValue[1];
            storage.setItem(key, value);
        }
    }
});
