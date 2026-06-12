'use strict';

/* ====================== 题库（48题，四维度各12题，正反向均衡） ======================
   dim: 维度对  EI / SN / TF / JP
   key: 该题"同意"时指向的极点（用于计分方向）
   计分：滑块 1..5，贡献 = value - 3（-2..+2）。key 命中第一字母则加，否则减。 */
const QUESTIONS = [
  // —— E / I 外向 vs 内向 ——
  { dim: 'EI', key: 'E', text: '在聚会上，我倾向于主动和陌生人攀谈。' },
  { dim: 'EI', key: 'I', text: '独处一段时间能让我重新充满能量。' },
  { dim: 'EI', key: 'E', text: '我享受成为人群中被关注的焦点。' },
  { dim: 'EI', key: 'I', text: '长时间社交之后，我会感到精疲力尽。' },
  { dim: 'EI', key: 'E', text: '我习惯边说边想，在交谈中理清思路。' },
  { dim: 'EI', key: 'I', text: '比起热闹的聚会，我更享受一对一的深谈。' },
  { dim: 'EI', key: 'E', text: '认识新朋友这件事让我感到兴奋。' },
  { dim: 'EI', key: 'I', text: '我需要安静的环境才能真正集中精力。' },
  { dim: 'EI', key: 'E', text: '周末我更愿意外出相聚，而不是宅在家里。' },
  { dim: 'EI', key: 'I', text: '表达想法之前，我倾向于在心里反复斟酌。' },
  { dim: 'EI', key: 'E', text: '热闹的氛围会让我更有活力。' },
  { dim: 'EI', key: 'I', text: '我的社交圈不大，但大多是深交。' },

  // —— S / N 实感 vs 直觉 ——
  { dim: 'SN', key: 'S', text: '我更关注眼前具体、确凿的事实。' },
  { dim: 'SN', key: 'N', text: '我常常思考事物背后隐藏的含义与可能性。' },
  { dim: 'SN', key: 'S', text: '做事时，我喜欢依照可靠的经验按部就班。' },
  { dim: 'SN', key: 'N', text: '比起细节，我更容易先看到整体的蓝图。' },
  { dim: 'SN', key: 'S', text: '我更相信亲眼所见、亲手验证过的东西。' },
  { dim: 'SN', key: 'N', text: '我经常对未来抱有各种新奇的想象。' },
  { dim: 'SN', key: 'S', text: '我更擅长处理具体、实际的问题。' },
  { dim: 'SN', key: 'N', text: '我喜欢探索抽象的理论与概念。' },
  { dim: 'SN', key: 'S', text: '描述一件事时，我倾向于讲清楚具体细节。' },
  { dim: 'SN', key: 'N', text: '我容易从一个想法联想到许多别的点子。' },
  { dim: 'SN', key: 'S', text: '我更信任经过长期实践检验的方法。' },
  { dim: 'SN', key: 'N', text: '我更在意"它可能变成什么"，而非"它现在是什么"。' },

  // —— T / F 思考 vs 情感 ——
  { dim: 'TF', key: 'T', text: '做决定时，我优先考虑逻辑与客观事实。' },
  { dim: 'TF', key: 'F', text: '我很容易察觉到别人情绪上的细微变化。' },
  { dim: 'TF', key: 'T', text: '我认为公平公正比照顾感受更重要。' },
  { dim: 'TF', key: 'F', text: '别人难过时，我会本能地想去安慰他。' },
  { dim: 'TF', key: 'T', text: '评价一件事，我习惯先分析它的对与错。' },
  { dim: 'TF', key: 'F', text: '维持和谐的人际关系对我来说非常重要。' },
  { dim: 'TF', key: 'T', text: '在争论中，我能保持冷静、就事论事。' },
  { dim: 'TF', key: 'F', text: '做选择时，我常把"会不会伤害到别人"放在前面。' },
  { dim: 'TF', key: 'T', text: '我欣赏直接坦率的批评，哪怕它不中听。' },
  { dim: 'TF', key: 'F', text: '我更倾向于用同理心去理解他人，而非讲道理。' },
  { dim: 'TF', key: 'T', text: '我更看重方案是否合理高效，而非是否让人舒服。' },
  { dim: 'TF', key: 'F', text: '当别人开口寻求帮助时，我很难拒绝。' },

  // —— J / P 判断 vs 感知 ——
  { dim: 'JP', key: 'J', text: '我喜欢提前做好计划，并尽量照计划执行。' },
  { dim: 'JP', key: 'P', text: '我享受随性而为、临时决定带来的自由。' },
  { dim: 'JP', key: 'J', text: '把待办事项一一划掉会让我很有满足感。' },
  { dim: 'JP', key: 'P', text: '往往要到截止日期临近，我才更容易进入状态。' },
  { dim: 'JP', key: 'J', text: '我的生活和工作通常安排得井井有条。' },
  { dim: 'JP', key: 'P', text: '我更喜欢保留多种选择，不急着下结论。' },
  { dim: 'JP', key: 'J', text: '事情悬而未决会让我感到不踏实。' },
  { dim: 'JP', key: 'P', text: '计划被打乱时，我也能轻松地随机应变。' },
  { dim: 'JP', key: 'J', text: '我习惯把东西归类整理、各就各位。' },
  { dim: 'JP', key: 'P', text: '我常常同时开很多个头，却不急于收尾。' },
  { dim: 'JP', key: 'J', text: '我喜欢凡事都有明确的规则和结论。' },
  { dim: 'JP', key: 'P', text: '我更愿意顺其自然，看情况再做打算。' }
];

