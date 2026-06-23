---
sidebar_position: 7
---

# data 属性（agent 与测试钩子）

每个可交互元素都带稳定的 `data-rios-*` 属性。这是 Playwright、cursor agent 和任何
DOM 驱动器定位并驱动组件的**受支持方式**——不要依赖文字内容或 DOM 位置（它们会
变）。

## 选择器参考

| 选择器 | 元素 | 额外状态 |
| --- | --- | --- |
| `[data-rios-select-trigger]` | 触发器按钮 | `data-state="open\|closed"` |
| `[data-rios-option-value="<value>"]` | 任意选项行 | `data-selected="true\|false"` |
| `[data-rios-sheet]` | sheet | `data-open="true\|false"` |
| `[data-rios-overlay]` | 遮罩/背景容器 | `data-open` |
| `[data-rios-backdrop]` | 点击关闭的遮罩 | — |
| `[data-rios-search-input]` | 搜索框 | — |
| `[data-rios-clear-search]` | 清除搜索按钮 | — |
| `[data-rios-confirm]` | 蓝色 ✓ 提交按钮（多选）| — |
| `[data-rios-cancel]` | ✕ 关闭按钮 | — |

:::note
`data-rios-option-value` 出现在**每个**选项行上（值来自 `option.value`）。
`data-selected` 镜像当前选中态，你无需自己计算选中就能断言。
:::

## Playwright 示例

```ts
import { test, expect } from "@playwright/test";

test("多选在确认时提交草稿", async ({ page }) => {
  await page.goto("/your-page");

  // 打开
  await page.click('[data-rios-select-trigger]');
  await expect(page.locator('[data-rios-select-trigger]')).toHaveAttribute(
    "data-state", "open"
  );

  // 在草稿里切换两行
  await page.click('[data-rios-option-value="AAPL"]');
  await page.click('[data-rios-option-value="NVDA"]');
  await expect(page.locator('[data-rios-option-value="AAPL"]')).toHaveAttribute(
    "data-selected", "true"
  );

  // 确认提交草稿并关闭 sheet
  await page.click('[data-rios-confirm]');
  await expect(page.locator('[data-rios-select-trigger]')).toHaveAttribute(
    "data-state", "closed"
  );
});
```

## ARIA 语义

除 `data-rios-*` 钩子外，组件还暴露标准 ARIA，让无障碍工具和屏幕阅读器开箱即用：

- 触发器：`aria-haspopup="dialog"`、`aria-expanded`。
- sheet：`role="dialog"`、`aria-modal="true"`。
- 选项列表：`role="listbox"`、`aria-multiselectable`（仅多选）。
- 每个选项行：`role="option"`、`aria-selected`、`aria-posinset`、`aria-setsize`，
  以及 `"label"` 或 `"label — description"` 形式的 `aria-label`。

## 测试 iOS 键盘行为

「键盘保持打开」的行为是 iOS 触屏特有的，headless 浏览器（无软键盘）测不出来。
它由 `select-interaction.ts` 里纯手势策略的单元测试覆盖
（`tests/select-interaction.test.ts`）。要端到端验证该行为，请在真机 iPhone
Safari 上测。
