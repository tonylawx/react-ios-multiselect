import * as React from "react";
import { Select } from "react-ios-multiselect";
import type { SelectOption } from "react-ios-multiselect";
import "react-ios-multiselect/style.css";

const SYMBOLS: SelectOption[] = [
  { value: "AAPL", label: "AAPL", description: "Apple Inc. · NASDAQ" },
  { value: "NVDA", label: "NVDA", description: "NVIDIA Corp. · NASDAQ" },
  { value: "TSLA", label: "TSLA", description: "Tesla Inc. · NASDAQ" },
  { value: "MSFT", label: "MSFT", description: "Microsoft Corp. · NASDAQ" },
  { value: "AMZN", label: "AMZN", description: "Amazon.com Inc. · NASDAQ" },
  { value: "GOOGL", label: "GOOGL", description: "Alphabet Inc. · NASDAQ" },
  { value: "META", label: "META", description: "Meta Platforms · NASDAQ" },
];

const STRATEGIES: SelectOption[] = [
  { value: "put", label: "Sell Put" },
  { value: "call", label: "Sell Call" },
  { value: "long_leaps", label: "Long LEAPS" },
];

/** Single-select demo. */
export function SingleDemo() {
  const [v, setV] = React.useState("put");
  return (
    <Select
      value={v}
      onValueChange={setV}
      options={STRATEGIES}
      searchable={false}
      mobileTitle="Strategy"
      aria-label="Strategy"
    />
  );
}

/** Multi-select demo with search. */
export function MultiDemo() {
  const [v, setV] = React.useState<string[]>(["AAPL", "NVDA"]);
  return (
    <Select
      multiple
      value={v}
      onValueChange={setV}
      options={SYMBOLS}
      placeholder="Select symbols"
      mobileTitle="Select symbols"
      searchPlaceholder="Search symbols"
      emptyText="No matching symbols"
      selectedCountLabel={(n) => `${n} selected`}
      aria-label="Symbols"
    />
  );
}

/** Demo with leading icons (text badges as stand-ins for logos). */
const ICONS: SelectOption[] = [
  { value: "AAPL", label: "AAPL", description: "Apple Inc.", icon: <Badge>🍎</Badge> },
  { value: "TSLA", label: "TSLA", description: "Tesla Inc.", icon: <Badge>🚗</Badge> },
  { value: "NVDA", label: "NVDA", description: "NVIDIA", icon: <Badge>💚</Badge> },
];
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 18, lineHeight: 1, display: "inline-block" }}>
      {children}
    </span>
  );
}
export function IconDemo() {
  const [v, setV] = React.useState<string[]>(["AAPL"]);
  return (
    <Select
      multiple
      value={v}
      onValueChange={setV}
      options={ICONS}
      placeholder="Select symbols"
      mobileTitle="With icons"
      selectedCountLabel={(n) => `${n} selected`}
    />
  );
}

/** Disabled trigger demo. */
export function DisabledDemo() {
  return (
    <Select
      value="put"
      onValueChange={() => {}}
      options={STRATEGIES}
      disabled
      aria-label="Disabled"
    />
  );
}

/** Theming demo: overrides --rios-color-accent to purple via a wrapper. */
export function ThemedDemo() {
  const [v, setV] = React.useState<string[]>(["AAPL"]);
  return (
    <div style={{ ["--rios-color-accent" as string]: "#7c3aed", ["--rios-color-selected" as string]: "#7c3aed" }}>
      <Select
        multiple
        value={v}
        onValueChange={setV}
        options={SYMBOLS}
        placeholder="Select symbols"
        mobileTitle="Purple theme"
        selectedCountLabel={(n) => `${n} selected`}
      />
    </div>
  );
}
