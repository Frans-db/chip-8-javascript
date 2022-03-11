class Display {
    private width: number;
    private height: number;
    private display: number[][];

    constructor() {
        this.width = 64;
        this.height = 32;
        this.display = new Array(this.width);
        for (let i = 0; i < this.display.length; i++) {
            this.display[i] = new Array(this.height);
            this.display[i].fill(0);
        }
    }

    clear() {
        this.display = new Array(this.width);
        for (let i = 0; i < this.display.length; i++) {
            this.display[i] = new Array(this.height);
            this.display[i].fill(0);
        }
    }

    drawPixel(x: number, y: number): boolean {
        const boundedX = x % this.width;
        const boundedY = y % this.height;
        const collision = this.display[boundedX][boundedY] == 1;
        this.display[boundedX][boundedY] ^= 1;
        return collision;
    }

    getDisplay(): number[][] {
        return this.display;
    }
}

class Keyboard {
    private pressed: Array<number>;
    private onNextKeyPress: Function | null;

    constructor() {
        this.pressed = [];
        this.onNextKeyPress = null;
    }

    onKeyDown(key: number) {
        if (this.onNextKeyPress) {
            this.onNextKeyPress(key);
            this.onNextKeyPress = null;
        }

        if (!this.pressed.includes(key)) {
            this.pressed.push(key);
        }
    }

    onKeyUp(key: number) {
        if (this.pressed.includes(key)) {
            const index = this.pressed.indexOf(key);
            this.pressed.splice(index, 1);
        }  
    }

    isPressed(key: number) {
        return this.pressed.includes(key);
    }

    setOnKeyPress(func: Function) {

    }
}

class Debugger {
    enabled: boolean

    constructor(enabled: boolean) {
        this.enabled = enabled;
    }

