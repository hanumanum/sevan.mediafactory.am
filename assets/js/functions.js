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
    makeWholeStory(jd)
    initEvents(jd)
}

function makeWholeStory(allParts, callback) {
    const storyHolder = $(CONFIG.storyHolderSelector)
    allParts.map(function (part, i) {
        storyHolder.append(makeStoryPart(part, i))
    })
}

function makeStoryPart(point, i) {
    const videoHTML = `<div id="video-holder">${getVideoEmbedByUrl(point.properties.video)}</div>`
    const imageHTML = `<a data-lightbox="image-${i}" href="${point.properties.image}"> <img src="${point.properties.image}"> </a>`
    const link = `<a id="see-more" href="${point.properties.more}" target="_blank">Կարդալ Ավելին »</a>`
    const part = `<div id="story-id${i}" class="story-part">
    <div class="story-content">
      ${(point.properties.video != "") ? videoHTML : imageHTML} 
      <h2>${point.properties.name}</h2>
      <div class="content-excerpt">${point.properties.excerpt}</div>
      <div class="authors">${point.properties.authors.join(" , ")}</div>
      ${(point.properties.more != "") ? link : ""}
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
        prevArrow: "#nav-arrow-next",
        nextArrow: "#nav-arrow-prev"
    })

    slider.on("afterChange", function () {
        const id = $(".slick-current.slick-active").attr("id").replace("story-id", "")
        mov.flyTo(id, handleArrowsBehavior)
    })


    $("#nav-arrow-prev, #nav-arrow-next").hide()


    $("#start-jorney, #nav-arrow-start, #overlay2").click(function (e) {
        e.preventDefault()
        $("#overlay2").slideUp("slow", function () {
            $("#nav-arrow-prev").fadeIn("slow")
            mov.flyFirst()
        })
    })

    sevanMap.addEventListener('click', function (ev) {
        console.log(ev.latlng.lat, ev.latlng.lng)
    });

    $("#nav-arrow-before-start, #overlay1").click(function(ev){
        $("#overlay1").slideUp("slow")
        $("#story-container").css("opacity",1)
        $("#overlay2").fadeIn("slow")
    })


    function handleArrowsBehavior(index){
        /*console.clear()
        console.log(index, _jd.length)
        */
        if(index==0){
            $("#nav-arrow-prev").hide()
            $("#nav-arrow-next").fadeIn("slow")
            console.log("0")

        }
        else if(index==_jd.length){
            $("#nav-arrow-prev").fadeIn("slow")
            $("#nav-arrow-next").hide()
            console.log("end")
        }
        else{
            $("#nav-arrow-prev").fadeIn("slow")
            $("#nav-arrow-next").fadeIn("slow")
            console.log("all")
        }

    }

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