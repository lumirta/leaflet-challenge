
//storing the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Adding a Leaflet tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


// Creating a Leaflet map object.
var myMap = L.map("map", {
    center: [39.32, -111.09],
    zoom: 4.5,
    layers: [streets]
});

//defining basemaps as the streetmap
let baseMaps = {
    "Street map": streets,
    "Topographic Map": topo
};

//defining the earthquake layergroup and tectonic plate layergroups for the map
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

//defining the overlays and link the layergroups to separate overlays
let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};

//adding a control layer and pass in baseMaps and overlays
L.control.layers(baseMaps, overlays).addTo(myMap);

//unction that will dictate the stying of the earthquake points on the map
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag), //sets radius based on magnitude 
        fillColor: chooseColor(feature.geometry.coordinates[2]) //sets fillColor based on the depth of the earthquake
    }
};

//defining a function to choose the fillColor of the earthquake based on earthquake depth
function chooseColor(depth) {
    if (depth <= 10) return "lightgreen";
    else if (depth > 10 & depth <= 30) return "yellow";
    else if (depth > 30 & depth <= 50) return "orange";
    else if (depth > 50 & depth <= 70) return "purple";
    else if (depth > 70 & depth <= 90) return "darkblue";
    else return "red";
};

//defining a function to determine the radius of each earthquake marker
function chooseRadius(magnitude) {
    return magnitude*5;
};

//d3 to pull JSON data and adding circle marker
d3.json(url).then(function (data) { 
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  
            return L.circleMarker(latlon).bindPopup(feature.id);  
        },
        style: styleInfo //styling the CircleMarker
    }).addTo(earthquake_data); // adding the earthquake data to the earthquake_data layergroup / overlay
    earthquake_data.addTo(myMap);

});

//create legend, credit to this website for the structure: https://codepen.io/haakseth/pen/KQbjdO -- this structure is referenced in style.css
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    
       div.innerHTML += '<i style="background: lightgreen"></i><span>(-10-10)</span><br>';
       div.innerHTML += '<i style="background: yellow"></i><span>(10-30)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(30-50)</span><br>';
       div.innerHTML += '<i style="background: purple"></i><span>(50-70)</span><br>';
       div.innerHTML += '<i style="background: blue"></i><span>(70-90)</span><br>';
       div.innerHTML += '<i style="background: red"></i><span>(90+)</span><br>';
  
    return div;
  };
  //add the legend to the map
  legend.addTo(myMap);

//scratch work for collecting the necessary  and console logging
//collect data with d3
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "nc73872510"); //replace the id string with the argument of the function once created
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); // longitude
    console.log(coordinates[1]); // latitude
    console.log(coordinates[2]); // depth of earthquake
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    //define depth variable
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

});