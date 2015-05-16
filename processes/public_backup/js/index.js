/* Ajax and Json functions are standard, 
 * Ignore this section, and don't worry 
 * about these functions or what they do 
 * unless you are Alpha.
 */
function Ajax(url, data, callback){
	    var http = new XMLHttpRequest();
	    http.onreadystatechange=function(){
		    if(http.readyState==4 && http.status==200){
			    callback(http.responseText);
		    }
	    }
		
	    urlBase = "http://52.10.133.86/Lux/";
	    http.open("POST", urlBase + url, true);
	    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	    http.send(JSON.stringify(data));
}
function getJsonFromUrl() {
	var query = location.search.substr(1);
 	var result = {};
	query.split("&").forEach(function(part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
  	});
 	return result;
}
var url = getJsonFromUrl();
if(!url.hasOwnProperty("access_token")){
	window.location = window.location+"?access_token=alpha59";
}
/******************** END THE DO NOT FOCUS PROJECT *******************************/

/* 
 * Update the weather and Earthquake data
 * You only have to worry about the callback
 * when editing, that is how you update the page
 * to get the data 
 */
function updateAPIs(){
	Ajax("API/call.php",{access_token:url.access_token
		, url:"https://api.wunderground.com/api/c8827d40b7166996/geolookup/conditions/q/PA/Philadelphia.json"}
		,function(data){
			var parsed = JSON.parse(data);
			//console.log(parsed.current_observation);
			var tempNow = document.getElementById("tempNow");
			tempNow.innerText = parsed.current_observation.temperature_string;
			var tempFeels = document.getElementById("tempFeels");
			tempFeels.innerText = parsed.current_observation.windchill_string;
			var humid = document.getElementById("humid");
			humid.innerText = parsed.current_observation.relative_humidity;
			var weath = document.getElementById("weath");
			weath.innerText = parsed.current_observation.weather;
			var wind = document.getElementById("wind");
			wind.innerText = parsed.current_observation.wind_dir;
			var baromet = document.getElementById("baromet");
			baromet.innerText = parsed.current_observation.pressure_in;
		}
	);
	Ajax("API/call.php", {access_token:url.access_token
		, url:"http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson" }
		,function(data){
				var myLatlng = new google.maps.LatLng(39.956676, -75.189952);
				var marker = new google.maps.Marker({
				    position: myLatlng,
			 	    icon:"http://support.genopro.com/Skins/Classic/Images/MessageIcons/Nuclear.gif",
				    title: "Test"
				});
				marker.setMap(EQmap);
			var parsed = JSON.parse(data);
			var EQL = document.getElementById("EQL");
			//console.log(EQmap);
			for(var i=0; i<parsed.features.length; i++){
				EQL.innerHTML += parsed.features[i].properties.title + "<br/>";
				// Use the Below to add to a MAP:
				//EQL.innerHTML += parsed.features[i].geometry.coordinates + "<br/>";
				var myLatlng = new google.maps.LatLng(parsed.features[i].geometry.coordinates[1],parsed.features[i].geometry.coordinates[0]);
				var marker = new google.maps.Marker({
				    position: myLatlng,
				    icon:"http://gis.aedit.it/ns/maps/earthquake_minor.png",
				    title: parsed.features[i].properties.title
				});
				marker.setMap(EQmap);
			}
		}
	);
}
// This just sets the update rate for the earthquake and 
// weather data to 300,000 milliseconds (5 Minutes)
setInterval(updateAPIs, 300000);


window.onload = function(){

	// TODO: Change this so it subscribes to all data
	Ajax("Assets/query.php", {query:{}, access_token: url.access_token}, function(data){
        	console.log(data);
        });
	Ajax("Assets/query.php"
		, {'query': {'type' : 'route'}, access_token:url.access_token}
		, function(data){
			var route = JSON.parse(data)[1];
			console.log(data);
			saveRoutes(route);
		});
		
	var Routes = document.getElementById("Routes");	
	var end = 10;
	for(var i=1; i<end; i++){
		var routeN = document.createElement("LI");
		var routeL = document.createElement("A");
		routeN.className = "route";
		if(i==1){
			routeN.className += "active";
		}
		if(i == end-1){
			routeL.onclick = function(){addRouteFromMap()};
			routeL.innerHTML = "+";
		}else{
			routeL.setAttribute("role", "tab");
			routeL.setAttribute("data-toggle", "tab");
			routeL.href = "#"+i;
			routeL.innerHTML = i;
			routeL.onclick = function(){putRouteOnMap(this.innerHTML)}
		}
		routeN.appendChild(routeL);
		Routes.appendChild(routeN);
	}
	updateAPIs(); 
	queryStatus();
}
/*
 * Query the server for status information
 * about the RC car, like GPS and Battery 
 * and such
 */
