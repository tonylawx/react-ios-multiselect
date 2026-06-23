---
sidebar_position: 6
---

# 测试

仓库跑两层测试——纯逻辑单元测试和组件渲染测试。两层都必须保持绿色，CI 会强制。

## 运行测试

```bash
bun test            # 全部
bun test tests/select.test.tsx     # 仅组件渲染测试
bun test tests/select-virtual.test.ts  # 单个纯逻辑套件
```

## 覆盖了什么

### 纯逻辑单元测试（`tests/select-*.test.ts`）

框架无关的模块被独立单元测试：

- `select-virtual.test.ts` —— 窗口化范围计算、overscan、列表签名。
- `select-layout.test.ts` —— sheet 相对 visual viewport 的布局、键盘处理。
- `select-interaction.test.ts` —— 点击 vs 滚动手势、键盘保持策略。

这些不碰 DOM，毫秒级完成。改纯模块的行为时先改它的测试——它文档化了预期行为。

### 组件渲染测试（`tests/select.test.tsx`）

用 **happy-dom** + **@testing-library/react**（仅 devDependency——发布的包保持
`dependencies: {}`）。覆盖：

- 触发器 label / 占位符 / 多选摘要。
- 通过 `data-state` 的打开态，以及每个可交互元素上 `data-rios-*` 钩子的存在性。
- 单选点击即提交；多选延迟到确认按钮（草稿语义）。
- 搜索过滤。
- 禁用触发器和禁用选项。
- 左侧图标插槽（ReactNode 和渲染函数两种形式）。
- ARIA：`aria-label`、`aria-selected`、`aria-posinset`。

## 测试 setup

DOM 全局在 `tests/setup.ts` 里注册，通过 `bunfig.toml` 预加载。它 stub 了
happy-dom 没实现的 Web API：`matchMedia`、`ResizeObserver`、`visualViewport`。如果
你加的组件功能用到另一个缺失的 Web API，扩展那个 setup 文件。

## 加测试

- **新的组件行为** → 在 `tests/select.test.tsx` 加测试。
- **新的纯逻辑 helper** → 在模块旁加测试，如 `tests/select-virtual.test.ts`。

优先断言 `data-rios-*` 属性和 `aria-*`，而非类名或 DOM 结构这类实现细节，这样测试
能扛过重构，同时也充当公开面的文档。
