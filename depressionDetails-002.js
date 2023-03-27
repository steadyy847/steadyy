/*
Webflow.push(function(){
	$("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 5, // PAGE: depression = 5
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
    			className = 'submit_button_active',
     			className2 = 'button_active',
    			submit = 'input[type="submit"]',
    			storage = window.localStorage;

			$(form).each(function() {
				var $form = $(this),
    				$submit = $form.find( submit ),
	     			$depression_more_next = $form.find( '#depression-more-step' ),
						currentPage = 5, // PAGE: depression = 5
      			nextPage,
      			last_focus,
						enabled = true,
            submit_errors = true,

      			$diagnosis_date = $form.find('#diagnosis-date'),
            $diagnosis_severity = $form.find('#diagnosis-severity'),
            $current_treatment = $form.find('#current-treatment'),
            $medications_wrapper = $form.find('#medications-wrapper'),
            $psychotherapy = $form.find('#psychotherapy'),
            $depression_meds = $form.find('#depression-meds'),
      			$treatment_date = $form.find('#treatment-date'),
      			$hospitalization = $form.find('#hospitalization'),
      			$hospitalization_date = $form.find('#hospitalization-date'),

    				$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
    				$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
    				$treatment_month = $form.find( 'input[id="treatment_month"]' ),
    				$treatment_year = $form.find( 'input[id="treatment_year"]' ),
    				$hospital_month = $form.find( 'input[id="hospital_month"]' ),
    				$hospital_year = $form.find( 'input[id="hospital_year"]' ),
            
            diagnosis_date_errors = false,
            diagnosis_severity_errors = false,
            current_treatment_errors = false,
            medications_errors = false,
            psychotherapy_errors = false,
            depression_meds_errors = false,
            treatment_date_errors = false,
            hospitalization_errors = false,
            hospitalization_date_errors = false;


				$('#commit_point').val("7-depression");
				$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
				$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
				$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

				document.getElementById("submit_button").disabled = true;
  			document.getElementById("depression-more-step").disabled = true;

/* STEP 1 - Set up masks for all number entry fields */
				$diagnosis_month.mask("#0");
				$diagnosis_year.mask("0000");
				$treatment_month.mask("#0");
				$treatment_year.mask("0000");
				$hospital_month.mask("#0");
				$hospital_year.mask("0000");