function queryStatus(){
	Ajax("Assets/query.php"
		,{'query': {'type':'status'}, access_token:url.access_token}
		,function(data){	
			//updateBars("90", "50", "95", "50", "3", "120");
			updateBars(data[1].battery, data[1].wifi, data[1].cpu, data[1].gps, data[1].sph, data[1].fps);
		}
	);
}
setInterval(queryStatus, 15000);

/*
 * Update the status bar type stuff, 
 * this should be pulled off of AWS 
 * with the function above, and called exclusively from there
 */
function updateBars(Battery, Wifi, CPU, GPS, SPH, FPS){
	// SideBar Bars
	document.getElementById("BATBar").setAttribute("aria-valuenow", Battery);
	document.getElementById("BATBar").style.width = Battery+"%";
	document.getElementById("WIFIBar").setAttribute("aria-valuenow", Wifi);
	document.getElementById("WIFIBar").style.width =  Wifi+"%";
	document.getElementById("CPUBar").setAttribute("aria-valuenow", CPU);
	document.getElementById("CPUBar").style.width = CPU+"%";

	// Under Map
	document.getElementById("GPS").innerText = GPS+"%";
	document.getElementById("SPH").innerText = SPH;
	document.getElementById("FPS").innerText = FPS;
}

// Socket.io stuff
var socket = io();
socket.emit('join', {access_token:url.access_token})
socket.on('updated', function(data){
	// any update coming from the server
	console.log("Update Data: " +JSON.stringify(data));
});
function doRoute(num){
	console.log("Doing Route");
	socket.emit('upsert', {query:{"route":num.toString()}, update:{'$set':{'inprogress':true}}});
	// TODO: render on screen
}
/*
 * Adding a route to the route list
 * means click on the plus, and then
 * all of the routes change color
 * so you can select which route number 
 * save it as.
 *
 * You can draw on the map without 
 * hitting the plus, so the plus just
 * takes the current flight path and 
 * saves it as that route number. 
 *
 * You can also launch a Route without
 * Saving it and it is just saved as 
 * Route 9, which can be overridden
 * by adding a new route. 
 *
 */
var routeInformation = {};
function saveRoutes(routes){
	var i = 1;
	console.log("Saving Routes");
	for(key in routes){
		console.log(key);
		console.log(routes[key].route_cord);
		routeInformation[i.toString()] = routes[key].route_cord;
		i++;
	}
}
var active = "1";
function getActive(){
	//var routes = document.getElementById("Routes");
	//if(routes.getElementsByClassName("active")[0] != undefined){
		//return routes.getElementsByClassName("active")[0].childNodes[0].innerHTML;
	//}else{
		return active;
	//}
}
function putRouteOnMap(num){
	// get route from map array, and update on map
	active = num;
	setRouteFPC(routeInformation[num]);	
}
function addRouteFromMap(){
	routeInformation[getActive()] = getRouteFPC();
	addRouteToLux(getActive(), routeInformation[getActive()]);
}
function addRouteToLux(num, route){
	Ajax("Assets/upsert.php" 
		, {'query': {'type' : 'route', 'route':num}, 'update':{'$set':{'route_cord':route}}, access_token:url.access_token}
		, function(data){});
	//socket.emit('upsert', {query:{"route":num.toString()}, update:{'$set':{'inprogress':false, route_cord:route}}});
}

/*
 * All the functionality for this is
 * dependent on the rocket group 
 */
function launchRocket(){
	document.getElementById("rocket").className = "btn btn-warning";
	document.getElementById("rocket").onclick = function(){
		rocket_Cancel();
		document.getElementById("rocketText").innerHTML = "Launch Rocket";
		document.getElementById("rocket").className = "btn btn-danger";
		document.getElementById("rocket").onclick = function(){
			launchRocket();
		};
		
	};
	rocket_Launch();
	document.getElementById("rocketText").innerHTML = "Press to Cancel";
}
