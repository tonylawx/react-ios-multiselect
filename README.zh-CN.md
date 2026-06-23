# react-ios-multiselect

> ## 🔥 世界第一款「Agent 自治前端组件」
>
> 2026 年，全世界还不知道「Agent 自治前端组件」为何物的时候，我推出了世界上第一款——`react-ios-multiselect`。它秉承 AI 时代「**黑灯工厂**」的编码理念：**无人编码、无人 review、无人测试**，遥遥领先于同行。
>
> 欢迎大家用你的 Agent 来使用这个组件；也欢迎你用你的 Agent 来提 PR，挑战我的 Agent。🤖

[![docs](https://img.shields.io/badge/docs-tonylawx.github.io%2Freact--ios--multiselect-0a84ff)](https://tonylawx.github.io/react-ios-multiselect/zh-CN/)
[![license](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![deps](https://img.shields.io/badge/runtime%20deps-0%20(only%20react)-success)](./package.json)

📚 **文档站 & 在线 demo：** https://tonylawx.github.io/react-ios-multiselect/zh-CN/

<table>
<tr>
<td>

📱 **扫码手机预览** —— 这是个移动端组件，拿在手里感受最真实：

</td>
<td>

<img src="docs-site/static/img/docs-qr.png" alt="扫码打开文档站" width="120">

</td>
</tr>
</table>

一个原生 iOS 手感的 React `<Select>`——单选**和**多选同一个组件，带**键盘感知的底部 sheet**、**虚拟化**（2,000+ 选项流畅滚动）、**iOS 原生选中态**（蓝色对勾），以及**草稿-提交式多选**。

点击行即可切换，**搜索时键盘不收起**（一个出了名难搞的 iOS WebKit 行为，本组件正确处理了）。每个可交互元素都带稳定的 `data-rios-*` 钩子，AI agent / Playwright 能可靠驱动。

**零运行时依赖**，只有 `react` / `react-dom`（peer）。没有 UI 库、没有图标包、没有 class 合并工具——图标是内联 SVG，class 是手写的 3 行 `cn()`。移动优先：trigger 打开底部 sheet。

## 🤖 给 AI agent —— 复制这段

```txt
用 npm 包 `react-ios-multiselect` 做 select 控件。读文档照着做：https://tonylawx.github.io/react-ios-multiselect/
```

作为 agent 贡献代码？读 [`AGENTS.md`](./AGENTS.md)——`ai-pr-guard` CI 会在 `ai-authored` 的 PR 上强制 agent 声明。

```tsx
import { Select } from "react-ios-multiselect";
import "react-ios-multiselect/style.css";

// 多选
<Select
  multiple
  value={symbols}
  onValueChange={setSymbols}
  options={options}
  placeholder="选择标的"
/>

// 单选（同一个组件，去掉 multiple）
<Select value={strategy} onValueChange={setStrategy} options={strategies} />
```

## 安装

```bash
bun add react-ios-multiselect
# 或
npm install react-ios-multiselect
```

Peer 依赖：`react` ≥ 18、`react-dom` ≥ 18。然后**只引入一次**样式表：

```ts
import "react-ios-multiselect/style.css";
```

完整文档见 [文档站](https://tonylawx.github.io/react-ios-multiselect/zh-CN/docs/intro)。

## 致谢

本组件端到端由 AI agent 驱动 **[GLM-5.2](https://z.ai)**（@[zai-org](https://github.com/zai-org)）构建——设计、代码、测试、文档、CI、发布自动化。API token 由 **@[mcdonaldsFriedChicken](https://github.com/mcdonaldsFriedChicken)** 赞助。

## 联系方式

作者 [@tonylaw](https://github.com/tonylawx)。来打个招呼、分享你做的东西，或者一起聊 iOS 手感的组件 👋

- X：[@tonylawdotcc](https://x.com/tonylawdotcc)
- Threads：[@aheadfour](https://www.threads.com/@aheadfour)
- 微信公众号「躲过核弹的自然选择号」：

  ![躲过核弹的自然选择号](docs-site/static/img/wechat-qr.png)

## License

MIT
