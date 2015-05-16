function executeRoute(){
	addRouteFromMap();
	doRoute(getActive());
}
/* This is all set up information and should not need to change for 
 * almost any reason 
 */
function setRouteFPC(route){
	FPC = [];
	for(point in route){
		FPC.push(new google.maps.LatLng(route[point].A, route[point].F));
	}
	setFPC();
}
function getRouteFPC(){
	return FPC;
}

function clearMap(){
	console.log("Clearing map data");
	FPC = [];
	setFPC();	
}
function handleClick(event){
	FPC.push(new google.maps.LatLng(event.latLng.A, event.latLng.F));
	setFPC();
}
function setFPC(){
	flightPath.setMap(null);
	console.log(FPC);
  	flightPath = makeFP(FPC);
  	flightPath.setMap(map);
}
var map;
var FPC = [];
var flightPath = makeFP(FPC);
function makeFP(FPC){
  var FP = new google.maps.Polyline({
    path: FPC,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  return FP;
}
var EQMap;
function initializeEQ(){
  var mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(39.956676, -75.189952),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    disableDefaultUI: true
  };

  EQmap = new google.maps.Map(document.getElementById('map-canvas-EQ'), mapOptions);
}

/**
 * The CenterControl adds a control to the map that recenters the map on Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function CenterControl(controlDiv, map, text, callback) {

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginTop = '10px';
  controlUI.style.marginBottom = '10px';
  controlUI.style.marginLeft = '10px';
  controlUI.style.marginRight = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlUI.onmousedown = function(){
	controlUI.style.backgroundColor = "#999";	
  };
  controlUI.onmouseup = function(){
	controlUI.style.backgroundColor = "#fff";	
  };

  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '10px';
  controlText.style.lineHeight = '14px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = text;
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    callback();
  });

}

google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
  var mapOptions = {
    zoom: 30,
    center: new google.maps.LatLng(39.956676, -75.189952),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    disableDefaultUI: true
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);


/* Handler for the map clicking stuff */
  google.maps.event.addListener(map, 'click', handleClick);
  var clearControlDiv = document.createElement('div');
  var doControlDiv = document.createElement('div');
  var clearControl = new CenterControl(clearControlDiv, map, 'Clear Map', clearMap);
  var doControl = new CenterControl(doControlDiv, map, 'Execute Route', executeRoute);
  clearControlDiv.index = 1;
  doControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearControlDiv);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(doControlDiv);
}
google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'load', initializeEQ);
