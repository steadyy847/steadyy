/*
Webflow.push(function(){
	$("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 7, // PAGE: heart_attack = 7
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
	     			$heart_attack_more_next = $form.find( '#heart-attack-more-step' ),
						currentPage = 7, // PAGE: heart_attack = 7
      			nextPage,
      			last_focus,
						enabled = true,
            submit_errors = true,

						$diagnosis_date = $form.find('#diagnosis-date'),
						$episode_date = $form.find('#episode-date'),
						$other_details_wrapper = $form.find('#other-details-wrapper'),

						$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
						$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
						$episode_month = $form.find( 'input[id="episode_month"]' ),
						$episode_year = $form.find( 'input[id="episode_year"]' ),
						$other_details = $form.find( 'input[id="other_details"]' ),

						diagnosis_date_errors = false,
						episode_date_errors = false,
						other_details_errors = false;

				$('#commit_point').val("9-heart-attack");
				$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
				$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
				$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

  			document.getElementById("heart-attack-more-step").disabled = true;
              
				$diagnosis_month.mask("#0");
				$diagnosis_year.mask("0000");
				$episode_month.mask("#0");
				$episode_year.mask("0000");

  			var storage_diag_month = storage.getItem('heart_attack_diag_month'),
  					storage_diag_year = storage.getItem('heart_attack_diag_year'),
						storage_episode_month = storage.getItem('heart_attack_episode_month'),
						storage_episode_year = storage.getItem('heart_attack_episode_month'),
						storage_other_details = storage.getItem('heart_attack_other_details');						

  			if (storage_diag_month !== null) {
  				$diagnosis_month.val(storage_diag_month);
  			}

  			if (storage_diag_year !== null) {
  				$diagnosis_year.val(storage_diag_year);
  			}

  			if (storage_episode_month !== null) {
  				$episode_month.val(storage_episode_month);
  			}

  			if (storage_episode_year !== null) {
  				$episode_year.val(storage_episode_year);
  			}

  			if (storage_other_details !== null) {
          document.getElementById("other_details").value = storage_other_details;
  			}

				submitButtonCheck();


				$diagnosis_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$diagnosis_year.on('input.True', function() {
					this.value = yearValuesCheck(this.value);});
				$episode_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$episode_year.on('input.True', function() {
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
  					diagnosis_date_errors = chkHeartDetailErrors('diagnosis_date', 'focusin', $diagnosis_date, $form, last_focus);
  					last_focus = "diagnosis_date";
  			});

  			$episode_date.on('focusin', function() {
  					episode_date_errors = chkHeartDetailErrors('episode_date', 'focusin', $episode_date, $form, last_focus);
  					last_focus = "episode_date";
  			});

  			$other_details_wrapper.on('focusin', function() {
  					other_details_errors = chkHeartDetailErrors('other_details', 'focusin', $other_details_wrapper, $form, last_focus);
  					last_focus = "other_details";
  			});

			$other_details_wrapper.on('focusout', function() {
					other_details_errors = chkHeartDetailErrors('other_details', 'focusout', $other_details_wrapper, $form, last_focus);
			});

  			$('#heart-attack-more-step').click(function(e) {
  				e.preventDefault();
          submitButtonCheck();

  				nextPage = getRedirectURL(currentPage);

          if (submit_errors) {
        		document.getElementById("heart-attack-more-step").disabled = true;
            if (!diagnosis_date_errors && !episode_date_errors && !other_details_errors) {
   					  $(".page_error").show(500);
            } else {
   					  $(".page_error").hide(500);
            }
  				} else {
        		document.getElementById("heart-attack-more-step").disabled = false;
  				  $(".page_error").hide(500);
  					location.href = nextPage;
          }
  			});
        
  			$('#heart-attack-more-prev').click(function(e) {
  				e.preventDefault();
  				window.history.back();
  			});


				function submitButtonCheck() {
					var other_details = document.getElementById("other_details").value;

					if ($diagnosis_month.val() != '' && /^([\w-]{1,2})?$/.test( $diagnosis_month.val() ) 
					 && $diagnosis_year.val() != '' && /^([\w-]{4,4})?$/.test( $diagnosis_year.val() ) 
																			 && $episode_month.val() != '' && /^([\w-]{1,2})?$/.test( $episode_month.val() ) 
																			 && $episode_year.val() != '' && /^([\w-]{4,4})?$/.test( $episode_year.val() ) 
					) {
           		document.getElementById("heart-attack-more-step").disabled = false;
        			$heart_attack_more_next.toggleClass(className, true);
        			submit_errors = false;
   					  $(".page_error").hide(500);
					} else {
           		document.getElementById("heart-attack-more-step").disabled = true;
        			$heart_attack_more_next.toggleClass(className, false);
        			submit_errors = true;
          }

					storage.setItem('heart_attack_diag_month', $diagnosis_month.val());
					storage.setItem('heart_attack_diag_year', $diagnosis_year.val());
					storage.setItem('heart_attack_episode_month', $episode_month.val());
					storage.setItem('heart_attack_episode_year', $episode_year.val());
					storage.setItem('heart_attack_other_details', other_details);

				}
			});
		})(jQuery, window, document);
	})

function chkHeartDetailErrors(objectAffected, focusState, object, $form, last_focus) {
	var error_color = "#AC0036",
	    no_error_color = "#DEDEDE",

      $diagnosis_date = $form.find('#diagnosis-date'),
      $episode_date = $form.find('#episode-date'),
      $other_details_wrapper = $form.find('#other-details-wrapper'),

			$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
			$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
			$episode_month = $form.find( 'input[id="episode_month"]' ),
			$episode_year = $form.find( 'input[id="episode_year"]' ),
			$other_details = $form.find( 'input[id="other_details"]' );

//	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState+"\nobject="+object.prop("class")+"\nlast_focus="+last_focus); // Use for debugging

	if (focusState == 'focusin') {
		$("."+objectAffected+"_error").hide(500);
    if (objectAffected == 'diagnosis_date') {
        $diagnosis_date.css("border-color", "black");
//        if (last_focus == "diagnosis_date") {chkHeartDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "episode_date") {chkHeartDetailErrors('episode_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "other_details") {chkHeartDetailErrors('other_details', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'episode_date') {
        $episode_date.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkHeartDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "episode_date") {chkHeartDetailErrors('episode_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "other_details") {chkHeartDetailErrors('other_details', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'other_details') {
        $other_details_wrapper.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkHeartDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "episode_date") {chkHeartDetailErrors('episode_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "other_details") {chkHeartDetailErrors('other_details', 'focusout', object, $form, last_focus);}
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
          $(".page_error").hide(500);
          $diagnosis_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'episode_date') {
				if ($episode_month.val().length > 0 && $episode_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $episode_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $episode_date.css("border-color", error_color);
					return true;
				}
		}

    if (objectAffected == 'other_details') {
//				if ($other_details.val().length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $other_details_wrapper.css("border-color", no_error_color);
					return false;
/*
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $other_details_wrapper.css("border-color", error_color);
					return true;
				}
*/
		}

	}
}