/* STEP 2 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
            left this page and comes back later, so they don't lose data that they may have already entered */
  			var storage_diag_month = storage.getItem('depression_diag_month'),
  					storage_diag_year = storage.getItem('depression_diag_year'),
  					storage_diagnosis = storage.getItem('depression_diagnosis'),
  					storage_current_treatment = storage.getItem('depression_current_treatment'),
  					storage_medications_num = storage.getItem('depression_medications_num'),
  					storage_current_psychotherapy = storage.getItem('depression_current_psychotherapy'),
  					storage_past_meds_flag = storage.getItem('depression_past_meds_flag'),
  					storage_treatment_month = storage.getItem('depression_treatment_month'),
  					storage_treatment_year= storage.getItem('depression_treatment_year'),
  					storage_hospitalization= storage.getItem('depression_hospitalization'),
  					storage_hosp_month = storage.getItem('depression_hosp_month'),
  					storage_hosp_year = storage.getItem('depression_hosp_year');

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

  			if (storage_current_treatment !== null) {
  				$("input[name='Treatment'][value='" + storage_current_treatment + "']").prop("checked", true);
  				$("input[name='Treatment'][value='" + storage_current_treatment + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#depression_treat_" + storage_current_treatment.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#depression_treat_" + storage_current_treatment.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#depression_treat_" + storage_current_treatment.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_medications_num !== null && storage_medications_num !== "") {
          document.getElementById("medications_num").value = storage_medications_num;
  			}

  			if (storage_current_psychotherapy !== null) {
  				$("input[name='Psychotherapy'][value='" + storage_current_psychotherapy + "']").prop("checked", true);
  				$("input[name='Psychotherapy'][value='" + storage_current_psychotherapy + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#psychotherapy_treat_" + storage_current_psychotherapy.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#psychotherapy_treat_" + storage_current_psychotherapy.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#psychotherapy_treat_" + storage_current_psychotherapy.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_past_meds_flag !== null) {
  				$("input[name='DepressionMeds'][value='" + storage_past_meds_flag + "']").prop("checked", true);
  				$("input[name='DepressionMeds'][value='" + storage_past_meds_flag + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#depression_meds_" + storage_past_meds_flag.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#depression_meds_" + storage_past_meds_flag.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#depression_meds_" + storage_past_meds_flag.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_treatment_month !== null) {
  				$treatment_month.val(storage_treatment_month);
  			}

  			if (storage_treatment_year !== null) {
  				$treatment_year.val(storage_treatment_year);
  			}

  			if (storage_hospitalization !== null) {
  				$("input[name='DepressionHospitalization'][value='" + storage_hospitalization + "']").prop("checked", true);
  				$("input[name='DepressionHospitalization'][value='" + storage_hospitalization + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#depression_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#depression_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#depression_hospital_" + storage_hospitalization.toLowerCase()).parent().css( "color", "#ffffff" );
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

				$treatment_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$treatment_year.on('input.True', function() {
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

  			$('#depression-more-step').click(function(e) {
  				e.preventDefault();
          submitButtonCheck();

  				nextPage = getRedirectURL(currentPage);

          if (submit_errors) {
        		document.getElementById("depression-more-step").disabled = true;
            if (!diagnosis_date_errors && !diagnosis_severity_errors && !current_treatment_errors && !medications_errors && !psychotherapy_errors && !depression_meds_errors && !treatment_date_errors && !hospitalization_errors && !hospitalization_date_errors) {
   					  $(".page_error").show(500);
            } else {
   					  $(".page_error").hide(500);
            }
  				} else {
        		document.getElementById("depression-more-step").disabled = false;
  				  $(".page_error").hide(500);
  					location.href = nextPage;
          }
  			});
        
  			$('#depression-more-prev').click(function(e) {
  				e.preventDefault();
  				window.history.back();
  			});


				function submitButtonCheck() {
  				var diagnosis_selected = $("input[name='Diagnosis']:checked").val(),
      				treatment_selected = $("input[name='Treatment']:checked").val(),
      				psychotherapy_selected = $("input[name='Psychotherapy']:checked").val(),
      				meds_selected = $("input[name='DepressionMeds']:checked").val(),
      				hospitalization_selected = $("input[name='DepressionHospitalization']:checked").val(),
      				medications_num = document.getElementById("medications_num").value,
      				conditionals_for_treatment_satisfied = false,
      				conditionals_for_therapy_satisfied = false,
      				conditionals_for_hospitalization_satisfied = false;

          console.log("treatment_selected = "+treatment_selected);

  				if (treatment_selected == "Yes") {
  					$treatment_month.val(null);
  					$treatment_year.val(null);
  					$("input[name='DepressionMeds']").prop('checked',false);
       			$("input[name='DepressionMeds']").prev('.w-radio-input').removeClass('w--redirected-checked');
  					$(".yes_no_button_3").css( "backgroundColor", "#ffffff" );
  					$(".yes_no_button_3").css( "border", "#d9d9d9" );
  					$(".yes_no_button_3").css( "color", "#707070" );
  					$(".conditional_treatment").show(500);
  					$(".conditional_treatment_no").hide(500);
  					$(".conditional_therapy").hide(500);
            meds_selected = "No";
  					conditionals_for_therapy_satisfied = true;

  					if (psychotherapy_selected != undefined && $('#medications_num').val().length > 0) {
  						conditionals_for_treatment_satisfied = true;
  					} else {
  						conditionals_for_treatment_satisfied = false;
  					}
  				} else if (treatment_selected == "No") {
  					$('#medications_num').val(null);
  					$("input[name='Psychotherapy']").prop('checked',false);
       			$("input[name='Psychotherapy']").prev('.w-radio-input').removeClass('w--redirected-checked');
						$(".yes_no_button_2").css( "backgroundColor", "#ffffff" );
						$(".yes_no_button_2").css( "border", "#d9d9d9" );
						$(".yes_no_button_2").css( "color", "#707070" );
  					psychotherapy_selected = "No";
  					conditionals_for_treatment_satisfied = true;
  					$(".conditional_treatment").hide(500);
  					$(".conditional_treatment_no").show(500);
  				}

  				if (meds_selected == "Yes") {
  						$(".conditional_therapy").show(500);
  						if (	 $treatment_month.val() != '' && /^([\w-]{1,2})?$/.test( $treatment_month.val() ) 
  								&& $treatment_year.val() != '' && /^([\w-]{4,4})?$/.test( $treatment_year.val() )
  						) {
  								conditionals_for_therapy_satisfied = true;
              } else {
  								conditionals_for_therapy_satisfied = false;
              }
  				} else if (meds_selected == "No") {
  						$(".conditional_therapy").hide(500);
  						$treatment_month.val(null);
  						$treatment_year.val(null);
  						conditionals_for_therapy_satisfied = true;
  				}

  				if (hospitalization_selected == "Yes") {
  						$(".conditional_hospitalization").show(500);
  						if (	 $hospital_month.val() != '' && /^([\w-]{1,2})?$/.test( $hospital_month.val() )
  								&& $hospital_year.val() != '' && /^([\w-]{4,4})?$/.test( $hospital_year.val() )
              ) {
  								conditionals_for_hospitalization_satisfied = true;
              } else {
  								conditionals_for_hospitalization_satisfied = false;
  						}
  				} else if (hospitalization_selected == "No") {
  						$(".conditional_hospitalization").hide(500);
  						$hospital_month.val(null);
  						$hospital_year.val(null);
  						conditionals_for_hospitalization_satisfied = true;
  				}

  				if ($diagnosis_month.val() != '' && /^([\w-]{1,2})?$/.test( $diagnosis_month.val() ) 
  				 && $diagnosis_year.val() != '' && /^([\w-]{4,4})?$/.test( $diagnosis_year.val() ) 
  				 && diagnosis_selected != undefined
  				 && treatment_selected != undefined
  				 && hospitalization_selected != undefined
  				 && conditionals_for_treatment_satisfied
  				 && conditionals_for_therapy_satisfied
  				 && conditionals_for_hospitalization_satisfied
  				) {
           		document.getElementById("depression-more-step").disabled = false;
        			$depression_more_next.toggleClass(className, true);
        			submit_errors = false;
   					  $(".page_error").hide(500);

/**/          document.getElementById("submit_button").disabled = false;
/**/  				$submit.toggleClass(className, true);
  				} else {
           		document.getElementById("depression-more-step").disabled = true;
        			$depression_more_next.toggleClass(className, false);
        			submit_errors = true;

/**/          document.getElementById("submit_button").disabled = true;
/**/          $submit.toggleClass(className, false);
          }

  				storage.setItem('depression_diag_month', $diagnosis_month.val());
  				storage.setItem('depression_diag_year', $diagnosis_year.val());
  				storage.setItem('depression_diagnosis', diagnosis_selected);
  				storage.setItem('depression_current_treatment', treatment_selected);
  				storage.setItem('depression_medications_num', medications_num);
  				storage.setItem('depression_current_psychotherapy', psychotherapy_selected);
  				storage.setItem('depression_past_meds_flag', meds_selected);
  				storage.setItem('depression_treatment_month', $treatment_month.val());
  				storage.setItem('depression_treatment_year', $treatment_year.val());
  				storage.setItem('depression_hospitalization', hospitalization_selected);
  				storage.setItem('depression_hosp_month', $hospital_month.val());
  				storage.setItem('depression_hosp_year', $hospital_year.val());

				}
			});
		})(jQuery, window, document);
	})
