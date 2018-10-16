//getting the data
var link="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(link,function(data){
    console.log(data);
    createFeatures(data.features);
});


function createFeatures(earthquakeData){
    function onEachFeature(feature,layer){
        layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes= L.geoJSON(earthquakeData,{
        onEachFeature: onEachFeature,
        pointToLayer: function(feature,latlng){
            return L.circleMarker(latlng,{
                radius: feature["properties"]["mag"]*3.5,
                color: colorscale(feature["properties"]["mag"]),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7,
                stroke: true

            });
        }
    });
    
    // Earthquakes layer to the createMap function
    createMap(earthquakes);
}

function colorscale(magnitude){
    if(magnitude>=0 & magnitude<=1){
        return "#F30";
    }
    else if(magnitude>1 & magnitude<=2){
        return "#F60";
    }
    else if(magnitude>2 & magnitude<=3){
        return "#F90";
    }
    else if(magnitude>3 & magnitude<=4){
        return "#FC0";
    }
    else if(magnitude>4 & magnitude<=5){
        return "#FF0";
    }
    else if(magnitude>5){
        return "#9F3";
    }
}
function createMap(earthquakes){
    // Access token for mapbox
    var token="pk.eyJ1Ijoic21haGFwYTUiLCJhIjoiY2psZWNscnNxMGg3MzNwcXp1Y2IzeGpnYiJ9.geWDGuplJdeeiwgrHs8ZSw";
    // Creating Satellite Map tile Layer
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token="+token);
    // Creating Outdoor Map tile Layer
    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token="+token);
    // Creating Greyscale Map tile Layer
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token="+token);
    
    // Tectonic Plate Boundaries URL
    var tectonics_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
    // Creating a new Layer Group to show the tectonic boundaries
    var tectonics = new L.LayerGroup();


    // Access the tectonics URL and convert the response to geoJSON format and add to the Layergroup
    d3.json(tectonics_url,function(response){
        L.geoJSON(response,{
            color:"Red",
            weight: 2
        }).addTo(tectonics);            
    })

    
    // Defining the baseMap controls
    var baseMaps={
        "Satellite":satellitemap,
        "Grayscale":darkmap,
        "Outdoors":outdoormap
    }
   
    var XX={
        
    };

    // Creating the map variables along with the default layers
    var myMap=L.map("map",{
        center: [0, -3.9962],
        zoom:2,
        layers:[satellitemap,earthquakes,tectonics],
        maxBounds: [[90,-180], [-90, 180]]
    });

    
     // Creating the control for selecting the map types
     L.control.layers(baseMaps, XX, {
        collapsed: false
        }).addTo(myMap);
        
    // Creating legend control
    var legend = L.control({position: 'topleft'});
    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend')
        var limits = [0,1,2,3,4,5]
        var colors = ["#F30","#F60","#F90","#FC0","#FF0","#9F3"]
        var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
        var legenddisplay = [];
        // Add min & max
        
        limits.forEach(function(limit, index) {
            legenddisplay.push("<li style=\"list-style:none;background-color: " + colors[index] + "\">"+ labels[index] +"</li>");
          });
        div.innerHTML += "<ul>" + legenddisplay.join("") + "</ul>";
        return div;
    };
    
    legend.addTo(myMap);

    
}