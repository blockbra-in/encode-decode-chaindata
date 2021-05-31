export class UtfToAscii {

    static stringToAsciiByteArray(str) {
        const bytes = [];
        for (let i = 0; i < str.length; ++i) {
            const charCode = str.charCodeAt(i);
            if (charCode > 0xFF) {  // char > 1 byte since charCodeAt returns the UTF-16 value
                throw new Error('Character ' + String.fromCharCode(charCode) + ' can\'t be represented by a US-ASCII byte.');
            }
            bytes.push(charCode);
        }
        return Buffer.from(bytes);
    }
    static convert(str) {
        return this.stringToAsciiByteArray(str);
    }

}
