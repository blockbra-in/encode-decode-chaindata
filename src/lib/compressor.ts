import * as pako from 'pako';

export class Compressor {
    stringToBytes(str) {
        let bytes = [];
        for (let i = 0; i < str.length; ++i) {
            const code = str.charCodeAt(i);
            bytes = bytes.concat([code]);
        }
        return bytes;
    }

    bytesToString(bytes) {
        let str = '';
        for (let i = 1; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return str;
    }
    toHexString(bytes) {
        let result;
        for (let hex = [], i = 0; i < bytes.length; i++) {
            // tslint:disable-next-line:no-bitwise
            hex.push((bytes[i] >>> 4).toString(16));
            // tslint:disable-next-line:no-bitwise
            hex.push((bytes[i] & 0xF).toString(16));
            result = hex;
        }
        return result.join('');
    }

    parseHexString(hex: string): Uint8Array {
        const bytes = [];
        for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return Uint8Array.from(bytes);
    }

    toHexArray(byteArray) {
        return Array.from(byteArray, (byte: any) => {
            // tslint:disable-next-line:no-bitwise
            let str = (byte & 0xFF).toString(16).slice(-2);
            if (str.length % 2 === 0) {
                str = '0x' + str;
            } else {
                str = '0x0' + str;
            }
            return str;
        });
    }

    compress(bitmap) {
        const height = bitmap.length;  // get the height, can divide by total string length to get rows.
        const result = { fgs: [], bgs: [], chars: [] };

        const pixels = [];
        bitmap.forEach(row => {
            row.forEach(pixel => {
                pixels.push(pixel);
            });
        });
        pixels
            .forEach(pixel => {
                const char = pixel.char.charCodeAt(0)
                if (char > 255 || pixel.color > 255 || pixel.bg > 255) {
                    throw new Error(('cant encode characters greater than 8 bits'));
                } else {
                    result.fgs.push(pixel.color);
                    result.bgs.push(pixel.bg);
                    result.chars.push(char);
                }
            })
        const originalSize = result.fgs.length + result.bgs.length + result.chars.length;
        const compressedData = pako.deflate(Uint8Array.from([height].concat(result.fgs, result.bgs, result.chars)));
        return compressedData;
    }


    prepBitmapArrForSubmit(bitmapArr) {
        return '0x' + this.toHexString(this.compress(bitmapArr));

    }

    decompress(compressedBitmap: Uint8Array): any[] {
        let arr: number[];
        try {
            arr = Array.from(pako.inflate(compressedBitmap));
            const height = arr.shift() as number;
            const slicepoint = arr.length / 3;
            const fgs = arr.slice(0, slicepoint);
            const bgs = arr.slice(slicepoint, slicepoint * 2);
            const chars = arr.slice(slicepoint * 2, slicepoint * 3);
            const width = chars.length / height;
            const result = [];
            let rowNum = 0;
            let row = [];
            for (let pixel = 0; pixel <= chars.length; pixel++) {
                if (pixel % width === 0 && pixel !== 0) {
                    result.push(row);
                    rowNum++;
                    row = [];
                }
                row.push({ color: fgs[pixel], bg: bgs[pixel], char: String.fromCharCode(chars[pixel]) })
            }
            return result;
        } catch (err) {
            console.error('Decompression Error ', err);
            console.error('Compressed Bitmap ', compressedBitmap);
            return [[]];
        }
    }
}
