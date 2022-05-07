const display = new Display();
const keyboard = new Keyboard();
const cpu = new CPU(display, keyboard);
const loader = new Loader();

loader.loadLocalROM("Breakout");