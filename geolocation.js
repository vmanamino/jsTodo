function findLocation() {    
    navigator.geolocation.getCurrentPosition(getLocation);
}

function getLocation(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	addGeolocation(latitude, longitude);	
}


