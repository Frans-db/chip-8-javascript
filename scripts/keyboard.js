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


class LogicKeyboard extends AbstractKeyboard {
    constructor() {
        super();
        // List of currently pressed keys
        this.pressed = [];
        // Function to execute on a key press
        this.onKeyPressFunction = null;
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


class InputKeyboard extends LogicKeyboard {
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
        // Make keyboard functional using keydown/keyup event listeners
        window.addEventListener('keydown', (event) => {
            const key = this.keymap[event.key];
            if (key != undefined) {
                console.log(key);
                this.onKeyDown(key);
            }
        })
        window.addEventListener('keyup', (event) => {
            const key = this.keymap[event.key];
            if (key != undefined) {
                console.log(key);
                this.onKeyUp(key);
            }
        })
    }
}


class HTMLKeyboard extends LogicKeyboard {
    constructor(buttonName, activeClass, inactiveClass) {
        super();
        // Prefix of buttons
        this.buttonName = buttonName;
        this.activeClass = activeClass;
        this.inactiveClass = inactiveClass;

        for (let buttonIndex = 0; buttonIndex <= 0xF; buttonIndex++) {
            const buttonId = `${this.buttonName}-${buttonIndex}`
            const button = document.getElementById(buttonId);
            // Gotta do some funky stuff with timers to keep detecting a press
            button.addEventListener('mousedown', (_) => {
                this.onKeyDown(buttonIndex);
            })
            // TODO(Frans): This will fail when the user takes their mouse off of the button without releasing their press
            button.addEventListener('mouseup', (_) => {
                this.onKeyUp(buttonIndex);
            })
        }
    }

    /**
     * Register a button press and change the class on the button that got pressed
     * @param {number} key 
     */
    onKeyDown(key) {
        this.toggleClass(key, this.activeClass, this.inactiveClass);
        super.onKeyDown(key);
    }
    
    /**
     * Register a button release and change the class on the button that got released
     * @param {number} key 
     */
    onKeyUp(key) {
        this.toggleClass(key, this.inactiveClass, this.activeClass);
        super.onKeyUp(key);
    }
    
    /**
     * Add a class to a button and remove another class
     * @param {number} buttonIndex 
     * @param {string} classToAdd 
     * @param {string} classToRemove 
     */
    toggleClass(buttonIndex, classToAdd, classToRemove) {
        const buttonId = `${this.buttonName}-${buttonIndex}`
        const button = document.getElementById(buttonId);
        button.classList.add(classToAdd);
        button.classList.remove(classToRemove);
    }
}


class Keyboard {
    
}