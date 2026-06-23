import { afterEach, describe, expect, test, mock } from "bun:test";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { Select } from "../src/select";
import type { SelectOption } from "../src/select";

// DOM globals + matchMedia/ResizeObserver/visualViewport are registered by
// tests/setup.ts (happy-dom preload) before this file is imported.

afterEach(() => {
  cleanup();
});

const FRUITS: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", description: "Dark & sweet" },
];

// Select defers single/multi commit by SHEET_TRANSITION_MS (220ms) so the
// slide-out animation isn't blocked by the parent re-render. waitFor covers it.
const COMMIT_DELAY = 300;

describe("Select — rendering", () => {
  test("renders the trigger showing the current single value's label", () => {
    render(<Select value="apple" onValueChange={() => {}} options={FRUITS} />);
    expect(screen.getByRole("button", { expanded: false })).toBeTruthy();
    expect(screen.getByRole("button").textContent).toContain("Apple");
  });

  test("shows the placeholder when no value is set", () => {
    render(
      <Select value="" onValueChange={() => {}} options={FRUITS} placeholder="Pick one" />
    );
    expect(screen.getByRole("button").textContent).toContain("Pick one");
  });

  test("multi-select trigger joins up to two labels", () => {
    render(
      <Select
        multiple
        value={["apple", "banana"]}
        onValueChange={() => {}}
        options={FRUITS}
      />
    );
    expect(screen.getByRole("button").textContent).toContain("Apple, Banana");
  });

  test("multi-select trigger summarizes count when more than two", () => {
    render(
      <Select
        multiple
        value={["apple", "banana", "cherry"]}
        onValueChange={() => {}}
        options={FRUITS}
        selectedCountLabel={(n) => `${n} picked`}
      />
    );
    expect(screen.getByRole("button").textContent).toContain("3 picked");
  });
});

describe("Select — open & options", () => {
  test("trigger opens the sheet and lists option rows with data-rios-option-value", () => {
    render(<Select value="" onValueChange={() => {}} options={FRUITS} />);
    fireEvent.click(screen.getByRole("button"));
    const apple = document.querySelector('[data-rios-option-value="apple"]');
    expect(apple).toBeTruthy();
    expect(document.querySelectorAll("[data-rios-option-value]").length).toBe(3);
  });

  test("trigger carries data-state reflecting open/closed", () => {
    render(<Select value="" onValueChange={() => {}} options={FRUITS} />);
    const trigger = document.querySelector("[data-rios-select-trigger]") as HTMLElement;
    expect(trigger.getAttribute("data-state")).toBe("closed");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("data-state")).toBe("open");
  });

  test("option rows expose aria-label and aria-selected", () => {
    render(<Select value="apple" onValueChange={() => {}} options={FRUITS} />);
    fireEvent.click(screen.getByRole("button"));
    const cherry = document.querySelector('[data-rios-option-value="cherry"]') as HTMLElement;
    expect(cherry.getAttribute("aria-label")).toBe("Cherry — Dark & sweet");
    expect(cherry.getAttribute("aria-selected")).toBe("false");
    const apple = document.querySelector('[data-rios-option-value="apple"]') as HTMLElement;
    expect(apple.getAttribute("aria-selected")).toBe("true");
  });

  test("sheet, overlay, confirm and cancel carry data-rios-* hooks", () => {
    render(
      <Select multiple value={["apple"]} onValueChange={() => {}} options={FRUITS} />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(document.querySelector("[data-rios-sheet]")).toBeTruthy();
    expect(document.querySelector("[data-rios-overlay]")).toBeTruthy();
    expect(document.querySelector("[data-rios-confirm]")).toBeTruthy();
    expect(document.querySelector("[data-rios-cancel]")).toBeTruthy();
  });

  test("single-select has no confirm button (only cancel/close)", () => {
    render(<Select value="" onValueChange={() => {}} options={FRUITS} />);
    fireEvent.click(screen.getByRole("button"));
    expect(document.querySelector("[data-rios-confirm]")).toBeNull();
    expect(document.querySelector("[data-rios-cancel]")).toBeTruthy();
  });
});

