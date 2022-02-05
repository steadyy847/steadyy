
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
