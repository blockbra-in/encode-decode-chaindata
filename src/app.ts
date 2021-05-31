import Artwork from "./lib/artwork";
import { Compressor } from "./lib/compressor";
import { Terminal } from "./lib/terminal";

const arg = process.argv[2];

export class App {
    terminal: Terminal = new Terminal();
    artwork: Artwork = new Artwork(this.terminal);
    compressor: Compressor = new Compressor();

    constructor(argument: string) {
        this.convert(argument);
    }

    convert(content) {
        const asciiConversion = content.substring(2);
        const byteArray = this.compressor.parseHexString(asciiConversion);
        const bitmap = this.compressor.decompress(byteArray);
        const formatted = this.artwork.format(bitmap);
        this.terminal.send(formatted + '\r\n');
    }
}

const app = new App(arg);
