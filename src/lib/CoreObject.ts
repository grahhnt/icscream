export class CoreObject<T extends string = string> {
  type: T;
  lines: (LineItem | CoreObject)[] = [];

  constructor(type: T, lines: (LineItem | CoreObject)[]) {
    this.type = type;
    this.lines = lines;
  }

  get(key: string): LineItem[];
  get(key: string, single: true): LineItem | undefined;
  get(key: string, single: boolean = false) {
    const items: LineItem[] = this.lines.filter((l) => l instanceof LineItem);

    return items[single ? "find" : "filter"]((l) => l.get("name") === key);
  }

  set(key: string, value: string) {
    const existing = this.get(key, true);

    if (existing) {
      existing.set(value);
      return;
    }

    this.lines.push(new LineItem(key, value));
  }

  add(child: CoreObject): void;
  add(...args: ConstructorParameters<typeof LineItem>): void;
  add(...args: [CoreObject] | ConstructorParameters<typeof LineItem>) {
    if (args.length === 1) {
      this.lines.push(args[0]);
    } else {
      this.lines.push(new LineItem(...args));
    }
  }

  delete(key: string): void;
  delete(instance: LineItem | CoreObject): void;
  delete(keyOrInstance: string | LineItem | CoreObject) {
    if (typeof keyOrInstance === "string") {
      this.lines = this.lines.filter((l) => l.get("name") !== keyOrInstance);
    } else {
      this.lines.splice(this.lines.indexOf(keyOrInstance), 1);
    }
  }

  toString(): string {
    return [
      "BEGIN:" + this.type,
      ...this.lines.map((l) => l.toString()),
      "END:" + this.type,
    ].join("\r\n");
  }
}

export class LineItem {
  private name: string;
  private value: string;
  private attributes: Record<string, string> = {};

  static fromString(input: string): LineItem {
    const [key, ...value] = input.split(":");
    const [name, ...attributesRaw] = key.split(";");
    const attributes = Object.fromEntries(
      attributesRaw.map((attr) => attr.split("="))
    );

    return new LineItem(name, value.join(":"), attributes);
  }

  constructor(
    name: string,
    value: string,
    attributes: Record<string, string> = {}
  ) {
    this.name = name;
    this.value = value;
    this.attributes = attributes;
  }

  get(): string;
  get(property: "name"): string;
  get(property: "*"): string;
  get(property: string): string;
  get(property?: string) {
    if (!property) return this.value;
    if (property === "name") return this.name;
    if (property === "*") return this.attributes;
    return this.attributes[property];
  }

  set(value: string): void;
  set(property: "name", value: string): void;
  set(property: "*", value: Record<string, string>): void;
  set(property: string, value: string): void;
  set(propertyOrValue: string, value?: string | Record<string, string>) {
    if (typeof value === "undefined") {
      this.value = propertyOrValue;
      return;
    }
    if (propertyOrValue === "*" && typeof value === "object") {
      this.attributes = value;
      return;
    }
    if (typeof value === "string") {
      if (propertyOrValue === "name") {
        this.name = value;
        return;
      }

      this.attributes[propertyOrValue] = value;
    }
  }

  toString() {
    let out = this.name;
    if (Object.keys(this.attributes).length > 0) {
      out +=
        ";" +
        Object.entries(this.attributes).map(
          ([key, value]) => key + "=" + value
        );
    }
    out += ":" + this.value;
    return out;
  }
}
