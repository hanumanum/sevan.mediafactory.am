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
    makeWholeStories(jd)
    initEvents(jd)
    showStarted()
}

function showStarted() {
    //$("#start-jorney").trigger("click")
}


function makeWholeStories(allParts) {
    const storyHolder = $(CONFIG.storyHolderSelector)
    allParts.map(function (part, i) {
        storyHolder.append(makeStoryPart(part, i))
    })
}



function makeStoryPart(point, i) {
    const videoHTML = `<div id="video-holder">${getVideoEmbedByUrl(point.properties.video)}</div>`
    const imageHTML = `<img src="${point.properties.image}">`
    const part = `<div id="story-id${i}" class="story-part">
    <div class="story-content">
      ${(point.properties.video != "") ? videoHTML : imageHTML} 
      <h2>${point.properties.name}</h2>
      <div class="content-excerpt">${point.properties.excerpt}</div>
      <div class="authors">${point.properties.authors.join(" , ")}</div>
      ${(point.properties.more != "") ? '<a id="see-more" href="" target="_blank">Կարդալ Ավելին »</a>' : ""}
    </div>
  </div>`

    return part;
}


function initEvents(jd) {
    const onlyPoints = function (d) {
        return d.geometry.type == "Point"
    }
    const _jd = jd.filter(onlyPoints)
    const mov = new Movements(_jd)

    const slider = $(CONFIG.storyHolderSelector).slick({
        vertical: true,
        swipe: true,
        infinite: false,
        prevArrow: "#nav-arrow-prev",
        nextArrow: "#nav-arrow-next"
    })

    slider.on("afterChange", function () {
        const id = $(".slick-current.slick-active").attr("id").replace("story-id", "")
        mov.flyTo(id)
    })


    $("#nav-arrow-prev, #nav-arrow-next").hide()

    $(document).keydown(function (e) {
        if (e.keyCode == 40) {
            mov.flyNext()
        }
    });

    $("#start-jorney, #nav-arrow-start").click(function (e) {
        e.preventDefault()
        $("#overlay").slideUp("slow", function () {
            $(".nav-arrows").fadeIn("slow")
            mov.flyFirst()
        })
    })

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
        reuseTiles: true,
        useCache: true,
        //tileSize:250
    }).addTo(sevanMap);

    return sevanMap
}

function makeCircleMarker() {
    return L.divIcon({
        className: 'circle-marker',
        iconSize: [CONFIG.iconsize, CONFIG.iconsize]
    });
}

function getVideoEmbedByUrl(url, width) {
    return '<iframe src="' + url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}