    printOpcode(opcode: number) {
        const start = (opcode & 0xF000) >> 12;
        const end = (opcode & 0x000F);
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;
        const nnn = (opcode & 0x0FFF);
        const kk = (opcode & 0x00FF);

        switch (start) {
            case 0x0:
                switch (nnn) {
                    case 0x0E0: // 00E0 - CLS
                        console.log('00E0 - CLS');
                        break;
                    case 0x0EE: // 00EE - RET
                        console.log('00EE - RET');
                        break;
                }
                break;
            case 0x1: // 1nnn - JP addr
                console.log(`1${nnn} - JP ${nnn}`);
                break;
            case 0x2: // 2nnn - CALL addr
                console.log(`2${nnn} - CALL ${nnn}`);
                break;
            case 0x3: // 3xkk - SE Vx, byte
                console.log(`3${x}${kk} - SE V${x}, ${kk}`);
                break;
            case 0x4: // 4xkk - SNE Vx, byte
                console.log(`3${x}${kk} - SNE ${x} V${x}, ${kk}`);
                break;
            case 0x5: // 5xy0 - SE Vx, Vy
                console.log(`5${x}${y}0 - SE V${x}, V${y}`);
                break;
            case 0x6: // 6xkk - LD Vx, byte
                console.log(`6${x}${kk} - LD V${x}, ${kk}`);
                break;
            case 0x7: // 7xkk - ADD Vx, byte
                console.log(`7${x}${kk} - ADD V${x}, ${kk}`);
                break;
            case 0x8:
                switch (end) {
                    case 0x0: // 8xy0 - LD Vx, Vy
                        console.log(`8${x}${y}0 - LD V${x}, V${y}`);
                        break;
                    case 0x1: // 8xy1 - OR Vx, Vy
                        console.log(`8${x}${y}1 - OR V${x}, V${y}`);
                        break;
                    case 0x2: // 8xy2 - AND Vx, Vy
                        console.log(`8${x}${y}2 - AND V${x}, V${y}`);
                        break;
                    case 0x3: // 8xy3 - XOR Vx, Vy
                        console.log(`8${x}${y}3 - XOR V${x}, V${y}`);
                        break;
                    case 0x4: // 8xy4 - ADD Vx, Vy
                        console.log(`8${x}${y}4 - ADD V${x}, V${y}`);
                        break;
                    case 0x5: // 8xy5 - SUB Vx, Vy
                        console.log(`8${x}${y}5 - SUB V${x}, V${y}`);
                        break;
                    case 0x6: // 8xy6 - SHR Vx (, Vy)
                        console.log(`8${x}${y}6 - SHR V${x}, (, V${y})`);
                        break;
                    case 0x7: // 8xy7 - SUBN Vx, Vy
                        console.log(`8${x}${y}7 - SUBN V${x}, V${y}`);
                        break;
                    case 0xE: // 8xyE - SHL Vx (, Vy)
                        console.log(`8${x}${y}E - SHL V${x}, (, V${y})`);
                        break;
                }
                break;
            case 0x9: // 9xy0 - SNE Vx, Vy
                console.log(`9${x}${y}0 - SNE V${x}, V${y}`);
                break;
            case 0xA: // Annn - LD I, addr
                console.log(`A${nnn} - LD I, ${nnn}`);
                break;
            case 0xB: // Bnnn - JP V0, addr
                console.log(`B${nnn} - JP V0, ${nnn}`);
                break;
            case 0xC: // Cxkk - RND Vx, byte
                console.log(`C${x}${kk} - RND V${x}, ${kk}`);
                break;
            case 0xD: // Dxyn - DRW Vx, Vy, nibble
                console.log(`D${x}${y}${end} - DRW V${x}, V${y}, ${end}`);
                break;
            case 0xE:
                switch (kk) {
                    case 0x9E: // Ex9E - SKP Vx
                        console.log(`E${x}9E - SKP V${x}`);
                        break;
                    case 0xA1: // ExA1 - SKNP Vx
                        console.log(`E${x}A1 - SKNP V${x}`);
                        break;
                }
                break;
            case 0xF:
                switch (kk) {
                    case 0x07: // Fx07 - LD Vx, DT
                        console.log(`F${x}07 - LD V${x}, DT`);
                        break;
                    case 0x0A: // Fx0A - LD Vx, K
                        console.log(`F${x}0A - LD V${x}, K`);
                        break;
                    case 0x15: // Fx15 - LD DT, Vx
                        console.log(`F${x}15 - LD DT, V${x}`);
                        break;
                    case 0x18: // Fx18 - LD ST, Vx
                        console.log(`F${x}18 - LD ST, V${x}`);
                        break;
                    case 0x1E: // Fx1E - ADD I, Vx
                        console.log(`F${x}1E - ADD I, V${x}`);
                        break;
                    case 0x29: // Fx29 - LD F, Vx
                        console.log(`F${x}29 - LD F, V${x}`);
                        break;
                    case 0x33: // Fx33 - LD B, Vx
                        console.log(`F${x}33 - LD B, V${x}`)
                        break;
                    case 0x55: // Fx55 - LD [I], Vx
                        console.log(`F${x}55 - LD [I], V${x}`)
                        break;
                    case 0x65: // Fx65 = LD Vx, [I]
                        console.log(`F${x}65 - LD V${x}, [I]`)
                        break;
                }
                break;
        }
    }
}

class CPU {
    private memory: Uint8Array;    // 4096 8-bit values
    private registers: Uint8Array; // 16 8-bit values. 0xF is flag register
    private stack: Uint16Array;    // 16 16-bit values

    private I: number;  // 16-bit memory address register
    private pc: number; // 16-bit program counter register
    private sp: number; // 8-bit stack pointer register

    private dt: number; // 8-bit delay register
    private st: number; // 8-bit sound register

    private display: Display; // Virtual keyboard
    private keyboard: Keyboard; // Virtual display
    private debugger: Debugger;

    private paused: boolean;

    constructor(display: Display, keyboard: Keyboard, cpuDebugger: Debugger) {
        this.memory = new Uint8Array(4096);
        this.registers = new Uint8Array(16);
        this.stack = new Uint16Array(16);

        this.I = 0;
        this.pc = 0x200;
        this.sp = 0;

        this.dt = 0;
        this.st = 0;

        this.paused = false;

        this.display = display;
        this.keyboard = keyboard;
        this.debugger = cpuDebugger;

        this.loadSprites();
    }

    step() {
        if (this.paused) {
            return;
        }
        if (this.dt > 0) {
            this.dt -= 1;
        }
        if (this.st > 0) {
            this.st -= 1;
        }
        const opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
        this.executeOpcode(opcode);
    }

