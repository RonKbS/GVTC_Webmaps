
var map = L.map('map', {
  minZoom: 8
}).setView([-0.2, 29.24], 8);

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  //maxZoom: 8
  // minZoom: 20
}).addTo(map);



// add files from map3 folder to map3.html
  ["map3Style", "map3Layers"].forEach(folder => {
    let hmap = document.createElement("script");
    hmap.setAttribute("type", "text/javascript");
    hmap.setAttribute("src", `js/map3/${folder}.js`);
    document.body.appendChild(hmap)
  })

// Add specific classes to OpenLayers elements: hide these controls for mobile view using Bootstrap classes
$('.ol-scale-line').addClass('hidden-xs')
$('.ol-attribution').addClass('hidden-xs')


// add file from map folder to map2.html
let toolTips = document.createElement("script");
toolTips.setAttribute("type", "text/javascript");
toolTips.setAttribute("src", "js/map/toolTips.js");
document.body.appendChild(toolTips)


// add file from map folder to map2.html
let povertyLandCMap = document.createElement("script");
povertyLandCMap.setAttribute("type", "text/javascript");
povertyLandCMap.setAttribute("src", "js/map/povertyLandCMap.js");
document.body.appendChild(povertyLandCMap)
//
var legendFrom = $('.leaflet-top.leaflet-right');
var legendTo = $('#container2');
legendTo[0].appendChild(legendFrom[0]);

// layer control
var povlegend = L.control({
  position: 'bottomright'
});
povlegend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    povGrades = [0.11, 0.15, 0.18, 0.22, 0.8],
    povLabels = ['<strong>1 = Highest Level of Poverty </strong> <br>'],
    from, to;

  for (var i = 0; i < povGrades.length; i++) {
    from = povGrades[i];
    to = povGrades[i + 1];

    povLabels.push(
      '<i style="background:' + getColorpoverty(from) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));

  }

  div.innerHTML = povLabels.join('<br>');
  return div;
};

var denlegend = L.control({
  position: 'bottomright'
});
denlegend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [100, 200, 400, 9700],
    labels = ['<strong> People/Sqkm </strong><br>'],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + getColordensity(from) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));;
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

map.on('baselayerchange', function (eventLayer) {
  if (eventLayer.name === 'Household Poverty Rates') { 
    if(landLegend._map) {
      map.removeControl(landLegend);
    } else if(denlegend._map) {
      map.removeControl(denlegend);
    }
    povlegend.addTo(map);
  }
  else if (eventLayer.name === 'Population Density') { 
    if(landLegend._map) {
      map.removeControl(landLegend);
    } else if(povlegend._map) {
      map.removeControl(povlegend);
    }
    denlegend.addTo(map);
  }
  if (eventLayer.name === 'LandCover Classification') { 
    if(denlegend._map) {
      map.removeControl(denlegend);
    } else if(povlegend._map) {
      map.removeControl(povlegend);
    }
    landLegend.addTo(map);
  }
})

//layer control 2
var landLegend = L.control({ position: 'bottomright' });
landLegend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML +=
    '<img class= "landlegend" src="images/geoserver-GetLegendGraphic.png" alt="legend">';
  return div;
};


function layer() {
  var layer = this;
  var name = layer.getGeoJSON().name;
  var item = filters.appendChild(document.createElement('div'));
  var checkbox = item.appendChild(document.createElement('input'));
  var label = item.appendChild(document.createElement('label'));
  checkbox.type = 'checkbox';
  checkbox.id = name;
  label.innerHTML = name;
  label.setAttribute('for', name);
  checkbox.addEventListener('change', update);

  function update() {
    (checkbox.checked) ? layer.addTo(map) : map.removeLayer(layer);
  }
}

let nav_height = $(
  ".navbar.fixed-top.row.navigation_dashboard"
).height()
let window_height = $(window).height()
$("#panel").css("top", `${(nav_height / window_height) * 100}%`)
$("#panel").css("height", `${(100 - (nav_height / window_height) * 100)}%`)
