---
sidebar_position: 2
---

# 快速开始

安装包，引入一次样式表，然后渲染一个 `<Select>`。

## 安装

```bash
bun add react-ios-multiselect
# 或
npm install react-ios-multiselect
```

**Peer 依赖：** `react` ≥ 18、`react-dom` ≥ 18。没有其它运行时依赖。

## 引入样式表

在应用根入口（如 `App.tsx`、`_app.tsx` 或 layout 组件）**只引入一次**全局
样式表。它定义了 `--rios-*` 主题变量和带前缀的 `rios-*` 类。

```ts
import "react-ios-multiselect/style.css";
```

:::note
样式表刻意没有从 JS 入口里 import —— 你显式引入，让全局 CSS 始终是自觉的。
:::

## 第一个 select

### 单选

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

### 多选

```tsx
const [symbols, setSymbols] = useState<string[]>(["AAPL", "NVDA"]);

<Select
  multiple
  value={symbols}
  onValueChange={setSymbols}
  options={options}
  placeholder="选择标的"
  searchPlaceholder="搜索标的"
  emptyText="没有匹配的标的"
/>;
```

完成。更多内容见[用法](./usage)。
