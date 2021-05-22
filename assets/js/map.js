//https://www.google.com/maps/d/edit?hl=en&mid=1U1yCBkZNnb7eBoxHtaIxkAstA_uDLVJm&ll=40.37642717752849%2C45.062418562653825&z=11

//const jorney = []
const tileUrl = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
//const tileUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
//const tileUrl =  "http://tiles.wmflabs.org/hillshading/${z}/${x}/${y}.png	"
const jsonUrl = '/json/data.geojson'

const iconsize = 20
const TIMOUT = 2000
const CONFIG = {
    iconsize: 10,
    //iconsize_current: 18,
    iconsize_footprint: 5,
    color: "#17B0A2",
    flySeconds: 13,
    lineHeight: 5
}

const ZERRO_POINT = {
    lat: 40.3549167507906,
    lng: 44.75555419921875,
    zoomLevel: 10
}

const sevanMap = L.map('sevanmap')
sevanMap.setView([ZERRO_POINT.lat, ZERRO_POINT.lng], ZERRO_POINT.zoomLevel)

L.tileLayer(tileUrl, {
    maxZoom: 18,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(sevanMap);

const iconDefault = L.divIcon({
    className: 'default-marker',
    iconSize: [CONFIG.iconsize, CONFIG.iconsize]
});

var iconBus = L.icon({
    iconUrl: './assets/icons/Bus-school.svg',
    iconSize: [80, 80],
    //iconAnchor: [0, 0],
});

/*
const iconCurrent = L.divIcon({
    className: 'current-marker',
    iconSize: [CONFIG.iconsize_current, CONFIG.iconsize_current]
});
*/

/*
const iconFootprint = L.divIcon({
    className: 'footprint-marker',
    iconSize: [CONFIG.iconsize_footprint, CONFIG.iconsize_footprint]
});
*/

fetch(jsonUrl)
    .then(function (response) { return response.json() })
    .then(function (data) { processJorney(data) });
