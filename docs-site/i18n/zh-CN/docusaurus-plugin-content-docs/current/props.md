---
sidebar_position: 8
---

# Props 参考

## `Select`

组件是可辨识联合：省略/`false` 的 `multiple` 为 `SingleProps`，`true` 为
`MultiProps`。TypeScript 自动收窄 `value` / `onValueChange`。

### 通用 props（`SelectBaseProps`）

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `options` | `SelectOption[]` | — | 选项列表。 |
| `searchable` | `boolean` | `multiple ‖ options.length > 5` | 显示搜索框。 |
| `placeholder` | `string` | — | 空值时触发器文字。 |
| `searchPlaceholder` | `string` | — | 搜索框占位符。 |
| `emptyText` | `string` | — | 无结果文案。 |
| `disabled` | `boolean` | `false` | 禁用触发器。 |
| `mobileTitle` | `string` | `placeholder` | sheet 表头标题。 |
| `mobileSetLabel` | `string` | `"Set"` | 多选确认按钮 `aria-label`。 |
| `mobileCancelLabel` | `string` | `"Cancel"` | 取消按钮 `aria-label`。 |
| `mobileDoneLabel` | `string` | `"Done"` | 单选关闭按钮 `aria-label`。 |
| `selectedCountLabel` | `(n: number) => string` | `${n} selected` | 多选 > 2 项时触发器摘要。 |
| `className` | `string` | — | 触发器额外类。 |
| `aria-label` | `string` | — | 触发器无障碍标签。 |

### 单选（`SingleProps`）

| Prop | 类型 |
| --- | --- |
| `multiple` | `false`（可选）|
| `value` | `string` |
| `onValueChange` | `(v: string) => void` |

### 多选（`MultiProps`）

| Prop | 类型 |
| --- | --- |
| `multiple` | `true` |
| `value` | `string[]` |
| `onValueChange` | `(v: string[]) => void` |

## `SelectOption`

```ts
type SelectOption = {
  value: string;            // 唯一键
  label: string;            // 行 label
  description?: string;     // 次要文本 + 并入 aria-label
  disabled?: boolean;       // 行不可切换
  icon?: ReactNode | ((option: SelectOption) => ReactNode);  // 左侧图标
};
```

## 导出的 helper

纯逻辑已导出，方便想用同一套原语搭自定义 UI 的高级用户：

- `OPTION_ROW_HEIGHT`、`OPTION_OVERSCAN`、`computeVirtualOptionRange`、`optionListSignature`（来自 `select-virtual`）
- `computeMobileSheetLayout`（来自 `select-layout`）
