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
    unifySlidesHeights()
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


function unifySlidesHeights() {
    let tailest = -1
    $.each($(".story-part"), function (index, slide) {
        tailest = Math.max(tailest, $(slide).outerHeight())
    });
    $(".story-part").outerHeight(tailest)
}


function scrollWheel(callback, slider, refresh = 200) {
    if (!callback || typeof callback !== 'function') return;
    let isScrolling;
    window.addEventListener('wheel', handleWheelFunctionality , false);

    function handleWheelFunctionality(event){
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function () {
            callback(event, slider)
        }, refresh);
    }

    return handleWheelFunctionality;
}


function initEvents(jd) {
    const onlyPoints = function (d) {
        return d.geometry.type == "Point"
    }
    const _jd = jd.filter(onlyPoints)
    const mov = new Movements(_jd)

    const slider = $(CONFIG.storyHolderSelector)
        .slick({
            vertical: true,
            swipe: true,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: "#nav-arrow-next",
            nextArrow: "#nav-arrow-prev"
        })


    slider.on("afterChange", function (event, slick, currentSlide, nextSlide) {
        const id = currentSlide
        mov.flyTo(id, handleArrowsBehavior)
    })


    $("#story-container, #mapholder").on("mouseenter", function () {
        stopPageScroll()
        const handleWheelFunctionality = scrollWheel(function (e) {
            if (e.deltaY > 0) {
                slider.slick("slickNext")
            }
            else {
                slider.slick("slickPrev")
            }
        }, slider)


        $("#story-container, #mapholder").on("mouseleave", function () {
            restorePageScroll()
            window.removeEventListener('wheel', handleWheelFunctionality);
        })
    })



    $("#nav-arrow-prev, #nav-arrow-next").hide()

    $("#start-jorney, #nav-arrow-start, #overlay2").on("click", processOverlay2)
    $("#start-jorney, #nav-arrow-start, #overlay2").on("wheel", processOverlay2)
    $("#overlay2").on("swipe", processOverlay2)

    $("#nav-arrow-before-start, #overlay1").on("click", processOverlay1)
    $("#nav-arrow-before-start, #overlay1").on("wheel", processOverlay1)
    $("#overlay1").on("swipe", processOverlay1)

    function processOverlay2(e) {
        $("#overlay0").fadeOut(.5)
        $("#overlay2").slideUp("slow", function () {
            $("#nav-arrow-prev").fadeIn("slow")
            mov.flyFirst()
            //restorePageScroll()
        })
    }

    function processOverlay1(e) {
        $("#overlay1").slideUp("slow")
        $("#story-container").css("opacity", 1)
        $("#overlay2").fadeIn("slow")
        //$("#story-container, #mapholder").trigger("mouseenter")
    }   


    function handleArrowsBehavior(index) {
        if (index == 0) {
            $("#nav-arrow-next").hide()
            $("#nav-arrow-prev").fadeIn("slow")
        }
        else if (index == _jd.length - 1) {
            $("#nav-arrow-next").fadeIn("slow")
            $("#nav-arrow-prev").hide()
        }
        else {
            $("#nav-arrow-prev").fadeIn("slow")
            $("#nav-arrow-next").fadeIn("slow")
        }

    }

}


function multiSlideAdaptiveHeight(slider) {
    let activeSlides = [];
    let tallestSlide = 0;

    setTimeout(function () {
        $('.slick-track .slick-active', slider).each(function (item) {
            activeSlides[item] = $(this).outerHeight();
        });

        activeSlides.forEach(function (item) {

            if (item > tallestSlide) {

                tallestSlide = item;

            }

        });

        $('.slick-list', slider).height(tallestSlide);

    }, 10);

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


function stopPageScroll() {
    $('html, body').css({
        overflow: 'hidden',
        height: '100%'
    });
}

function restorePageScroll() {
    $('html, body').css({
        overflow: 'auto',
        height: 'auto'
    });
}


