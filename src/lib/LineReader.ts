export class LineReader {
  constructor(private input: string) {}

  next() {
    if (!this.input) return null;

    let index = this.input.indexOf("\r\n");
    if (index === -1) index = this.input.length;

    const output = this.input.slice(0, index);
    this.input = this.input.substring(index + 2);
    return output;
  }

  slurp(until: string) {
    let output: string[] = [];

    let line: string | null;
    while ((line = this.next())) {
      if (line === until) break;
      output.push(line);
    }

    return output.join("\r\n");
  }
}
