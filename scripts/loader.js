class Loader {
    local = ["Breakout", "Maze", "Clock"];

    loadLocalROM(name) {
        const url = `/roms/${name}.ch8`;
        fetch(url)
            .then(response => {
                response.text()
                .then(body => {
                    const program = new Uint8Array(body.length);
                    for (let i = 0; i < body.length; i++) {
                        program[i] = body.charCodeAt(i);
                    }
                    console.log(program);
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    loadUploadedROM(input) {

    }

    /**
     * Not sure about this one yet
     * @param {string} url 
     */
    loadROMFromUrl(url) {

    }
}