/* ====================== 16 型结果 ====================== */
const TYPES = {
  INTJ: { cn: '建筑师', tagline: '富有想象力又果断的战略家，凡事皆有规划。', tags: ['独立', '战略思维', '理性', '远见'], grad: ['#6a5acd', '#8e7bef'], desc: '你独立、果决，习惯用长远的眼光审视一切。一旦认定目标，便会系统地规划路径并坚定执行。你不轻易盲从，更愿意凭借缜密的思考做出判断。' },
  INTP: { cn: '逻辑学家', tagline: '充满创造力的思想家，对知识有止不住的渴望。', tags: ['逻辑', '好奇', '创新', '独立思考'], grad: ['#7b6ef0', '#9d7bff'], desc: '你对世界的运作方式充满好奇，享受拆解复杂问题、构建理论的过程。你重视逻辑自洽，常常沉浸在自己的思想世界里，不断追问"为什么"。' },
  ENTJ: { cn: '指挥官', tagline: '大胆、富有想象力、意志坚定的天生领导者。', tags: ['领导力', '果断', '高效', '目标导向'], grad: ['#5e4ae0', '#7a5bf0'], desc: '你天生擅长统筹与决断，能迅速看清局势并推动事情向前。你目标明确、追求效率，乐于带领他人一起把宏大的设想变成现实。' },
  ENTP: { cn: '辩论家', tagline: '聪明好奇的思考者，无法抗拒智力上的挑战。', tags: ['机敏', '善辩', '创意', '灵活'], grad: ['#8a6ef0', '#b07bff'], desc: '你思维敏捷、点子层出不穷，享受辩论与头脑风暴带来的火花。你不喜欢墨守成规，总在寻找打破常规、推翻定论的新角度。' },
  INFJ: { cn: '提倡者', tagline: '安静而神秘，却鼓舞人心、不知疲倦的理想主义者。', tags: ['理想', '共情', '洞察', '坚定'], grad: ['#5b6ef0', '#7b9bff'], desc: '你有着深刻的洞察力与强烈的价值感，关心他人也关心世界的意义。你外表平和内心坚定，愿意为自己相信的理想默默而执着地付出。' },
  INFP: { cn: '调停者', tagline: '诗意、善良的利他主义者，总愿为正义挺身而出。', tags: ['理想', '真诚', '共情', '创造'], grad: ['#6e8af0', '#8ea0ff'], desc: '你内心丰盈、感受细腻，忠于自己的价值观与情感。你温柔却有原则，渴望让世界变得更好，也总能看见他人身上的闪光点。' },
  ENFJ: { cn: '主人公', tagline: '富有魅力、鼓舞人心的领导者，能让人愿意追随。', tags: ['感召力', '利他', '热情', '组织'], grad: ['#6e7bf0', '#9b8eff'], desc: '你温暖而有感染力，天生懂得激励与凝聚他人。你乐于成就别人，也擅长在群体中营造信任与归属，是许多人愿意追随的那个人。' },
  ENFP: { cn: '竞选者', tagline: '热情、有创造力、爱社交的自由灵魂。', tags: ['热情', '创意', '社交', '乐观'], grad: ['#7b8ef0', '#a0b0ff'], desc: '你充满活力与好奇心，对人和可能性都抱有真诚的热情。你不喜欢被束缚，享受探索与连接，总能为身边的人带来新鲜的能量。' },
  ISTJ: { cn: '物流师', tagline: '务实、注重事实，可靠性不容置疑。', tags: ['务实', '可靠', '严谨', '责任感'], grad: ['#5a6ec0', '#7b8ee0'], desc: '你踏实、守信，凡事讲求条理与证据。你重视承诺与秩序，一旦接下任务便会认真负责地完成，是团队里最让人放心的那块基石。' },
  ISFJ: { cn: '守卫者', tagline: '专注而温暖的守护者，时刻准备保护所爱之人。', tags: ['忠诚', '体贴', '细心', '负责'], grad: ['#6e8ec0', '#8eb0e0'], desc: '你善良、细致，习惯默默照顾身边的人。你重情重义，注重细节，愿意用实际行动去守护那些对你而言重要的人与关系。' },
  ESTJ: { cn: '总经理', tagline: '出色的管理者，在统筹事务与人员上无与伦比。', tags: ['组织', '务实', '果断', '守序'], grad: ['#5a7bd0', '#7b9be0'], desc: '你条理清晰、执行力强，擅长把混乱变得有序。你尊重规则与效率，敢于做决定也乐于承担责任，是天然的组织者与推动者。' },
  ESFJ: { cn: '执政官', tagline: '极有同情心、受欢迎、乐于助人的人。', tags: ['热心', '合群', '负责', '体贴'], grad: ['#6e9bd0', '#8eb8e8'], desc: '你热情、周到，乐于为集体和他人付出。你重视和谐与归属，善于照顾每个人的感受，常常是把大家凝聚在一起的那个核心。' },
  ISTP: { cn: '鉴赏家', tagline: '大胆而务实的实验家，擅长动手解决问题。', tags: ['冷静', '务实', '灵巧', '独立'], grad: ['#7b6ec0', '#9b8ee0'], desc: '你冷静、灵活，喜欢亲手拆解和探索事物如何运作。你不爱空谈，遇到问题更愿意动手实践，在关键时刻总能沉着地找到解法。' },
  ISFP: { cn: '探险家', tagline: '灵活而有魅力的艺术家，时刻准备探索新事物。', tags: ['艺术感', '随性', '温和', '敏感'], grad: ['#9b6ec0', '#bb8ee0'], desc: '你温和、随性，对美与体验有着敏锐的感受力。你活在当下，忠于自己的感觉，喜欢用行动而非言语去表达内心真实的自己。' },
  ESTP: { cn: '企业家', tagline: '聪明、精力充沛、善于感知，真心享受冒险。', tags: ['行动力', '机敏', '大胆', '现实'], grad: ['#8a6ec0', '#aa8ee0'], desc: '你果敢、机敏，享受行动与冒险带来的刺激。你善于抓住眼前的机会，反应迅速、不惧风险，总能在变化中找到突破口。' },
  ESFP: { cn: '表演者', tagline: '自发、热情的表演者，他们在场就绝不无聊。', tags: ['热情', '活力', '社交', '乐观'], grad: ['#a06ec8', '#c08ee8'], desc: '你开朗、富有感染力，懂得享受当下与生活的乐趣。你乐于成为焦点，也乐于把快乐带给身边的人，走到哪里都能点亮气氛。' }
};

