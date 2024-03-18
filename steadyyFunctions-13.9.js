function calcPremium(thisObject) {
	const modal_factor = Number($(thisObject).parents('.child-set_content').find('.modal_factor').text());
	const policy_fee = Number($(thisObject).parents('.child-set_content').find('.policy_fee').text());
  var term = $(thisObject).parents('.child-set_content').find('.term').text().slice(4, 6),
			rate,
			storage = window.localStorage,
			risk_class = storage.getItem('risk_class');
  
	if (risk_class == "nt1") {
		rate = $(thisObject).parents('.child-set_content').find('.nt1_rate').text();}
	else if (risk_class == "nt2") {
		rate = $(thisObject).parents('.child-set_content').find('.nt2_rate').text();}
	else if (risk_class == "nt3") {
		rate = $(thisObject).parents('.child-set_content').find('.nt3_rate').text();}
	else if (risk_class == "nt4") {
		rate = $(thisObject).parents('.child-set_content').find('.nt4_rate').text();}
	else if (risk_class == "smoke1") {
		rate = $(thisObject).parents('.child-set_content').find('.smoke1_rate').text();}
	else if (risk_class == "smoke2") {
		rate = $(thisObject).parents('.child-set_content').find('.smoke2_rate').text();}

	const coverage_amount = Number(coverageAmountInput.value);
  if (!isNaN(parseInt(rate))) {
	    var monthly_premium = (((rate * modal_factor).toPrecision(4)) * (coverage_amount/1000)) + policy_fee;
  } else {
	    var monthly_premium = 0;
  }
  var premium_formatted = formatter.format(monthly_premium).toString(),
      prem_dollars = premium_formatted.slice(1, premium_formatted.length - 3),
      prem_cents = premium_formatted.slice(premium_formatted.length - 3, premium_formatted.length);

$(thisObject).parents('.child-set_content').find('.premium_cents').text(prem_cents);
$(thisObject).parents('.child-set_content').find('.premium_dollars').text(prem_dollars);
$(thisObject).parents('.child-set_content').find('.policy_length').text(term);

return formatter.format(monthly_premium);
}



