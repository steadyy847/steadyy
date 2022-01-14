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