/* 分享卡专用 slogan：比 tagline 更有传播感、更上头 */
const SLOGAN = {
  INTJ: '别问，问就是我早有计划。',
  INTP: '脑子里有座图书馆，只是没人参观。',
  ENTJ: '给我目标，剩下的交给我。',
  ENTP: '杠你不是针对你，是我的本能。',
  INFJ: '看透了一切，还是选择温柔。',
  INFP: '在自己的小宇宙里，认真地爱着世界。',
  ENFJ: '你的情绪，我比你先知道。',
  ENFP: '三分钟热度，但每一分钟都很真。',
  ISTJ: '答应的事，刻进 DNA 里。',
  ISFJ: '默默把你照顾好，不用你开口。',
  ESTJ: '这事交给我，按计划走。',
  ESFJ: '你过得好，我才安心。',
  ISTP: '话不多，但东西我修好了。',
  ISFP: '不爱解释，只想活成自己喜欢的样子。',
  ESTP: '想了就去做，怕什么。',
  ESFP: '我在的地方，从不冷场。'
};

/* 维度对配置：first = 第一字母（计分正方向） */
const DIMS = [
  { id: 'EI', first: 'E', second: 'I', firstName: '外向', secondName: '内向' },
  { id: 'SN', first: 'S', second: 'N', firstName: '实感', secondName: '直觉' },
  { id: 'TF', first: 'T', second: 'F', firstName: '思考', secondName: '情感' },
  { id: 'JP', first: 'J', second: 'P', firstName: '判断', secondName: '感知' }
];

