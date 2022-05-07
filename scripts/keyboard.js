class Keyboard {
    pressed;
    onNextKeyPress;

    constructor() {
        this.pressed = [];
        this.onNextKeyPress = null;
    }

    /**
     * Add a key to the pressed array
     * @param {number} key 
     */
    onKeyDown(key) {
        // If onNextKeyPress is a function execute it and set it back to null
        if (this.onNextKeyPress != null) {
            this.onNextKeyPress(key);
            this.onNextKeyPress = null;
        }

        if (!this.pressed.includes(key)) {
            this.pressed.push(key);
        }
    }

    /**
     * Remove a key from the pressed array
     * @param {number} key 
     */
    onKeyUp(key) {
        if (this.pressed.includes(key)) {
            const index = this.pressed.indexOf(key);
            this.pressed.splice(index, 1);
        }  
    }

    /**
     * Is key pressed
     * @param {number} key 
     * @returns {boolean} is key pressed or not
     */
    isPressed(key) {
        return this.pressed.includes(key);
    }

    /**
     * Sets the function to be executed on the next keypress
     * @param {function} func - Sets the function to execute on the next key press
     */
    setOnKeyPress(func) {
        this.onNextKeyPress = func;
    }
}