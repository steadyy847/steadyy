function getQuotes(document) {
	var storage = window.localStorage;
//    var riskClass = storage.getItem('risk_class');
	var risk = getRiskClass(),
			risk_class = risk.risk_class,
			tobacco = risk.tobacco;
    
	var health;
		switch (risk_class) {
			case "nt1": health = "PP"; break;
			case "nt2": health = "P"; break;
			case "nt3": health = "RP"; break;
			case "nt4": health = "R"; break;
			case "smoke1": health = "RP"; break;
			case "smoke2": health = "R"; break;
			default: health = ""; break;
		}

	var state;
		switch (storage.getItem('state')) {
			case "CA": state = "5"; break;
			case "FL": state = "10"; break;
			case "IL": state = "14"; break;
			case "MI": state = "23"; break;
			case "NY": state = "52"; break;
			case "OH": state = "32"; break;
			case "PA": state = "39"; break;
			case "TX": state = "44"; break;
			case "VA": state = "47"; break;
			default: state = ""; break;
		}

  var formData = {
		state: state,
		birthmonth: storage.getItem('dob').slice(5,7),
		birthday: storage.getItem('dob').slice(8,10),
		birthyear: storage.getItem('dob').slice(0,4),
		sex: storage.getItem('gender').slice(0,1),
		smoker: tobacco.slice(0,1),
		health: health,
		compinc: "AMGE,UTST,CINN,BANN,WILP,PACL,PROT,PROA,PRUC,PRUJ,SBLI,JOHU,JOHY,LNNA,LNLI",
		newcategory: "Z:34567",
		faceamount: storage.getItem('coverage_selected'),
		modeused: "M",
		sortoverride1: "M",
		maxnumresults: "1",
		ipaddress: storage.getItem('quote_initiated_from_ip_address')
	};

	var settings = {
	  "url": "https://young-shelf-70816.herokuapp.com/getQuotes",
	  "method": "POST",
	  "timeout": 0,
	  "headers": {
	    "Content-Type": "application/x-www-form-urlencoded",
	  },
	  "contentType": 'application/x-www-form-urlencoded',
	  "data": formData
	};

	$.ajax(settings).done(function (response) {
		console.log(response);
      
		const responseObject = JSON.parse(JSON.stringify(response));
      
		if (response.Compulife_ComparisonResults === undefined) {
			$('#success-content').hide();
			$('#error-content').show();
			$('#error_message').text("Uh-oh! We're having a problem. Please check back later.");
		} else {
			$('#success-content').show();
			$('#error-content').hide();
			console.log("Compulife Results="+response.Compulife_ComparisonResults.length);

			let termResult;
			response.Compulife_ComparisonResults.forEach(result1 => {
			var title = result1.Compulife_title,
					term = title.slice(0,2);

			$('#quote_detail_'+term).show();
			$('#no_quotes_'+term).hide();

			termResult = result1.Compulife_Results;
			termResult.forEach(result2 => {
				let company = result2.Compulife_company,
						company_code = result2.Compulife_compprodcode.slice(0,4),
						monthlyPremium = result2.Compulife_premiumM,
						product = result2.Compulife_product;
				var premium_formatted = formatter.format(monthlyPremium.replace(/,/g, '')).toString(),
						prem_dollars = premium_formatted.slice(1, premium_formatted.length - 3),
						prem_cents = premium_formatted.slice(premium_formatted.length - 3, premium_formatted.length);
				document.getElementById("premium_dollars_"+term).innerHTML = prem_dollars;
				document.getElementById("premium_cents_"+term).innerHTML = prem_cents;

				$('#quote_detail_'+term).find('.product').text(product);

				const collectionList = document.getElementById('container-'+term),
							items = collectionList.querySelectorAll('.carriers');
				items.forEach(item => {
					const carrierCodeField = item.querySelector('.list_carrier_code');
					const carrierCode = carrierCodeField.textContent;
					item.setAttribute('data-carrier-code', carrierCode);
				});

/*				const filteredItems = Array.prototype.filter.call(items, item => item.dataset.carrierCode === company_code);

				collectionList.innerHTML = '';
				filteredItems.forEach(item => collectionList.appendChild(item));
					collectionList.items = filteredItems;
*/
				console.log("term="+term+" | company_code="+company_code.toLowerCase());
				console.log("Number(term)="+Number(term)+" | company_code="+company_code.toLowerCase());

				switch(Number(term)) {
					case 10:
						mixer10.filter('.'+company_code.toLowerCase());
						break;
					case 15:
						mixer15.filter('.'+company_code.toLowerCase());
						break;
					case 20:
						mixer20.filter('.'+company_code.toLowerCase());
						break;
					case 25:
						mixer25.filter('.'+company_code.toLowerCase());
						break;
					case 30:
						mixer30.filter('.'+company_code.toLowerCase());
						break;
					default:
						console.log("Invalid term");
				}



				});
			});
     }
	})
	.fail(function (jqXHR, textStatus) {
		$('#success-content').hide();
		$('#error-content').show();

		if (!navigator.onLine) {
			$('#error_message').text("It appears your internet is disconnected. Please try again later");
		} else {
			if (jqXHR.status == 429) {
				$('#error_message').text("We limit the number of quote requests over a timeframe. Please try again later.");
			} else {
				$('#error_message').text("Error: " + jqXHR.status + " - " + jqXHR.responseText);
			}
		}
	});
}
