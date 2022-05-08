class Loader {
    constructor(cpu) {
        this.local = ["Breakout", "Maze", "Clock"];
        this.inputElementId = "rom-upload";
        this.input = null;
        this.cpu = cpu;
    }

    getInputElement() {
        this.input = document.getElementById(this.inputElementId);
    }

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
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    loadUploadedROM() {
        if (!this.input) {
            this.getInputElement();
        }
        if (!this.input.files) {
            return;
        }
        const file = this.input.files[0];
        const reader = new FileReader();
    
        reader.onload = function() {
            const result = reader.result
            const program = new Uint8Array(result.length);
            for (let i = 0; i < result.length; i++) {
                program[i] = result.charCodeAt(i);
            }
            this.cpu.loadProgram(program);
        }
        reader.readAsBinaryString(file);
    }

    /**
     * Not sure about this one yet
     * @param {string} url 
     */
    loadROMFromUrl(url) {

    }
}