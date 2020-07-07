 // Create our map, giving it the streetmap and earthquakes layers to display on load
 var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5
  });

  // Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  
  // Store API query variables
  var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  
  // Grab the data with d3
  d3.json(baseURL, function(data) {

    console.log(data);
    var featuresArray =data.features;
    for (var i=0; i<featuresArray.length; i++){
        var myCoordinate =featuresArray[i].geometry.coordinates;
        var myMagnitude =featuresArray[i].properties.mag;
        var mysize = myMagnitude*10000;
        var myPlace = featuresArray[i].properties.place;
        var myType = featuresArray[i].properties.type;
        var color = "";
        var markerOpacity ="";
         if (mysize > 40000) {
            color = "red";
            markerOpacity =.80;
          }
          else if (mysize > 30000) {
            color = "orange";
            markerOpacity =.70;
          }
          else if (mysize > 20000) {
            color = "yellow";
            markerOpacity =.60;
          }
          else if (mysize > 10000) {
            color = "lime";
            markerOpacity =.50;
          }
          else {
            color = "green";
            markerOpacity =.40;
          }
          L.circle([myCoordinate[1],myCoordinate[0]], {
            stroke: true,
            fillOpacity: markerOpacity,
            color: "white",
            weight: 0.50,
            fillColor: color,
            radius: mysize
          }).bindPopup("<h1> Place:" + myPlace + "</h1> <hr> <h3>Magnitude:"  + myMagnitude + myType +"</h3><hr><p>" + new Date(featuresArray[i].properties.time) + "</p>").addTo(myMap);
        
    }

      // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ['4+','3+','2+','1+','<1'];
    var colors = ['red','orange','yellow','lime','green'];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1 style=\"color:red\">Earthquake Magnitude</h1>" +
      "<div class=\"labels\">" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push(`<li style="background-color: ${colors[index]}">${limit}</li>`);
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
}
legend.addTo(myMap); 
  

  });

  
    