# DESIGN.md

> 阳光穿过磨砂玻璃落在桌面上——一份让人愿意认真做完的人格测试。

## 1. Visual Theme & Atmosphere

**Style**: 玻璃拟态 (Glassmorphism) · 手机端优先
**Keywords**: 透明、模糊、光影、层叠、梦幻、精致、沉浸、可信
**Tone**: 梦幻而高级、安静而有质感 — NOT 廉价、花哨、塑料感、信息过载
**Feel**: 像把一面磨砂玻璃举到晨光里，紫蓝色的光晕在指尖流动；每滑动一次滑块，都像在一块半透明的水晶上留下痕迹。

**Interaction Tier**: L2 流畅交互（滑块拖拽反馈 + 卡片转场 + 光效流动，但克制，不喧宾夺主）
**Dependencies**: CSS only（无 GSAP / Lenis；backdrop-filter + CSS transition + 少量原生 JS 足够）

**形态**：单页应用（SPA 式三屏切换）——开始屏 → 答题屏（逐题）→ 结果屏。纯静态，无后端。

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds — 渐变背景是玻璃拟态的灵魂 */
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 55%, #6B4FA0 100%);
  --bg: #5b4a9e;                              /* 渐变 fallback 纯色 */
  --surface: rgba(255, 255, 255, 0.14);      /* 玻璃卡片 */
  --surface-alt: rgba(255, 255, 255, 0.08);  /* 次级玻璃面 */
  --surface-hover: rgba(255, 255, 255, 0.20);/* 悬停/激活玻璃面 */
  --surface-solid: rgba(255, 255, 255, 0.95);/* 需要高对比时的实心卡 */

  /* Borders — 玻璃边缘的高光 */
  --border: rgba(255, 255, 255, 0.22);
  --border-hover: rgba(255, 255, 255, 0.45);

  /* Text — 背景深，文字以白为主 */
  --text: #FFFFFF;                           /* 标题、题干 */
  --text-secondary: rgba(255, 255, 255, 0.78);/* 正文、描述 */
  --text-tertiary: rgba(255, 255, 255, 0.55);/* 标签、进度、辅助 */
  --text-on-light: #2D2350;                  /* 实心卡上的深色文字 */

  /* Accent — 滑块、CTA、进度 */
  --accent: #FFD86E;                         /* 暖金，与紫蓝撞出高级感 */
  --accent-hover: #FFE08A;
  --accent-soft: rgba(255, 216, 110, 0.25);

  /* RGB variants */
  --accent-rgb: 255, 216, 110;
  --white-rgb: 255, 255, 255;

  /* Semantic */
  --success: #7BE0B0;
  --error: #FF8A8A;
  --warning: #FFC15E;

  /* Glass blur 强度 */
  --blur: 16px;
  --blur-strong: 24px;
}
```

**Color Rules:**
- 背景永远是 `--bg-gradient`，固定不滚动（`background-attachment: fixed`），制造"玻璃浮在光上"的纵深。
- 所有卡片/控件用 `rgba` 半透明 + `backdrop-filter: blur()`，禁止用实心 hex 做卡片背景（除结果分享卡需要截图时用 `--surface-solid`）。
- 强调色 `--accent` 暖金只用在**当前激活的滑块滑钮、CTA 按钮、进度高亮**三处，不滥用。
- 16 种人格结果各配一组渐变（见 §4 结果卡），但只换 hue，不破坏整体紫蓝基调的明度/饱和度区间。

## 3. Typography Rules

**Font Stack:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700&display=swap');
```

| Role | Font | Size (mobile) | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| 开始屏大标题 | Outfit + Noto Sans SC | 34px | 700 | 1.15 | -0.01em |
| 结果类型名 (EN) | Outfit | 40px | 700 | 1.0 | 0.02em |
| 结果类型名 (中) | Noto Sans SC | 22px | 700 | 1.2 | 0 |
| 题干 H2 | Noto Sans SC | 21px | 500 | 1.45 | 0 |
| 正文/描述 Body | Noto Sans SC | 15px | 400 | 1.7 | 0 |
| 滑块两端标签 | Outfit + Noto Sans SC | 13px | 500 | 1.3 | 0 |
| 进度/编号 Label | Outfit | 13px | 600 | 1.2 | 0.04em |
| 维度缩写 (E/I…) | Outfit | 15px | 700 | 1.2 | 0.05em |

**Typography Rules:**
- 中文用 Noto Sans SC，英文/数字/字母代号用 Outfit（标题）或 Inter（数据），中英混排时数字走 Outfit 更精神。
- 题干 weight 不超过 500——要安静、可读，不要压迫感。
- **NEVER use**: 系统默认宋体、楷体、任何 cursive 手写体、Comic Sans。

