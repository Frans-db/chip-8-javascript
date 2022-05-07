class CPU {
    memory;    // 4096 8-bit values
    registers; // 16 8-bit values. 0xF is flag register
    stack;    // 16 16-bit values

    I;  // 16-bit memory address register
    pc; // 16-bit program counter register
    sp; // 8-bit stack pointer register

    dt; // 8-bit delay register
    st; // 8-bit sound register

    display; // Display object
    keyboard; // Keyboard object
    debug;

    paused; // Boolean, is execution paused

    constructor(display, keyboard, debug) {
        this.memory = new Uint8Array(4096);
        this.registers = new Uint8Array(16);
        this.stack = new Uint16Array(16);

        this.I = 0;
        this.pc = 0x200; // ProgramCounter starts at 0x200, before this is sprite storage
        this.sp = 0;

        this.dt = 0;
        this.st = 0;

        this.paused = false;

        this.display = display;
        this.keyboard = keyboard;
        this.debug = debug;

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

    /**
     * Simulate the execution of an opcode. The opcode is a 2 byte integer
     * @param {number} opcode 
     */
    executeOpcode(opcode) {
        // TODO (Frans): The current way RET and CALL work makes it so the first address of the stack is never used.
        // this is according to the specification, but should this be changed?
        this.debug.printOpcode(opcode);
        console.log(opcode);
        this.increasePC();
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
                        this.display.clear();
                        this.display.drawToCanvas();
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
                this.display.drawToCanvas();
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
                        this.keyboard.setOnKeyPress((key) => {
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

    /**
     * Load a program into the memory starting at 0x200
     * @param {Array} program 
     */
    loadProgram(program) {
        for (let i = 0; i < program.length; i++) {
            this.memory[0x200 + i] = program[i];
        }
    }

    /**
     * Load sprites into the first memory addresses
     */
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