/* 荣格认知功能栈（主栈四功能：主导→辅助→第三→劣势），由类型固定查表 */
const FN_NAME = {
  Ni: '内向直觉', Ne: '外向直觉', Si: '内向实感', Se: '外向实感',
  Ti: '内向思考', Te: '外向思考', Fi: '内向情感', Fe: '外向情感'
};
const FN_ROLE = ['主导功能', '辅助功能', '第三功能', '劣势功能'];
const FN_STRENGTH = [92, 70, 46, 26]; // 理论强弱（递减），仅示意排序，非个人实测值
const STACKS = {
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'], ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'], INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'], ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'], INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'], ESFP: ['Se', 'Fi', 'Te', 'Ni'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'], ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'], ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'], ENTJ: ['Te', 'Ni', 'Se', 'Fi']
};

/* ====================== 状态 ====================== */
const TOTAL = QUESTIONS.length;
const answers = new Array(TOTAL).fill(3); // 默认中立
let idx = 0;

/* ====================== DOM ====================== */
const $ = (s) => document.querySelector(s);
const screens = { start: $('#start'), quiz: $('#quiz'), result: $('#result') };
const card = $('#questionCard');
const qText = $('#qText');
const qIndexLabel = $('#qIndexLabel');
const qCurrent = $('#qCurrent');
const progressFill = $('#progressFill');
const likert = $('#likert');
const ticks = $('#ticks').querySelectorAll('.tick');
const likertNow = $('#likertNow');
const prevBtn = $('#prevBtn');
const nextBtn = $('#nextBtn');

const LIKERT_TEXT = ['完全不同意', '不太同意', '中立', '比较同意', '完全同意'];

/* ====================== 本地存储（方向 A：无登录持久化）======================
   store 是一层抽象：以后接账号(方向 B)时，只需把 read/write 换成读写远端，
   上层的 saveProgress / saveResult / renderStartEntries 全部不用动。 */
const STORE_KEY = 'mbti.v1';
const store = {
  read() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  },
  write(patch) {
    const data = Object.assign(this.read(), patch);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* 隐私模式等：静默降级 */ }
    return data;
  },
  clear(keys) {
    const data = this.read();
    keys.forEach((k) => delete data[k]);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* noop */ }
  }
};

let currentResultTs = null; // 当前正在展示的那次结果的时间（新完成=刚刚；回看=当时）

function saveProgress() {
  store.write({ progress: { answers: answers.slice(), idx, ts: Date.now() } });
}
function getHistory() {
  const data = store.read();
  if (Array.isArray(data.history)) return data.history;
  if (data.result) return [data.result]; // 兼容旧版单条 result 字段
  return [];
}
function migrateStore() {
  const data = store.read();
  if (!Array.isArray(data.history) && data.result) {
    store.write({ history: [data.result] });
    store.clear(['result']);
  }
}
function saveResult() {
  const entry = { type: computeResult().typeKey, answers: answers.slice(), ts: Date.now() };
  const hist = getHistory();
  hist.unshift(entry);                 // 最新在前
  if (hist.length > 30) hist.length = 30;
  store.write({ history: hist });
  store.clear(['progress', 'result']); // 清进度 + 清旧版字段
  currentResultTs = entry.ts;
}
function loadAnswers(arr) {
  if (!Array.isArray(arr) || arr.length !== TOTAL) return false;
  for (let i = 0; i < TOTAL; i++) answers[i] = Number(arr[i]) || 3; // 复制进 const 数组，保持引用
  return true;
}

