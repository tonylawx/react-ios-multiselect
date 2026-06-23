---
sidebar_position: 3
---

# 用法

## 选项结构

每个选项有唯一的 `value`、`label`，以及可选的 `description`、`disabled`、
`icon`。

```ts
type SelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode | ((option) => ReactNode);
};
```

## 单选 vs 多选

同一个 `<Select>` 两种都支持。省略 `multiple`（或传 `false`）为单选；传
`multiple` 为多选。`value` / `onValueChange` 的签名随之改变：

| 模式 | `value`       | `onValueChange`           |
| ---- | ------------- | ------------------------- |
| 单选 | `string`      | `(v: string) => void`     |
| 多选 | `string[]`    | `(v: string[]) => void`   |

### 提交行为

- **单选**点击即提交并关闭 sheet。
- **多选**使用**草稿**：打开 sheet 时把受控值复制到本地草稿。切换行只修改草稿
  （即时视觉反馈）。蓝色 ✓ 按钮把草稿提交给 `onValueChange`；✕ 丢弃草稿并恢复
  到受控值。这跟原生 iOS 多选 sheet 一致。

## 描述

传 `description` 在 label 下渲染次要文本。

```tsx
const options = [
  { value: "AAPL", label: "AAPL", description: "Apple Inc. · NASDAQ" },
  { value: "TSLA", label: "TSLA", description: "Tesla Inc. · NASDAQ" },
];
```

描述也会并入行的 `aria-label`（`"AAPL — Apple Inc. · NASDAQ"`），方便屏幕阅读器
和 agent 解析。

## 左侧图标

`icon` 可以是 `ReactNode`（如 `<img>`）或接收 option 的渲染函数。图标渲染在
label 左侧的固定尺寸插槽里，与右侧的选中态对勾区分。

```tsx
// ReactNode
const options = [
  { value: "AAPL", label: "AAPL", icon: <img src="/logos/aapl.svg" alt="" /> },
];

// 渲染函数，跨 option 复用
const icon = (o) => <Logo symbol={o.value} />;
const options = symbols.map((s) => ({ ...s, icon }));
```

## 搜索

当 `multiple` 为真**或**选项数 > 5 时自动显示搜索框。用 `searchable` 强制开/关。

```tsx
<Select searchable options={fewOptions} value={v} onValueChange={setV} />
```

输入按 `label`、`value`、`description` 过滤（不区分大小写）。结果集变化时列表
滚回顶部。

## 禁用

用 `disabled` 禁用整个触发器，用 `option.disabled` 禁用单个选项。

```tsx
<Select value={v} onValueChange={setV} options={options} disabled />

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B", disabled: true }, // 不可切换
];
```

## 纯受控

组件完全受控——你始终持有 `value`，在 `onValueChange` 里决定怎么做。没有内部非
受控状态会失同步。
