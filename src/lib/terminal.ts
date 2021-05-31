import { colorize, colorize4bit } from './colorize';
import { Color } from './colors';
const clear = '\u001b[0m';

export class Terminal {
    color = new Color();
    type = null;
    echo = false;
    tempSubscription: any;

    clearLine() {
        const store = '\u001b7';
        const restore = '\u001b8';
        const deleteLine = '\u001b[2K';
        const cursorUp = '\u001b[1A';
        try {
            if (!this.echo) {
                console.log(store + cursorUp + deleteLine + restore + cursorUp + clear);
            } else {
                console.log(deleteLine);
                console.log('');
            }
        } catch (err) {
            console.error(err);
        }
    }
    colorize(str, num, bg?) {
        if (this.type === 2) { // Plain text
            return str;
        }
        // if (this.sixteenColors) {
        //     num = this.color.downsampleFg(num);
        //     if (bg) {
        //         bg = this.color.downsampleBg(bg);
        //     }
        //     return colorize4bit(str, num, bg);
        // }
        return colorize(str, num, bg);
    }
    clearScreen() {
        const prefix = '\u001bD\u001b[2J';
        console.log(prefix);
        this.resetAttr();
    }
    resetAttr() {
        try {
            console.log(clear);
        } catch (err) {
            console.error(err);
        }
    }
    sendln(msg) {
        try {
            console.log(clear);
            console.log(msg);
        } catch (err) {
            console.error(err);
        }
    }

    send(msg) {
        try {
            console.log(clear);
            console.log(msg);
        } catch (err) {
            console.error(err);
        }

    }
}
