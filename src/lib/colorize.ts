
export function colorize(str: string, colorNum: number, bg?: number) {
    const fgCode = '\u001b[38;5;' + colorNum + 'm';
    const bgCode = bg ? '\u001b[48;5;' + bg + 'm' : '';
    const clear = '\u001b[0m';
    return (fgCode + bgCode + str + clear);
}

export function colorize4bit(str: string, colorNum: number, bg?: number) {
    const fgVal = colorNum < 8 ? '3' + colorNum.toString() : '1;3' + (colorNum - 8).toString();
    const fgCode = '\u001b[' + fgVal + 'm';
    const bgCode = bg ? '\u001b[4' + bg + 'm' : '';
    const clear = '\u001b[0m';
    return (fgCode + bgCode + str + clear);
}
