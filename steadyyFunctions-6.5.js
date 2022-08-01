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
		rate = $(thisObject).parents('.child-set_content').find('.smoke1_rate').text();}

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
	    $visa = $form.find('.visa'),
	    $residency = $form.find('.residency'),
	    $origin = $form.find('.origin'),
      $height_feet = $form.find('input[id="height_feet"]'),
	    $zip_div = $form.find('.zip'),
	    $annual_income_div = $form.find('.annual-income'),
	    $height_div = $form.find('.height'),
	    $weight_div = $form.find('.weight'),
      gender_selected = $("input[name='Gender']:checked").val(),
			citizenship_selected = $("input[name='Citizenship']:checked").val(),
			tobacco_selected = $("input[name='Tobacco']:checked").val(),
			license_selected = $("input[name='License']:checked").val(),
			$visa_type = $form.find('#visa_type'),
			$years_in_us = $form.find('#years_in_us'),
			$origin_country = $form.find('#origin_country');

//	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState); // Use for debugging
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
    } else if (objectAffected == 'visa') {
        $visa.css("border-color", "black");
        if (last_focus == "residency") {chkErrors('residency', 'focusout', $years_in_us, $form, last_focus);}
        if (last_focus == "origin") {chkErrors('origin', 'focusout', $origin_country, $form, last_focus);}
    } else if (objectAffected == 'residency') {
        $residency.css("border-color", "black");
        if (last_focus == "visa") {chkErrors('visa', 'focusout', $visa_type, $form, last_focus);}
        if (last_focus == "origin") {chkErrors('origin', 'focusout', $origin_country, $form, last_focus);}
    } else if (objectAffected == 'origin') {
        $origin.css("border-color", "black");
        if (last_focus == "visa") {chkErrors('visa', 'focusout', $visa_type, $form, last_focus);}
        if (last_focus == "residency") {chkErrors('residency', 'focusout', $years_in_us, $form, last_focus);}
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
        if (state == "IL") {
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
          console.log("objectAffected="+objectAffected);
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
    if (objectAffected == 'visa') {
	    	if ($visa_type.val() != '') {
						$("."+objectAffected+"_error").hide(500);
            $visa.css("border-color", no_error_color);
						return false;
				} else {
						$("."+objectAffected+"_error").show(500);
            $visa.css("border-color", error_color);
            return true;
				}
		}
    if (objectAffected == 'residency') {
	    	if ($years_in_us.val() != '') {
						$("."+objectAffected+"_error").hide(500);
            $residency.css("border-color", no_error_color);
						return false;
				} else {
						$("."+objectAffected+"_error").show(500);
            $residency.css("border-color", error_color);
            return true;
				}
		}
    if (objectAffected == 'origin') {
	    	if ($origin_country.val() != '') {
						$("."+objectAffected+"_error").hide(500);
            $origin.css("border-color", no_error_color);
						return false;
				} else {
						$("."+objectAffected+"_error").show(500);
            $origin.css("border-color", error_color);
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

function monthValuesCheck(thisValue) {
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
		  	return "/life-quote-health-tobacco";
		}
		if (!no_conditions) {
			  if (currentPage < 3 && asthma) {
				    return "/life-quote-health-asthma";
			  }
			  if (currentPage < 4 && cancer) {
				    return "/life-quote-health-cancer";
			  }
			  if (currentPage < 5 && depression) {
				    return "/life-quote-health-depression";
			  }
			  if (currentPage < 6 && diabetes) {
				    return "/life-quote-health-diabetes";
			  }
			  if (currentPage < 7 && heart_attack) {
				    return "/life-quote-health-heart-attack";
			  }
			  if (currentPage < 8 && sleep_apnea) {
				    return "/life-quote-health-sleep-apnea";
			  }
			  if (currentPage < 9 && stroke) {
				    return "/life-quote-health-stroke";
			  }
		}
		if (currentPage < 10 && license == "Yes") {
			  return "/life-quote-driving-history";
		}
    if (currentPage < 11) { 
        if (gender == 'male') {
    	    if (age <= 29) {
				    	return "/quote-results/m1829";
			    }
    	    else if (age >= 30 && age <= 39) {
				    	return "/quote-results/m3039";
			    }
    	    else if (age >= 40 && age <= 49) {
				    	return "/quote-results/m4049";
			    }
    	    else if (age >= 50 && age <= 59) {
				    	return "/quote-results/m5059";
			    }
          else if (age >= 60) {
              return "/quote-results/m6080";
          }
		    }
		    else if (gender == 'female') {
    	    if (age <= 29) {
				    	return "/quote-results/f1829";
			    }
    	    else if (age >= 30 && age <= 39) {
				    	return "/quote-results/f3039";
			    }
    	    else if (age >= 40 && age <= 49) {
				    	return "/quote-results/f4049";
			    }
    	    else if (age >= 50 && age <= 59) {
				    	return "/quote-results/f5059";
			    }
          else if (age >= 60) {
              return "/quote-results/f6080";
          }
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
        coverage_rec,
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
      
			if (age < 18 || adj_age >= 81) {
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

		if ($annual_income.val().length > 0 && adj_age != '') {
			annual_income = parseInt($annual_income.val().replace(/,/g, ""));
			if (adj_age >= 18 && adj_age <= 29) {
				coverage_rec = Math.ceil((annual_income * 15) / 100000) * 100000;
			}
			else if (adj_age >= 30 && adj_age <= 39) {
				coverage_rec = Math.ceil((annual_income * 14) / 100000) * 100000;
			}
			else if (adj_age >= 40 && adj_age <= 44) {
				coverage_rec = Math.ceil((annual_income * 12) / 100000) * 100000;
			}
			else if (adj_age >= 45 && adj_age <= 49) {
				coverage_rec = Math.ceil((annual_income * 10) / 100000) * 100000;
			}
			else if (adj_age >= 50 && adj_age <= 54) {
				coverage_rec = Math.ceil((annual_income * 8) / 100000) * 100000;
			}
			else if (adj_age >= 55) {
				coverage_rec = Math.ceil((annual_income * 6) / 100000) * 100000;
			}
		}
		if (coverage_rec > 2000000) {
			coverage_rec = 2000000
		}
		storage.setItem('coverage_recommendation', coverage_rec);
    
    return [dob, adj_age, dob_error_req, dob_error_age];

	}


	function setLocalStorage(document) {
		var storage = window.localStorage,
        gender_selected = $("input[name='Gender']:checked").val(),
        citizenship_selected = $("input[name='Citizenship']:checked").val();

		storage.setItem('zip', document.getElementById("zip-input").value);
		storage.setItem('gender', gender_selected);
		storage.setItem('dob', document.getElementById("dob").value);
		storage.setItem('age', document.getElementById("age").value);
		storage.setItem('citizenship', citizenship_selected);
		storage.setItem('annual_income', document.getElementById("income-input").value);
		storage.setItem('quote_initiated_from_city', document.getElementById("submit_from_city").value);
		storage.setItem('quote_initiated_from_ip_address', document.getElementById("submit_from_ip_address").value);
	}

	function submitButtonCheck(page) {
	var $document = $(this),
			enabled = true,
			storage = window.localStorage,
			$zip_next_button = $document.find( '#zip-step' ),
			$gender_next_button = $document.find( '#gender-step' ),
			$dob_next_button = $document.find( '#dob-step' ),
			$citizenship_next_button = $document.find( '#citizenship-step' ),
			$income_next_button = $document.find( '#income-step' ),
			className = 'button_active',
			$dob = $document.find('.dob'),
			$gender = $document.find('.gender'),
			$citizen = $document.find('.citizen'),
      gender_selected = $("input[name='Gender']:checked").val(),
			citizenship_selected = $("input[name='Citizenship']:checked").val(),
			$dob_month = $document.find('input[id="dob_month"]'),
			$dob_day = $document.find('input[id="dob_day"]'),
			$dob_year = $document.find('input[id="dob_year"]'),
      DOBresult,
			dob,
			age,
			adj_age,
			annual_income,
			coverage_rec,
			dob_error_req = true,
			dob_error_age = false,
			$zip_input = $document.find('input[id="zip-input"]'),
			zip_error = true,
			$annual_income = $document.find('input[id="income-input"]'),
      income_error = true,
			strDateTime = getFormattedDate(),
			error_flag = true;
console.log("page calling submitButtonCheck() function = "+page);
		// check zip code entry
  	if (page == "zip") {
		var zip = $('#zip-input').val();
console.log("zip.length = "+zip.length+" | zip_error = "+zip_error);
		if (zip.length == 5 &&
				zip_error == false
		) {
			document.getElementById("zip-step").disabled = false;
			$zip_next_button.toggleClass(className, true);
			setTimeout(function() {$('.w-round div:nth-child(2)').trigger('tap'); }, 500);
		} else {
			document.getElementById("zip-step").disabled = true;
			$zip_next_button.toggleClass(className, false);
		}
		}
		// check gender selection
  	if (page == "gender") {
		if ($("input[name='Gender']").is(':checked') ) {
			$('#gender-alert-required').hide(500);
			document.getElementById("gender-step").disabled = false;
			$gender_next_button.toggleClass(className, true);
			setTimeout(function() {$('.w-round div:nth-child(3)').trigger('tap'); }, 500);
		} else {
			document.getElementById("gender-step").disabled = true;
			$gender_next_button.toggleClass(className, false);
		}
		}
		// check DOB entry
  	if (page == "dob") {
		dob = DOBresult[0];
		adj_age = DOBresult[1];
    dob_error_req = DOBresult[2];
    dob_error_age = DOBresult[3];
		document.getElementById("dob").value = dob;
		document.getElementById("age").value = adj_age;

		if ($dob_month.val() != '' && /^([\w]{1,2})?$/.test($dob_month.val()) &&
				$dob_day.val() != '' && /^([\w]{1,2})?$/.test($dob_day.val()) &&
				$dob_year.val() != '' && /^([\w]{4,4})?$/.test($dob_year.val()) &&
				dob_error_age == false &&
        dob_error_req == false) {
			document.getElementById("dob-step").disabled = false;
			$dob_next_button.toggleClass(className, true);
		} else {
			document.getElementById("dob-step").disabled = true;
			$dob_next_button.toggleClass(className, false);
		}
		}
		// check citizenship selection
  	if (page == "citizen") {
		if ($("input[name='Citizenship']").is(':checked') ) {
			$('#citizenship-alert-required').hide(500);
			document.getElementById("citizenship-step").disabled = false;
			$citizenship_next_button.toggleClass(className, true);
			setTimeout(function() {$('.w-round div:nth-child(5)').trigger('tap'); }, 500);
		} else {
			document.getElementById("citizenship-step").disabled = true;
			$citizenship_next_button.toggleClass(className, false);
		}
    }
    
		// check income entry
  	if (page == "income") {
		var income = $('#income-input').val();
		if (income.length > 5 && income.length < 14) {
			$('income-alert-required').hide(500);
			document.getElementById("income-step").disabled = false;
			$income_next_button.toggleClass(className, true);
			income_error = false;
      setLocalStorage(document);
		} else {
			document.getElementById("income-step").disabled = true;
			$income_next_button.toggleClass(className, false);
			income_error = true;
   		storage.setItem('coverage_recommendation', "");
		}
		}

	}
