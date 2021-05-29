//https://www.google.com/maps/d/edit?hl=en&mid=1U1yCBkZNnb7eBoxHtaIxkAstA_uDLVJm&ll=40.37642717752849%2C45.062418562653825&z=11
const tileUrl = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
const jsonUrl = './json/data-updated.json'
const CONFIG = {
    storyHolderSelector:"#story-container",
    iconsize: 10,
    color: "#17B0A2",
    flySeconds: 18,
    lineHeight: 1,
    finalZoom:15,
    flyToDuration:3000, //ms seconds
    center:{  
        lat: 40.42395127765169,
        lng: 44.95399475097657,
        zoomLevel: 10
    }
}

const sevanMap = makeMap()
const iconCircle = makeCircleMarker()

fetch(jsonUrl)
    .then(function (response) { return response.json() })
    .then(function (data) { processJorney(data) });

