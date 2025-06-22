import MinObject from "./min-object.type";

export type RenderMap<T extends MinObject> = {
  [K in keyof Partial<T>]: (item: T[K], object: T) => React.ReactNode
}
