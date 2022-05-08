// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// const display = new Display(ctx, 8);
// const keyboard = new Keyboard();
// const debug = new Debugger(true);
// const cpu = new CPU(display, keyboard, debug);
// const loader = new Loader(cpu);

// function step() {
//     cpu.step();
//     window.requestAnimationFrame(step);
// }
// // window.requestAnimationFrame(step);
const test = new HTMLKeyboard("button", "buttonActive", "buttonInactive");