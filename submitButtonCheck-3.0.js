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

			console.log("thisObject.id="+thisObject.id+"\n"+
									"thisObject.name="+thisObject.name);

			console.log("asthma_CB="+asthma_CB+"\n"+
									"depression_CB="+depression_CB+"\n"+
									"heart_attack_CB="+heart_attack_CB+"\n"+
									"stroke_CB="+stroke_CB+"\n"+
									"cancer_CB="+cancer_CB+"\n"+
									"sleep_apnea_CB"+sleep_apnea_CB+"\n"+
									"diabetes_CB"+diabetes_CB+"\n"+
									"no_conditions_CB"+no_conditions_CB);

			if (document.getElementById(thisObject.id).checked) {
				$(thisObject.id).prev('.w-checkbox-input').addClass('w--redirected-checked');
			}
			else {
				$(thisObject.id).prev('.w-checkbox-input').removeClass('w--redirected-checked');
				$("input[id='"+thisObject.id+"']:checked").prop('checked', false);
			}

			if (thisObject.name.slice(0,9) == "Condition") {
				if (no_conditions_CB) {
					$("input[name='NoConditions']:checked").prev('.w-checkbox-input').removeClass('w--redirected-checked');
					$("input[name='NoConditions']:checked").prop('checked', false);
				}
			}
			else {
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
/*************************************/

			if (asthma_CB || depression_CB || heart_attack_CB || stroke_CB || cancer_CB || sleep_apnea_CB || diabetes_CB || no_conditions_CB) {
					$('#conditions-alert-required').hide(500);
					document.getElementById("conditions-step").disabled = false;
					$conditions_next.toggleClass(className, true);
					conditions_errors = false;
					storage.setItem('asthma', asthma_CB);
					storage.setItem('depression', depression_CB);
					storage.setItem('heart_attack', heart_attack_CB);
					storage.setItem('stroke', stroke_CB);
					storage.setItem('cancer', cancer_CB);
					storage.setItem('sleep_apnea', sleep_apnea_CB);
					storage.setItem('diabetes', diabetes_CB);
					storage.setItem('no_conditions', no_conditions_CB);
			} else {
					document.getElementById("conditions-step").disabled = true;
					$conditions_next.toggleClass(className, false);
					conditions_errors = true;
			}
			return conditions_errors;
		}

	}