function formatDate(ts, withTime) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  let s = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  if (withTime) s += ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  return s;
}
function formatDateShort(ts) {
  const d = new Date(ts);
  return (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

/* 开始屏顶部的"继续作答 / 查看上次结果"入口（每次回到开始屏刷新） */
function renderStartEntries() {
  const el = $('#startEntries');
  if (!el) return;
  el.innerHTML = '';
  const data = store.read();

  if (data.progress && Array.isArray(data.progress.answers)) {
    const at = Math.min((data.progress.idx || 0) + 1, TOTAL);
    const b = document.createElement('button');
    b.className = 'start-entry resume';
    b.innerHTML =
      '<span class="se-main"><span class="se-label">上次没测完</span>' +
      '<span class="se-value">继续作答 · 第 ' + at + ' / ' + TOTAL + ' 题</span></span>' +
      '<span class="se-arrow">→</span>';
    b.addEventListener('click', () => {
      loadAnswers(data.progress.answers);
      idx = Math.min(data.progress.idx || 0, TOTAL - 1);
      renderQuestion();
      showScreen('quiz');
    });
    el.appendChild(b);
  }

  const hist = getHistory();
  if (hist.length) {
    const top = hist[0];
    const cn = (TYPES[top.type] && TYPES[top.type].cn) || '';
    const b = document.createElement('button');
    b.className = 'start-entry';
    b.innerHTML =
      '<span class="se-main"><span class="se-label">上次结果 · ' + formatDateShort(top.ts) + '</span>' +
      '<span class="se-value">' + top.type + ' · ' + cn + '</span></span>' +
      '<span class="se-arrow">查看 →</span>';
    b.addEventListener('click', () => {
      loadAnswers(top.answers);
      currentResultTs = top.ts;
      renderResult();
    });
    el.appendChild(b);
  }

  if (hist.length >= 2) {
    const b = document.createElement('button');
    b.className = 'start-entry';
    b.innerHTML =
      '<span class="se-main"><span class="se-label">测试历史</span>' +
      '<span class="se-value">共 ' + hist.length + ' 次 · 看变化</span></span>' +
      '<span class="se-arrow">→</span>';
    b.addEventListener('click', openHistory);
    el.appendChild(b);
  }
}

/* 测试历史浮层：时间线列出每次结果，点任意一条回看 */
function renderHistory() {
  const list = $('#historyList');
  if (!list) return;
  const hist = getHistory();
  list.innerHTML = '';
  hist.forEach((h) => {
    const cn = (TYPES[h.type] && TYPES[h.type].cn) || '';
    const grad = (TYPES[h.type] && TYPES[h.type].grad) || ['#8b7bff', '#b07bff'];
    const item = document.createElement('button');
    item.className = 'hist-item';
    item.innerHTML =
      '<span class="hist-dot" style="background:linear-gradient(135deg,' + grad[0] + ',' + grad[1] + ')"></span>' +
      '<span class="hist-main"><span class="hist-date">' + formatDate(h.ts, true) + '</span>' +
      '<span class="hist-type">' + h.type + ' · ' + cn + '</span></span>' +
      '<span class="hist-arrow">查看 →</span>';
    item.addEventListener('click', () => {
      loadAnswers(h.answers);
      currentResultTs = h.ts;
      closeHistory();
      renderResult();
    });
    list.appendChild(item);
  });
}
function openHistory() { renderHistory(); $('#historyOverlay').classList.add('show'); }
function closeHistory() { $('#historyOverlay').classList.remove('show'); }

/* 结果页"较上次"对比：拿当前展示这次的上一条（更早）做对比 */
function renderCompare(curType) {
  const el = $('#rCompare');
  if (!el) return;
  const hist = getHistory();
  let i = hist.findIndex((h) => h.ts === currentResultTs);
  if (i < 0) i = 0;
  const prev = hist[i + 1];
  if (!prev) { el.style.display = 'none'; el.innerHTML = ''; return; }
  el.style.display = '';
  if (prev.type === curType) {
    el.innerHTML = '<span class="cmp-dot same"></span>较 ' + formatDateShort(prev.ts) + ' · 类型未变';
  } else {
    el.innerHTML = '<span class="cmp-dot diff"></span><b>' + prev.type + '</b> → <b>' + curType +
      '</b> · 较 ' + formatDateShort(prev.ts);
  }
}

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo(0, 0);
  if (name === 'start') renderStartEntries();
}

function pad2(n) { return String(n).padStart(2, '0'); }

function renderQuestion() {
  const q = QUESTIONS[idx];
  qText.textContent = q.text;
  qIndexLabel.textContent = 'QUESTION ' + pad2(idx + 1);
  qCurrent.textContent = idx + 1;
  likert.value = answers[idx];
  updateLikertUI(answers[idx]);
  progressFill.style.width = ((idx + 1) / TOTAL) * 100 + '%';
  prevBtn.disabled = idx === 0;
  nextBtn.textContent = idx === TOTAL - 1 ? '查看结果' : '下一题';
}

function updateLikertUI(val) {
  const v = Number(val);
  ticks.forEach((t, i) => t.classList.toggle('active', i === v - 1));
  likertNow.textContent = LIKERT_TEXT[v - 1];
}

function go(next) {
  if (next === idx) return;
  card.classList.add('swap');
  setTimeout(() => {
    idx = next;
    renderQuestion();
    card.classList.remove('swap');
    saveProgress();
  }, 240);
}

/* ====================== 计分 ====================== */
function computeResult() {
  const score = { EI: 0, SN: 0, TF: 0, JP: 0 };
  QUESTIONS.forEach((q, i) => {
    const contrib = answers[i] - 3; // -2..+2
    const firstLetter = DIMS.find((d) => d.id === q.dim).first;
    score[q.dim] += (q.key === firstLetter) ? contrib : -contrib;
  });

  let typeKey = '';
  const dimResults = DIMS.map((d) => {
    const s = score[d.id];
    const winner = s >= 0 ? d.first : d.second;
    typeKey += winner;
    // 第一字母占比：50% 居中，±24 满偏
    let firstPct = Math.round(50 + (s / 24) * 50);
    firstPct = Math.max(2, Math.min(98, firstPct));
    const winPct = Math.max(firstPct, 100 - firstPct);
    return { ...d, winner, firstPct, winPct };
  });

  return { typeKey, dimResults, score };
}

/* —— 专属人格图形：由四维 score 驱动的确定性极坐标曲线 ——
   均衡(接近0)→ 近圆；偏向越强 → 起伏/花瓣越明显。同样的作答 → 同样的图。 */
function buildShapePath(score, typeKey, cx, cy, base) {
  // 每个维度提供一组 (频率, 振幅, 相位)；频率由类型字母决定，振幅由偏向强度决定
  const freqMap = {
    EI: typeKey[0] === 'E' ? 3 : 4,
    SN: typeKey[1] === 'S' ? 4 : 5,
    TF: typeKey[2] === 'T' ? 2 : 3,
    JP: typeKey[3] === 'J' ? 5 : 6
  };
  const phase = { EI: 0, SN: Math.PI / 5, TF: Math.PI / 2, JP: Math.PI / 3 };
  const waves = ['EI', 'SN', 'TF', 'JP'].map((d, i) => ({
    freq: freqMap[d],
    amp: (Math.min(Math.abs(score[d]), 24) / 24) * (base * 0.17), // 4波叠加上限<base，避免半径变负自交
    ph: phase[d]
  }));

  const STEPS = 120;
  const rMin = base * 0.42; // 兜底，极端偏向也不破形
  let d = '';
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * Math.PI * 2;
    let r = base;
    waves.forEach((w) => { r += w.amp * Math.sin(w.freq * t + w.ph); });
    r = Math.max(r, rMin);
    const x = cx + r * Math.cos(t - Math.PI / 2);
    const y = cy + r * Math.sin(t - Math.PI / 2);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
  }
  return d + 'Z';
}

