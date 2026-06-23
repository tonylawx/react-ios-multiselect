/**
 * Tiny className combiner. Joins truthy class values (string | false | null |
 * undefined). Zero dependencies — no clsx, no tailwind-merge.
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  let out = "";
  for (const v of inputs) {
    if (v) {
      out += out ? " " + v : v;
    }
  }
  return out;
}
