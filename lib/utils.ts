import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const lookForParam = (paramName: string, object: any): any => {
  if (object === null || typeof object !== 'object') {
    return null;
  }

  if (object.hasOwnProperty(paramName)) {
    return object[paramName];
  }

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const result = lookForParam(paramName, object[key]);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}