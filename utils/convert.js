// index.js
const kmlfile = "../json/data-updated.kml"
const geofile = "../json/data-updated.geojson"
const converter = require("@mapbox/togeojson");
const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;

const parsedKML = new DOMParser().parseFromString(fs.readFileSync(kmlfile, "utf8"));
const geojson = converter.kml(parsedKML);
const _geojsonCleared = clearUnnecessaryFields(geojson, ["name"])
const _geoJsonChanged = changeLatLongOrder(geojson)


if(fs.existsSync(geofile)){
    fs.unlinkSync(geofile)
}

fs.appendFileSync(geofile, JSON.stringify(_geoJsonChanged))

console.log(geofile)


function changeLatLongOrder(geojsonOBj){

    for(let i=0; i<geojsonOBj.features.length; i++){
        if(geojsonOBj.features[i].geometry.type=="Point"){
            let tmp = geojsonOBj.features[i].geometry.coordinates[0]
            geojsonOBj.features[i].geometry.coordinates[0] = geojsonOBj.features[i].geometry.coordinates[1]  
            geojsonOBj.features[i].geometry.coordinates[1] = tmp
        }
        
        
        else if(geojsonOBj.features[i].geometry.type=="LineString"){
            console.log(geojsonOBj.features[i].geometry.coordinates)
            for(let j=0; j<geojsonOBj.features[i].geometry.coordinates.length; j++){
                let tmp = geojsonOBj.features[i].geometry.coordinates[j][0]
                geojsonOBj.features[i].geometry.coordinates[j][0] = geojsonOBj.features[i].geometry.coordinates[j][1]
                geojsonOBj.features[i].geometry.coordinates[j][1] = tmp 
            }
            console.log(geojsonOBj.features[i].geometry.coordinates)

        }
    }
    return geojsonOBj;
}


function clearUnnecessaryFields(geojsonOBj, leaveUnchaned){
    for(let gj of geojsonOBj.features){
        for(let o in gj.properties){
            if(!leaveUnchaned.includes(o)){
                delete gj.properties[o]
            }
        }
    }

    return geojsonOBj
}