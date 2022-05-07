class Display {
    width;
    heigth;
    display;
    scale;
    ctx;

    constructor(ctx, scale) {
        this.width = 64;
        this.height = 32;
        this.scale = scale;
        this.ctx = ctx;
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

    drawToCanvas() {
        for (let i = 0; i < this.display.length; i++) {
            const col = this.display[i];
            for (let j = 0; j < col.length; j++) {
                if (col[j]) {
                    this.ctx.fillStyle = 'black';
                } else {
                    this.ctx.fillStyle = 'rgb(243 244 246)';
                }
                this.ctx.fillRect(i * this.scale, j * this.scale, this.scale, this.scale);
                this.ctx.stroke();
            }
        }
    }
}