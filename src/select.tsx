"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "./icons";
import { computeMobileSheetLayout } from "./select-layout";
import {
  OPTION_ROW_HEIGHT,
  computeVirtualOptionRange,
  optionListSignature,
} from "./select-virtual";
import {
  createOptionGesture,
  getBottomAccessory,
  moveOptionGesture,
  shouldActivateOptionGesture,
  shouldPreserveSearchFocusOnOptionPointerDown,
  type OptionGesture,
  shouldDeferViewportLayout
} from "./select-interaction";
import { cn } from "./utils";
import { styles } from "./styles";

const SHEET_TRANSITION_MS = 220;

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type SelectBaseProps = {
  options: readonly SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  searchable?: boolean;
  className?: string;
  disabled?: boolean;
  /** Sheet header title. Defaults to placeholder. */
  mobileTitle?: string;
  /** "Set/确认" button label (multi-select). Defaults to "Set". */
  mobileSetLabel?: string;
  /** "Cancel/取消" button label (multi-select). Defaults to "Cancel". */
  mobileCancelLabel?: string;
  /** "Done/完成" button label (single-select). Defaults to "Done". */
  mobileDoneLabel?: string;
  /** Summary text shown on the trigger when more than 2 values are selected
   *  (multi-select only). Defaults to `${count} selected`. */
  selectedCountLabel?: (count: number) => string;
  "aria-label"?: string;
};

export type SingleProps = SelectBaseProps & {
  multiple?: false;
  value: string;
  onValueChange: (value: string) => void;
};

export type MultiProps = SelectBaseProps & {
  multiple: true;
  value: string[];
  onValueChange: (value: string[]) => void;
};

export type SelectProps = SingleProps | MultiProps;

/**
 * Select — a native iOS-feeling select with a keyboard-aware bottom sheet,
 * virtualized rows (2,000+ options scroll smoothly), iOS-native selected state
 * (blue text + filled checkmark), and draft/commit multi-select.
 *
 * Single-select (`multiple` omitted/false) and multi-select (`multiple`) share
 * one component; the prop switches the `value` / `onValueChange` signature and
 * the commit behavior (immediate vs draft-then-Set).
 *
 * Mobile-first: the trigger opens a bottom sheet (no desktop popover path).
 *
 * Styling comes from `select.css` (global, prefixed `rios-`). Theme via the
 * `--rios-*` CSS variables, which all carry sensible defaults on `:root`.
 *
 * Agent-control surface: stable `data-rios-*` attributes on every interactive
 * element so Playwright/agent drivers can locate and drive the component
 * reliably (see docs/components.md).
 *
 * Zero runtime dependencies beyond react/react-dom (peer).
 */
