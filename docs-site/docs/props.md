---
sidebar_position: 8
---

# Props reference

## `Select`

The component is a discriminated union: `SingleProps` when `multiple` is
omitted/`false`, `MultiProps` when `multiple` is `true`. TypeScript narrows
`value` / `onValueChange` automatically.

### Common props (`SelectBaseProps`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SelectOption[]` | — | The option list. |
| `searchable` | `boolean` | `multiple ‖ options.length > 5` | Show the search field. |
| `placeholder` | `string` | — | Trigger text when empty. |
| `searchPlaceholder` | `string` | — | Search field placeholder. |
| `emptyText` | `string` | — | Empty-results message. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `mobileTitle` | `string` | `placeholder` | Sheet header title. |
| `mobileSetLabel` | `string` | `"Set"` | Multi confirm button `aria-label`. |
| `mobileCancelLabel` | `string` | `"Cancel"` | Cancel button `aria-label`. |
| `mobileDoneLabel` | `string` | `"Done"` | Single-select close button `aria-label`. |
| `selectedCountLabel` | `(n: number) => string` | `${n} selected` | Trigger summary when > 2 selected (multi). |
| `className` | `string` | — | Extra class on the trigger. |
| `aria-label` | `string` | — | Accessible label for the trigger. |

### Single-select (`SingleProps`)

| Prop | Type |
| --- | --- |
| `multiple` | `false` (optional) |
| `value` | `string` |
| `onValueChange` | `(v: string) => void` |

### Multi-select (`MultiProps`)

| Prop | Type |
| --- | --- |
| `multiple` | `true` |
| `value` | `string[]` |
| `onValueChange` | `(v: string[]) => void` |

## `SelectOption`

```ts
type SelectOption = {
  value: string;            // unique key
  label: string;            // row label
  description?: string;     // secondary text + folded into aria-label
  disabled?: boolean;       // row is not toggleable
  icon?: ReactNode | ((option: SelectOption) => ReactNode);  // leading icon
};
```

## Exported helpers

The pure logic is exported for advanced consumers building a custom UI on the
same primitives:

- `OPTION_ROW_HEIGHT`, `OPTION_OVERSCAN`, `computeVirtualOptionRange`, `optionListSignature` (from `select-virtual`)
- `computeMobileSheetLayout` (from `select-layout`)

## TypeScript example

```tsx
import { Select, type SelectOption, type SingleProps, type MultiProps } from "react-ios-multiselect";

// single — value is string
const single: SingleProps = {
  value: "put",
  onValueChange: (v: string) => {},
  options: [] as SelectOption[],
};

// multi — value is string[]
const multi: MultiProps = {
  multiple: true,
  value: ["AAPL"],
  onValueChange: (v: string[]) => {},
  options: [] as SelectOption[],
};
```
