import { Terminal } from './terminal';
export default class Artwork {
    constructor(private term: Terminal) { }

    format(content: any[]) {
        if (content && !!content.map) {
            return '\r\n' + content.map(line => {
                return line.map(pixel => {
                    return pixel ? this.term.colorize(pixel.char, pixel.color, pixel.bg) : '';
                }).join('');
            }).join('\r\n');
        } else {
            console.error(typeof content, 'INVALID CONTENT NO MAP METHOD', JSON.stringify(content));
            return '';
        }
    }
}