function chkErrors(objectAffected, focusState, object, $form, last_focus) {
	var error_color = "#AC0036",
	    no_error_color = "#DEDEDE",

	    $dob = $form.find('.dob'),
      $dob_month = $form.find('input[id="dob_month"]'),
      $dob_day = $form.find('input[id="dob_day"]'),
      $dob_year = $form.find('input[id="dob_year"]'),
	    $gender = $form.find('.gender'),
	    $citizen = $form.find('.citizen'),
	    $tobacco = $form.find('.tobacco'),
      $conditions = $form.find('.conditions'),
	    $license = $form.find('.license'),

      $height_feet = $form.find('input[id="height_feet"]'),
	    $zip_div = $form.find('.zip'),
	    $annual_income_div = $form.find('.annual-income'),
	    $height_div = $form.find('.height'),
	    $weight_div = $form.find('.weight'),
      gender_selected = $("input[name='Gender']:checked").val(),
			citizenship_selected = $("input[name='Citizenship']:checked").val(),
			tobacco_selected = $("input[name='Tobacco']:checked").val(),
			license_selected = $("input[name='License']:checked").val();

//	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState+"\nlast_focus="+last_focus); // Use for debugging
	if (focusState == 'focusin') {
		$("."+objectAffected+"_error").hide(500);
    if (objectAffected == 'zip') {
        $zip_div.css("border-color", "black");
    } else if (objectAffected == 'income') {
        $annual_income_div.css("border-color", "black");
    } else if (objectAffected == 'height') {
        $height_div.css("border-color", "black");
        if (last_focus == "tobacco") {chkErrors('tobacco', 'focusout', $tobacco, $form, last_focus);}
        if (last_focus == "conditions") {chkErrors('conditions', 'focusout', $conditions, $form, last_focus);}
        if (last_focus == "license") {chkErrors('license', 'focusout', $license, $form, last_focus);}
    } else if (objectAffected == 'weight') {
        $weight_div.css("border-color", "black");
        if (last_focus == "height") {chkErrors('height', 'focusout', $height_feet, $form, last_focus);}
        if (last_focus == "tobacco") {chkErrors('tobacco', 'focusout', $tobacco, $form, last_focus);}
        if (last_focus == "conditions") {chkErrors('conditions', 'focusout', $conditions, $form, last_focus);}
        if (last_focus == "license") {chkErrors('license', 'focusout', $license, $form, last_focus);}
    } else if (objectAffected == 'tobacco') {
        $tobacco.css("border-color", "black");
        if (last_focus == "height") {chkErrors('height', 'focusout', $height_feet, $form, last_focus);}
        if (last_focus == "conditions") {chkErrors('conditions', 'focusout', $conditions, $form, last_focus);}
        if (last_focus == "license") {chkErrors('license', 'focusout', $license, $form, last_focus);}
    } else if (objectAffected == 'conditions') {
        $conditions.css("border-color", "black");
        if (last_focus == "height") {chkErrors('height', 'focusout', $height_feet, $form, last_focus);}
        if (last_focus == "tobacco") {chkErrors('tobacco', 'focusout', $tobacco, $form, last_focus);}
        if (last_focus == "license") {chkErrors('license', 'focusout', $license, $form, last_focus);}
    } else if (objectAffected == 'license') {
        $license.css("border-color", "black");
        if (last_focus == "height") {chkErrors('height', 'focusout', $height_feet, $form, last_focus);}
        if (last_focus == "tobacco") {chkErrors('tobacco', 'focusout', $tobacco, $form, last_focus);}
        if (last_focus == "conditions") {chkErrors('conditions', 'focusout', $conditions, $form, last_focus);}
	  } else {
        object.css("border-color", "black");
    }
		return false;
	} else if (focusState == 'focusout') {
    if (objectAffected == 'gender') {
	    			if (gender_selected != undefined) {
						$("."+objectAffected+"_error").hide(500);
            $gender.css("border-color", no_error_color);
						return false;
				} else {
						$("."+objectAffected+"_error").show(500);
            $gender.css("border-color", error_color);
            return true;
				}
		}
		if (objectAffected == 'dob') {
				if ($dob_month.val().length > 0 && $dob_day.val().length > 0 && $dob_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $dob.css("border-color", no_error_color);
					return false;
  		    } else {
					$("."+objectAffected+"_error").show(500);
          $dob.css("border-color", error_color);
					return true;
				}
		}
		if (objectAffected == 'zip') {
			if (object.val().length == 5) {
				$("."+objectAffected+"_error").hide(500);
				$("."+objectAffected+"_error_validity").hide(500);

        var storage = window.localStorage,
            state = storage.getItem('state');

				const validStates = ["IL", "CA", "FL", "MI", "NJ", "NY", "PA", "TX", "OH"]; // add "VA" after licensing is finished
				if (validStates.includes(state)) {
          $(".zip_error_state").hide(500);
  				$zip_div.css("border-color", no_error_color);
  				return false;
        } else {
          $(".zip_error_state").show(500);
  				$zip_div.css("border-color", error_color);
  				return true;
        }
          
			} else {
				if (object.val().length == 0) {
					$("."+objectAffected+"_error_validity").hide();
					$("."+objectAffected+"_error").show(500);
				} else {
					$("."+objectAffected+"_error").hide();
					$("."+objectAffected+"_error_validity").show(500);
				}
				$zip_div.css("border-color", error_color);
				return true;
			}
		}
    if (objectAffected == 'citizen') {
				if (citizenship_selected != undefined) {
						$("."+objectAffected+"_error").hide(500);
            $citizen.css("border-color", no_error_color);
						return false;
				} else {
						$("."+objectAffected+"_error").show(500);
            $citizen.css("border-color", error_color);
						return true;
				}
		}
    if (objectAffected == 'income') {
			if (object.val().length > 5 && object.val().length < 14) {
				$("."+objectAffected+"_error").hide(500);
				$("."+objectAffected+"_error_validity").hide(500);
				$annual_income_div.css("border-color", no_error_color);
				return false;
			} else {
				if (object.val().length == 0) {
					$("."+objectAffected+"_error_validity").hide();
					$("."+objectAffected+"_error").show(500);
				} else {
					$("."+objectAffected+"_error").hide();
					$("."+objectAffected+"_error_validity").show(500);
				}
				$annual_income_div.css("border-color", error_color);
				return true;
			}
    }

		if (objectAffected == 'height') {
			if (object.val().length == 2) {
				$("."+objectAffected+"_error").hide(500);
				$("."+objectAffected+"_error_validity").hide(500);
				$height_div.css("border-color", no_error_color);
				return false;
			} else {
				if (object.val().length == 0) {
					$("."+objectAffected+"_error").show(500);
				} else {
					$("."+objectAffected+"_error").hide();
				}
				$height_div.css("border-color", error_color);
				return true;
			}
		}
		if (objectAffected == 'weight') {
			if (object.val().length >= 2 && object.val().length <= 3 && parseInt(object.val()) >= 75 && parseInt(object.val()) <= 500) {
				$("."+objectAffected+"_error").hide(500);
				$("."+objectAffected+"_error_validity").hide(500);
				$weight_div.css("border-color", no_error_color);
				return false;
			} else {
				if (object.val().length == 0) {
					$("."+objectAffected+"_error_validity").hide();
					$("."+objectAffected+"_error").show(500);
				} else {
					$("."+objectAffected+"_error").hide();
					$("."+objectAffected+"_error_validity").show(500);
				}
				$weight_div.css("border-color", error_color);
				return true;
			}
		}
    if (objectAffected == 'tobacco') {
	    	if (tobacco_selected != undefined) {
						$("."+objectAffected+"_error").hide(500);
            $tobacco.css("border-color", no_error_color);
						return false;
				} else {
						$("."+objectAffected+"_error").show(500);
            $tobacco.css("border-color", error_color);
            return true;
				}
		}
    if (objectAffected == 'conditions') {
        var asthma_CB = document.getElementById('asthma').checked,
            depression_CB = document.getElementById('depression').checked,
            heart_attack_CB = document.getElementById('heart_attack').checked,
            stroke_CB = document.getElementById('stroke').checked,
            cancer_CB = document.getElementById('cancer').checked,
            sleep_apnea_CB = document.getElementById('sleep_apnea').checked,
            diabetes_CB = document.getElementById('diabetes').checked,
            no_conditions_CB = document.getElementById('no_conditions').checked;

	    	if (asthma_CB || depression_CB || heart_attack_CB || stroke_CB || cancer_CB || sleep_apnea_CB || diabetes_CB || no_conditions_CB) {
						$("."+objectAffected+"_error").hide(500);
            $conditions.css("border-color", no_error_color);
						return false;
				} else {
						$("."+objectAffected+"_error").show(500);
            $conditions.css("border-color", error_color);
            return true;
				}
		}
    if (objectAffected == 'license') {
	    	if (license_selected != undefined) {
						$("."+objectAffected+"_error").hide(500);
            $license.css("border-color", no_error_color);
						return false;
				} else {
						$("."+objectAffected+"_error").show(500);
            $license.css("border-color", error_color);
            return true;
				}
		}
	}
}

