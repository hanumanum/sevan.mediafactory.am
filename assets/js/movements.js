class Movements {
    constructor(jd) {
        this.jd = jd
        this.currentIndex = 0
    }

    getIndex() {
        this.currentIndex
    }

    flyTo(index, indexBasedCallback) {
        if(index == this.currentIndex){
            return
        }

        this.currentIndex = index
        const nextStep = this.jd[this.currentIndex].geometry.coordinates
        flyAndSetMarker(nextStep, this.currentIndex)
        indexBasedCallback(index)
    }

    flyFirst() {
        const nextStep = this.jd[this.currentIndex].geometry.coordinates
        flyAndSetMarker(nextStep, 0)
    }


    flyNext() {
        this.currentIndex++
        if (this.currentIndex == this.jd.length) {
            this.currentIndex = this.jd.length - 1
            return
        }

        const nextStep = this.jd[this.currentIndex].geometry.coordinates
        flyAndSetMarker(nextStep, this.currentIndex)
    }

    flyPrev() {
        this.currentIndex--
        if (this.currentIndex == -1) {
            this.currentIndex = 0
            return
        }

        const nextStep = this.jd[this.currentIndex].geometry.coordinates
        flyAndSetMarker(nextStep, this.currentIndex)
    }
}


function flyAndSetMarker(nextStep, currentIndex) {
    L.marker(nextStep).addTo(sevanMap);
    sevanMap.flyTo(nextStep, CONFIG.finalZoom, {
        animate: true,
        duration: CONFIG.flyToDuration / 1000
    })
}