**Text Decoration:**
- 大标题：用 `--accent` 暖金做局部高亮词，**不**加 text-shadow（玻璃风靠 blur 制造层次，不靠投影）。
- 结果类型名 (EN)：可加极轻的白色 text-shadow（0 2px 20px rgba(255,255,255,.3)）做"发光"，仅此一处。

## 4. Component Stylings

### 玻璃卡片基类 (.glass)
```css
.glass {
  background: var(--surface);
  backdrop-filter: blur(var(--blur));
  -webkit-backdrop-filter: blur(var(--blur));
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 20, 66, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.25); /* 顶部高光 */
}
```

### Buttons (CTA)
```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 8px; width: 100%; min-height: 54px; padding: 0 24px;
  font-family: 'Noto Sans SC', sans-serif; font-size: 17px; font-weight: 600;
  color: var(--text-on-light);
  background: var(--accent);
  border: none; border-radius: 16px; cursor: pointer;
  box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.btn:hover { background: var(--accent-hover); box-shadow: 0 8px 26px rgba(var(--accent-rgb), 0.5); }
.btn:active { transform: scale(0.97); }
.btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }

/* 次级按钮：玻璃描边 */
.btn-ghost {
  background: var(--surface); color: var(--text);
  border: 1px solid var(--border); backdrop-filter: blur(var(--blur));
  box-shadow: none;
}
.btn-ghost:hover { background: var(--surface-hover); border-color: var(--border-hover); }
```

### 题目卡 (.question-card)
```css
.question-card {
  /* 继承 .glass */
  padding: 28px 22px 32px;
  transition: opacity .35s ease, transform .35s ease;
}
.question-card.exit { opacity: 0; transform: translateX(-24px); }   /* 切下一题 */
.question-card.enter { opacity: 0; transform: translateX(24px); }   /* 入场起点 */
```

### 李克特滑块 (.likert)
```css
.likert {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 8px; border-radius: 999px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  outline: none;
}
/* 滑钮 — webkit */
.likert::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--accent);
  border: 3px solid rgba(255,255,255,.9);
  box-shadow: 0 4px 14px rgba(var(--accent-rgb), .55);
  cursor: grab; transition: transform .15s ease;
}
.likert::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.likert::-moz-range-thumb {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--accent); border: 3px solid rgba(255,255,255,.9);
  box-shadow: 0 4px 14px rgba(var(--accent-rgb), .55); cursor: grab;
}
/* 五档刻度点 */
.likert-ticks { display: flex; justify-content: space-between; padding: 0 4px; margin-top: 14px; }
.tick { width: 10px; height: 10px; border-radius: 50%; background: var(--surface-alt); border: 1px solid var(--border); transition: all .2s ease; }
.tick.active { background: var(--accent); border-color: var(--accent); transform: scale(1.25); }
```

### 进度条 (.progress)
```css
.progress { height: 6px; border-radius: 999px; background: var(--surface-alt); overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 999px; transition: width .4s cubic-bezier(.4,0,.2,1); }
```

### 维度结果条 (.dim-bar) — 结果屏展示 E/I S/N T/F J/P 倾向
```css
.dim-bar { height: 10px; border-radius: 999px; background: var(--surface-alt); position: relative; overflow: hidden; }
.dim-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #FFD86E, #FF9E6E); transition: width .8s cubic-bezier(.4,0,.2,1); }
```

### Tags / Badges (人格关键词)
```css
.tag {
  display: inline-block; padding: 6px 14px; border-radius: 999px;
  font-family: 'Noto Sans SC'; font-size: 13px; font-weight: 500;
  color: var(--text); background: var(--surface);
  border: 1px solid var(--border); backdrop-filter: blur(8px);
}
```

## 5. Layout Principles

**Container:**
- Max width: 440px（手机端单列，桌面端居中成"手机卡"）
- Padding: 20px 左右安全边距
- 全屏高度：`min-height: 100dvh`，三屏各自满屏垂直居中

**Spacing Scale:**
- 屏间垂直 padding: 24px
- 题干 → 滑块 间距: 36px
- 卡片内 padding: 28px 22px
- 控件组件 gap: 16px

**Grid:**
```css
.screen { min-height: 100dvh; display: flex; flex-direction: column; justify-content: center; padding: 24px 20px; max-width: 440px; margin: 0 auto; }
.result-dims { display: grid; gap: 18px; }       /* 四维度条纵向堆叠 */
.result-tags { display: flex; flex-wrap: wrap; gap: 8px; }
```

## 6. Depth & Elevation

玻璃拟态的"深度"靠 **blur 强度 + 不透明度 + 内高光**三件套，而非传统投影。

