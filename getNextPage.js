function getNextPage(currentPage) {
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
				return "/life-quote-health-heart_attack";
			}
			if (currentPage < 8 && sleep_apnea) {
				return "/life-quote-health-sleep_apnea";
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
    	  if (age <= 43) {
				  	return "/quote-results-m1843";
			  }
        else if (age >= 44) {
            return "/quote-results-m4480";
        }
		  }
		  else if (gender == 'female') {
    	  if (age <= 43) {
				  	return "/quote-results-f1843";
			  }
        else if (age >= 44) {
					  return "/quote-results-f4480";
        }
      }
   }
}
