class Display {
    width;
    heigth;
    display;

    constructor() {
        this.width = 64;
        this.height = 32;
        this.clearDisplay();
    }

    /**
     * Sets the display array to all zeroes
     */
    clearDisplay() {
        this.display = new Array(this.width);
        for (let i = 0; i < this.display.length; i++) {
            this.display[i] = new Array(this.height);
            this.display[i].fill(0);
        }
    }

    /**
     * Toggle the pixel at coordinates (x,y)
     * @param {number} x - x coordinate of pixel
     * @param {number} y - y coordinate of pixel
     * @returns {boolean} - collision, if pixel (x,y) was already set to 1
     */
    drawPixel(x, y) {
        const boundedX = x % this.width;
        const boundedY = y % this.height;
        const collision = this.display[boundedX][boundedY] == 1;
        this.display[boundedX][boundedY] ^= 1;
        return collision;
    }
}