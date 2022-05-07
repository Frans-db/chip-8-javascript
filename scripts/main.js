const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const display = new Display(ctx, 8);
const keyboard = new Keyboard();
const debug = new Debugger(true);
const cpu = new CPU(display, keyboard, debug);
const loader = new Loader();

function step() {
    cpu.step();
    // window.requestAnimationFrame(step);
}


cpu.loadProgram([
    0x60, 0x05
])
console.log(cpu.memory);
console.log(cpu.pc);
console.log(cpu.registers)
cpu.step();
loader.loadLocalROM("Maze", cpu);
// window.requestAnimationFrame(step);