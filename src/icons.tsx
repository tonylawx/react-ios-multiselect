import * as React from "react";

/**
 * Inline SVG icons — zero dependency replacements for lucide-react.
 * Each accepts standard SVG props (className, strokeWidth) so the call sites
 * in select.tsx are unchanged. Stroke = currentColor; fill = none (checkmark
 * glyph fills via its container).
 */

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function Svg({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function ChevronDownIcon({ size, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function SearchIcon({ size, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

export function XIcon({ size, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  );
}

/** Checkmark used inside the filled circle — stroke only, color via currentColor. */
export function CheckIcon({ size, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}