    executeOpcode(opcode: number) {
        // TODO (Frans): The current way RET and CALL work makes it so the first address of the stack is never used.
        // this is according to the specification, but should this be changed?
        this.increasePC();
        const start = (opcode & 0xF000) >> 12;
        const end = (opcode & 0x000F);
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;
        const nnn = (opcode & 0x0FFF);
        const kk = (opcode & 0x00FF);

        this.debugger.printOpcode(opcode);

        switch (start) {
            case 0x0:
                switch (nnn) {
                    case 0x0E0: // 00E0 - CLS
                        this.display.clear();
                        break;
                    case 0x0EE: // 00EE - RET
                        this.pc = this.stack[this.sp];
                        this.sp = (this.sp - 1) & 0xFF;
                        break;
                }
                break;
            case 0x1: // 1nnn - JP addr
                this.pc = nnn;
                break;
            case 0x2: // 2nnn - CALL addr
                this.sp = (this.sp + 1) & 0xFF;
                this.stack[this.sp] = this.pc;
                this.pc = nnn;
                break;
            case 0x3: // 3xkk - SE Vx, byte
                if (this.registers[x] == kk) {
                    this.increasePC();
                }
                break;
            case 0x4: // 4xkk - SNE Vx, byte
                if (this.registers[x] != kk) {
                    this.increasePC();
                }
                break;
            case 0x5: // 5xy0 - SE Vx, Vy
                if (this.registers[x] == this.registers[y]) {
                    this.increasePC();
                }
                break;
            case 0x6: // 6xkk - LD Vx, byte
                this.registers[x] = kk;
                break;
            case 0x7: // 7xkk - ADD Vx, byte
                this.registers[x] += kk;
                break;
            case 0x8:
                switch (end) {
                    case 0x0: // 8xy0 - LD Vx, Vy
                        this.registers[x] = this.registers[y];
                        break;
                    case 0x1: // 8xy1 - OR Vx, Vy
                        this.registers[x] |= this.registers[y];
                        break;
                    case 0x2: // 8xy2 - AND Vx, Vy
                        this.registers[x] &= this.registers[y];
                        break;
                    case 0x3: // 8xy3 - XOR Vx, Vy
                        this.registers[x] ^= this.registers[y];
                        break;
                    case 0x4: // 8xy4 - ADD Vx, Vy
                        const addResult = this.registers[x] + this.registers[y];
                        this.registers[x] = addResult;
                        this.registers[0xF] = (addResult > 255) ? 1 : 0;
                        break;
                    case 0x5: // 8xy5 - SUB Vx, Vy
                        this.registers[0xF] = (this.registers[x] > this.registers[y]) ? 1 : 0;
                        this.registers[x] = this.registers[x] - this.registers[y];
                        break;
                    case 0x6: // 8xy6 - SHR Vx (, Vy)
                        this.registers[0xF] = this.registers[x] & 0x1;
                        this.registers[x] >>= 1;
                        break;
                    case 0x7: // 8xy7 - SUBN Vx, Vy
                        this.registers[0xF] = (this.registers[y] > this.registers[x]) ? 1 : 0;
                        this.registers[x] = this.registers[y] - this.registers[x];
                        break;
                    case 0xE: // 8xyE - SHL Vx (, Vy)
                        this.registers[0xF] = this.registers[x] & 0x80;
                        this.registers[x] <<= 1;
                        break;
                }
                break;
            case 0x9: // 9xy0 - SNE Vx, Vy
                if (this.registers[x] != this.registers[y]) {
                    this.increasePC();
                }
                break;
            case 0xA: // Annn - LD I, addr
                this.I = nnn;
                break;
            case 0xB: // Bnnn - JP V0, addr
                this.I = nnn + this.registers[0];
                break;
            case 0xC: // Cxkk - RND Vx, byte
                const rnd = Math.floor(Math.random() * 256);
                this.registers[x] = rnd & kk
                break;
            case 0xD: // Dxyn - DRW Vx, Vy, nibble
                let collision = false;
                for (let i = 0; i < end; i++) {
                    let value = this.memory[this.I + i];
                    for (let j = 0; j < 8; j++) {
                        const pixel = value & 0x80;
                        if (pixel) {
                            if (this.display.drawPixel(this.registers[x] + j, this.registers[y] + i)) {
                                collision = true;
                            }
                        }
                        value <<= 1;
                    }
                    this.registers[0xF] = collision ? 1 : 0; 
                }
                break;
            case 0xE:
                switch (kk) {
                    case 0x9E: // Ex9E - SKP Vx
                        if (this.keyboard.isPressed(this.registers[x])) {
                            this.increasePC();
                        }
                        break;
                    case 0xA1: // ExA1 - SKNP Vx
                        if (!this.keyboard.isPressed(this.registers[x])) {
                            this.increasePC();
                        }
                        break;
                }
                break;
            case 0xF:
                switch (kk) {
                    case 0x07: // Fx07 - LD Vx, DT
                        this.registers[x] = this.dt;
                        break;
                    case 0x0A: // Fx0A - LD Vx, K
                        this.paused = true;
                        this.keyboard.setOnKeyPress((key: number) => {
                            this.registers[x] = key;
                            this.paused = false;
                        })
                        break;
                    case 0x15: // Fx15 - LD DT, Vx
                        this.dt = this.registers[x];
                        break;
                    case 0x18: // Fx18 - LD ST, Vx
                        this.st = this.registers[x];
                        break;
                    case 0x1E: // Fx1E - ADD I, Vx
                        this.I = this.I + this.registers[x];
                        this.I &= 0xFFFF;
                        break;
                    case 0x29: // Fx29 - LD F, Vx
                        this.I = this.registers[x] * 5;
                        break;
                    case 0x33: // Fx33 - LD B, Vx
                        this.memory[this.I    ] = Math.floor(this.registers[x] / 100);
                        this.memory[this.I + 1] = Math.floor((this.registers[x] % 100) / 10)
                        this.memory[this.I + 2] = Math.floor(this.registers[x] % 10)
                        break;
                    case 0x55: // Fx55 - LD [I], Vx
                        for (let i = 0; i <= x; i++) {
                            this.memory[this.I + i] = this.registers[i];
                        }
                        break;
                    case 0x65: // Fx65 = LD Vx, [I]
                        for (let i = 0; i <= x; i++) {
                            this.registers[i] = this.memory[this.I + i];
                        }
                        break;
                }
                break;
        }
    }