| Level | Treatment | Use |
|-------|-----------|-----|
| Base | 背景渐变，无卡 | 页面底 |
| Glass-1 | blur 16px, surface .14, 外阴影轻 | 题目卡、标签 |
| Glass-2 | blur 24px, surface .20, 外阴影中 + 内高光 | 结果主卡、当前激活态 |
| Float | 上移 + 阴影加深 | 按钮 hover、滑钮 active |
| Solid | 实心 95% 白 | 结果分享卡（需截图保存时） |

## 7. Animation & Interaction

**Motion Philosophy**: 克制、丝滑、有"重量感"。只用 opacity / transform / backdrop-filter，所有过渡 ≤ 0.4s。滑块拖动要跟手，结果揭晓要有仪式感。
**Tier**: L2
**Dependencies**: 无外部库，纯 CSS transition + 原生 JS。

### Entrance Animation
```css
@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.screen.active > * { animation: floatIn .5s cubic-bezier(.2,.7,.3,1) both; }
.screen.active > *:nth-child(2) { animation-delay: .08s; }
.screen.active > *:nth-child(3) { animation-delay: .16s; }
```

### 题目切换（JS 驱动）
```js
// 旧题加 .exit 渐出 → 换数据 → 新题加 .enter 再移除触发渐入
card.classList.add('exit');
setTimeout(() => { renderQuestion(next); card.classList.remove('exit'); card.classList.add('enter');
  requestAnimationFrame(() => card.classList.remove('enter')); }, 280);
```

### 滑块联动
```js
// input 事件：实时更新五档刻度点 active、记录答案、刷新进度条
slider.addEventListener('input', e => { updateTicks(e.target.value); saveAnswer(e.target.value); });
```

### 结果揭晓（仪式感）
```css
@keyframes revealGlow {
  0%   { opacity: 0; transform: scale(.88); filter: blur(8px); }
  60%  { filter: blur(0); }
  100% { opacity: 1; transform: scale(1); }
}
.result-type-name { animation: revealGlow .8s cubic-bezier(.2,.8,.2,1) both; }
.dim-bar-fill { /* width 由 0 过渡到目标值，进入结果屏后触发 */ }
```

### 背景光效（可选，极轻）
```css
/* 两团缓慢漂浮的光斑，强化梦幻感，但不分散注意力 */
@keyframes drift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-40px)} }
.orb { position: fixed; border-radius: 50%; filter: blur(60px); opacity: .5; animation: drift 18s ease-in-out infinite; z-index: 0; }
```

### Hover & Focus States
```css
.glass:hover { border-color: var(--border-hover); }
.btn:focus-visible, .likert:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  .orb { animation: none; }
  .result-type-name { filter: none; }
}
```

## 8. Do's and Don'ts

### Do
- 背景渐变固定不动，卡片浮在其上——这是玻璃拟态的核心纵深。
- 每个玻璃面都要有 `1px` 高光边框 + `inset` 顶部高光，否则会"糊"成一团。
- 滑块拖动实时反馈：五档刻度点 + 滑钮缩放，让用户感到"答得很精确"。
- 48 题分四维度，但**不**告诉用户当前在测哪个维度（避免被引导作答）。
- 结果揭晓给足仪式感：类型名发光放大入场，四维度条从 0 长出。
- 触摸目标 ≥ 44px，滑钮 34px 但热区扩到 44px。

### Don't
- ❌ 不要用实心 hex 背景做卡片——会丢掉玻璃质感。
- ❌ 不要堆叠超过 2 层 blur（性能差且发灰）。
- ❌ 不要在一屏里塞多道题——一屏一题，专注。
- ❌ 不要用 text-shadow 制造层次（除结果名那一处发光）。
- ❌ 不要让强调色暖金出现在 3 处以上。
- ❌ 不要用进度百分比之外的"还剩 X 题"反复提醒（增加焦虑、降低完成率）。
- ❌ 不要把 16 种结果的渐变做得明度/饱和度差异过大，破坏整体调性。
- ❌ 不要默认开启背景音乐或自动跳题。
- ❌ 不要在滑块未拖动时就允许"下一题"——必须作答（可设中间值为默认但需用户确认）。

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 480px | 单列满宽，container 100%，padding 20px（主场景） |
| Tablet/Desktop | ≥ 480px | container 锁 440px 居中，背景渐变铺满视口，呈"手机卡"展示 |

**Touch Targets:** 最小 44×44px（滑钮视觉 34px，热区 44px；按钮 min-height 54px）
**Collapsing Strategy:** 本就是移动优先单列，桌面端不重排，仅居中收窄 + 背景铺满。

```css
.screen { width: 100%; }
@media (min-width: 480px) {
  body { display: flex; align-items: center; justify-content: center; }
  .app { width: 440px; }
}
/* 用 100dvh 而非 100vh，规避移动端地址栏高度跳动 */
.screen { min-height: 100dvh; }
```
