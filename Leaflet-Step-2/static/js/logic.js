 // Store API query variables
 var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 var faultlineURL= "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
 
//Render Map function
renderMap(earthquakeURL, faultlineURL);

//Render Map function
function renderMap(earthquakeURL, faultlineURL){
  // Grab the data with d3
    d3.json(earthquakeURL, function(data) {
    console.log(data);
    var earthquakeData= data;
    d3.json(faultlineURL, function(data2) {
      console.log(data2);
      var faultlineData= data2;
      createFeatures(earthquakeData, faultlineData);
      });
    });
  }

//Create features functiom
function createFeatures(earthquakeData, faultlineData){
  function onEachEarthquakeLayer(feature, layer){
    return new L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
      fillOpacity: 1,
      color: chooseColor(feature.properties.mag),
      fillColor: chooseColor(feature.properties.mag),
      radius:  markerSize(feature.properties.mag)
    });
  }

  function onEachEarthquake(feature, layer){
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time)+ "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  function onEachFaultline(feature, layer){
    L.polyline(feature.geometry.coordinates);
  }

  // Creates a GeoJSON layer containing the features array of the earthquakeData object
    // Run the onEachEarthquake & onEachQuakeLayer functions once for each element in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachEarthquake,
      pointToLayer: onEachEarthquakeLayer
    });

    // Creates a GeoJSON layer containing the features array of the faultLineData object
    // Run the onEachFaultLine function once for each element in the array
    var faultLines = L.geoJSON(faultlineData, {
      onEachFeature: onEachFaultline,
      style: {
        weight: 2,
        color: 'blue'
      }
    });
    // Sends earthquakes, fault lines and timeline layers to the createMap function
    createMap(earthquakes, faultLines);
}


//Function to Create Map
function createMap(earthquakes, faultLines){
    let outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=" + API_KEY);
    let satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=" + API_KEY);
    let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=" + API_KEY);

    // Define a baseMaps object to hold base layers
    let baseMaps = {
      "Outdoors": outdoors,
      "Satellite": satellite,
      "Dark Map": darkmap,
    };

    // Create overlay object to hold overlay layers
    let overlayMaps = {
      "Earthquakes": earthquakes,
      "Fault Lines": faultLines
    };

    // Create map, default settings: outdoors and faultLines layers display on load
    let map = L.map("map", {
      center: [39.8283, -98.5785], //using the center of the US for reference per google
      zoom: 3,
      layers: [outdoors, faultLines],
      scrollWheelZoom: false
    });

    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: true
    }).addTo(map);

    

}

// chooseColor function:
// Returns color for each grade parameter using ternary expressions
//----------------------------------------------------------------------------
function chooseColor(magnitude) {
  return magnitude > 5 ? "red":
    magnitude > 4 ? "orange":
      magnitude > 3 ? "gold":
        magnitude > 2 ? "yellow":
          magnitude > 1 ? "yellowgreen":
            "greenyellow"; // <= 1 default
}

//----------------------------------------------------------------------------
// Function to amplify circle size by earthquake magnitude
//----------------------------------------------------------------------------
function markerSize(magnitude) {
  return magnitude * 5;
}







