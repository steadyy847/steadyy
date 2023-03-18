Webflow.push(function(){
  $("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 3, // PAGE: asthma = 3
				nextPage;

		nextPage = getRedirectURL(currentPage);
		location.href = nextPage;
  })
});

	$(function() {
		;
		(function($, window, document, undefined) {
			'use strict';
			var form = '.quote',
					className = 'submit_button_active',
					storage = window.localStorage,
					submit = 'input[type="submit"]',
					diagnosis_month = 'input[id="diagnosis_month"]',
					diagnosis_year = 'input[id="diagnosis_year"]',
          attacks_per_year = 'input[id="asthma_attacks_per_year"]',
          hosp_past_yr = 'input[id="asthma_hosp_past_yr"]',
          hosp_total = 'input[id="asthma_hosp_total"]',
					hospital_month = 'input[id="hospital_month"]',
					hospital_year = 'input[id="hospital_year"]';

			$(form).each(function() {
				var $form = $(this),
						$submit = $form.find( submit ),
						enabled = true,
						$diagnosis_month = $form.find( diagnosis_month ),
						$diagnosis_year = $form.find( diagnosis_year ),
            $attacks_per_year = $form.find( attacks_per_year ),
            $hosp_past_yr = $form.find( hosp_past_yr ),
            $hosp_total = $form.find( hosp_total ),
						$hospital_month = $form.find( hospital_month ),
						$hospital_year = $form.find( hospital_year );

				$('#commit_point').val("5-asthma");
				$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
				$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
				$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

				document.getElementById("submit_button").disabled = true;
              
				$diagnosis_month.mask("#0");
				$diagnosis_year.mask("0000");
				$hospital_month.mask("#0");
				$hospital_year.mask("0000");

			var storage_diag_month = storage.getItem('asthma_diag_month'),
					storage_diag_year = storage.getItem('asthma_diag_year'),
					storage_diagnosis = storage.getItem('asthma_diagnosis'),
					storage_treatment_past = storage.getItem('asthma_treatment_past'),
					storage_treatment_current = storage.getItem('asthma_treatment_current'),
					storage_inhaled_bronchodilators = storage.getItem('inhaled_bronchodilators'),
					storage_inhaled_corticosteroids = storage.getItem('inhaled_corticosteroids'),
					storage_oral_meds_no_steroids = storage.getItem('oral_meds_no_steroids'),
					storage_oral_meds_steroids = storage.getItem('oral_meds_steroids'),
					storage_rescue_inhaler = storage.getItem('rescue_inhaler'),
					storage_attacks_per_year = storage.getItem('asthma_attacks_per_year'),
					storage_hospitalization = storage.getItem('asthma_hospitalization'),
					storage_hosp_past_yr = storage.getItem('asthma_hosp_past_yr'),
					storage_hosp_total = storage.getItem('asthma_hosp_total'),
					storage_hosp_month = storage.getItem('asthma_hosp_month'),
					storage_hosp_year= storage.getItem('asthma_hosp_year');

			if (storage_diag_month !== null) {
				$diagnosis_month.val(storage_diag_month);
			}

			if (storage_diag_year !== null) {
				$diagnosis_year.val(storage_diag_year);
			}

			if (storage_diagnosis !== null) {
				$("input[name='Diagnosis'][value='" + storage_diagnosis + "']").prop("checked", true);
			}

			if (storage_treatment_past !== null) {
				$("input[name='TreatmentPast'][value='" + storage_treatment_past + "']").prop("checked", true);
				$("input[name='TreatmentPast'][value='" + storage_treatment_past + "']").prev('.w-radio-input').addClass('w--redirected-checked');
				$("#asthma_treat_past_" + storage_treatment_past.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
				$("#asthma_treat_past_" + storage_treatment_past.toLowerCase()).parent().css( "border", "#48bd9e" );
				$("#asthma_treat_past_" + storage_treatment_past.toLowerCase()).parent().css( "color", "#ffffff" );
			}

			if (storage_treatment_current !== null) {
				$("input[name='TreatmentCurrent'][value='" + storage_treatment_current + "']").prop("checked", true);
				$("input[name='TreatmentCurrent'][value='" + storage_treatment_current + "']").prev('.w-radio-input').addClass('w--redirected-checked');
				$("#asthma_treat_current_" + storage_treatment_current.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
				$("#asthma_treat_current_" + storage_treatment_current.toLowerCase()).parent().css( "border", "#48bd9e" );
				$("#asthma_treat_current_" + storage_treatment_current.toLowerCase()).parent().css( "color", "#ffffff" );
			}

      if (storage_inhaled_bronchodilators == null || storage_inhaled_bronchodilators === 'false') {
    			$("input[id='inhaled_bronchodilators']:checked").prop('checked', false);
    			$('#inhaled_bronchodilators').prev('.w-checkbox-input').removeClass('w--redirected-checked');
      } else {
          document.querySelector("input[id='inhaled_bronchodilators']").checked = true;
    			$('#inhaled_bronchodilators').prev('.w-checkbox-input').addClass('w--redirected-checked');
      }

      if (storage_inhaled_corticosteroids == null || storage_inhaled_corticosteroids === 'false') {
    			$("input[id='inhaled_corticosteroids']:checked").prop('checked', false);
    			$('#inhaled_corticosteroids').prev('.w-checkbox-input').removeClass('w--redirected-checked');
      } else {
          document.querySelector("input[id='inhaled_corticosteroids']").checked = true;
    			$('#inhaled_corticosteroids').prev('.w-checkbox-input').addClass('w--redirected-checked');
      }

      if (storage_oral_meds_no_steroids == null || storage_oral_meds_no_steroids === 'false') {
    			$("input[id='oral_meds_no_steroids']:checked").prop('checked', false);
    			$('#oral_meds_no_steroids').prev('.w-checkbox-input').removeClass('w--redirected-checked');
      } else {
          document.querySelector("input[id='oral_meds_no_steroids']").checked = true;
    			$('#oral_meds_no_steroids').prev('.w-checkbox-input').addClass('w--redirected-checked');
      }

      if (storage_oral_meds_steroids == null || storage_oral_meds_steroids === 'false') {
    			$("input[id='oral_meds_steroids']:checked").prop('checked', false);
    			$('#oral_meds_steroids').prev('.w-checkbox-input').removeClass('w--redirected-checked');
      } else {
          document.querySelector("input[id='oral_meds_steroids']").checked = true;
    			$('#oral_meds_steroids').prev('.w-checkbox-input').addClass('w--redirected-checked');
      }

      if (storage_rescue_inhaler == null || storage_rescue_inhaler === 'false') {
    			$("input[id='rescue_inhaler']:checked").prop('checked', false);
    			$('#rescue_inhaler').prev('.w-checkbox-input').removeClass('w--redirected-checked');
      } else {
          document.querySelector("input[id='rescue_inhaler']").checked = true;
    			$('#rescue_inhaler').prev('.w-checkbox-input').addClass('w--redirected-checked');
      }

			if (storage_attacks_per_year !== null) {
				$attacks_per_year.val(storage_attacks_per_year);
			}

			if (storage_hospitalization !== null) {
				$("input[name='Hospitalization'][value='" + storage_hospitalization + "']").prop("checked", true);
				$("input[name='Hospitalization'][value='" + storage_hospitalization + "']").prev('.w-radio-input').addClass('w--redirected-checked');
				$("#asthma_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
				$("#asthma_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "border", "#48bd9e" );
				$("#asthma_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "color", "#ffffff" );
			}

			if (storage_hosp_past_yr !== null) {
				$hosp_past_yr.val(storage_hosp_past_yr);
			}

			if (storage_hosp_total !== null) {
				$hosp_total.val(storage_hosp_total);
			}

			if (storage_hosp_month !== null) {
				$hospital_month.val(storage_hosp_month);
			}

			if (storage_hosp_year !== null) {
				$hospital_year.val(storage_hosp_year);
			}

			submitButtonCheck();

				$diagnosis_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$diagnosis_year.on('input.True', function() {
					this.value = yearValuesCheck(this.value);});

				$hospital_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$hospital_year.on('input.True', function() {
					this.value = yearValuesCheck(this.value);});

				$('form').on('change', 'input, select, textarea', function() {
					if (enabled) {
						submitButtonCheck();
					}
				});

				$('form').on('keyup', 'input, select, textarea', function() {
					if (enabled) {
						submitButtonCheck();
					}
				});
				function submitButtonCheck() {
					var diagnosis_selected = $("input[name='Diagnosis']:checked").val(),
							treatment_past_selected = $("input[name='TreatmentPast']:checked").val(),
							treatment_current_selected = $("input[name='TreatmentCurrent']:checked").val(),
							inhaled_bronchodilators_CB = document.getElementById('inhaled_bronchodilators').checked,
							inhaled_corticosteroids_CB = document.getElementById('inhaled_corticosteroids').checked,
							oral_meds_no_steroids_CB = document.getElementById('oral_meds_no_steroids').checked,
							oral_meds_steroids_CB = document.getElementById('oral_meds_steroids').checked,
							rescue_inhaler_CB = document.getElementById('rescue_inhaler').checked,
							hospitalization_selected = $("input[name='Hospitalization']:checked").val(),
							asthma_attacks_per_year = document.getElementById("asthma_attacks_per_year").value,
							asthma_hosp_past_yr = document.getElementById("asthma_hosp_past_yr").value,
							asthma_hosp_total = document.getElementById("asthma_hosp_total").value,
							conditionals_for_treatment_satisfied = false,
							conditionals_for_hospitalization_satisfied = false;

					if (treatment_past_selected == "Yes") {
							$(".conditional_treatment").show(500);
							if (treatment_current_selected != undefined) {
									conditionals_for_treatment_satisfied = true;
							} else {
									conditionals_for_treatment_satisfied = false;
							}
					} else if (treatment_past_selected == "No") {
							treatment_current_selected = "No";
							$("input[name='TreatmentCurrent']").prop('checked',false);
							$("input[name='TreatmentCurrent']").prev('.w-radio-input').removeClass('w--redirected-checked');
							$(".yes_no_button_2").css( "backgroundColor", "#ffffff" );
							$(".yes_no_button_2").css( "border", "#d9d9d9" );
							$(".yes_no_button_2").css( "color", "#707070" );
							if (inhaled_bronchodilators_CB == true) {
									document.getElementById('inhaled_bronchodilators').click();
									inhaled_bronchodilators_CB = false;}
							if (inhaled_corticosteroids_CB == true) {
									document.getElementById('inhaled_corticosteroids').click();
		              inhaled_corticosteroids_CB = false;}
							if (oral_meds_no_steroids_CB == true) {
									document.getElementById('oral_meds_no_steroids').click();
		              oral_meds_no_steroids_CB = false;}
							if (oral_meds_steroids_CB == true) {
									document.getElementById('oral_meds_steroids').click();
		              oral_meds_steroids_CB = false;}
							if (document.getElementById('rescue_inhaler').checked == true) {
									document.getElementById('rescue_inhaler').click();
		              rescue_inhaler_CB = false;}
//							$(".conditional_treatment").hide(500);
							conditionals_for_treatment_satisfied = true;
					}

					if (hospitalization_selected == "Yes") {
							$(".conditional_hospitalization").show(500);
							if (	 $('#asthma_hosp_past_yr').val().length  >   0
              		&& $('#asthma_hosp_total').val().length  >   0
              		&& $hospital_month.val() != '' && /^([\w-]{1,2})?$/.test( $hospital_month.val() ) 
									&& $hospital_year.val() != '' && /^([\w-]{4,4})?$/.test( $hospital_year.val() ) 
              ) {
									conditionals_for_hospitalization_satisfied = true;
              } else {
									conditionals_for_hospitalization_satisfied = false;
              }
					} else if (hospitalization_selected == "No") {
							$(".conditional_hospitalization").hide(500);
							$('#asthma_hosp_past_yr').val(null);
							$('#asthma_hosp_total').val(null);
							$hospital_month.val(null);
							$hospital_year.val(null);
							conditionals_for_hospitalization_satisfied = true;
					}

					if ($diagnosis_month.val() != '' && /^([\w-]{1,2})?$/.test( $diagnosis_month.val() ) 
					 && $diagnosis_year.val() != '' && /^([\w-]{4,4})?$/.test( $diagnosis_year.val() ) 
					 && diagnosis_selected != undefined
           && treatment_past_selected != undefined
           && $('#asthma_attacks_per_year').val().length  >   0
           && hospitalization_selected != undefined
					 && conditionals_for_treatment_satisfied
					 && conditionals_for_hospitalization_satisfied
					) {
              document.getElementById("submit_button").disabled = false;
							$submit.toggleClass(className, true);
					} else {
              document.getElementById("submit_button").disabled = true;
							$submit.toggleClass(className, false);
          }

					storage.setItem('asthma_diag_month', $diagnosis_month.val());
					storage.setItem('asthma_diag_year', $diagnosis_year.val());
					storage.setItem('asthma_diagnosis', diagnosis_selected);
					storage.setItem('asthma_treatment_past', treatment_past_selected);
					storage.setItem('asthma_treatment_current', treatment_current_selected);
					storage.setItem('inhaled_bronchodilators', inhaled_bronchodilators_CB);
					storage.setItem('inhaled_corticosteroids', inhaled_corticosteroids_CB);
					storage.setItem('oral_meds_no_steroids', oral_meds_no_steroids_CB);
					storage.setItem('oral_meds_steroids', oral_meds_steroids_CB);
					storage.setItem('rescue_inhaler', rescue_inhaler_CB);
					storage.setItem('asthma_attacks_per_year', document.getElementById("asthma_attacks_per_year").value);
					storage.setItem('asthma_hospitalization', hospitalization_selected);
					storage.setItem('asthma_hosp_past_yr', document.getElementById("asthma_hosp_past_yr").value);
					storage.setItem('asthma_hosp_total', document.getElementById("asthma_hosp_total").value);
					storage.setItem('asthma_hosp_month', $hospital_month.val());
					storage.setItem('asthma_hosp_year', $hospital_year.val());

				}
			});
		})(jQuery, window, document);
	})
