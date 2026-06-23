---
sidebar_position: 5
---

# AI agent 指南

本页是 AI agent 给 `react-ios-multiselect` 贡献代码或使用它的入口。仓库根目录也有
[`AGENTS.md`](https://github.com/tonylawx/react-ios-multiselect/blob/main/AGENTS.md)，
内容相同——改仓库代码前先读它。

## 📋 一句话 prompt —— 直接发给 agent

复制下面这段，粘给你的 AI 编程 agent，它无需其它上下文就能接入组件。

```txt
用 npm 包 `react-ios-multiselect` 做 select 控件。读文档照着做：https://tonylawx.github.io/react-ios-multiselect/
```

:::tip[TL;DR —— 直接接入]
**如果你的任务是「给这个 app 加一个 select」，照抄下面这些，别加别的：**

```bash
bun add react-ios-multiselect          # peer 依赖: react >= 18
```

```tsx
// 在 app 根入口引入一次（App.tsx / _app.tsx / layout）
import "react-ios-multiselect/style.css";

// 单选
<Select value={v} onValueChange={setV} options={opts} />

// 多选  （同一个组件，加 `multiple` 即可）
<Select multiple value={arr} onValueChange={setArr} options={opts} placeholder="请选择…" />
```

**不要**在它旁边加 UI 库、图标包或 CSS 框架——组件是移动优先、零依赖的，自带
`--rios-*` 主题 CSS。在测试/自动化里用 `[data-rios-select-trigger]` 和
`[data-rios-option-value="<value>"]` 驱动它（见 [data 属性](./data-attributes)）。
:::

## 作为消费方使用组件

如果你的任务是在 app 里加一个 select，只需要这些：

```bash
bun add react-ios-multiselect   # peer: react >= 18
```

```tsx
import { Select } from "react-ios-multiselect";
import "react-ios-multiselect/style.css"; // 在 app 根入口引入一次
```

- **单选：** `<Select value={s} onValueChange={setS} options={opts} />`
- **多选：** `<Select multiple value={arr} onValueChange={setArr} options={opts} />`

见[快速开始](./getting-started)和[用法](./usage)。组件是移动优先的（打开底部
sheet），并且**零运行时依赖**——不要在它旁边加 UI 库或图标包。

### 在测试/自动化里驱动它

用稳定的 `data-rios-*` 选择器——绝不依赖文字或位置。完整列表和 Playwright 片段
见 [data 属性](./data-attributes)。

## 作为贡献方贡献代码

1. **读仓库根目录的 `AGENTS.md`**。它是唯一事实来源。
2. **找一个 `agent-task` issue**，开始前评论 `/claim`。
3. **遵守硬约束：**
   - 除 `react`/`react-dom` 外零运行时依赖。
   - 只用纯 CSS + `--rios-*` 变量（不用 Tailwind、不用 CSS-in-JS）。
   - `data-rios-*` 选择器是公开 API——不要重命名/删除。
   - 移动优先——不要加回桌面 popover 路径。
4. **推送前验证：**
   ```bash
   bun install && bun test && bun run typecheck && bun run build
   ```
   CI 跑同样的四条命令。

### 必填：AI 贡献者声明

任何由 agent 撰写或主要由 agent 撰写的 PR **必须**声明身份。CI 工作流
`ai-pr-guard` 会让缺少声明的 `ai-authored` PR 失败。填写 PR 模板的声明区块：

- **Agent** —— 如 `ZCode`、`Cursor 0.42`、`Claude Code`。
- **模型** —— 如 `GLM-5.2`、`gpt-5`、`claude-opus-4.5`。
- **自主程度** —— `human-directed` / `human-supervised` / `autonomous`。
- **Prompt 摘要** —— 1–3 句。
- **本地验证** —— test/typecheck/build 哪些通过了。

已知 agent 登记在
[`.github/ai-contributors.yml`](https://github.com/tonylawx/react-ios-multiselect/blob/main/.github/ai-contributors.yml)。

## 为什么这很重要

声明让评审者能校准审查力度、让用户知道自己在运行什么，并为「哪些 agent/模型能
给这个代码库产出可靠贡献」建立记录。未声明的 agent 贡献会被当作流程违规处理，
而不是技术问题。