    increasePC() {
        this.pc += 2;
        this.pc = this.pc & 0xFFFF;
    }

    loadProgram(program: Uint8Array) {
        for (let i = 0; i < program.length; i++) {
            this.memory[0x200 + i] = program[i];
        }
    }

    loadSprites() {
        const sprites = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];
        for (let i = 0; i < sprites.length; i++) {
            this.memory[i] = sprites[i];
        }
    }

    toggle() {
        this.paused = !this.paused;
    }
}

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

const keyboard = new Keyboard();
const display = new Display();
const cpuDebugger = new Debugger(true);
const cpu = new CPU(display, keyboard, cpuDebugger);

let program: Uint8Array;

const keymap: {[key: string]: number} = {
    '1': 0x1, // 1
    '2': 0x2, // 2
    '3': 0x3, // 3
    '4': 0xc, // 4
    'q': 0x4, // Q
    'w': 0x5, // W
    'e': 0x6, // E
    'r': 0xD, // R
    'a': 0x7, // A
    's': 0x8, // S
    'd': 0x9, // D
    'f': 0xE, // F
    'z': 0xA, // Z
    'x': 0x0, // X
    'c': 0xB, // C
    'v': 0xF  // V
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
    const key = keymap[event.key];
    if (key) {
        keyboard.onKeyDown(key);
    }
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
    const key = keymap[event.key];
    if (key) {
        keyboard.onKeyUp(key);
    }
})

function toggle() {
    cpu.toggle();
}

function step() {
    if (!ctx) {
        return;
    }

    cpu.step();
    ctx.clearRect(0, 0, 200, 200);
    // render frame
    const displayGrid = display.getDisplay();
    const size = 10;
    for (let i = 0; i < displayGrid.length; i++) {
        const col = displayGrid[i];
        for (let j = 0; j < col.length; j++) {
            if (col[j]) {
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(i * size, j * size, size, size);
            ctx.stroke();
        }
    }
    window.requestAnimationFrame(step);
}

function showFile(input: HTMLInputElement) {
    if (!input.files) {
        return;
    }
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const result = reader.result as string
        program = new Uint8Array(result.length);
        for (let i = 0; i < result.length; i++) {
            program[i] = result.charCodeAt(i);
        }
        display.clear();
        cpu.loadProgram(program);
        window.requestAnimationFrame(step);
    }
    reader.readAsBinaryString(file);
}