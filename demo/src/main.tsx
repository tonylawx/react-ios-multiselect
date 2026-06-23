import React from "react";
import ReactDOM from "react-dom/client";

import "react-ios-multiselect/style.css";
import { Select } from "react-ios-multiselect";

const FEATURED = ["SMH", "NVDA", "AAPL", "SPCX", "TQQQ"];

const OPTIONS = [
  ...FEATURED.map((symbol) => ({
    value: symbol,
    label: symbol,
    description: `${symbol} · US`,
  })),
  ...Array.from({ length: 1_995 }, (_, i) => {
    const symbol = `TEST${String(i + 1).padStart(4, "0")}`;
    return { value: symbol, label: symbol, description: `${symbol} · US` };
  }),
];

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        borderRadius: 9999,
        border: "1px solid var(--rios-color-line)",
        background: "var(--rios-color-trigger-bg)",
        color: "var(--rios-color-text)",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label} ✕
    </button>
  );
}

function App() {
  const [selected, setSelected] = React.useState<string[]>(FEATURED);
  const [single, setSingle] = React.useState("put");

  return (
    <main
      style={{
        maxWidth: 448,
        margin: "0 auto",
        padding: "56px 20px 96px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 28, margin: 0, color: "var(--rios-color-text)" }}>
        react-ios-multiselect
      </h1>
      <p style={{ color: "var(--rios-color-muted)", marginTop: 8 }}>
        2,000 options — test open / close, search, and scroll. On mobile, the
        keyboard stays open while you tap rows.
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 24,
          background: "rgba(255,255,255,0.7)",
          border: "1px solid var(--rios-color-line)",
        }}
      >
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "var(--rios-color-text)" }}>
          Multi-select
        </h2>
        <Select
          multiple
          value={selected}
          onValueChange={setSelected}
          options={OPTIONS}
          placeholder="Select symbols"
          mobileTitle="Select symbols"
          searchPlaceholder="Search symbols"
          emptyText="No matching symbols"
          selectedCountLabel={(count) => `${count} selected`}
          aria-label="Select symbols"
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {selected.map((symbol) => (
            <Chip
              key={symbol}
              label={symbol}
              onRemove={() =>
                setSelected((cur) => cur.filter((s) => s !== symbol))
              }
            />
          ))}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected([])}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--rios-color-muted)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                padding: "8px 12px",
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      <section
        style={{
          marginTop: 16,
          padding: 20,
          borderRadius: 24,
          background: "rgba(255,255,255,0.7)",
          border: "1px solid var(--rios-color-line)",
        }}
      >
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "var(--rios-color-text)" }}>
          Single-select
        </h2>
        <Select
          value={single}
          onValueChange={setSingle}
          options={[
            { value: "put", label: "Sell Put" },
            { value: "call", label: "Sell Call" },
            { value: "long_leaps", label: "Long LEAPS" },
          ]}
          searchable={false}
          mobileTitle="Strategy"
          aria-label="Select strategy"
        />
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