function renderShape(score, typeKey, grad) {
  const size = 200, cx = 100, cy = 100, base = 62;
  const path = buildShapePath(score, typeKey, cx, cy, base);
  const gid = 'g_' + typeKey;
  $('#rShape').innerHTML =
    '<svg viewBox="0 0 ' + size + ' ' + size + '" width="170" height="170" aria-label="专属人格图形">' +
      '<defs>' +
        '<linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + grad[0] + '"/>' +
          '<stop offset="1" stop-color="' + grad[1] + '"/>' +
        '</linearGradient>' +
        '<filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/>' +
          '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>' +
      '<path d="' + path + '" fill="url(#' + gid + ')" fill-opacity="0.62"' +
        'stroke="rgba(255,255,255,0.85)" stroke-width="1.5" filter="url(#glow)"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="#fff" fill-opacity="0.9"/>' +
    '</svg>';
}

function renderFunctions(typeKey) {
  const stack = STACKS[typeKey];
  const wrap = $('#rFn');
  wrap.innerHTML = '';
  stack.forEach((fn, i) => {
    const row = document.createElement('div');
    row.className = 'fn-row';
    row.innerHTML =
      '<div class="fn-meta">' +
        '<span class="fn-code">' + fn + '</span>' +
        '<span class="fn-name">' + FN_NAME[fn] + '</span>' +
        '<span class="fn-role">' + FN_ROLE[i] + '</span>' +
      '</div>' +
      '<div class="fn-bar"><div class="fn-bar-fill"></div></div>';
    wrap.appendChild(row);
    requestAnimationFrame(() => {
      row.querySelector('.fn-bar-fill').style.width = FN_STRENGTH[i] + '%';
    });
  });
}

