class AbstractKeyboard {
    constructor() {
        if (this.constructor == AbstractKeyboard) {
            throw new Error(`Cannot instantiate abstract class ${this.constructor.name}`)
        }
    }

    /**
     * 
     * @abstract
     * @param {number} key 
     */
    onKeyDown(key) {throw new Error(`Cannot execute method on abstract class ${this.constructor.name}`)}
    
    /**
     * 
     * @abstract
     * @param {number} key 
     */
    onKeyUp(key) {throw new Error(`Cannot execute method on abstract class ${this.constructor.name}`)}
    
    /**
     * 
     * @abstract
     * @param {number} key 
     */
    isPressed(key) {throw new Error(`Cannot execute method on abstract class ${this.constructor.name}`)}
    
    /**
     * 
     * @abstract
     * @param {function} func 
     */
    setOnkeyPressed(func) {throw new Error(`Cannot execute method on abstract class ${this.constructor.name}`)}
}

class BasicKeyboard extends AbstractKeyboard {
    keymap = {
        '1': 0x1,
        '2': 0x2,
        '3': 0x3,
        '4': 0xc,
        'q': 0x4,
        'w': 0x5,
        'e': 0x6,
        'r': 0xD,
        'a': 0x7,
        's': 0x8,
        'd': 0x9,
        'f': 0xE,
        'z': 0xA,
        'x': 0x0,
        'c': 0xB,
        'v': 0xF
    }

    constructor() {
        super();
        // List of currently pressed keys
        this.pressed = [];
        // Function to execute on a key press
        this.onKeyPressFunction = null;
        this.initializeEvents();
    }

    initializeEvents() {
        window.addEventListener('keydown', (event) => {
            const key = this.keymap[event.key];
            if (key != undefined) {
                this.onKeyDown(event.key);
            }
        })
        window.addEventListener('keyup', (event) => {
            const key = this.keymap[event.key];
            if (key != undefined) {
                this.onKeyUp(event.key);
            }
        })
    }

    /**
     * Add a key to the pressed array if it does not already exist
     * and execute the onKeyPressFunction if it is not null
     * @param {number} key 
     */
    onKeyDown(key) {
        if (this.onKeyPressFunction != null) {
            this.onKeyPressFunction(key);
            this.onKeyPressFunction = null;
        }
        if (!this.pressed.includes(key)) {
            this.pressed.push(key);
        }
    }

    /**
     * Remove a key from the pressed array if it exists
     * Adapted from https://stackoverflow.com/a/5767357
     * @param {number} key 
     */
    onKeyUp(key) {
        const index = this.pressed.indexOf(key);
        if (index > -1) {
            this.pressed.splice(index, 1);
        }
    }

    /**
     * Returns if a key is pressed
     * @param {number} key 
     * @returns boolean
     */
    isPressed(key) {
        return this.pressed.includes(key);
    }

    /**
     * Set the onKeyPressFunction variable
     * @param {function} func 
     */
    setOnkeyPressed(func) {
        this.onKeyPressFunction = func;
    }
}

class HTMLKeyboard extends BasicKeyboard {
    constructor(buttonIdentifier, activeClass, inactiveClass) {
        super();
        // List of currently pressed keys
        this.pressed = [];
        // Function to execute on a key press
        this.onKeyPressFunction = null;
        // Prefix of buttons
        this.buttonIdentifier = buttonIdentifier;
        this.activeClass = activeClass;
        this.inactiveClass = inactiveClass;
        this.initializeButtons();
    }

    initializeButtons() {
        for (let i = 0; i <= 0xF; i++) {
            const buttonId = `${this.buttonIdentifier}-${i}`
            const button = document.getElementById(buttonId);
        }
    }

    onKeyDown(key) {
        console.log(key);
        super.onKeyDown(key);
    }
    
    onKeyUp(key) {
        super.onKeyUp(key);
    }

    isPressed(key) {
        super.isPressed(key);
    }

    setOnkeyPressed(func) {
        super.setOnkeyPressed(func);
    }
}