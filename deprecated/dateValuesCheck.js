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
		return this.value.slice(0, 4);}
	if (thisValue.length == 1) {
		if ((thisValue != 1) && (thisValue != 2)) {
			return null;}}
	if (thisValue.length == 2) {
		if ((thisValue != 19) && (thisValue != 20)) {
			if (thisValue < 19) {
				return 1;}
		}
		if (thisValue > 20) {
			return 2;}}
	return thisValue;
}
