import MinObject from "./min-object.type";

export type KeyMap<T extends MinObject> = {
  [K in keyof Partial<T>]: string
}
