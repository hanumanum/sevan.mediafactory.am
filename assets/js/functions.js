let currentIndex = 0
let animatedMarker = {}
let loremIpsum = "լոռեմ իպսում դոլոռ սիթ ամեթ, ին ուսու վեռիթուս դելեծթուս, աութեմ հոմեռո պոսսիթ եի եոս. պռոբաթուս հենդռեռիթ պեռսեքուեռիս եսթ եու. պռո ութ վիռիս ոմնես պեռպեթուա. ան քուո գլոռիաթուռ ուլլամծոռպեռ ծոնսեքուունթուռ, եոս ելոքուենթիամ նեծեսսիթաթիբուս ին. եսթ դիծո իռիուռե եխպլիծառի եա, թամքուամ քուաեռենդում սիթ նո."
const modal = $("#infomodal");

function drawJorney(jorneyData) {
    for (let i = 0; i < jorneyData.length; i++) {
        if (jorneyData[i].geometry.type == "Point") {
            L.marker([jorneyData[i].geometry.coordinates[0], jorneyData[i].geometry.coordinates[1]], { icon: iconCircle })
                .addTo(sevanMap);
        }

        else if (jorneyData[i].geometry.type == "LineString") {
            L.polyline(jorneyData[i].geometry.coordinates, { color: CONFIG.color, weight: CONFIG.lineHeight, smoothFactor: 1 })
                .addTo(sevanMap);
        }
    }
}

function processJorney(jorneyData) {
    const jd = jorneyData.features
    drawJorney(jd)
    processStart(jd)
    initEvents(jd)
    showStarted()
}

function showStarted() {
    $("#start-jorney").trigger("click")
}

function processStart(jd) {
    $("#start-jorney, #nav-arrow-start").click(function (e) {
        e.preventDefault()
        $("#overlay").slideUp("slow", function () {
            //mov.flyNext()
            $(".nav-arrows").fadeIn("slow")
        })
    })
}

class Movements {
    constructor(jd) {
        this.jd = jd
        this.currentIndex = 0
        this.runmodal = true
    }

    flyFirst() {
        if (this.currentIndex != 0) {
            return
        }

        const nextStep = this.jd[this.currentIndex].geometry.coordinates
        const modaldata = this.jd[this.currentIndex]
        flyAndSetMarker(nextStep)
        showModal(modaldata)
    }


    flyNext() {
        this.currentIndex++
        if (this.currentIndex == this.jd.length) {
            this.currentIndex = this.jd.length - 1
            return
        }

        const nextStep = this.jd[this.currentIndex].geometry.coordinates
        const modaldata = this.jd[this.currentIndex]

        flyAndSetMarker(nextStep)
        showModal(modaldata)
    }

    flyPrev() {
        this.currentIndex--
        if (this.currentIndex == -1) {
            this.currentIndex = 0
            return
        }

        const nextStep = this.jd[this.currentIndex].geometry.coordinates
        const modaldata = this.jd[this.currentIndex]
        flyAndSetMarker(nextStep)
        showModal(modaldata)

    }
}


function flyAndSetMarker(nextStep) {
    L.marker(nextStep).addTo(sevanMap);
    sevanMap.flyTo(nextStep, CONFIG.finalZoom, {
        animate: true,
        duration: CONFIG.flyToDuration / 1000
    })
}


function showModal(modaldata) {
    $(modal).hide()

    const span = $(".close")[0];
    const title = $(".modal-content > h2")
    const content = $(".modal-content > .content-excerpt")

    $(title).html(modaldata.properties.name)
    $(content).html((modaldata.properties.excerpt) ? modaldata.properties.excerpt : loremIpsum)

    $(span).on("click", function () {
        $(modal).css("display", "none")
    })

    setTimeout(function () {
        $(modal).fadeIn("slow")
    }, CONFIG.flyToDuration)
}


function initEvents(jd) {
    const _jd = jd.filter(function (d) {
        return d.geometry.type == "Point"
    })

    const mov = new Movements(_jd)
    setTimeout(function () {
        mov.flyFirst()
    }, 3000)


    $("#nav-arrow-prev").click(function () {
        mov.flyNext()
    })

    $("#nav-arrow-next").click(function () {
        mov.flyPrev()
    })


    let scrolling = true
    $("#sevanmap").bind('mousewheel', function (event) {
        event.preventDefault()

        if (!scrolling)
            return

        if (event.originalEvent.wheelDelta >= 0) {
            mov.flyPrev()
        }
        else {
            mov.flyNext()
        }

        scrolling = false
        setTimeout(function () {
            scrolling = true
        }, CONFIG.flyToDuration)


    });


    sevanMap.addEventListener('click', function (ev) {
        console.log(ev.latlng.lat, ev.latlng.lng)
    });

}

function makeMap() {
    const sevanMap = L.map('sevanmap', {
        scrollWheelZoom: false,
        zoomControl: false,
        tileSize: 20
    })
    sevanMap.setView([CONFIG.center.lat, CONFIG.center.lng], CONFIG.center.zoomLevel)

    L.tileLayer(tileUrl, {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        edgeBufferTiles: CONFIG.edgeBufferTiles,
        reuseTiles: true
    }).addTo(sevanMap);

    return sevanMap
}

function makeCircleMarker(){
    return L.divIcon({
        className: 'circle-marker',
        iconSize: [CONFIG.iconsize, CONFIG.iconsize]
    });
}