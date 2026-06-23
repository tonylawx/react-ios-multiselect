import { clsx, type ClassValue } from "clsx";

/**
 * Tiny className combiner. Built on clsx only — no tailwind-merge, since this
 * package ships plain CSS Modules rather than Tailwind utility classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
