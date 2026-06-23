---
sidebar_position: 2
---

# Getting started

Install the package, import the stylesheet once, and render a `<Select>`.

## Install

```bash
bun add react-ios-multiselect
# or
npm install react-ios-multiselect
# or
yarn add react-ios-multiselect
# or
pnpm add react-ios-multiselect
```

**Peer dependencies:** `react` ≥ 18 and `react-dom` ≥ 18. There are no other
runtime dependencies.

## Import the stylesheet

Import the global stylesheet **once** at your app root (e.g. in `App.tsx`,
`_app.tsx`, or your layout component). It defines the `--rios-*` theme
variables and the prefixed `rios-*` classes.

```ts
import "react-ios-multiselect/style.css";
```

:::note
The stylesheet is intentionally not imported by the JS entry — you opt in
explicitly so the global CSS is always deliberate.
:::

## Your first select

### Single-select

```tsx
import { useState } from "react";
import { Select } from "react-ios-multiselect";

export function Example() {
  const [strategy, setStrategy] = useState("put");
  return (
    <Select
      value={strategy}
      onValueChange={setStrategy}
      options={[
        { value: "put", label: "Sell Put" },
        { value: "call", label: "Sell Call" },
        { value: "long_leaps", label: "Long LEAPS" },
      ]}
      searchable={false}
    />
  );
}
```

### Multi-select

```tsx
const [symbols, setSymbols] = useState<string[]>(["AAPL", "NVDA"]);

<Select
  multiple
  value={symbols}
  onValueChange={setSymbols}
  options={options}
  placeholder="Select symbols"
  searchPlaceholder="Search symbols"
  emptyText="No matching symbols"
/>;
```

That's it. Head to [Usage](./usage) for icons, descriptions, theming, and more.
