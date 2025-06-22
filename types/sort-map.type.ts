import MinObject from "./min-object.type";

export type SortMap<T extends MinObject> = {
  [K in keyof Partial<T>]: (first: T[K], second: T[K]) => number
}