function dateDiff(startingDate, endingDate) {
    var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
    if (!endingDate) {
        endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
    }
    var endDate = new Date(endingDate);
    if (startDate > endDate) {
        var swap = startDate;
            startDate = endDate;
            endDate = swap;
    }
    var startYear = startDate.getFullYear();
    var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var yearDiff = endDate.getFullYear() - startYear;
    var monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
    }
    var dayDiff = endDate.getDate() - startDate.getDate();
    if (dayDiff < 0) {
        if (monthDiff > 0) {
            monthDiff--;
        } else {
            yearDiff--;
            monthDiff = 11;
        }
        dayDiff += daysInMonth[startDate.getMonth()];
    }

//            return yearDiff + 'Y ' + monthDiff + 'M ' + dayDiff + 'D';
    return yearDiff + (monthDiff/12) + (dayDiff/365);
}

function getFormattedDate() {
    var now = new Date(),
    		strDateTime = [[now.getUTCFullYear(), 
        AddZero(now.getUTCMonth() + 1), 
        AddZero(now.getUTCDate())].join("-"),
        [AddZero(now.getUTCHours()),
        AddZero(now.getUTCMinutes()),
        AddZero(now.getUTCSeconds()),
        AddZero(now.getUTCMilliseconds())].join(":")].join(" ");
    return strDateTime;
}

//Pad given value to the left with "0"
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

function dayValuesCheck(thisValue) {
   if (thisValue.length == 2) {
      if (thisValue == 0) {
  		  return thisValue.slice(0, 1);
      }
    }
	if (thisValue < 0) {
		return null;}

  /* Check That Day Doesn't Exceed the Days Allowed in Month of February */
	if ($('#dob_month').val() == 2) {
		if (thisValue > 29 && thisValue < 100) {
			return thisValue.slice(0, 1);}
	}

  /* Check That Day Doesn't Exceed the Days Allowed in Months of April, June, September or November */
	if ($('#dob_month').val() == 4 || $('#dob_month').val() == 6 || $('#dob_month').val() == 9 || $('#dob_month').val() == 11) {
		if (thisValue > 30 && thisValue < 100) {
			return thisValue.slice(0, 1);}
	}

  /* Check That Day Doesn't Exceed 31 Days for All Other Months */
	if (thisValue > 31 && thisValue < 100) {
		return thisValue.slice(0, 1);}
  
	if (thisValue.length > 2) {
		return thisValue.slice(0, 2);}

	return thisValue;
}

function monthValuesCheck(thisValue) {
    if (thisValue.length == 2) {
      if (thisValue == 0) {
  		  return thisValue.slice(0, 1);
      }
    }
	  if (thisValue < 0) {
		  return null;}
	  if (thisValue > 12 && thisValue < 100) {
		  return thisValue.slice(0, 1);}
	  if (thisValue.length > 2) {
		  return thisValue.slice(0, 2);}
	  return thisValue;
}

function yearValuesCheck(thisValue) {
	  if (thisValue.length > 4) {
		  return this.value.slice(0, 4);
    }
	  if (thisValue.length == 1) {
		  if ((thisValue != 1) && (thisValue != 2)) {
			  return null;
      }
    }
	  if (thisValue.length == 2) {
		  if ((thisValue != 19) && (thisValue != 20)) {
			  if (thisValue < 19) {
				  return 1;
        }
		  }
		  if (thisValue > 20) {
			  return 2;
      }
    }
	  if (thisValue.length == 3) {
		  if (thisValue > 202) {
			  return 20;
      }
    }
	  return thisValue;
}

