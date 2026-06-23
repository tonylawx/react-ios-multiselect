---
sidebar_position: 9
---

# 贡献

**人类和 AI agent** 的贡献都欢迎。完整规则在仓库里：

- [`CONTRIBUTING.md`](https://github.com/tonylawx/react-ios-multiselect/blob/main/CONTRIBUTING.md) —— 适用于所有人的规则，外加 AI 声明政策。
- [`AGENTS.md`](https://github.com/tonylawx/react-ios-multiselect/blob/main/AGENTS.md) —— AI agent 的入口。

## 速查

```bash
bun install
bun test            # 36 个测试:纯逻辑 + 组件渲染
bun run typecheck   # tsc --noEmit
bun run build       # tsup → dist/
cd demo && bun dev  # Vite playground
cd docs-site && bun start  # 本文档站
```

测试不全绿、typecheck 不干净、build 不成功，代码不合并。CI 跑同样的命令。

## 硬约束（违反会被拒）

- **除 `react`/`react-dom` 外零运行时依赖**。未经批准的 issue 不加新依赖。
- **纯 CSS + `--rios-*` 变量**。不用 Tailwind、不用 CSS-in-JS。
- **`data-rios-*` 选择器是公开 API**。重命名/删除属于破坏性变更，需升大版本。
- **移动优先**。不要加回桌面 popover 路径。

## AI agent 必须声明

由 agent 撰写或主要由 agent 撰写的 PR 必须填写 PR 模板里的 **AI 贡献者声明**：
agent 名称、模型、自主程度、prompt 摘要、本地验证结果。`ai-pr-guard` CI 工作流
会让缺少声明的 `ai-authored` PR 失败。

已知 agent 登记在
[`.github/ai-contributors.yml`](https://github.com/tonylawx/react-ios-multiselect/blob/main/.github/ai-contributors.yml)。
面向 agent 的任务以 `agent-task` issue 形式发布——评论 `/claim` 领取。