let lastResult = null; // 供分享卡复用

function renderResult() {
  const { typeKey, dimResults, score } = computeResult();
  const t = TYPES[typeKey];
  lastResult = { typeKey, score, t };

  $('#rTypeEn').textContent = typeKey;
  $('#rTypeCn').textContent = t.cn;
  $('#rTagline').textContent = t.tagline;
  $('#rDesc').textContent = t.desc;

  // 测试时间 + 与上一次的对比
  $('#rDate').textContent = currentResultTs ? '测于 ' + formatDate(currentResultTs, true) : '';
  renderCompare(typeKey);

  renderShape(score, typeKey, t.grad);
  renderFunctions(typeKey);

  // 维度条
  const dimsEl = $('#rDims');
  dimsEl.innerHTML = '';
  dimResults.forEach((d) => {
    const leftWin = d.winner === d.first;
    const row = document.createElement('div');
    row.className = 'dim-row';
    row.innerHTML =
      '<div class="dim-top">' +
        '<span class="dim-label">' +
          '<span class="' + (leftWin ? 'win' : 'muted') + '">' + d.first + ' ' + d.firstName + '</span>' +
          ' <span class="muted">·</span> ' +
          '<span class="' + (!leftWin ? 'win' : 'muted') + '">' + d.secondName + ' ' + d.second + '</span>' +
        '</span>' +
        '<span class="dim-pct">' + d.winner + ' ' + d.winPct + '%</span>' +
      '</div>' +
      '<div class="dim-bar"><div class="dim-bar-fill"></div></div>';
    dimsEl.appendChild(row);
    // 触发动画：填充宽度 = 第一字母占比
    requestAnimationFrame(() => {
      row.querySelector('.dim-bar-fill').style.width = d.firstPct + '%';
    });
  });

  // 关键词
  const tagsEl = $('#rTags');
  tagsEl.innerHTML = '';
  t.tags.forEach((tag) => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.textContent = tag;
    tagsEl.appendChild(el);
  });

  // 结果卡顶部高光用人格专属渐变
  $('.result-card').style.background =
    'linear-gradient(160deg, ' + hexA(t.grad[0], 0.30) + ', ' + hexA(t.grad[1], 0.16) + ')';

  showScreen('result');
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}

/* ====================== 分享卡（Canvas 重绘，固定尺寸 PNG，朝向锁死） ====================== */
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrapTextCenter(ctx, text, x, y, maxW, lh) {
  let line = '';
  const lines = [];
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxW && line) { lines.push(line); line = ch; }
    else line += ch;
  }
  lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  return lines.length;
}
function drawTags(ctx, tags, cx, y) {
  ctx.font = '500 30px "Noto Sans SC", sans-serif';
  const padX = 26, h = 60, gap = 18;
  const ws = tags.map((t) => ctx.measureText(t).width + padX * 2);
  const total = ws.reduce((a, b) => a + b, 0) + gap * (tags.length - 1);
  let x = cx - total / 2;
  ctx.textBaseline = 'middle';
  tags.forEach((t, i) => {
    roundRectPath(ctx, x, y - h / 2, ws[i], h, h / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,0.30)'; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillText(t, x + ws[i] / 2, y);
    x += ws[i] + gap;
  });
  ctx.textBaseline = 'alphabetic';
}

