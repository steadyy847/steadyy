/*
Webflow.push(function(){
  $("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 3, // PAGE: asthma = 3
				nextPage;
		nextPage = getRedirectURL(currentPage);
		location.href = nextPage;
  })
});
*/
	$(function() {
		;
		(function($, window, document, undefined) {
			'use strict';
			var form = '.quote',
     			className = 'button_active',
					storage = window.localStorage;

			$(form).each(function() {
				var $form = $(this),
      			$asthma_more_next = $form.find( '#asthma-more-step' ),
      			currentPage = 3, // PAGE: asthma = 3
      			nextPage,
      			last_focus,
						enabled = true,
            submit_errors = true,
						$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
						$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
            $attacks_per_year = $form.find( 'input[id="asthma_attacks_per_year"]' ),
            $hosp_past_yr = $form.find( 'input[id="asthma_hosp_past_yr"]' ),
            $hosp_total = $form.find( 'input[id="asthma_hosp_total"]' ),
						$hospital_month = $form.find( 'input[id="hospital_month"]' ),
						$hospital_year = $form.find( 'input[id="hospital_year"]' ),
            diagnosis_date_errors = false,
			      $diagnosis_date = $form.find('.diagnosis-date'),
            diagnosis_severity_errors = false,
            $diagnosis_severity = $form.find('.diagnosis-severity'),
            past_treatment_errors = false,
            $past_treatment = $form.find('.past-treatment');

				$('#commit_point').val("5-asthma");
				$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
				$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
				$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

  			document.getElementById("asthma-more-step").disabled = true;
        
  /* STEP 1 - Set up masks for all number entry fields */
				$diagnosis_month.mask("#0");
				$diagnosis_year.mask("0000");
				$hospital_month.mask("#0");
				$hospital_year.mask("0000");

  /* STEP 2 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
              left this page and comes back later, so they don't lose data that they may have already entered */
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

  /* STEP 3 - Evaluate whether there was data in localStorage for the page, and re-initialize it with that data, if there was */
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

			if (storage_attacks_per_year !== null && storage_attacks_per_year !== "") {
        document.getElementById("asthma_attacks_per_year").value = storage_attacks_per_year;
			}

			if (storage_hospitalization !== null) {
				$("input[name='Hospitalization'][value='" + storage_hospitalization + "']").prop("checked", true);
				$("input[name='Hospitalization'][value='" + storage_hospitalization + "']").prev('.w-radio-input').addClass('w--redirected-checked');
				$("#asthma_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
				$("#asthma_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "border", "#48bd9e" );
				$("#asthma_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "color", "#ffffff" );
			}

			if (storage_hosp_past_yr !== null && storage_hosp_past_yr !== "") {
        document.getElementById("asthma_hosp_past_yr").value = storage_hosp_past_yr;
			}

			if (storage_hosp_total !== null && storage_hosp_total !== "") {
        document.getElementById("asthma_hosp_total").value = storage_hosp_total;
			}

			if (storage_hosp_month !== null) {
				$hospital_month.val(storage_hosp_month);
			}

			if (storage_hosp_year !== null) {
				$hospital_year.val(storage_hosp_year);
			}

			submitButtonCheck();

  /* STEP 4 - Set up listeners on each field for input events & validate all date entry fields */
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

			$diagnosis_date.on('focusin', function() {
					diagnosis_date_errors = chkAsthmaDetailErrors('diagnosis_date', 'focusin', $diagnosis_date, $form, last_focus);
					last_focus = "diagnosis_date";
			});

			$diagnosis_severity.on('focusin', function() {
					diagnosis_severity_errors = chkAsthmaDetailErrors('diagnosis_severity', 'focusin', $diagnosis_severity, $form, last_focus);
					last_focus = "diagnosis_severity";
			});

			$past_treatment.on('focusin', function() {
					past_treatment_errors = chkAsthmaDetailErrors('past_treatment', 'focusin', $past_treatment, $form, last_focus);
					last_focus = "past_treatment";
			});

  			$('#asthma-more-step').click(function(e) {
  				e.preventDefault();
          submitButtonCheck();

  				nextPage = getRedirectURL(currentPage);

          if (submit_errors == false) {
        		document.getElementById("asthma-more-step").disabled = false;
  					location.href = nextPage;
  				} else {
        		document.getElementById("asthma-more-step").disabled = true;
          }
  			});
        
  			$('#asthma-more-prev').click(function(e) {
  				e.preventDefault();
  				window.history.back();
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

    					if (inhaled_bronchodilators_CB || inhaled_corticosteroids_CB || oral_meds_no_steroids_CB || oral_meds_steroids_CB || rescue_inhaler_CB) {
    						$(inhaled_bronchodilators).prev('.w-checkbox-input').removeClass('w--redirected-checked');
    						$(inhaled_corticosteroids).prev('.w-checkbox-input').removeClass('w--redirected-checked');
    						$(oral_meds_no_steroids).prev('.w-checkbox-input').removeClass('w--redirected-checked');
    						$(oral_meds_steroids).prev('.w-checkbox-input').removeClass('w--redirected-checked');
    						$(rescue_inhaler).prev('.w-checkbox-input').removeClass('w--redirected-checked');

    						$(inhaled_bronchodilators).prop('checked', false);
    						$(inhaled_corticosteroids).prop('checked', false);
    						$(oral_meds_no_steroids).prop('checked', false);
    						$(oral_meds_steroids).prop('checked', false);
    						$(rescue_inhaler).prop('checked', false);

                inhaled_bronchodilators_CB = false;
                inhaled_corticosteroids_CB = false;
                oral_meds_no_steroids_CB = false;
                oral_meds_steroids_CB = false;
                rescue_inhaler_CB = false;
    					}
 							$(".conditional_treatment").hide(500);
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
           		document.getElementById("asthma-more-step").disabled = false;
    					$asthma_more_next.toggleClass(className, true);
    					submit_errors = false;

					} else {
           		document.getElementById("asthma-more-step").disabled = true;
    					$asthma_more_next.toggleClass(className, false);
    					submit_errors = true;
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


function chkAsthmaDetailErrors(objectAffected, focusState, object, $form, last_focus) {
	var error_color = "#AC0036",
	    no_error_color = "#DEDEDE",
	    $diagnosis_date = $form.find('.diagnosis-date'),
			$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
			$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
	    $diagnosis_severity = $form.find('.diagnosis-severity'),
			diagnosis_severity_selected = $("input[name='Diagnosis']:checked").val(),
	    $past_treatment = $form.find('.past-treatment'),
			past_treatment_selected = $("input[name='TreatmentPast']:checked").val();

	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState+"\nlast_focus="+last_focus); // Use for debugging
	if (focusState == 'focusin') {
		$("."+objectAffected+"_error").hide(500);
    if (objectAffected == 'zip') {
//        $zip_div.css("border-color", "black");
    } else if (objectAffected == 'diagnosis_date') {
        $diagnosis_date.css("border-color", "black");
        if (last_focus == "diagnosis_severity") {chkAsthmaDetailErrors('diagnosis_severity', 'focusout', $diagnosis_severity, $form, last_focus);}
        if (last_focus == "past_treatment") {chkAsthmaDetailErrors('past_treatment', 'focusout', $past_treatment, $form, last_focus);}
    } else if (objectAffected == 'diagnosis_severity') {
        $diagnosis_severity.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkAsthmaDetailErrors('diagnosis_date', 'focusout', $diagnosis_date, $form, last_focus);}
        if (last_focus == "past_treatment") {chkAsthmaDetailErrors('past_treatment', 'focusout', $past_treatment, $form, last_focus);}
    } else if (objectAffected == 'past_treatment') {
        $past_treatment.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkAsthmaDetailErrors('diagnosis_date', 'focusout', $diagnosis_date, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkAsthmaDetailErrors('diagnosis_severity', 'focusout', $diagnosis_severity, $form, last_focus);}
	  } else {
        object.css("border-color", "black");
    }
		return false;
	} else if (focusState == 'focusout') {
    if (objectAffected == 'diagnosis_date') {
				if ($diagnosis_month.val().length > 0 && $diagnosis_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $diagnosis_date.css("border-color", no_error_color);
					return false;
  		    } else {
					$("."+objectAffected+"_error").show(500);
          $diagnosis_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'diagnosis_severity') {
	    	if (diagnosis_severity_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $diagnosis_severity.css("border-color", no_error_color);
					return false;
  		    } else {
					$("."+objectAffected+"_error").show(500);
          $diagnosis_severity.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'past_treatment') {
	    	if (past_treatment_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $past_treatment.css("border-color", no_error_color);
					return false;
  		    } else {
					$("."+objectAffected+"_error").show(500);
          $past_treatment.css("border-color", error_color);
					return true;
				}
		}
	}
}
