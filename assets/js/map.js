//https://www.google.com/maps/d/edit?hl=en&mid=1U1yCBkZNnb7eBoxHtaIxkAstA_uDLVJm&ll=40.37642717752849%2C45.062418562653825&z=11
const tileUrl = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
const jsonUrl = './json/data.geojson'

const CONFIG = {
    iconsize: 10,
    color: "#17B0A2",
    flySeconds: 13,
    lineHeight: 5,
    initialZoom:15,
    edgeBufferTiles:4,
    center:{
        lat: 40.3549167507906,
        lng: 44.75555419921875,
        zoomLevel: 10
    }
}

const sevanMap = L.map('sevanmap')
sevanMap.setView([CONFIG.center.lat, CONFIG.center.lng], CONFIG.center.zoomLevel)

L.tileLayer(tileUrl, {
    maxZoom: CONFIG.initialZoom,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    edgeBufferTiles: CONFIG.edgeBufferTiles
    
}).addTo(sevanMap);

const iconDefault = L.divIcon({
    className: 'default-marker',
    iconSize: [CONFIG.iconsize, CONFIG.iconsize]
});

var iconBus = L.icon({
    iconUrl: './assets/icons/Bus-school.svg',
    iconSize: [80, 80],
});

fetch(jsonUrl)
    .then(function (response) { return response.json() })
    .then(function (data) { processJorney(data) });
