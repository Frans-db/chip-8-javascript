class Display {
    width;
    heigth;
    display;

    constructor() {
        this.width = 64;
        this.height = 32;
        this.display = new Array(this.width);
        for (let i = 0; i < this.display.length; i++) {
            this.display[i] = new Array(this.height);
            this.display[i].fill(0);
        }
    }

    test() {
        console.log("display test!");
    }
}