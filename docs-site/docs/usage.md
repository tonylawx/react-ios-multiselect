---
sidebar_position: 3
---

# Usage

## Options shape

Each option has a `value` (unique), a `label`, and optional `description`,
`disabled`, and `icon`.

```ts
type SelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode | ((option) => ReactNode);
};
```

## Single vs multi

The same `<Select>` handles both. Omit `multiple` (or pass `false`) for
single-select; pass `multiple` for multi-select. The `value` / `onValueChange`
signature changes accordingly:

| Mode   | `value`       | `onValueChange`           |
| ------ | ------------- | ------------------------- |
| Single | `string`      | `(v: string) => void`     |
| Multi  | `string[]`    | `(v: string[]) => void`   |

### Commit behavior

- **Single-select** commits immediately on tap and closes the sheet.
- **Multi-select** uses a **draft**: opening the sheet copies the controlled
  value into a local draft. Toggling rows only mutates the draft (instant
  visual feedback). The blue ✓ button commits the draft to `onValueChange`;
  ✕ discards it and reverts to the controlled value. This matches native iOS
  multi-select sheets.

## Descriptions

Pass `description` to render secondary text below the label.

```tsx
const options = [
  { value: "AAPL", label: "AAPL", description: "Apple Inc. · NASDAQ" },
  { value: "TSLA", label: "TSLA", description: "Tesla Inc. · NASDAQ" },
];
```

The description is also folded into the row's `aria-label`
(`"AAPL — Apple Inc. · NASDAQ"`) for screen readers and agents.

## Leading icons

Pass `icon` as a `ReactNode` (e.g. an `<img>`) or a render function that
receives the option. The icon renders in a fixed-size slot to the left of the
label, distinct from the trailing selected-state checkmark.

```tsx
// ReactNode
const options = [
  { value: "AAPL", label: "AAPL", icon: <img src="/logos/aapl.svg" alt="" /> },
];

// render function, reused across options
const icon = (o) => <Logo symbol={o.value} />;
const options = symbols.map((s) => ({ ...s, icon }));
```

## Search

The search field shows automatically when `multiple` is set **or** there are
more than 5 options. Force it on/off with the `searchable` prop.

```tsx
<Select searchable options={fewOptions} value={v} onValueChange={setV} />
```

Typing filters by `label`, `value`, and `description` (case-insensitive). When
the result set changes, the list scrolls back to the top.

## Disabled

Disable the whole trigger with `disabled`, or a single option with
`option.disabled`.

```tsx
<Select value={v} onValueChange={setV} options={options} disabled />

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B", disabled: true }, // not toggleable
];
```

## Controlled only

The component is fully controlled — you always own the `value` and decide what
to do in `onValueChange`. There is no internal uncontrolled state to drift out
of sync.