export function Select(props: SelectProps) {
  const {
    options,
    placeholder,
    searchPlaceholder,
    emptyText,
    searchable,
    className,
    disabled,
    mobileTitle,
    mobileSetLabel,
    mobileCancelLabel,
    mobileDoneLabel,
    selectedCountLabel,
  } = props;

  const multiple = props.multiple === true;
  const isSearchable = searchable ?? (multiple || options.length > 5);

  // Header copy (overridable via props; defaults are sensible)
  const sheetTitle = mobileTitle || placeholder || "";
  const tSet = mobileSetLabel || "Set";
  const tCancel = mobileCancelLabel || "Cancel";
  const tDone = mobileDoneLabel || "Done";
  const formatSelectedCount = selectedCountLabel
    ?? ((count: number) => `${count} selected`);

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const searchRef = React.useRef<HTMLInputElement>(null);

  // --- Value helpers ---
  // Multi-select uses a draft: opening the sheet copies the controlled value
  // into `draftSelected`. Toggling only mutates the draft (instant feedback);
  // "Set" commits it to the parent, "Cancel" discards it.
  // Single-select commits after the close animation starts.
  const rawValue = props.value;
  const controlledSelected: string[] = React.useMemo(
    () =>
      multiple
        ? (rawValue as string[])
        : rawValue
          ? [rawValue as string]
          : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawValue, multiple]
  );

  const [draftSelected, setDraftSelected] = React.useState<string[]>(controlledSelected);
  // Tracks whether the sheet DOM is present (open OR sliding out).
  // Rows show the draft as long as the sheet is mounted, so the selection
  // stays visually stable during the close animation (no flash back to the
  // pre-commit controlled value).
  const [sheetMounted, setSheetMounted] = React.useState(false);

  // What the rows currently show: draft while sheet is mounted (multi),
  // otherwise the controlled value.
  const displaySelected = multiple && sheetMounted ? draftSelected : controlledSelected;

  const selectedSet = React.useMemo(() => {
    const set = new Set<string>();
    for (const v of displaySelected) set.add(v);
    return set;
  }, [displaySelected]);

  const isSelected = React.useCallback(
    (val: string) => selectedSet.has(val),
    [selectedSet]
  );

  // --- Value → label map (built once per option list, O(1) lookup) ---
  const labelByValue = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const o of options) m.set(o.value, o.label);
    return m;
  }, [options]);

  // --- Trigger display text (reflects committed value, not the draft) ---
  const triggerText = React.useMemo(() => {
    if (controlledSelected.length === 0) return "";
    if (!multiple) return labelByValue.get(controlledSelected[0]) ?? "";
    if (controlledSelected.length <= 2) {
      return controlledSelected
        .map((v) => labelByValue.get(v) ?? v)
        .join(", ");
    }
    return formatSelectedCount(controlledSelected.length);
  }, [controlledSelected, multiple, labelByValue, formatSelectedCount]);

  // --- Toggle handler ---
  // Multi: mutate draft only — committed with the blue check button.
  // Single: select and close.
  // Stable identity via refs so OptionRow's React.memo short-circuits; only
  // the toggled row re-renders.
  const onValueChange = props.multiple
    ? (props as MultiProps).onValueChange
    : (props as SingleProps).onValueChange;
  const onValueChangeRef = React.useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const draftRef = React.useRef(draftSelected);
  draftRef.current = draftSelected;
  const multipleRef = React.useRef(multiple);
  multipleRef.current = multiple;
  const controlledSelectedRef = React.useRef(controlledSelected);
  controlledSelectedRef.current = controlledSelected;

  const close = React.useCallback(() => {
    searchRef.current?.blur();
    setOpen(false);
  }, []);

  const commitAfterClose = React.useCallback((commit: () => void) => {
    window.setTimeout(commit, SHEET_TRANSITION_MS);
  }, []);

  const handleToggle = React.useCallback((val: string) => {
    if (multipleRef.current) {
      const cur = draftRef.current;
      const next = cur.includes(val)
        ? cur.filter((v) => v !== val)
        : cur.concat(val);
      setDraftSelected(next); // draft-only: committed by the blue check button
    } else {
      const cb = onValueChangeRef.current as (v: string) => void;
      close();
      commitAfterClose(() => cb(val));
    }
  }, [close, commitAfterClose]);

  // --- Multi-select commit / cancel (header buttons) ---
  // Close the sheet FIRST (starts slide-out this frame), then commit to the
  // parent after the transition. A heavy parent re-render would otherwise
  // compete with the slide-out animation and make closing feel delayed.
  const commitMulti = React.useCallback(() => {
    const cb = onValueChangeRef.current as (v: string[]) => void;
    const draft = draftRef.current;
    close();
    commitAfterClose(() => cb(draft));
  }, [close, commitAfterClose]);

  const cancelMulti = React.useCallback(() => {
    close(); // draft is discarded — display reverts to controlled
  }, []);

  // --- Deferred search for smooth typing ---
  const deferredQuery = React.useDeferredValue(query);

  const filteredOptions = React.useMemo(() => {
    if (!isSearchable || !deferredQuery.trim()) return options;
    const q = deferredQuery.toLowerCase();
    const out: SelectOption[] = [];
    for (const o of options) {
      if (
        `${o.label} ${o.value} ${o.description ?? ""}`
          .toLowerCase()
          .includes(q)
      ) {
        out.push(o);
      }
    }
    return out;
  }, [options, deferredQuery, isSearchable]);

  // Identity used to reset the list scroll: changes whenever the *visible*
  // result set's start or size changes — independent of whether the underlying
  // array reference was reused (e.g. empty query returns the same `options`
  // array). Drives OptionList's scroll-to-top reset.
  const optionListKey = optionListSignature(filteredOptions);

  // Prepare the next open after the close animation has finished. Resetting
  // search and draft state here keeps that work out of the user's next click.
  React.useEffect(() => {
    if (open || sheetMounted) return;
    if (query) setQuery("");
    if (multiple) setDraftSelected(controlledSelected);
  }, [controlledSelected, open, multiple, query, sheetMounted]);

  const openSheet = () => {
    setOpen(true);
  };

  // ---- Trigger ----
  const trigger = (
    <button
      type="button"
      className={cn(styles.trigger, className)}
      disabled={disabled}
      data-rios-select-trigger
      data-state={open ? "open" : "closed"}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => {
        if (disabled) return;
        openSheet();
      }}
      {...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {})}
    >
      <span
        className={cn(
          styles.triggerLabel,
          !triggerText && styles.triggerLabelPlaceholder
        )}
      >
        {triggerText || placeholder}
      </span>
      <ChevronDownIcon className={cn(styles.chevron, open && styles.chevronOpen)} />
    </button>
  );

  // ---- Listbox body ----
  const renderBody = () => {
    const bottomAccessory = getBottomAccessory(isSearchable);
    return (
      <div className={cn(styles.sheetBody)}>
        <OptionList
          options={filteredOptions}
          resetKey={optionListKey}
          emptyText={emptyText}
          multiple={multiple}
          isSelected={isSelected}
          onToggle={handleToggle}
          searchInputRef={isSearchable ? searchRef : undefined}
        />
        {bottomAccessory === "search" ? (
          <div className={styles.searchAccessory}>
            <div className={styles.searchAccessoryBar}>
              <SearchIcon className={styles.searchAccessoryIcon} />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className={styles.searchAccessoryInput}
                data-rios-search-input
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  data-rios-clear-search
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                  className={styles.clearBtn}
                >
                  <XIcon className={styles.clearIcon} />
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className={styles.safeAreaSpacer} aria-hidden="true" />
        )}
      </div>
    );
  };

  return (
    <>
      {trigger}
      <Sheet
        open={open}
        onDismiss={multiple ? cancelMulti : close}
        onMountedChange={setSheetMounted}
        title={sheetTitle}
        multiple={multiple}
        onConfirm={multiple ? commitMulti : close}
        onCancel={multiple ? cancelMulti : close}
        confirmLabel={multiple ? tSet : undefined}
        cancelLabel={tCancel}
        doneLabel={tDone}
      >
        {renderBody()}
      </Sheet>
    </>
  );
}

