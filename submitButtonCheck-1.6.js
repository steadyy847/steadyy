	function submitButtonCheck(document, page, height_errors, weight_errors) {
		var asthma_CB = document.getElementById('asthma').checked,
				depression_CB = document.getElementById('depression').checked,
				heart_attack_CB = document.getElementById('heart_attack').checked,
				stroke_CB = document.getElementById('stroke').checked,
				cancer_CB = document.getElementById('cancer').checked,
				sleep_apnea_CB = document.getElementById('sleep_apnea').checked,
				diabetes_CB = document.getElementById('diabetes').checked,
				no_conditions_CB = document.getElementById('no_conditions').checked,
		    
				$form = $(this),
				className = 'button_active',
				storage = window.localStorage,
				$body_next = $form.find( '#body-step' ),
				$tobacco_next = $form.find( '#tobacco-step' ),
				$conditions_next = $form.find( '#conditions-step' ),
				$license_next = $form.find( '#license-step' ),
				$income_next = $form.find( '#income-step' ),
				$height_feet = document.find('input[id="height_feet"]'),
				$height_inches = document.find('input[id="height_inches"]'),
				$weight = document.find('input[id="weight"]'),
				$tobacco = $form.find('.tobacco'),
				tobacco_selected = $("input[name='Tobacco']:checked").val(),

//				height_errors = false,
//				weight_errors = false,
//				weight_valid_error = false,
				tobacco_errors,
				strDateTime = getFormattedDate();
console.log("In the submitButtonCheck() function\n"+
            "height_errors="+height_errors+" | weight_errors="+weight_errors+"\n"+
            "$height_feet.val()="+$height_feet.val()+" | $weight.val()="+$weight.val());
		if (page == "body") {
			if ($height_feet.val() != '' && /^([\w\']{2,2})?$/.test($height_feet.val()) &&
					$weight.val() != '' && /^([\w]{2,3})?$/.test($weight.val()) && parseInt($weight.val()) >= 75 && parseInt($weight.val()) <= 500 &&
					!height_errors && !weight_errors) {
console.log("In the TRUE section of page=body");
				document.getElementById("body-step").disabled = false;
				$body_next.toggleClass(className, true);
				storage.setItem('height_feet', height_feet);
				storage.setItem('height_inches', height_inches);
				storage.setItem('weight', weight);
				if (tobacco_selected != undefined && height_feet !='' && weight!='') {
     			if (height_inches.length == 0) {height_inches = "0";}
					var risk = calcRisk(tobacco_selected, height_feet, height_inches, weight);
						storage.setItem('risk_class', risk.risk_class);
				}
			} else {
console.log("In the FALSE section of page=body");
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
   				if (height_inches.length == 0) {height_inches = "0";}
					var risk = calcRisk(tobacco_selected, height_feet, height_inches, weight);
						storage.setItem('risk_class', risk.risk_class);
				}
				setTimeout(function() {$('.w-round div:nth-child(3)').trigger('tap'); }, 500);
			} else {
				document.getElementById("tobacco-step").disabled = true;
				$tobacco_next.toggleClass(className, false);
        tobacco_errors = true;
			}
    }

  	if (page == "conditions") {
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
		}

		if (page == "license") {
			if (license_selected != undefined) {
				$('#license-alert-required').hide(500);
				document.getElementById("license-step").disabled = false;
				$license_next.toggleClass(className, true);
				license_errors = false;
				storage.setItem('license', license_selected);
			} else {
				document.getElementById("license-step").disabled = true;
				$license_next.toggleClass(className, false);
				license_errors = true;
			}
		}
	}