function getRedirectURL(currentPage) {
		var storage = window.localStorage,
				tobacco = storage.getItem('tobacco'),
				no_conditions = stringToBoolean(storage.getItem('no_conditions')),
				asthma = stringToBoolean(storage.getItem('asthma')),
				cancer = stringToBoolean(storage.getItem('cancer')),
				depression = stringToBoolean(storage.getItem('depression')),
				diabetes = stringToBoolean(storage.getItem('diabetes')),
				heart_attack = stringToBoolean(storage.getItem('heart_attack')),
				sleep_apnea = stringToBoolean(storage.getItem('sleep_apnea')),
				stroke = stringToBoolean(storage.getItem('stroke')),
				license = storage.getItem('license'),
				gender = storage.getItem('gender').toLowerCase(),
				age = storage.getItem('age').toLowerCase();

		if (currentPage < 2 && tobacco == "Yes") {
		  	return "/life-quote/health/tobacco";
		}
		if (!no_conditions) {
			  if (currentPage < 3 && asthma) {
				    return "/life-quote/health/asthma";
			  }
			  if (currentPage < 4 && cancer) {
				    return "/life-quote/health/cancer";
			  }
			  if (currentPage < 5 && depression) {
				    return "/life-quote/health/depression";
			  }
			  if (currentPage < 6 && diabetes) {
				    return "/life-quote/health/diabetes";
			  }
			  if (currentPage < 7 && heart_attack) {
				    return "/life-quote/health/heart-attack";
			  }
			  if (currentPage < 8 && sleep_apnea) {
				    return "/life-quote/health/sleep-apnea";
			  }
			  if (currentPage < 9 && stroke) {
				    return "/life-quote/health/stroke";
			  }
		}
		if (currentPage < 10 && license == "Yes") {
			  return "/life-quote/driving-history";
		}
    if (currentPage < 11) {

				var risk = getRiskClass(),
						risk_class = risk.risk_class,
						risk_tobacco = risk.tobacco;

				storage.setItem('tobacco', risk_tobacco);
				storage.setItem('risk_class', risk_class);

				if (risk_class == 'refer') {
						return "/life-quote/referral";
				} else {
						return "/life-quote/results-summary";
				}
    }
}

function stringToBoolean(string) {
    switch(string.toLowerCase().trim()){
        case "true": 
        case "yes": 
        case "1": 
          return true;
          break;
            
        case "false": 
        case "no": 
        case "0": 
        case null: 
          return false;
          break;

        default: 
          return Boolean(string);
    }
}

function calcRisk(smoker, height_ft, height_in, weight) {
    var height_total_inches = Number(height_ft * 12) + Number(height_in),
//        bmi = Math.round(((weight/height_total_inches)/height_total_inches)*703),
        bmi = ((weight/height_total_inches)/height_total_inches)*703,
        risk_class;
    if (smoker == 'No') {
        risk_class = 'nt4';
        if (bmi<=33 && bmi>=18) { 
            risk_class = 'nt3';
        }
        if (bmi<=31 && bmi>=18) { 
            risk_class = 'nt2';
        }
        if (bmi<=29 && bmi>=18) { 
            risk_class = 'nt1';
        }
    } else {
        if (smoker == 'Yes') {
            risk_class = 'smoke2';
            if (bmi<=31 && bmi>=18) { 
                risk_class = 'smoke1';
            }
        }
    }
    return {
        bmi,
        risk_class
    };
} 

var conv = function (str) {
		if (!str) {
				str = 'empty';
		}  return str.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')
							.replace(/ /g, "-")
							.toLowerCase()
							.trim();
};

var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
});

function getFormattedDate() {
    var now = new Date(),
    		strDateTime = [[now.getUTCFullYear(), 
        AddZero(now.getUTCMonth() + 1), 
        AddZero(now.getUTCDate())].join("-"),
        [AddZero(now.getUTCHours()),
        AddZero(now.getUTCMinutes()),
        AddZero(now.getUTCSeconds()),
        AddZero(now.getUTCMilliseconds())].join(":")].join(" ");
    return strDateTime;
}