function OptionList({
  options,
  resetKey,
  emptyText,
  multiple,
  isSelected,
  onToggle,
  searchInputRef
}: {
  options: readonly SelectOption[];
  /** When this string changes, the list scrolls back to the top so the user
   *  sees the first match after a search filter or clear. */
  resetKey: string;
  emptyText?: string;
  multiple: boolean;
  isSelected: (value: string) => boolean;
  onToggle: (value: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const latestScrollTopRef = React.useRef(0);
  const optionGestureRef = React.useRef<OptionGesture | null>(null);
  const preserveSearchFocusRef = React.useRef(false);
  const suppressClickValueRef = React.useRef<string | null>(null);
  const suppressClickUntilRef = React.useRef(0);
  const focusReleaseTimerRef = React.useRef<number | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(640);

  React.useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateHeight = () => {
      setViewportHeight(Math.max(OPTION_ROW_HEIGHT, scroller.clientHeight));
    };
    updateHeight();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateHeight);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, []);

  // Reset scroll to top whenever the visible result set changes. We key off
  // `resetKey` (a content signature: first value + count) rather than the
  // `options` reference, because an empty search query reuses the original
  // options array — a reference-stable change that must still scroll up.
  React.useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = 0;
    latestScrollTopRef.current = 0;
    setScrollTop(0);
  }, [resetKey]);

  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (focusReleaseTimerRef.current !== null) {
        window.clearTimeout(focusReleaseTimerRef.current);
      }
    };
  }, []);

  const range = computeVirtualOptionRange({
    itemCount: options.length,
    scrollTop,
    viewportHeight
  });
  const visibleOptions = options.slice(range.startIndex, range.endIndex);

  return (
    <div className={styles.listWrap}>
      <div
        ref={scrollerRef}
        className={cn(styles.list, styles.listScroll)}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        onPointerDownCapture={(event) => {
          if (event.pointerType !== "touch") return;

          suppressClickValueRef.current = null;
          suppressClickUntilRef.current = 0;
          const target = event.target;
          const optionElement = target instanceof Element
            ? target.closest<HTMLButtonElement>("[data-rios-option-value]")
            : null;
          if (!optionElement || optionElement.disabled) return;

          if (focusReleaseTimerRef.current !== null) {
            window.clearTimeout(focusReleaseTimerRef.current);
            focusReleaseTimerRef.current = null;
          }
          const searchFocused = searchInputRef?.current === document.activeElement;
          // Native iOS: tapping a row while the search field is focused must
          // toggle the row without dismissing the keyboard. Focus transfer
          // happens on the compatibility mousedown after pointerdown; calling
          // preventDefault here keeps focus on the input so the keyboard never
          // starts to collapse. Far more reliable on iOS WebKit than blurring
          // and re-focusing from pointerup.
          if (shouldPreserveSearchFocusOnOptionPointerDown({
            optionValue: optionElement.dataset.riosOptionValue ?? null,
            searchFocused
          })) {
            event.preventDefault();
            preserveSearchFocusRef.current = true;
          } else {
            preserveSearchFocusRef.current = false;
          }
          optionGestureRef.current = createOptionGesture({
            pointerId: event.pointerId,
            value: optionElement.dataset.riosOptionValue ?? "",
            clientX: event.clientX,
            clientY: event.clientY,
            scrollTop: event.currentTarget.scrollTop
          });
        }}
        onPointerMoveCapture={(event) => {
          const gesture = optionGestureRef.current;
          if (!gesture || event.pointerType !== "touch") return;
          optionGestureRef.current = moveOptionGesture({
            gesture,
            pointerId: event.pointerId,
            clientX: event.clientX,
            clientY: event.clientY
          });
        }}
        onPointerUpCapture={(event) => {
          const gesture = optionGestureRef.current;
          optionGestureRef.current = null;
          if (!gesture || event.pointerType !== "touch") return;

          const shouldActivate = shouldActivateOptionGesture({
            gesture,
            pointerId: event.pointerId,
            scrollTop: event.currentTarget.scrollTop
          });
          if (!shouldActivate) {
            preserveSearchFocusRef.current = false;
            return;
          }

          // iOS may consume the compatibility click when tapping outside the
          // focused search input to dismiss its keyboard. Activate on the
          // touch pointerup instead, before focusout/visualViewport changes
          // can move or replace the virtualized row.
          event.preventDefault();
          suppressClickValueRef.current = gesture.value;
          suppressClickUntilRef.current = window.performance.now() + 700;
          if (preserveSearchFocusRef.current) {
            searchInputRef?.current?.focus({ preventScroll: true });
          }
          // Keep the focus flag through Safari's delayed compatibility click
          // window. If Safari focuses the option button after pointerup,
          // onFocusCapture below immediately restores the search focus in the
          // same task so the soft keyboard remains open.
          focusReleaseTimerRef.current = window.setTimeout(() => {
            focusReleaseTimerRef.current = null;
            preserveSearchFocusRef.current = false;
          }, 700);
          onToggle(gesture.value);
        }}
        onPointerCancelCapture={() => {
          if (focusReleaseTimerRef.current !== null) {
            window.clearTimeout(focusReleaseTimerRef.current);
            focusReleaseTimerRef.current = null;
          }
          optionGestureRef.current = null;
          preserveSearchFocusRef.current = false;
          suppressClickValueRef.current = null;
          suppressClickUntilRef.current = 0;
        }}
        onFocusCapture={(event) => {
          if (!preserveSearchFocusRef.current) return;
          const target = event.target;
          if (
            target instanceof Element
            && target.closest("[data-rios-option-value]")
          ) {
            searchInputRef?.current?.focus({ preventScroll: true });
          }
        }}
        onClickCapture={(event) => {
          const target = event.target;
          const optionElement = target instanceof Element
            ? target.closest<HTMLButtonElement>("[data-rios-option-value]")
            : null;
          const value = optionElement?.dataset.riosOptionValue;
          const shouldSuppress = Boolean(
            value
            && suppressClickValueRef.current === value
            && window.performance.now() <= suppressClickUntilRef.current
          );
          if (!shouldSuppress) {
            suppressClickValueRef.current = null;
            suppressClickUntilRef.current = 0;
            return;
          }

          // Some browsers still emit click after a prevented pointerup.
          // Suppress that compatibility click so the option toggles once.
          if (focusReleaseTimerRef.current !== null) {
            window.clearTimeout(focusReleaseTimerRef.current);
            focusReleaseTimerRef.current = null;
          }
          suppressClickValueRef.current = null;
          suppressClickUntilRef.current = 0;
          if (preserveSearchFocusRef.current) {
            searchInputRef?.current?.focus({ preventScroll: true });
            preserveSearchFocusRef.current = false;
          }
          event.preventDefault();
          event.stopPropagation();
        }}
        onScroll={(event) => {
          latestScrollTopRef.current = event.currentTarget.scrollTop;
          if (animationFrameRef.current !== null) return;

          animationFrameRef.current = window.requestAnimationFrame(() => {
            animationFrameRef.current = null;
            setScrollTop(latestScrollTopRef.current);
          });
        }}
      >
        {options.length === 0 ? (
          <p className={styles.emptyText}>{emptyText}</p>
        ) : (
          <div className={styles.virtualTrack} style={{ height: range.totalHeight }}>
            <div
              className={styles.virtualWindow}
              style={{ transform: `translate3d(0, ${range.offsetTop}px, 0)` }}
            >
              {visibleOptions.map((option, visibleIndex) => {
                const optionIndex = range.startIndex + visibleIndex;
                return (
                  <OptionRow
                    key={option.value}
                    option={option}
                    selected={isSelected(option.value)}
                    onToggle={onToggle}
                    position={optionIndex + 1}
                    setSize={options.length}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className={styles.listEdgeTop} />
    </div>
  );
}

/**
 * Sheet — keyboard-aware iOS-style selection modal.
 *
 * The shell stays mounted; its content remains present through the close
 * transition. Body scroll lock, ESC and backdrop dismissal are included.
 */
function Sheet({
  open,
  onDismiss,
  onMountedChange,
  children,
  title,
  multiple,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  doneLabel
}: {
  open: boolean;
  onDismiss: () => void;
  onMountedChange?: (displaying: boolean) => void;
  children: React.ReactNode;
  title?: string;
  multiple: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  doneLabel?: string;
}) {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const optionGestureActiveRef = React.useRef(false);
  const optionGestureReleaseTimerRef = React.useRef<number | null>(null);
  const applyViewportLayoutRef = React.useRef<() => void>(() => {});

  const releaseOptionGesture = React.useCallback(() => {
    if (optionGestureReleaseTimerRef.current !== null) {
      window.clearTimeout(optionGestureReleaseTimerRef.current);
    }
    // Pointerup capture runs before click. Release on the next task so the
    // click can toggle the option before any keyboard-driven layout update.
    optionGestureReleaseTimerRef.current = window.setTimeout(() => {
      optionGestureReleaseTimerRef.current = null;
      optionGestureActiveRef.current = false;
      applyViewportLayoutRef.current();
    }, 0);
  }, []);

  React.useEffect(() => {
    return () => {
      if (optionGestureReleaseTimerRef.current !== null) {
        window.clearTimeout(optionGestureReleaseTimerRef.current);
      }
    };
  }, []);

  // The sheet stays in the DOM permanently. `open` drives the slide via CSS
  // classes — NO mount cycle, so open/close are instant. `displaying` lags the
  // close by the slide-out duration so the parent keeps showing the draft
  // while the sheet is still visually sliding away.
  const [displaying, setDisplaying] = React.useState(open);
  const present = open || displaying;

  React.useEffect(() => {
    if (open) {
      setDisplaying(true); // open → show draft immediately
    } else {
      // close → keep draft until slide-out finishes, then drop it
      const t = window.setTimeout(() => setDisplaying(false), SHEET_TRANSITION_MS);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    onMountedChange?.(displaying);
  }, [displaying, onMountedChange]);

  // Keep scroll locked until the slide-out finishes so touches cannot pass
  // through the fading sheet to the page or parent dialog underneath.
  React.useEffect(() => {
    if (!present) return;
    const bodyOverflow = document.body.style.overflow;
    const bodyPaddingRight = document.body.style.paddingRight;
    const htmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.body.style.paddingRight = bodyPaddingRight;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [present]);

  // ESC to close.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onDismiss]);

  // --- Track the visual viewport so the sheet sits above the iOS keyboard. ---
  // On iOS Safari the layout viewport (window.innerHeight) does NOT shrink when
  // the soft keyboard opens; the *visual* viewport does. A fixed bottom-0 sheet
  // would end up behind the keyboard. We expose keyboard-aware bottom offset
  // and max height via CSS vars so the sheet always stays in the visible area.
  const [viewportCssVars, setViewportCssVars] = React.useState<React.CSSProperties>(
    () => multiple ? { height: "85vh" } : {}
  );
  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const apply = () => {
      if (shouldDeferViewportLayout(optionGestureActiveRef.current)) {
        return;
      }
      const activeElement = document.activeElement;
      const keyboardActive = Boolean(
        activeElement
        && sheetRef.current?.contains(activeElement)
        && (
          activeElement instanceof HTMLInputElement
          || activeElement instanceof HTMLTextAreaElement
          || (activeElement instanceof HTMLElement && activeElement.isContentEditable)
        )
      );
      const layout = computeMobileSheetLayout({
        layoutHeight: window.innerHeight,
        visualHeight: vv.height,
        visualOffsetTop: vv.offsetTop,
        keyboardActive
      });
      const vars: Record<string, string | undefined> = {
        ["--rios-sheet-bottom"]: `${layout.bottom}px`
      };
      if (layout.top != null) {
        vars["--rios-sheet-top"] = `${layout.top}px`;
      }
      if (layout.maxHeight != null) {
        vars["--rios-sheet-max-h"] = `${layout.maxHeight}px`;
      }
      // With the keyboard up we anchor top + bottom (no explicit height), so
      // the sheet fills the visual viewport regardless of update timing.
      // Otherwise (no keyboard) a content-driven height keeps the sheet from
      // spanning the whole screen.
      if (layout.height != null) {
        vars.height = `${layout.height}px`;
      } else if (layout.top != null) {
        // top + bottom define the box; clear any prior explicit height.
        vars.height = "auto";
      } else if (multiple && layout.maxHeight != null) {
        vars.height = `${layout.maxHeight}px`;
      }
      setViewportCssVars(vars as React.CSSProperties);
    };
    applyViewportLayoutRef.current = apply;
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    document.addEventListener("focusin", apply);
    document.addEventListener("focusout", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      document.removeEventListener("focusin", apply);
      document.removeEventListener("focusout", apply);
    };
  }, [multiple]);

  return (
    <div
      className={cn(
        styles.overlay,
        present ? styles.overlayVisible : styles.overlayHidden,
        open ? styles.overlayOpen : styles.overlayClosed
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      data-rios-overlay
      data-open={open ? "true" : "false"}
      inert={!present}
      onPointerDownCapture={(event) => {
        const target = event.target;
        if (target instanceof Element && target.closest("[role='option']")) {
          optionGestureActiveRef.current = true;
        }
      }}
      onPointerUpCapture={() => {
        if (optionGestureActiveRef.current) releaseOptionGesture();
      }}
      onPointerCancelCapture={() => {
        if (optionGestureActiveRef.current) releaseOptionGesture();
      }}
    >
      {/* Backdrop. On iOS Safari a tap while the search input is focused can
          be consumed by the blur before `click` fires, so dismiss on the
          earlier pointerdown event. Keep keyboard activation via click. */}
      <button
        type="button"
        aria-label={cancelLabel || doneLabel || "Close"}
        className={styles.backdrop}
        data-rios-backdrop
        onPointerDown={(event) => {
          event.preventDefault();
          onDismiss();
        }}
        onClick={(event) => {
          if (event.detail === 0) onDismiss();
        }}
      />
      {/* Sheet — slides via transform, independent of the backdrop fade.
          bottom/maxHeight driven by visualViewport CSS vars so it clears the
          keyboard on iOS; falls back to 0 / 85vh when vars are absent. */}
      <div
        ref={sheetRef}
        style={viewportCssVars}
        className={cn(
          styles.sheet,
          open ? styles.sheetOpen : styles.sheetClosed
        )}
        data-rios-sheet
        data-open={open ? "true" : "false"}
      >
        {/* iOS selection header: circular close and confirm controls. */}
        <div className={styles.sheetHeader}>
          <button
            type="button"
            aria-label={multiple ? cancelLabel : doneLabel}
            onClick={onCancel}
            className={cn(styles.iconBtnRound, styles.closeBtn)}
            data-rios-cancel
          >
            <XIcon className={styles.closeIcon} />
          </button>
          <span className={styles.sheetTitle}>
            {title}
          </span>
          {multiple ? (
            <button
              type="button"
              aria-label={confirmLabel}
              onClick={onConfirm}
              className={cn(styles.iconBtnRound, styles.confirmBtn)}
              data-rios-confirm
            >
              <CheckIcon className={styles.confirmIcon} />
            </button>
          ) : (
            <span className={styles.confirmSpacer} aria-hidden="true" />
          )}
        </div>
        <div className={cn(styles.sheetBody)}>{children}</div>
      </div>
    </div>
  );
}

/**
 * OptionRow — memoised so only affected visible rows re-render.
 *
 * iOS-native selected state: the row label turns iOS blue and the trailing
 * indicator becomes a filled circle (accent fill + white checkmark) instead of
 * an outline glyph. `data-rios-option-value` is always present so agent drivers
 * can locate any row by value.
 */
const OptionRow = React.memo(function OptionRow({
  option,
  selected,
  onToggle,
  position,
  setSize
}: {
  option: SelectOption;
  selected: boolean;
  onToggle: (val: string) => void;
  position?: number;
  setSize?: number;
}) {
  const ariaLabel = option.description
    ? `${option.label} — ${option.description}`
    : option.label;
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      aria-label={ariaLabel}
      aria-posinset={position}
      aria-setsize={setSize}
      data-rios-option-value={option.value}
      data-selected={selected ? "true" : "false"}
      disabled={option.disabled}
      onClick={() => onToggle(option.value)}
      className={cn(
        styles.option,
        styles.optionRow,
        selected && styles.optionRowSelected,
        option.disabled && styles.optionDisabled
      )}
    >
      <span className={styles.optionMain}>
        <span className={styles.optionLabel}>{option.label}</span>
        {option.description && (
          <span className={styles.optionDescription}>
            {option.description}
          </span>
        )}
      </span>
      {/* iOS-native filled checkmark: a filled circle (accent) with a white
          check inside. Only rendered when selected; a spacer reserves the
          slot otherwise so labels stay aligned. */}
      {selected ? (
        <span className={styles.checkWrap} aria-hidden="true">
          <span className={styles.checkCircle} />
          <CheckIcon className={styles.checkGlyph} />
        </span>
      ) : (
        <span className={styles.checkSpacer} aria-hidden="true" />
      )}
    </button>
  );
});

export default Select;
