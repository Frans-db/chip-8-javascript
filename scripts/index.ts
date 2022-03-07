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
}

class CPU {
    private memory: Uint8Array;    // 4096 bytes
    private registers: Uint8Array; // 16 bytes. 0xF is flag register
    private stack: Uint16Array;    // 16 16-bit values

    private I: number;  // 16-bit memory address register
    private pc: number; // 16-bit program counter register
    private sp: number; // 8-bit stack pointer register

    private delay: number; // 8-bit delay register
    private sound: number; // 8-bit sound register

    private display: Display;

    constructor() {
        this.memory = new Uint8Array(4096);
        this.registers = new Uint8Array(16);
        this.stack = new Uint16Array(16);

        this.I = 0;
        this.pc = 0x200;
        this.sp = 0;

        this.delay = 0;
        this.sound = 0;

        this.display = new Display();

        this.loadSprites();
    }

    step() {
        const opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
        this.executeOpcode(opcode);
    }

    executeOpcode(opcode: number) {
        // TODO (Frans): The current way RET and CALL work makes it so the first address of the stack is never used.
        // this is according to the specification, but should this be changed?
        this.increasePC();
        const start = (opcode & 0xF000) >> 12;
        const end = (opcode & 0x000F);
        const x = (opcode & 0x0F00);
        const y = (opcode & 0x00F0);
        const nnn = (opcode & 0x0FFF);
        const kk = (opcode & 0x00FF);

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
                    case 0x2: // 8xy2 - XOR Vx, Vy
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
            case 0xD: // Dyxn - DRW Vx, Vy, nibble
                break;
            case 0xE:
                switch (kk) {
                    case 0x9E: // Ex9E - SKP Vx
                        break;
                    case 0xA1: // ExA1 - SKNP Vx
                        break;
                }
                break;
            case 0xF:
                switch (kk) {
                    case 0x07:
                        break;
                    case 0x0A:
                        break;
                    case 0x15:
                        break;
                    case 0x18:
                        break;
                    case 0x1E:
                        break;
                    case 0x29:
                        break;
                    case 0x33:
                        break;
                    case 0x55:
                        break;
                    case 0x65:
                        break;
                }
                break;
        }
    }

    increasePC() {
        this.pc += 2;
        this.pc = this.pc & 0xFFFF;
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
}

const cpu = new CPU();
const display = new Display();