describe("Select — interaction", () => {
  test("single-select fires onValueChange with the tapped value (after close transition)", async () => {
    const onChange = mock<(v: string) => void>(() => {});
    render(<Select value="" onValueChange={onChange} options={FRUITS} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(document.querySelector('[data-rios-option-value="banana"]')!);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("banana"), {
      timeout: COMMIT_DELAY,
    });
  });

  test("multi-select does NOT commit on row tap; commit happens via confirm button", async () => {
    const onChange = mock<(v: string[]) => void>(() => {});
    render(
      <Select multiple value={["apple"]} onValueChange={onChange} options={FRUITS} />
    );
    fireEvent.click(screen.getByRole("button"));
    // tapping banana toggles the draft but should not call onValueChange yet
    fireEvent.click(document.querySelector('[data-rios-option-value="banana"]')!);
    expect(onChange).not.toHaveBeenCalled();
    // the row should reflect the draft selection state immediately
    expect(
      document
        .querySelector('[data-rios-option-value="banana"]')!
        .getAttribute("data-selected")
    ).toBe("true");
    // confirming commits (deferred by the slide-out transition)
    fireEvent.click(document.querySelector("[data-rios-confirm]")!);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(["apple", "banana"]), {
      timeout: COMMIT_DELAY,
    });
  });

  test("disabled trigger cannot open the sheet", () => {
    render(<Select value="" onValueChange={() => {}} options={FRUITS} disabled />);
    const trigger = screen.getByRole("button");
    expect(trigger.hasAttribute("disabled")).toBe(true);
    fireEvent.click(trigger);
    // The trigger must stay closed.
    expect(trigger.getAttribute("data-state")).toBe("closed");
    const sheet = document.querySelector("[data-rios-sheet]") as HTMLElement | null;
    if (sheet) {
      // The sheet shell may be mounted (display:none until opened), but it must
      // never report open=true for a disabled trigger.
      expect(sheet.getAttribute("data-open")).toBe("false");
    }
  });

  test("disabled option is not interactive", () => {
    const opts: SelectOption[] = [
      { value: "a", label: "A" },
      { value: "b", label: "B", disabled: true },
    ];
    render(<Select value="a" onValueChange={() => {}} options={opts} />);
    fireEvent.click(screen.getByRole("button"));
    const b = document.querySelector('[data-rios-option-value="b"]') as HTMLButtonElement;
    expect(b.disabled).toBe(true);
  });
});

describe("Select — search", () => {
  test("typing into the search input filters the option list", async () => {
    render(
      <Select
        value=""
        onValueChange={() => {}}
        options={FRUITS}
        searchable
        searchPlaceholder="Search"
      />
    );
    fireEvent.click(screen.getByRole("button"));
    const input = document.querySelector(
      "[data-rios-search-input]"
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: "ban" } });
    // deferred query updates after a tick
    await waitFor(() => {
      expect(document.querySelector('[data-rios-option-value="banana"]')).toBeTruthy();
      expect(document.querySelector('[data-rios-option-value="apple"]')).toBeNull();
    });
  });
});

describe("Select — icon slot", () => {
  test("renders option.icon ReactNode to the left of the label", () => {
    const opts: SelectOption[] = [
      { value: "a", label: "Apple", icon: <img alt="" src="/a.png" data-testid="a-icon" /> },
      { value: "b", label: "Banana" },
    ];
    render(<Select value="" onValueChange={() => {}} options={opts} />);
    fireEvent.click(screen.getByRole("button"));
    const rowA = document.querySelector('[data-rios-option-value="a"]')!;
    const iconSlot = rowA.querySelector(".rios-option-icon");
    expect(iconSlot).toBeTruthy();
    expect(iconSlot!.querySelector("img")).toBeTruthy();
    // row without icon has no icon slot
    const rowB = document.querySelector('[data-rios-option-value="b"]')!;
    expect(rowB.querySelector(".rios-option-icon")).toBeNull();
  });

  test("renders option.icon as a function receiving the option", () => {
    const renderer = (o: SelectOption) => (
      <span data-testid={`icon-${o.value}`}>{o.value[0]}</span>
    );
    const opts: SelectOption[] = [
      { value: "a", label: "Apple", icon: renderer },
      { value: "b", label: "Banana", icon: renderer },
    ];
    render(<Select value="" onValueChange={() => {}} options={opts} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("icon-a")).toBeTruthy();
    expect(screen.getByTestId("icon-b")).toBeTruthy();
  });
});
