---
sidebar_position: 4
---

# 主题

所有视觉 token 都是声明在 `:root` 上的 CSS 自定义属性，带合理默认值。只覆盖你想
改的——不需要 theme 对象，也不需要构建步骤。

## 覆盖变量

```css
:root {
  --rios-color-text: #1d2038;
  --rios-color-accent: #0a84ff;       /* iOS 蓝:确认按钮 + 对勾 */
  --rios-color-selected: #0a84ff;     /* 选中行文字 */
  --rios-color-hairline: rgba(60, 60, 67, 0.29);
  --rios-font-size-body: 17px;
  --rios-row-height: 58px;
  --rios-easing-spring: cubic-bezier(0.32, 0.72, 0, 1);
}
```

也可以把覆盖限定到某个子树——例如包住一个 select 给它紫色强调色，不动 app 其余
部分：

```tsx
<div style={{ "--rios-color-accent": "#7c3aed", "--rios-color-selected": "#7c3aed" }}>
  <Select multiple value={v} onValueChange={setV} options={options} />
</div>
```

## 完整变量参考

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--rios-color-text` | `#1d2038` | 触发器 + sheet 文字 |
| `--rios-color-muted` | `#7b8190` | 占位符、描述 |
| `--rios-color-line` | `rgba(26,34,56,.1)` | 边框 |
| `--rios-color-accent` | `#0a84ff` | iOS 蓝:确认按钮、对勾填充 |
| `--rios-color-selected` | `#0a84ff` | 选中行文字 |
| `--rios-color-trigger-bg` | `#fcfbf8` | 触发器背景 |
| `--rios-color-sheet-bg` | `#f7f7f9` | sheet 背景 |
| `--rios-color-row-active` | `rgba(0,0,0,.035)` | 移动行按下反馈 |
| `--rios-color-hairline` | `rgba(60,60,67,.29)` | iOS 分隔线 |
| `--rios-shadow-sheet` | `0 18px 70px rgba(15,23,42,.28)` | sheet 阴影 |
| `--rios-radius-sheet` | `32px` | sheet 圆角 |
| `--rios-radius-trigger` | `18px` | 触发器圆角 |
| `--rios-font-size-body` | `17px` | 选项 label 字号 |
| `--rios-font-size-description` | `13px` | 描述字号 |
| `--rios-row-height` | `58px` | 选项行高（~44pt）|
| `--rios-hairline-inset` | `16px` | 分隔线左缩进 |
| `--rios-easing-spring` | `cubic-bezier(.32,.72,0,1)` | iOS 弹簧曲线 |
| `--rios-check-size` | `22px` | 实心对勾直径 |

## 类名

所有内置类都带 `rios-` 前缀（如 `rios-trigger`、`rios-sheet`、
`rios-option-row`）。高级覆盖时可在自己的 CSS 里直接定位它们。通过 `className`
prop 给触发器加额外类。

:::caution
`data-rios-*` 属性和 `rios-*` 类名是**公开 API**——重命名或删除属于破坏性变更，
需要升大版本。见 [data 属性](./data-attributes)。
:::
