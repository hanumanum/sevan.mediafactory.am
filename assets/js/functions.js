let currentIndex = 0
let animatedMarker = {}
let loremIpsum = "լոռեմ իպսում դոլոռ սիթ ամեթ, ին ուսու վեռիթուս դելեծթուս, աութեմ հոմեռո պոսսիթ եի եոս. պռոբաթուս հենդռեռիթ պեռսեքուեռիս եսթ եու. պռո ութ վիռիս ոմնես պեռպեթուա. ան քուո գլոռիաթուռ ուլլամծոռպեռ ծոնսեքուունթուռ, եոս ելոքուենթիամ նեծեսսիթաթիբուս ին. եսթ դիծո իռիուռե եխպլիծառի եա, թամքուամ քուաեռենդում սիթ նո."
const modal = $("#infomodal");

L.Polyline = L.Polyline.include({
    getDistance: function (system) {
        // distance in meters
        let mDistanse = 0,
            length = this._latlngs.length;
        for (var i = 1; i < length; i++) {
            mDistanse += this._latlngs[i].distanceTo(this._latlngs[i - 1]);
        }
        // optional
        if (system === 'imperial') {
            return mDistanse / 1609.34;
        } else {
            return mDistanse / 1000;
        }
    }
});


function drawJorney(jorneyData) {
    for (let i = 0; i < jorneyData.length; i++) {
        if (jorneyData[i].geometry.type == "Point") {
            L.marker([jorneyData[i].geometry.coordinates[0], jorneyData[i].geometry.coordinates[1]], { icon: iconDefault })
                .addTo(sevanMap);
        }

        else if (jorneyData[i].geometry.type == "LineString") {
            L.polyline(jorneyData[i].geometry.coordinates, { color: CONFIG.color, weight: CONFIG.lineHeight })
                .addTo(sevanMap);
        }
    }

}


function processJorney(jorneyData) {
    const jd = jorneyData.features
    drawJorney(jd)
    flyFirst(jd)

    $("#nav-arrow-next").click(function () {
        flyNext(jd)
    })

    $("#nav-arrow-prev").click(function () {
        flyPrev(jd)
    })

    sevanMap.addEventListener('click', function (ev) {
        console.log(ev.latlng.lat, ev.latlng.lng)
    });

}

function flyFirst(jd) {
    showModal(jd[0])
}

function flyNext(jd) {
    const prevStepCoords = jd[currentIndex].geometry.coordinates
    const nextStepData = getNextStep(jd)
    const routePoints = nextStepData.nextPaths
    currentIndex = nextStepData.nextPoint
    $(modal).fadeOut()

    repositeMap(prevStepCoords, jd)
    runAnimatedMarker(routePoints, jd)

}


function flyPrev(jd) {
    const prevStepCoords = jd[currentIndex].geometry.coordinates
    const nextStepData = getPrevStep(jd)
    const routePoints = nextStepData.nextPaths
    currentIndex = nextStepData.nextPoint
    $(modal).fadeOut()

    repositeMap(prevStepCoords, jd)
    runAnimatedMarker(routePoints, jd, true)
}


function repositeMap(prevStepCoords, jd) {
    const points = [prevStepCoords, jd[currentIndex].geometry.coordinates]
    const bounds = new L.LatLngBounds(points)
    sevanMap.fitBounds(bounds, {
        padding: [500, 300]
    })
}


function runAnimatedMarker(routePoints, jd, reverse=false) {
    const lineToFollow = L.polyline(routePoints)
    setTimeout(function () {
        if (Object.keys(animatedMarker).length !== 0) {
            animatedMarker.stop()
            animatedMarker.remove()
        }

        animatedMarker = L.animatedMarker((reverse) ? lineToFollow.getLatLngs().reverse() : lineToFollow.getLatLngs(), {
            interval: calcInterval(lineToFollow)
            , onEnd: function () {
                showModal(jd[currentIndex])
            }
        })
        sevanMap.addLayer(animatedMarker)
    }, 1000)

}


function calcInterval(lineToFollow) {
    const dd = (1 / lineToFollow.getDistance()) * 150
    return dd
}

function showModal(modaldata) {
    const span = $(".close")[0];
    const title = $(".modal-content > h2")
    const content = $(".modal-content > .content-excerpt")
    $(modal).fadeIn("slow")

    $(span).on("click", function () {
        $(modal).css("display", "none")
    })

    $(title).html(modaldata.properties.name)
    $(content).html((modaldata.properties.excerpt) ? modaldata.properties.excerpt : loremIpsum)
}


function getNextStep(jd) {
    function getNextPoint(jd) {
        for (let i = currentIndex + 1; i < jd.length; i++) {
            if (jd[i].geometry.type == "Point") {
                return i
            }
        }
    }

    function getNextPaths(jd) {
        let pathCoordinates = []
        for (let i = currentIndex + 1; i < jd.length; i++) {
            if (jd[i].geometry.type == "LineString") {
                pathCoordinates = pathCoordinates.concat(jd[i].geometry.coordinates)
            }

            if (jd[i].geometry.type == "Point") {
                return pathCoordinates
            }
        }
    }

    return {
        nextPaths: getNextPaths(jd),
        nextPoint: getNextPoint(jd)
    }
}


function getPrevStep(jd){
    function getPrevPoint(jd) {
        for (let i = currentIndex-1; i >= 0; i--) {
            if (jd[i].geometry.type == "Point") {
                console.log(i)
                return i
            }
        }
    }

    function getNextPaths(jd) {
        let pathCoordinates = []
        for (let i = currentIndex-1; i >= 0; i--) {
            if (jd[i].geometry.type == "LineString") {
                pathCoordinates = pathCoordinates.concat(jd[i].geometry.coordinates)
            }

            if (jd[i].geometry.type == "Point") {
                return pathCoordinates
            }
        }
    }

    return {
        nextPaths: getNextPaths(jd),
        nextPoint: getPrevPoint(jd)
    }
}
