/*
Webflow.push(function(){
	$("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 4, // PAGE: cancer = 4
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
      			$cancer_more_next = $form.find( '#cancer-more-step' ),
						$submit = $form.find( submit ),
						currentPage = 4, // PAGE: cancer = 4
      			nextPage,
      			last_focus,
						enabled = true,
            submit_errors = true,

      			$cancer_type_wrapper = $form.find('#cancer-type-wrapper'),
            $diagnosis_date = $form.find('#diagnosis-date'),
      			$cancer_stage_wrapper = $form.find('#cancer-stage-wrapper'),
            $treatment_date = $form.find('#treatment-date'),
      			$other_details_wrapper = $form.find('#other-details-wrapper'),
            
						$cancer_type = $form.find( 'input[id="cancer_type"]' ),
						$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
						$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
						$cancer_stage = $form.find( 'input[id="cancer_stage"]' ),
						$last_treatment_month = $form.find( 'input[id="last_treatment_month"]' ),
						$last_treatment_year = $form.find( 'input[id="last_treatment_year"]' ),
						$other_details = $form.find( 'input[id="other_details"]' ),

            cancer_type_errors = false,
            diagnosis_date_errors = false,
            cancer_stage_errors = false,
            treatment_date_errors = false,
            other_details_errors = false;

				$('#commit_point').val("6-cancer");
				$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
				$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
				$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

				document.getElementById("submit_button").disabled = true;

				$diagnosis_month.mask("#0");
				$diagnosis_year.mask("0000");
				$last_treatment_month.mask("#0");
				$last_treatment_year.mask("0000");

  			var storage_cancer_type = storage.getItem('cancer_type'),
  					storage_diag_month = storage.getItem('cancer_diag_month'),
  					storage_diag_year = storage.getItem('cancer_diag_year'),
						storage_cancer_stage = storage.getItem('cancer_stage'),
						storage_last_treatment_month = storage.getItem('cancer_last_treatment_month'),
						storage_last_treatment_year = storage.getItem('cancer_last_treatment_year'),
						storage_other_details = storage.getItem('cancer_other_details');						

  			if (storage_cancer_type !== null && storage_cancer_type !== "") {
          document.getElementById("cancer_type").value = storage_cancer_type;
  			}

  			if (storage_diag_month !== null) {
  				$diagnosis_month.val(storage_diag_month);
  			}

  			if (storage_diag_year !== null) {
  				$diagnosis_year.val(storage_diag_year);
  			}

  			if (storage_cancer_stage !== null && storage_cancer_stage !== "") {
          document.getElementById("cancer_stage").value = storage_cancer_stage;
  			}

  			if (storage_last_treatment_month !== null) {
  				$last_treatment_month.val(storage_last_treatment_month);
  			}

  			if (storage_last_treatment_year !== null) {
  				$last_treatment_year.val(storage_last_treatment_year);
  			}

  			if (storage_other_details !== null) {
  				$last_treatment_year.val(storage_other_details);
  			}
				submitButtonCheck();


				$diagnosis_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$diagnosis_year.on('input.True', function() {
					this.value = yearValuesCheck(this.value);});

				$last_treatment_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$last_treatment_year.on('input.True', function() {
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

  			$cancer_type_wrapper.on('focusin', function() {
  					cancer_type_errors = chkCancerDetailErrors('cancer_type', 'focusin', $cancer_type_wrapper, $form, last_focus);
  					last_focus = "cancer_type";
  			});

  			$diagnosis_date.on('focusin', function() {
  					diagnosis_date_errors = chkCancerDetailErrors('diagnosis_date', 'focusin', $diagnosis_date, $form, last_focus);
  					last_focus = "diagnosis_date";
  			});

  			$cancer_stage_wrapper.on('focusin', function() {
  					cancer_stage_errors = chkCancerDetailErrors('cancer_stage', 'focusin', $cancer_stage_wrapper, $form, last_focus);
  					last_focus = "cancer_stage";
  			});

  			$treatment_date.on('focusin', function() {
  					treatment_date_errors = chkCancerDetailErrors('treatment_date', 'focusin', $treatment_date, $form, last_focus);
  					last_focus = "treatment_date";
  			});

  			$other_details_wrapper.on('focusin', function() {
  					other_details_errors = chkCancerDetailErrors('other_details', 'focusin', $other_details_wrapper, $form, last_focus);
  					last_focus = "other_details";
  			});

			$other_details_wrapper.on('focusout', function() {
					other_details_errors = chkCancerDetailErrors('other_details', 'focusout', $other_details_wrapper, $form, last_focus);
			});

  			$('#cancer-more-step').click(function(e) {
  				e.preventDefault();
          submitButtonCheck();

  				nextPage = getRedirectURL(currentPage);

          if (submit_errors) {
        		document.getElementById("cancer-more-step").disabled = true;
            if (!cancer_type_errors && !diagnosis_date_errors && !cancer_stage_errors && !treatment_date_errors && !other_details_errors) {
   					  $(".page_error").show(500);
            } else {
   					  $(".page_error").hide(500);
            }
  				} else {
        		document.getElementById("cancer-more-step").disabled = false;
  				  $(".page_error").hide(500);
  					location.href = nextPage;
          }
  			});
        
  			$('#cancer-more-prev').click(function(e) {
  				e.preventDefault();
  				window.history.back();
  			});


				function submitButtonCheck() {
					var cancer_type = document.getElementById("cancer_type").value,
              cancer_stage = document.getElementById("cancer_stage").value,
							other_details = document.getElementById("other_details").value;

					if ($diagnosis_month.val() != '' && /^([\w-]{1,2})?$/.test( $diagnosis_month.val() ) 
					 && $diagnosis_year.val() != '' && /^([\w-]{4,4})?$/.test( $diagnosis_year.val() ) 
					 && $last_treatment_month.val() != '' && /^([\w-]{1,2})?$/.test( $last_treatment_month.val() ) 
					 && $last_treatment_year.val() != '' && /^([\w-]{4,4})?$/.test( $last_treatment_year.val() ) 
					 && $('#cancer_type').val().length  >   0
					 && $('#cancer_stage').val().length  >   0
					) {
              document.getElementById("submit_button").disabled = false;
							$submit.toggleClass(className, true);

           		document.getElementById("cancer-more-step").disabled = false;
        			$cancer_more_next.toggleClass(className2, true);
        			submit_errors = false;
   					  $(".page_error").hide(500);
					} else {
              document.getElementById("submit_button").disabled = true;
							$submit.toggleClass(className, false);

           		document.getElementById("cancer-more-step").disabled = true;
        			$cancer_more_next.toggleClass(className2, false);
        			submit_errors = true;
          }

					storage.setItem('cancer_diag_month', $diagnosis_month.val());
					storage.setItem('cancer_diag_year', $diagnosis_year.val());
					storage.setItem('cancer_last_treatment_month', $last_treatment_month.val());
					storage.setItem('cancer_last_treatment_year', $last_treatment_year.val());
					storage.setItem('cancer_other_details', other_details);
					storage.setItem('cancer_type', cancer_type);
					storage.setItem('cancer_stage', cancer_stage);

				}
			});
		})(jQuery, window, document);
	})

function chkCancerDetailErrors(objectAffected, focusState, object, $form, last_focus) {
	var error_color = "#AC0036",
	    no_error_color = "#DEDEDE",

      $cancer_type_wrapper = $form.find('#cancer-type-wrapper'),
      $diagnosis_date = $form.find('#diagnosis-date'),
      $cancer_stage_wrapper = $form.find('#cancer-stage-wrapper'),
      $treatment_date = $form.find('#treatment-date'),
      $other_details_wrapper = $form.find('#other-details-wrapper'),

			$cancer_type = document.getElementById("cancer_type").value,
			$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
			$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
			$cancer_stage = document.getElementById("cancer_stage").value,
			$last_treatment_month = $form.find( 'input[id="last_treatment_month"]' ),
			$last_treatment_year = $form.find( 'input[id="last_treatment_year"]' ),
			$other_details = $form.find( 'input[id="other_details"]' );

//	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState+"\nobject="+object.prop("class")+"\nlast_focus="+last_focus); // Use for debugging

	if (focusState == 'focusin') {
		$("."+objectAffected+"_error").hide(500);
    if (objectAffected == 'cancer_type') {
        $cancer_type_wrapper.css("border-color", "black");
//        if (last_focus == "cancer_type") {chkCancerDetailErrors('cancer_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_date") {chkCancerDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cancer_stage") {chkCancerDetailErrors('cancer_stage', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkCancerDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "other_details") {chkCancerDetailErrors('other_details', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'diagnosis_date') {
        $diagnosis_date.css("border-color", "black");
        if (last_focus == "cancer_type") {chkCancerDetailErrors('cancer_type', 'focusout', object, $form, last_focus);}
//        if (last_focus == "diagnosis_date") {chkCancerDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cancer_stage") {chkCancerDetailErrors('cancer_stage', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkCancerDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "other_details") {chkCancerDetailErrors('other_details', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'cancer_stage') {
        $cancer_stage_wrapper.css("border-color", "black");
        if (last_focus == "cancer_type") {chkCancerDetailErrors('cancer_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_date") {chkCancerDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "cancer_stage") {chkCancerDetailErrors('cancer_stage', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkCancerDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "other_details") {chkCancerDetailErrors('other_details', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'treatment_date') {
        $treatment_date.css("border-color", "black");
        if (last_focus == "cancer_type") {chkCancerDetailErrors('cancer_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_date") {chkCancerDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cancer_stage") {chkCancerDetailErrors('cancer_stage', 'focusout', object, $form, last_focus);}
//        if (last_focus == "treatment_date") {chkCancerDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "other_details") {chkCancerDetailErrors('other_details', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'other_details') {
        $other_details_wrapper.css("border-color", "black");
        if (last_focus == "cancer_type") {chkCancerDetailErrors('cancer_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_date") {chkCancerDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cancer_stage") {chkCancerDetailErrors('cancer_stage', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkCancerDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "other_details") {chkCancerDetailErrors('other_details', 'focusout', object, $form, last_focus);}
	  } else {
        object.css("border-color", "black");
    }
		return false;
	} else if (focusState == 'focusout') {
    if (objectAffected == 'cancer_type') {
	    	if ($cancer_type.length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $cancer_type_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cancer_type_wrapper.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'diagnosis_date') {
				if ($diagnosis_month.val().length > 0 && $diagnosis_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $diagnosis_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $diagnosis_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'cancer_stage') {
	    	if ($cancer_stage.length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $cancer_stage_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cancer_stage_wrapper.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'treatment_date') {
				if ($last_treatment_month.val().length > 0 && $last_treatment_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $treatment_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $treatment_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'other_details') {
				if ($other_details.val().length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $other_details_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $other_details_wrapper.css("border-color", error_color);
					return true;
				}
		}
	}
}
