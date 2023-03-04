	function zipCheck(document, thisObject) {
    console.log("In the js function zipCheck()");
			var storage = window.localStorage,
          zip = thisObject.value,
					url = 'https://api.zippopotam.us/us/' + zip,
					state = "99";
    console.log("zip="+zip);

			$('#zip-alert-required').hide(500);

			if (!zip) return;
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if(xhr.status == 404) { 
						var state = "XX";
					} else {
						var result = xhr.responseText,
								zippo = JSON.parse(result),
								state = zippo.places[0]["state abbreviation"];
					}
					storage.setItem('state', state);
					if ((state == "IL") || (state == "CA") || (state == "MI") || (state == "NY") || (state == "PA") || (state == "TX") || (state == "VA")) {
						$('#zip-alert-valid').hide(500);
						$('#zip-alert-state').hide(500);
						zip_error = false;
					} else {
						if (state == "XX") {
							$('#zip-alert-valid').show(500);
							$('#zip-alert-state').hide(500);
							zip_error = true;
						} else {
							$('#zip-alert-valid').hide(500);
							$('#zip-alert-state').show(500);
							zip_error = true;
						}
					}
					submitButtonCheck("zip");
				}
			};
			xhr.open('GET', url, true);
			xhr.send(null);
  }

function zipCheck2(document, thisObject) {
  console.log("In the js function zipCheck()");
  var storage = window.localStorage,
      zip = thisObject.value,
      url = 'https://production.shippingapis.com/ShippingAPI.dll?API=CityStateLookup%20&XML=%3CCityStateLookupRequest%20USERID=%22222STEAD5477%22%3E%3CZipCode%20ID=%20%220%22%3E%20%3CZip5%3E'+zip+'%3C/Zip5%3E%3C/ZipCode%3E%3C/CityStateLookupRequest%3E',
      state = "99";
  console.log("zip=" + zip);

  $('#zip-alert-required').hide(500);

  if (!zip) return;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 404) {
        var state = "XX";
      } else {
        var result = xhr.responseText;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(result, "text/xml");
        var cityStateLookupResponse = xmlDoc.getElementsByTagName("CityStateLookupResponse")[0];
        var zipCode = cityStateLookupResponse.getElementsByTagName("ZipCode")[0];
        var city = zipCode.getElementsByTagName("City")[0].textContent;
        var state = zipCode.getElementsByTagName("State")[0].textContent;
      }
      storage.setItem('state', state);
      if ((state == "IL") || (state == "CA") || (state == "MI") || (state == "NY") || (state == "PA") || (state == "TX") || (state == "VA")) {
        $('#zip-alert-valid').hide(500);
        $('#zip-alert-state').hide(500);
        zip_error = false;
      } else {
        if (state == "XX") {
          $('#zip-alert-valid').show(500);
          $('#zip-alert-state').hide(500);
          zip_error = true;
        } else {
          $('#zip-alert-valid').hide(500);
          $('#zip-alert-state').show(500);
          zip_error = true;
        }
      }
      submitButtonCheck("zip");
    }
  };
  xhr.open('GET', url, true);
  xhr.send(null);
}
