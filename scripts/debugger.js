class Debugger {
    enabled

    constructor(enabled) {
        this.enabled = enabled;
    }

    printOpcode(opcode) {
        if (!this.enabled) {
            return;
        }
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