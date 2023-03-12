	function submitButtonCheck(document, form, thisObject, page, height_errors, weight_errors, conditions_errors) {
		var asthma_CB = document.getElementById('asthma').checked,
				depression_CB = document.getElementById('depression').checked,
				heart_attack_CB = document.getElementById('heart_attack').checked,
				stroke_CB = document.getElementById('stroke').checked,
				cancer_CB = document.getElementById('cancer').checked,
				sleep_apnea_CB = document.getElementById('sleep_apnea').checked,
				diabetes_CB = document.getElementById('diabetes').checked,
				no_conditions_CB = document.getElementById('no_conditions').checked,

				className = 'button_active',
				storage = window.localStorage,
				$body_next = form.find( '#body-step' ),
				$tobacco_next = form.find( '#tobacco-step' ),
				$conditions_next = form.find( '#conditions-step' ),
				$license_next = form.find( '#license-step' ),
				$income_next = form.find( '#income-step' ),
				$height_feet = form.find('input[id="height_feet"]'),
        height_feet = $height_feet.val().slice(0,1),
				$height_inches = form.find('input[id="height_inches"]'),
        height_inches = $height_inches.val().slice(0,$height_inches.val().length-1),
				$weight = form.find('input[id="weight"]'),
        weight = $weight.val(),
				$tobacco = form.find('.tobacco'),
				tobacco_selected = $("input[name='Tobacco']:checked").val(),
				$license = form.find('.license'),
				license_selected = $("input[name='License']:checked").val(),

//				height_errors = false,
//				weight_errors = false,
//				weight_valid_error = false,
				tobacco_errors,
				strDateTime = getFormattedDate();

		if (page == "license") {
			if (license_selected != undefined) {
				$('#license-alert-required').hide(500);
				document.getElementById("license-step").disabled = false;
				$license_next.toggleClass(className, true);
				license_errors = false;
				storage.setItem('license', license_selected);
				setTimeout(function() {$('.w-round div:nth-child(2)').trigger('tap'); }, 500);
			} else {
				document.getElementById("license-step").disabled = true;
				$license_next.toggleClass(className, false);
				license_errors = true;
			}
		}

		if (page == "body") {
			if ($height_feet.val() != '' && /^([\w\']{2,2})?$/.test($height_feet.val()) &&
					$weight.val() != '' && /^([\w]{2,3})?$/.test($weight.val()) && parseInt($weight.val()) >= 75 && parseInt($weight.val()) <= 500 &&
					!height_errors && !weight_errors) {
				document.getElementById("body-step").disabled = false;
				$body_next.toggleClass(className, true);
        if (height_inches.length == 0) {height_inches = "0";}
				storage.setItem('height_feet', height_feet);
				storage.setItem('height_inches', height_inches);
				storage.setItem('weight', weight);
				if (tobacco_selected != undefined && height_feet !='' && weight!='') {
					var risk = calcRisk(tobacco_selected, height_feet, height_inches, weight);
						storage.setItem('risk_class', risk.risk_class);
				}
			} else {

				document.getElementById("body-step").disabled = true;
				$body_next.toggleClass(className, false);
			}
		}

  	if (page == "tobacco") {
			if (tobacco_selected != undefined) {
				$('#tobacco-alert-required').hide(500);
				document.getElementById("tobacco-step").disabled = false;
				$tobacco_next.toggleClass(className, true);
				storage.setItem('tobacco', tobacco_selected);
        tobacco_errors = false;
				if (tobacco_selected != undefined && height_feet !='' && weight!='') {
					var risk = calcRisk(tobacco_selected, height_feet, height_inches, weight);
						storage.setItem('risk_class', risk.risk_class);
				}
				setTimeout(function() {$('.w-round div:nth-child(4)').trigger('tap'); }, 500);
			} else {
				document.getElementById("tobacco-step").disabled = true;
				$tobacco_next.toggleClass(className, false);
        tobacco_errors = true;
			}
    }

  	if (page == "conditions") {
			var asthma_CB = document.getElementById('asthma').checked,
					depression_CB = document.getElementById('depression').checked,
					heart_attack_CB = document.getElementById('heart_attack').checked,
					stroke_CB = document.getElementById('stroke').checked,
					cancer_CB = document.getElementById('cancer').checked,
					sleep_apnea_CB = document.getElementById('sleep_apnea').checked,
					diabetes_CB = document.getElementById('diabetes').checked,
					no_conditions_CB = document.getElementById('no_conditions').checked;

			if (document.getElementById(thisObject.id).checked) {
				$(thisObject.id).prev('.w-checkbox-input').addClass('w--redirected-checked');
			}
			else {
				$(thisObject.id).prev('.w-checkbox-input').removeClass('w--redirected-checked');
				$("input[id='"+thisObject.id+"']:checked").prop('checked', false);
			}

			if (thisObject.name.slice(0,9) == "Condition") {
				/*  If at least one health condition was just changed, check to see what the state of the
						'No Conditions' checkbox was, and if it was checked, uncheck it */
				if (no_conditions_CB) {
					$("input[name='NoConditions']:checked").prev('.w-checkbox-input').removeClass('w--redirected-checked');
					$("input[name='NoConditions']:checked").prop('checked', false);
				}
			}
			else {
				/*  If the 'No Conditions' checkbox was just changed, check to see if any health conditions were previously checked, and if so, then clear them */
				if (thisObject.name == "NoConditions") {
					if (asthma_CB || depression_CB || heart_attack_CB || stroke_CB || cancer_CB || sleep_apnea_CB || diabetes_CB) {
						$(asthma).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(depression).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(heart_attack).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(stroke).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(cancer).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(sleep_apnea).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(diabetes).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(asthma).prop('checked', false);
						$(depression).prop('checked', false);
						$(heart_attack).prop('checked', false);
						$(stroke).prop('checked', false);
						$(cancer).prop('checked', false);
						$(sleep_apnea).prop('checked', false);
						$(diabetes).prop('checked', false);
					}
				}
			}
			/*  After all checkboxes have been set or unset properly, write the current state of each to the local storage */
			storage.setItem('asthma', document.getElementById('asthma').checked);
			storage.setItem('depression', document.getElementById('depression').checked);
			storage.setItem('heart_attack', document.getElementById('heart_attack').checked);
			storage.setItem('stroke', document.getElementById('stroke').checked);
			storage.setItem('cancer', document.getElementById('cancer').checked);
			storage.setItem('sleep_apnea', document.getElementById('sleep_apnea').checked);
			storage.setItem('diabetes', document.getElementById('diabetes').checked);
			storage.setItem('no_conditions', document.getElementById('no_conditions').checked);

			/*  After all checkboxes have been set or unset properly, re-collect the current state of
					each checkbox prior to evaluating how to set error messages and submit button */
			asthma_CB = document.getElementById('asthma').checked;
			depression_CB = document.getElementById('depression').checked;
			heart_attack_CB = document.getElementById('heart_attack').checked;
			stroke_CB = document.getElementById('stroke').checked;
			cancer_CB = document.getElementById('cancer').checked;
			sleep_apnea_CB = document.getElementById('sleep_apnea').checked;
			diabetes_CB = document.getElementById('diabetes').checked;
			no_conditions_CB = document.getElementById('no_conditions').checked;

			if (asthma_CB || depression_CB || heart_attack_CB || stroke_CB || cancer_CB || sleep_apnea_CB || diabetes_CB || no_conditions_CB) {
					$('#conditions-alert-required').hide(500);
					document.getElementById("conditions-step").disabled = false;
					$conditions_next.toggleClass(className, true);
					conditions_errors = false;
			} else {
					document.getElementById("conditions-step").disabled = true;
					$conditions_next.toggleClass(className, false);
					conditions_errors = true;
			}
			return conditions_errors;
		}

	}