async function drawShareCard() {
  const { typeKey, score, t } = lastResult;
  const W = 1080, H = 1440;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  try { await document.fonts.ready; } catch (e) { /* 字体未就绪也继续 */ }

  // 背景渐变
  let g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#667eea'); g.addColorStop(0.55, '#764ba2'); g.addColorStop(1, '#6B4FA0');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // 两团柔光
  ctx.globalCompositeOperation = 'lighter';
  let o1 = ctx.createRadialGradient(200, 240, 0, 200, 240, 440);
  o1.addColorStop(0, 'rgba(139,123,255,0.55)'); o1.addColorStop(1, 'rgba(139,123,255,0)');
  ctx.fillStyle = o1; ctx.fillRect(0, 0, W, H);
  let o2 = ctx.createRadialGradient(W - 160, H - 260, 0, W - 160, H - 260, 460);
  o2.addColorStop(0, 'rgba(255,158,216,0.45)'); o2.addColorStop(1, 'rgba(255,158,216,0)');
  ctx.fillStyle = o2; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';

  // 玻璃卡
  const m = 70, cardY = 150, cardH = H - 300, cardW = W - 2 * m;
  roundRectPath(ctx, m, cardY, cardW, cardH, 48);
  ctx.fillStyle = 'rgba(255,255,255,0.13)'; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.stroke();

  ctx.textAlign = 'center';

  // 顶部标签
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '600 34px Outfit, "Noto Sans SC", sans-serif';
  ctx.fillText('MBTI 人格测试', W / 2, cardY + 86);

  // 专属图形（朝向锁死 = 基准朝向）
  const cx = W / 2, cy = cardY + 320, base = 150;
  const p = new Path2D(buildShapePath(score, typeKey, cx, cy, base));
  let sg = ctx.createLinearGradient(cx - base, cy - base, cx + base, cy + base);
  sg.addColorStop(0, t.grad[0]); sg.addColorStop(1, t.grad[1]);
  ctx.save();
  ctx.shadowColor = t.grad[1]; ctx.shadowBlur = 40;
  ctx.globalAlpha = 0.62; ctx.fillStyle = sg; ctx.fill(p);
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.stroke(p);
  ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();

  // 类型 EN
  ctx.fillStyle = '#fff';
  ctx.font = '700 140px Outfit, sans-serif';
  ctx.fillText(typeKey, W / 2, cardY + 690);
  // 类型 CN
  ctx.font = '700 58px "Noto Sans SC", sans-serif';
  ctx.fillText(t.cn, W / 2, cardY + 770);
  // slogan
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.font = '500 42px "Noto Sans SC", sans-serif';
  const lines = wrapTextCenter(ctx, SLOGAN[typeKey], W / 2, cardY + 860, cardW - 120, 58);
  // 关键词
  drawTags(ctx, t.tags, W / 2, cardY + 860 + lines * 58 + 60);
  // 底部引导
  ctx.fillStyle = 'rgba(255,255,255,0.62)';
  ctx.font = '500 32px "Noto Sans SC", sans-serif';
  ctx.fillText('你是哪一种？来测测看 →', W / 2, cardY + cardH - 56);

  return cv.toDataURL('image/png');
}

/* ====================== 事件 ====================== */
// 开始测试 = 全新开始（清空旧进度；上次结果保留，仍可在开始屏回看）
$('#startBtn').addEventListener('click', () => {
  answers.fill(3);
  idx = 0;
  store.clear(['progress']);
  renderQuestion();
  showScreen('quiz');
});

likert.addEventListener('input', (e) => {
  answers[idx] = Number(e.target.value);
  updateLikertUI(e.target.value);
});
likert.addEventListener('change', saveProgress); // 拖动松手即存，刷新不丢

prevBtn.addEventListener('click', () => { if (idx > 0) go(idx - 1); });
nextBtn.addEventListener('click', () => {
  if (idx < TOTAL - 1) go(idx + 1);
  else { saveResult(); renderResult(); }
});

$('#retryBtn').addEventListener('click', () => {
  answers.fill(3);
  idx = 0;
  store.clear(['progress']); // 保留上次结果，仅清进度
  showScreen('start');
});

// 分享卡
$('#shareBtn').addEventListener('click', async () => {
  const btn = $('#shareBtn');
  btn.disabled = true; btn.textContent = '生成中…';
  try {
    const url = await drawShareCard();
    $('#shareImg').src = url;
    $('#shareOverlay').classList.add('show');
  } finally {
    btn.disabled = false; btn.textContent = '生成分享卡';
  }
});
$('#shareClose').addEventListener('click', () => $('#shareOverlay').classList.remove('show'));
$('#shareOverlay').addEventListener('click', (e) => {
  if (e.target === $('#shareOverlay')) $('#shareOverlay').classList.remove('show');
});

// 测试历史浮层
$('#historyClose').addEventListener('click', closeHistory);
$('#historyOverlay').addEventListener('click', (e) => {
  if (e.target === $('#historyOverlay')) closeHistory();
});

/* ====================== 初始化 ====================== */
migrateStore();       // 旧版单条 result → history 数组
renderStartEntries(); // 首屏渲染入口（有存档才出现）