//Pad given value to the left with "0"
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

	function checkDOB(document) {
		var storage = window.localStorage,
				dob,
        age,
				adj_age,
        annual_income,
				income_replacement_amount,
				income_replacement_multiple,
  			$dob = document.find('.dob'),
	  		$dob_month = document.find('input[id="dob_month"]'),
		  	$dob_day = document.find('input[id="dob_day"]'),
			  $dob_year = document.find('input[id="dob_year"]'),
  			dob_error_req = true,
	  		dob_error_age = false,
		  	$annual_income = document.find('input[id="income-input"]'),
			  strDateTime = getFormattedDate();

		if ($dob_month.val().length > 0 && $dob_day.val().length > 0 && $dob_year.val().length == 4) {
			dob = $dob_year.val() + "-" + $dob_month.val() + "-" + $dob_day.val();
//			$document.getElementById("dob").value = dob;
			age = dateDiff(dob);
			adj_age = Math.round(age);

			if (age < 18 || adj_age >= 66) {
				$('#dob-alert-age').show(500);
				$('#dob-alert-required').hide(500);
				dob_error_age = true;
	    	dob_error_req = false;
	     } else {
				$('#dob-alert-age').hide(500);
				dob_error_age = false;
	    	dob_error_req = false;
			}
		} else {
			dob = "";
			age = "";
			adj_age = "";
			dob_error_age = false;
    	dob_error_req = true;
		}

		if ($annual_income.val().length > 5 && adj_age != '') {
			annual_income = parseInt($annual_income.val().replace(/,/g, ""));
			if (adj_age >= 18 && adj_age <= 29) {
				income_replacement_amount = Math.ceil((annual_income * 15) / 100000) * 100000;
				income_replacement_multiple = 15; // 15x annual income
			}
			else if (adj_age >= 30 && adj_age <= 39) {
				income_replacement_amount = Math.ceil((annual_income * 14) / 100000) * 100000;
				income_replacement_multiple = 14; // 14x annual income
			}
			else if (adj_age >= 40 && adj_age <= 44) {
				income_replacement_amount = Math.ceil((annual_income * 12) / 100000) * 100000;
				income_replacement_multiple = 12; // 12x annual income
			}
			else if (adj_age >= 45 && adj_age <= 49) {
				income_replacement_amount = Math.ceil((annual_income * 10) / 100000) * 100000;
				income_replacement_multiple = 10; // 10x annual income
			}
			else if (adj_age >= 50 && adj_age <= 54) {
				income_replacement_amount = Math.ceil((annual_income * 8) / 100000) * 100000;
				income_replacement_multiple = 8; // 8x annual income
			}
			else if (adj_age >= 55) {
				income_replacement_amount = Math.ceil((annual_income * 6) / 100000) * 100000;
				income_replacement_multiple = 6; // 6x annual income
			}
		} else {
			income_replacement_amount = "";
			income_replacement_multiple = "";
		}

		storage.setItem('income_replacement_amount', income_replacement_amount);

		if (income_replacement_amount > 5000000) {
			storage.setItem('income_replacement_amount_capped', 5000000);
		} else {
			storage.setItem('income_replacement_amount_capped', income_replacement_amount);
		}
		storage.setItem('income_replacement_multiple', income_replacement_multiple);

		coverage_recommendation_method = storage.getItem('coverage_recommendation_method');
		if (coverage_recommendation_method !== "Needs") {
			storage.setItem('coverage_recommendation_method', "Multiple of Income ("+income_replacement_multiple+"x)");
			if (income_replacement_amount > 5000000) {
				storage.setItem('coverage_recommendation', 5000000);
			} else {
				storage.setItem('coverage_recommendation', income_replacement_amount);
			}
		}

    return [dob, adj_age, dob_error_req, dob_error_age];

	}

	function getRiskClass(document) {
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();
		var todayDate = year + "-" + month + "-" + day;

		var storage = window.localStorage;

		// Evaluate Residency & Citizenship
		var citizenship = storage.getItem('citizenship');
		var citizenship_risk_class = 'refer';

		if (citizenship == 'Yes') {
				citizenship_risk_class = 'nt1';
		}

		// Evaluate Driving Record
		var driving_drunk_dui = storage.getItem('driving_drunk_dui'),
				driving_reckless = storage.getItem('driving_reckless'),
				driving_license_suspension = storage.getItem('driving_license_suspension'),
				driving_moving_violations = storage.getItem('driving_moving_violations'),
				driving_violations_last_6mo = storage.getItem('driving_violations_last_6mo'),
				driving_violations_last_year = storage.getItem('driving_violations_last_year'),
				driving_violations_last_2years = storage.getItem('driving_violations_last_2years'),
				driving_violations_last_3years = storage.getItem('driving_violations_last_3years'),
				driving_violations_last_5years = storage.getItem('driving_violations_last_5years'),
				last_dui_date = storage.getItem('driving_last_dui_year')+"-"+storage.getItem('driving_last_dui_month')+"-01",
				last_reckless_date = storage.getItem('driving_last_reckless_year')+"-"+storage.getItem('driving_last_reckless_month')+"-01",
				last_suspension_date = storage.getItem('driving_last_suspension_year')+"-"+storage.getItem('driving_last_suspension_month')+"-01",
				years_since_dui = 99,
				years_since_reckless = 99,
				years_since_suspension = 99,
				total_violations_in_past_3_years = 0;

		if (driving_drunk_dui == 'Yes') {years_since_dui = dateDiff(last_dui_date, todayDate);}
		if (driving_reckless == 'Yes') {years_since_reckless = dateDiff(last_reckless_date, todayDate);}
		if (driving_license_suspension == 'Yes') {years_since_suspension = dateDiff(last_suspension_date, todayDate);}
		if (driving_moving_violations == 'Yes') {total_violations_in_past_3_years = Number(driving_violations_last_6mo) + Number(driving_violations_last_year) + Number(driving_violations_last_2years) + Number(driving_violations_last_3years);}

		var driving_risk_class = 'refer';
		switch(true) {
			case (years_since_dui > 5 && years_since_reckless > 5 && years_since_suspension > 5 && total_violations_in_past_3_years < 3):
				driving_risk_class = "nt1";
				break;
			case (years_since_dui > 3 && years_since_reckless > 3 && years_since_suspension > 3 && total_violations_in_past_3_years < 4):
				driving_risk_class = "nt3";
				break;
			case (years_since_dui > 2 && years_since_reckless > 2 && years_since_suspension > 2 && total_violations_in_past_3_years < 5):
				driving_risk_class = "nt4";
				break;
			default:
				driving_risk_class = 'refer';
				break;
		}

		// Evaluate Tobacco Use
		var tobacco = storage.getItem('tobacco'),
				tobacco_cigarettes = storage.getItem('tobacco_cigarettes'),
				tobacco_cigars = storage.getItem('tobacco_cigars'),
				tobacco_cigars_per_month = storage.getItem('tobacco_cigars_per_month'),
				tobacco_pipe = storage.getItem('tobacco_pipe'),
				tobacco_chew = storage.getItem('tobacco_chew'),
				tobacco_patch = storage.getItem('tobacco_patch'),

				last_cigarette_date = storage.getItem('tobacco_cigarette_last_smoke_year')+"-"+storage.getItem('tobacco_cigarette_last_smoke_month')+"-01",
				last_cigar_date = storage.getItem('tobacco_cigar_last_smoke_year')+"-"+storage.getItem('tobacco_cigar_last_smoke_month')+"-01",
				last_pipe_date = storage.getItem('tobacco_pipe_last_smoke_year')+"-"+storage.getItem('tobacco_pipe_last_smoke_month')+"-01",
				last_chew_date = storage.getItem('tobacco_chew_last_use_year')+"-"+storage.getItem('tobacco_chew_last_use_month')+"-01",
				last_patch_date = storage.getItem('tobacco_patch_last_use_year')+"-"+storage.getItem('tobacco_patch_last_use_month')+"-01";

		var years_since_last_tobacco_use = 99,
				years_since_last_cigarette = 99,
				years_since_last_cigar = 99,
				years_since_last_pipe = 99,
				years_since_last_chew = 99,
				years_since_last_patch = 99;

		if (tobacco_cigarettes == 'Yes') {years_since_last_cigarette = dateDiff(last_cigarette_date, todayDate);}
		if (tobacco_cigars == 'Yes') {years_since_last_cigar = dateDiff(last_cigar_date, todayDate);}
		if (tobacco_pipe == 'Yes') {years_since_last_pipe = dateDiff(last_pipe_date, todayDate);}
		if (tobacco_chew == 'Yes') {years_since_last_chew = dateDiff(last_chew_date, todayDate);}
		if (tobacco_patch == 'Yes') {years_since_last_patch = dateDiff(last_patch_date, todayDate);}

	  if (tobacco == 'No') {
			tobacco_risk_class = 'nt1';
		}

	  if (tobacco == 'Yes') {
				if (tobacco_cigars == 'Yes' && tobacco_cigars_per_month > 1) {
						years_since_last_tobacco_use = Math.min(years_since_last_cigarette, years_since_last_cigar, years_since_last_pipe, years_since_last_chew, years_since_last_patch);
				} else {
						years_since_last_tobacco_use = Math.min(years_since_last_cigarette, years_since_last_pipe, years_since_last_chew, years_since_last_patch);
				}

				var tobacco_risk_class = 'refer';
				switch(true) {
					case (years_since_last_tobacco_use > 5):
						tobacco_risk_class = "nt1";
						tobacco = 'No';
						break;
					case (years_since_last_tobacco_use > 3):
						tobacco_risk_class = "nt2";
						tobacco = 'No';
						break;
					case (years_since_last_tobacco_use > 2):
						tobacco_risk_class = "nt3";
						tobacco = 'No';
						break;
					case (years_since_last_tobacco_use > 1):
						tobacco_risk_class = "nt4";
						tobacco = 'No';
						break;
					default:
						tobacco_risk_class = "smoke1";
						tobacco = 'Yes';
						break;
				}
		}

		// Evaluate Body Mass Index (BMI)
		var	height_ft = storage.getItem('height_feet'),
				height_in = storage.getItem('height_inches'),
				weight = storage.getItem('weight');

		var height_total_inches = Number(height_ft * 12) + Number(height_in),
		//	bmi = Math.round(((weight/height_total_inches)/height_total_inches)*703),
				bmi = ((weight/height_total_inches)/height_total_inches)*703,
	      bmi_risk_class = 'refer';

	  if (tobacco == 'No') {
	      if (bmi<=38 && bmi>=18) { 
	          bmi_risk_class = 'nt4';
	      }
	      if (bmi<=32.5 && bmi>=18) { 
	          bmi_risk_class = 'nt3';
	      }
	      if (bmi<=30 && bmi>=18) { 
	          bmi_risk_class = 'nt2';
	      }
	      if (bmi<=28 && bmi>=18) { 
	          bmi_risk_class = 'nt1';
	      }
	  } else {
	  if (tobacco == 'Yes') {
	      if (bmi<=38 && bmi>=18) { 
	          bmi_risk_class = 'smoke2';
	      }
	      if (bmi<=32.5 && bmi>=18) { 
	          bmi_risk_class = 'smoke1';
	      }
	  }}

		// Evaluate Cancer History
		var cancer = storage.getItem('cancer'),
				cancer_type = storage.getItem('cancer_type'),
				orig_cancer_diag = storage.getItem('cancer_diag_year')+"-"+storage.getItem('cancer_diag_month')+"-01",
				cancer_risk_class = 'not rated';

		if(JSON.parse(cancer)) {
				var years_since_cancer_diag = dateDiff(orig_cancer_diag, todayDate);

				if (cancer_type == 'Basal' || cancer_type == 'Squamous') {
					cancer_risk_class = 'nt1';
				} else {
					cancer_risk_class = 'refer';
				}
		}

		// Evaluate Heart Attack History
		var heart_attack = storage.getItem('heart_attack'),
				last_heart_attack = storage.getItem('heart_attack_episode_year')+"-"+storage.getItem('heart_attack_episode_month')+"-01",
				heart_attack_risk_class = 'not rated';

		if(JSON.parse(heart_attack)) {
				var years_since_heart_attack = dateDiff(last_heart_attack, todayDate);

				if (years_since_heart_attack > 0.5) {
					heart_attack_risk_class = 'nt4';
				} else {
					heart_attack_risk_class = 'refer';
				}
		}

		// Evaluate Stroke History
		var stroke = storage.getItem('stroke'),
				last_stroke = storage.getItem('stroke_episode_month')+"-"+storage.getItem('stroke_episode_month')+"-01",
				stroke_risk_class = 'not rated';

		if (JSON.parse(stroke)) {
				var years_since_stroke = dateDiff(last_stroke, todayDate);

				if (years_since_stroke > 1) {
					stroke_risk_class = 'nt4';
				} else {
					stroke_risk_class = 'refer';
				}
		}

		// Evaluate Diabetes History
		var diabetes = storage.getItem('diabetes'),
				diabetes_type = storage.getItem('diabetes_type'),
				diabetes_risk_class = 'not rated';

		if (JSON.parse(diabetes)) {
				if (diabetes_type == 'Type-2') {
					diabetes_risk_class = 'nt3';
				} else {
					diabetes_risk_class = 'refer';
				}
		} 

		// Evaluate Depression History
		var depression = storage.getItem('depression'),
				depression_diagnosis = storage.getItem('depression_diagnosis'),
				orig_depression_diag = storage.getItem('depression_diag_year')+"-"+storage.getItem('depression_diag_month')+"-01",
				depression_current_treatment = storage.getItem('depression_current_treatment'),
				depression_medications_num = storage.getItem('depression_medications_num'),
				depression_past_treatment = storage.getItem('depression_past_treatment'),
				treatent_duration_in_years = 0,
				depression_hospitalization = storage.getItem('depression_hospitalization'),
				depression_risk_class = 'not rated';

		if (JSON.parse(depression)) {
				years_since_depression_diag = dateDiff(orig_depression_diag, todayDate);

				if (depression_current_treatment == 'Yes') {
						treatent_duration_in_years = years_since_depression_diag;
						if (typeof depression_medications_num === 'undefined') {
							depression_medications_num = 0;
						} else {
							depression_medications_num = Number(depression_medications_num);
						}
				} else {
						if ( depression_current_treatment == 'No' ) {
								depression_medications_num = 0;
								if ( depression_past_treatment == 'Yes') {
										past_treatment_end_date = storage.getItem('depression_treatment_year')+"-"+storage.getItem('depression_treatment_month')+"-01";
										treatent_duration_in_years = dateDiff(orig_depression_diag, past_treatment_end_date);
								} else {
									if ( depression_past_treatment == 'No') {
										treatent_duration_in_years = 0;
									}
								}
						}
				}

				if (depression_diagnosis != "Severe" && depression_hospitalization == 'No') {
						switch(true) {
							case (depression_medications_num == 0):
								if (depression_current_treatment = 'No' && treatent_duration_in_years < 1){
									depression_risk_class = 'nt1'; // Qualify for nt1 if a) recovered from episode (not in current treatment), b) duration of less than a year & c) no current meds
								} else {
									depression_risk_class = 'nt2'; // Qualify for nt2 is a) no meds, and either b) currently still getting treatment, OR recovered, but treatment was for a year or longer
								}
								break;
							case (depression_medications_num == 1):
								depression_risk_class = 'nt2'; // Qualify for nt2 if a) still being treated, but it is well controlled by only one med, or b) have recovered but it required just one med
								break;
							case (depression_medications_num == 2):
								depression_risk_class = 'nt3'; // Potentially qualify for nt3 if have had two or fewer meds
								break;
							default:
								depression_risk_class = 'refer'; // everything else must be 'referred' - if not severe and never hospitalized, it might still be possible to get coverage, but may require some extra effort to find the right plan
								break;
						}
				} else {
						depression_risk_class = 'refer'; // if person has had severe depression or been hospitalized, it should be 'referred', just to confirm details, but it is unlikely we will be able to find a plan 
				}
		}

		// Evaluate Asthma History
		var asthma = storage.getItem('asthma'),
				asthma_diagnosis = storage.getItem('asthma_diagnosis'),
				orig_asthma_diag = storage.getItem('asthma_diag_year')+"-"+storage.getItem('asthma_diag_month')+"-01",
				asthma_treatment_current = storage.getItem('asthma_treatment_current'),
				inhaled_bronchodilators = storage.getItem('inhaled_bronchodilators'),
				inhaled_corticosteroids = storage.getItem('inhaled_corticosteroids'),
				asthma_hospitalization = storage.getItem('asthma_hospitalization'),
				asthma_risk_class = 'not rated';

		if (JSON.parse(asthma)) {
				years_since_asthma_diag = dateDiff(orig_asthma_diag, todayDate);
			
				switch(true) {
					case (asthma_diagnosis == "Mild" && asthma_hospitalization == 'No' && !inhaled_bronchodilators && !inhaled_corticosteroids):
						asthma_risk_class = 'nt1';
						break;
					case (asthma_hospitalization == 'No' && asthma_treatment_current && (inhaled_bronchodilators || inhaled_corticosteroids) && tobacco == 'No'):
						asthma_risk_class = 'nt2';
						break;
					default:
						asthma_risk_class = 'refer';
						break;
				}
		}

		// Evaluate Sleep Apnea History
		var sleep_apnea = storage.getItem('sleep_apnea'),
				sleep_apnea_diagnosis = storage.getItem('sleep_apnea_diagnosis'),
				orig_sleep_apnea_diag = storage.getItem('sleep_apnea_diag_year')+"-"+storage.getItem('sleep_apnea_diag_month')+"-01",
				sleep_apnea_cpap = storage.getItem('sleep_apnea_cpap'),
				sleep_apnea_sleep_study = storage.getItem('sleep_apnea_sleep_study'),
				sleep_apnea_apnea_index = storage.getItem('sleep_apnea_apnea_index'),
				sleep_apnea_rdi = storage.getItem('sleep_apnea_respiratory_disturbance_index'),
				sleep_apnea_oxygen_saturation = storage.getItem('sleep_apnea_oxygen_saturation'),
				sleep_apnea_risk_class = 'not rated';

		if (JSON.parse(sleep_apnea)) {
				years_since_sleep_apnea_diag = dateDiff(orig_sleep_apnea_diag, todayDate);
		
				if (sleep_apnea_sleep_study == 'Yes') {
						if (typeof sleep_apnea_apnea_index === 'undefined') {
							sleep_apnea_apnea_index = 99;
						} else {
							sleep_apnea_apnea_index = Number(sleep_apnea_apnea_index);
						}
						if (typeof sleep_apnea_rdi === 'undefined') {
							sleep_apnea_rdi = 99;
						} else {
							sleep_apnea_rdi = Number(sleep_apnea_rdi);
						}
						if (typeof sleep_apnea_oxygen_saturation === 'undefined') {
							sleep_apnea_oxygen_saturation = 0;
						} else {
							sleep_apnea_oxygen_saturation = Number(sleep_apnea_oxygen_saturation);
						}
				}

				switch(true) {
					case (sleep_apnea && sleep_apnea_diagnosis == "Mild" && sleep_apnea_sleep_study == "Yes" && (sleep_apnea_apnea_index < 20 || sleep_apnea_rdi < 30) && sleep_apnea_oxygen_saturation > 85):
						sleep_apnea_risk_class = 'nt2';
						break;
					case (sleep_apnea && sleep_apnea_diagnosis != "Mild" && sleep_apnea_cpap == "Yes" && years_since_sleep_apnea_diag > 0):
						sleep_apnea_risk_class = 'nt3';
						break;
					default:
						sleep_apnea_risk_class = 'refer';
						break;
				}
		}
		/*
		console.log("years_since_cancer_diag="+years_since_cancer_diag+"\n"+
								"years_since_heart_attack="+years_since_heart_attack+"\n"+
								"years_since_stroke="+years_since_stroke+"\n"+
								"diabetes_type="+diabetes_type);

		console.log("citizenship="+citizenship_risk_class+"\n"+
								"driving="+driving_risk_class+"\n"+
								"tobacco="+tobacco_risk_class+"\n"+
								"bmi="+bmi_risk_class+"\n"+
								"cancer="+cancer_risk_class+"\n"+
								"heart_attack="+heart_attack_risk_class+"\n"+
								"stroke="+stroke_risk_class+"\n"+
								"diabetes="+diabetes_risk_class+"\n"+
								"depression="+depression_risk_class+"\n"+
								"asthma="+asthma_risk_class+"\n"+
								"sleep_apnea="+sleep_apnea_risk_class);
		*/

		// create an array of objects with the variable name and value
		var riskClasses = [
		    {name: "citizenship", value: citizenship_risk_class},
		    {name: "driving", value: driving_risk_class},
		    {name: "tobacco", value: tobacco_risk_class},
		    {name: "bmi", value: bmi_risk_class},
		    {name: "cancer", value: cancer_risk_class},
		    {name: "heart_attack", value: heart_attack_risk_class},
		    {name: "stroke", value: stroke_risk_class},
		    {name: "diabetes", value: diabetes_risk_class},
		    {name: "depression", value: depression_risk_class},
		    {name: "asthma", value: asthma_risk_class},
		    {name: "sleep_apnea", value: sleep_apnea_risk_class}
		];

		// create an object with the ranking of the values, with 'nt4' being the highest and 'refer' being the lowest
		var riskRanking = {'nt1': 7, 'nt2': 6, 'nt3': 5, 'nt4': 4, 'smoke1': 3, 'smoke2': 2, 'refer': 1};

		// initialize a variable to store the smallest value
		var smallestValue = null;

		// iterate through the riskClasses array
		var factors_evaluated_for_risk_classes = '';
		for (var i = 0; i < riskClasses.length; i++) {
		  var riskClass = riskClasses[i];
		//	console.log(riskClass.name + " = " + riskClass.value);
			if (riskClass.value !== "not rated" && riskClass.value !== "nt1") {
//				factors_evaluated_for_risk_classes = factors_evaluated_for_risk_classes + riskClass.name + " = " + riskClass.value + "; ";
				factors_evaluated_for_risk_classes = factors_evaluated_for_risk_classes + riskClass.name + " (" + riskClass.value + "); ";
			}

		  // check if the risk class is not rated or not exist in the ranking
		  if (riskClass.value === 'not rated' || !(riskClass.value in riskRanking)) {
		    continue;
		  }
		  
		  // check if the risk class is the smallest so far
		  if (smallestValue === null || riskRanking[riskClass.value] < riskRanking[smallestValue]) {
		    smallestValue = riskClass.value;
		  }
		}
		if (factors_evaluated_for_risk_classes == '') {
			factors_evaluated_for_risk_classes = "No adverse risks --> rated NT1"
		} else {
			factors_evaluated_for_risk_classes = factors_evaluated_for_risk_classes + "The final risk class (taking the lowest value) is: " + smallestValue;
		}

		storage.setItem('factors_evaluated_for_risk_classes', factors_evaluated_for_risk_classes);
		var risk_class = smallestValue;
		return {
		    risk_class,
				tobacco
		};
	}
