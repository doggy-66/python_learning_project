const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 16:9

// ====== 配色方案 ======
const C = {
  white:     "ffffff",
  black:     "000000",
  darkGray:  "333333",
  midGray:   "666666",
  lightGray: "cccccc",
  cardBg:    "f5f5f5",
  cardBg2:   "eeeeee",
  accent:    "c0392b",
  accent2:   "e74c3c",
  accentBg:  "fdf0f0",
};

// ====== 参考线：上6 下6 左12 右24 (单位: 0.1英寸) ======
const M = { top: 0.6, bottom: 0.6, left: 1.2, right: 2.4 };

// ====== 字体 ======
const FONT_H = "Microsoft YaHei";
const FONT_B = "Microsoft YaHei";
const CW = 13.33; // 16:9 宽度
const CH = 7.5;   // 16:9 高度
const MW = CW - M.left - M.right;  // 内容区宽度
const MH = CH - M.top - M.bottom;  // 内容区高度

// 内容区 x 起点
const LX = M.left;
const LY = M.top;

// ====== 页脚 ======
function addFooter(slide, pageNum) {
  slide.addText(`大语言模型核心概念入门 · 第 ${pageNum} 页`, {
    x: LX, y: CH - M.bottom + 0.15, w: MW, h: 0.3,
    fontSize: 12, color: C.lightGray, fontFace: FONT_B, align: "center"
  });
}

// ====== 通用标题栏 ======
function addTitle(slide, title, subtitle, pageNum) {
  // 标题背景条
  slide.addShape(pptx.ShapeType.rect, {
    x: LX, y: LY, w: MW, h: 1.1,
    fill: { color: C.white }
  });
  // 标题
  slide.addText(title, {
    x: LX, y: LY + 0.05, w: MW, h: 0.6,
    fontSize: 26, bold: true, color: C.black, fontFace: FONT_H
  });
  // 红色装饰线
  slide.addShape(pptx.ShapeType.rect, {
    x: LX, y: LY + 0.7, w: 1.5, h: 0.04, fill: { color: C.accent }
  });
  // 副标题
  if (subtitle) {
    slide.addText(subtitle, {
      x: LX, y: LY + 0.8, w: MW, h: 0.35,
      fontSize: 12, color: C.midGray, fontFace: FONT_B
    });
  }
  if (pageNum) addFooter(slide, pageNum);
}

// 红色标签卡片
function redLabel(slide, x, y, w, text) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: w, h: 0.5, fill: { color: C.accent }, rectRadius: 0.04
  });
  slide.addText(text, {
    x, y, w, h: 0.5, fontSize: 12, bold: true, color: C.white,
    fontFace: FONT_H, align: "center", valign: "middle"
  });
}

// 灰色卡片
function grayCard(slide, x, y, w, h, title, body, titleSize) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, fill: { color: C.cardBg }, rectRadius: 0.06,
    line: { color: "e0e0e0", width: 0.5 }
  });
  if (title) {
    slide.addText(title, {
      x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.4,
      fontSize: titleSize || 14, bold: true, color: C.black, fontFace: FONT_H
    });
  }
  if (body) {
    slide.addText(body, {
      x: x + 0.15, y: y + (title ? 0.55 : 0.1), w: w - 0.3, h: h - (title ? 0.7 : 0.2),
      fontSize: 12, color: C.darkGray, fontFace: FONT_B, valign: "top"
    });
  }
}

// ============================ 第 1 页：封面 ============================
(function slide01() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  // 左侧大面积红色装饰
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 3.5, h: CH, fill: { color: C.accent } });
  // 装饰条
  s.addShape(pptx.ShapeType.rect, { x: 3.5, y: 0, w: 0.15, h: CH, fill: { color: C.accent2 } });
  // 标题区域
  s.addText("大语言模型", {
    x: 4.2, y: 1.5, w: 8.0, h: 1.2,
    fontSize: 32, bold: true, color: C.black, fontFace: FONT_H
  });
  s.addText("核心概念入门", {
    x: 4.2, y: 2.7, w: 8.0, h: 0.8,
    fontSize: 32, color: C.accent, fontFace: FONT_H
  });
  s.addText("从 Token 到 RAG，全面理解 LLM 技术生态", {
    x: 4.2, y: 3.6, w: 8.0, h: 0.5,
    fontSize: 14, color: C.midGray, fontFace: FONT_B
  });
  s.addText("适用于授课与自学 · 2025", {
    x: 4.2, y: 5.5, w: 8.0, h: 0.4,
    fontSize: 12, color: C.lightGray, fontFace: FONT_B
  });
})();

// ============================ 第 2 页：目录 ============================
(function slide02() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "目录 CONTENTS", "", 2);
  const items = [
    ["01", "什么是 LLM"],
    ["02", "Token 分词"],
    ["03", "Embedding 向量化"],
    ["04", "向量数据库"],
    ["05", "RAG 检索增强生成"],
    ["06", "MCP 模型上下文协议"],
    ["07", "知识全景与学习路线"],
  ];
  items.forEach((r, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i < 4 ? i : i - 4;
    const x = LX + col * (MW / 2 + 0.2);
    const w = MW / 2 - 0.2;
    const y = LY + 1.5 + row * 1.2;
    grayCard(s, x, y, w, 0.95, null, null, 0);
    s.addShape(pptx.ShapeType.rect, {
      x: x, y: y, w: 0.06, h: 0.95, fill: { color: C.accent }
    });
    s.addText(r[0], {
      x: x + 0.3, y: y + 0.1, w: 0.8, h: 0.75,
      fontSize: 22, bold: true, color: C.accent, fontFace: FONT_H, valign: "middle"
    });
    s.addText(r[1], {
      x: x + 1.2, y: y + 0.1, w: w - 1.4, h: 0.75,
      fontSize: 16, bold: true, color: C.black, fontFace: FONT_H, valign: "middle"
    });
  });
  addFooter(s, 2);
})();

// ============================ 第 3 页：什么是 LLM ============================
(function slide03() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "01  什么是 LLM", "大语言模型 = AI 的\u201C大脑\u201D", 3);
  
  s.addText("🧠", {
    x: LX, y: LY + 1.5, w: MW, h: 0.8,
    fontSize: 32, align: "center", color: C.accent
  });
  s.addText("LLM 是基于海量文本数据训练而成的深度神经网络模型，\n能够理解并生成人类语言。", {
    x: LX + 1.0, y: LY + 2.3, w: MW - 2.0, h: 1.0,
    fontSize: 14, color: C.darkGray, fontFace: FONT_B, align: "center"
  });
  const tags = ["代码生成", "语义理解", "逻辑推理", "对话问答", "文本创作", "翻译摘要"];
  tags.forEach((t, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = LX + 1.5 + col * 3.0;
    const y = LY + 3.5 + row * 0.7;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 2.6, h: 0.5, fill: { color: C.accentBg },
      line: { color: C.accent, width: 0.5 }
    });
    s.addText(t, {
      x, y, w: 2.6, h: 0.5, fontSize: 12, color: C.accent,
      fontFace: FONT_B, align: "center", valign: "middle"
    });
  });
  addFooter(s, 3);
})();

// ============================ 第 4 页：Transformer 架构 ============================
(function slide04() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "Transformer 架构", "所有现代 LLM 的基石 (2017, Google)", 4);
  
  const steps = [
    ["输入文本", "将原始文本切分为 Token 序列"],
    ["位置编码", "为每个 Token 添加位置信息"],
    ["多头自注意力", "同时捕捉多个子空间的词间关系"],
    ["前馈网络", "非线性变换增强表达能力"],
    ["输出概率", "通过 Softmax 预测下一个 Token"],
  ];
  steps.forEach((st, i) => {
    const y = LY + 1.5 + i * 0.95;
    grayCard(s, LX, y, MW, 0.82, null, null, 0);
    s.addShape(pptx.ShapeType.ellipse, {
      x: LX + 0.15, y: y + 0.12, w: 0.55, h: 0.55, fill: { color: C.accent }
    });
    s.addText(`${i + 1}`, {
      x: LX + 0.15, y: y + 0.12, w: 0.55, h: 0.55,
      fontSize: 14, bold: true, color: C.white, fontFace: FONT_H, align: "center", valign: "middle"
    });
    s.addText(st[0], {
      x: LX + 1.0, y: y + 0.05, w: 3.5, h: 0.7,
      fontSize: 16, bold: true, color: C.black, fontFace: FONT_H, valign: "middle"
    });
    s.addText(st[1], {
      x: LX + 4.5, y: y + 0.05, w: MW - 4.7, h: 0.7,
      fontSize: 12, color: C.midGray, fontFace: FONT_B, valign: "middle"
    });
  });
  addFooter(s, 4);
})();

// ============================ 第 5 页：LLM 训练三阶段 ============================
(function slide05() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "LLM 训练三阶段", "从海量数据到符合人类偏好", 5);
  
  const stages = [
    { icon: "📚", title: "预训练", sub: "Pre-training", desc: "在海量互联网语料、书籍上训练\n让模型学会语法、知识和推理能力", color: C.accent },
    { icon: "🔧", title: "微调", sub: "Fine-tuning", desc: "在特定任务数据集上进一步训练\n让模型适配代码生成、对话等场景", color: C.accent2 },
    { icon: "🎯", title: "RLHF", sub: "人类对齐", desc: "基于人类反馈的强化学习\n让模型输出有用、诚实、无害", color: C.accent },
  ];
  stages.forEach((st, i) => {
    const x = LX + i * (MW / 3 + 0.1);
    const w = MW / 3 - 0.2;
    grayCard(s, x, LY + 1.5, w, 3.5, null, null, 0);
    s.addShape(pptx.ShapeType.rect, {
      x: x, y: LY + 1.5, w: w, h: 0.06, fill: { color: st.color }
    });
    s.addText(st.icon, {
      x: x, y: LY + 1.8, w, h: 0.5, fontSize: 24, align: "center"
    });
    s.addText(st.title, {
      x: x, y: LY + 2.4, w, h: 0.5, fontSize: 18, bold: true,
      color: C.black, fontFace: FONT_H, align: "center"
    });
    s.addText(st.sub, {
      x: x, y: LY + 2.85, w, h: 0.3, fontSize: 12, color: C.midGray,
      fontFace: FONT_B, align: "center"
    });
    s.addText(st.desc, {
      x: x + 0.2, y: LY + 3.3, w: w - 0.4, h: 1.5,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B, align: "center", valign: "top"
    });
  });
  addFooter(s, 5);
})();

// ============================ 第 6 页：知名模型一览 ============================
(function slide06() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "知名模型一览", "主流厂商与代表模型 (截至 2025)", 6);
  
  const models = [
    { company: "OpenAI", model: "GPT-4o", ctx: "128K~1M" },
    { company: "Anthropic", model: "Claude 3.5", ctx: "200K" },
    { company: "Google", model: "Gemini 2.0", ctx: "1M~2M" },
    { company: "Meta", model: "Llama 4", ctx: "128K" },
    { company: "DeepSeek", model: "DeepSeek-V3", ctx: "128K" },
    { company: "阿里云", model: "Qwen 3", ctx: "128K~1M" },
  ];
  models.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = LX + col * (MW / 3 + 0.15);
    const w = MW / 3 - 0.25;
    const y = LY + 1.5 + row * 2.3;
    grayCard(s, x, y, w, 2.0);
    s.addText(m.company, {
      x: x + 0.15, y: y + 0.15, w: w - 0.3, h: 0.3,
      fontSize: 12, color: C.midGray, fontFace: FONT_B
    });
    s.addText(m.model, {
      x: x + 0.15, y: y + 0.5, w: w - 0.3, h: 0.6,
      fontSize: 22, bold: true, color: C.black, fontFace: FONT_H
    });
    s.addText(`上下文: ${m.ctx}`, {
      x: x + 0.15, y: y + 1.3, w: w - 0.3, h: 0.4,
      fontSize: 12, color: C.accent, fontFace: FONT_B
    });
  });
  addFooter(s, 6);
})();

// ============================ 第 7 页：Token 分词 ============================
(function slide07() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "02  Token 分词", "大语言模型的最小处理单位", 7);
  
  // 定义卡片
  grayCard(s, LX, LY + 1.5, MW, 0.85,
    "定义: Token 是 LLM 处理文本的最小基本单位",
    "≈0.75 个英文单词 ≈1.5 个中文字   |   按 BPE / SentencePiece 算法切分"
  );
  
  // 分词示例
  s.addText("分词示例 (BPE 算法)", {
    x: LX, y: LY + 2.6, w: MW, h: 0.35,
    fontSize: 14, bold: true, color: C.black, fontFace: FONT_H
  });
  grayCard(s, LX, LY + 3.0, MW / 2 - 0.1, 1.1,
    "\"Hello World\"",
    "→ [\"Hello\", \" World\"]\n共 2 个 Token"
  );
  grayCard(s, LX + MW / 2 + 0.1, LY + 3.0, MW / 2 - 0.1, 1.1,
    "\"大语言模型\"",
    "→ [\"大\", \"语言\", \"模型\"]\n约 4~6 个 Token"
  );
  
  // Token 估算表
  s.addText("Token 数量估算", {
    x: LX, y: LY + 4.35, w: MW, h: 0.35,
    fontSize: 14, bold: true, color: C.black, fontFace: FONT_H
  });
  const estData = [
    ["1 个英文单词", "≈ 1.3 Token"],
    ["1 个中文字", "≈ 1.5 Token"],
    ["1 页英文文档", "≈ 500 Token"],
    ["128K 上下文窗口", "≈ 250 页英文 / 170 页中文"],
  ];
  estData.forEach((r, i) => {
    s.addText(r[0], {
      x: LX, y: LY + 4.75 + i * 0.35, w: MW / 2, h: 0.3,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B
    });
    s.addText(r[1], {
      x: LX + MW / 2, y: LY + 4.75 + i * 0.35, w: MW / 2, h: 0.3,
      fontSize: 12, bold: true, color: C.accent, fontFace: FONT_B
    });
  });
  addFooter(s, 7);
})();

// ============================ 第 8 页：Token 成本与上下文窗口 ============================
(function slide08() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "Token 成本与上下文窗口", "Token 决定成本、速度和能力上限", 8);
  
  const cols = [
    { icon: "💰", title: "成本", desc: "按 Token 计费\n输入 + 输出\n模型越大越贵\n\n用简洁 Prompt 省钱" },
    { icon: "⚡", title: "速度", desc: "Token 数越少\n响应越快\n\n批量处理可\n降低延迟" },
    { icon: "📏", title: "上下文窗口", desc: "GPT-4: 128K\nClaude: 200K\nGemini: 1M~2M\n\n超限需截断或压缩" },
  ];
  cols.forEach((c, i) => {
    const x = LX + i * (MW / 3 + 0.15);
    const w = MW / 3 - 0.25;
    grayCard(s, x, LY + 1.5, w, 4.5, null, null, 0);
    s.addShape(pptx.ShapeType.rect, {
      x: x, y: LY + 1.5, w, h: 0.05, fill: { color: C.accent }
    });
    s.addText(c.icon, {
      x, y: LY + 1.7, w, h: 0.6, fontSize: 28, align: "center"
    });
    s.addText(c.title, {
      x, y: LY + 2.3, w, h: 0.5, fontSize: 16, bold: true,
      color: C.black, fontFace: FONT_H, align: "center"
    });
    s.addText(c.desc, {
      x: x + 0.2, y: LY + 2.9, w: w - 0.4, h: 2.9,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B, align: "center", valign: "top"
    });
  });
  addFooter(s, 8);
})();

// ============================ 第 9 页：Embedding 向量化 ============================
(function slide09() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "03  Embedding 向量化", "让计算机\u201C理解\u201D语义的数学方法", 9);
  
  grayCard(s, LX, LY + 1.5, MW, 0.85,
    "核心概念: 将文本/图片转为固定长度的浮点数向量",
    "语义相近的内容 → 向量空间中距离更近   |   用余弦相似度衡量两个向量的语义接近程度"
  );
  
  const cards = [
    ["语义向量", "文本映射到高维空间中的点\n(如 768 / 1024 / 1536 维)"],
    ["余弦相似度", "衡量两个向量的方向相似度\n值越大 → 语义越接近"],
    ["Embedding 模型", "text-embedding-3-small\nBGE / text2vec 等"],
    ["维度选择", "高维(1536): 更精确但慢\n低维(384): 快但精度略低"],
  ];
  cards.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = LX + col * (MW / 2 + 0.15);
    const w = MW / 2 - 0.15;
    const y = LY + 2.6 + row * 1.7;
    grayCard(s, x, y, w, 1.5, null, null, 0);
    s.addShape(pptx.ShapeType.rect, {
      x: x, y: y, w: w, h: 0.04, fill: { color: C.accent }
    });
    s.addText(c[0], {
      x: x + 0.15, y: y + 0.15, w: w - 0.3, h: 0.4,
      fontSize: 15, bold: true, color: C.black, fontFace: FONT_H
    });
    s.addText(c[1], {
      x: x + 0.15, y: y + 0.6, w: w - 0.3, h: 0.75,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B
    });
  });
  addFooter(s, 9);
})();

// ============================ 第 10 页：Embedding 应用场景 ============================
(function slide10() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "Embedding 应用场景", "从搜索到推荐，语义向量无处不在", 10);
  
  const apps = [
    { icon: "🔍", title: "RAG 检索增强", desc: "文档片段向量化存入数据库\n用户提问也向量化匹配最相关片段" },
    { icon: "💬", title: "语义搜索", desc: "传统关键词→语义匹配\n输入自然语言即可找到意思相近的内容" },
    { icon: "📊", title: "文本聚类/分类", desc: "按语义自动归类文档\n相似内容自动成组、异常检测去重" },
    { icon: "🎯", title: "推荐系统", desc: "用户行为向量化 + 物品特征向量化\n相似度计算推荐相关内容" },
  ];
  apps.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = LX + col * (MW / 2 + 0.2);
    const w = MW / 2 - 0.2;
    const y = LY + 1.5 + row * 2.3;
    grayCard(s, x, y, w, 2.1, null, null, 0);
    s.addText(a.icon, {
      x: x + 0.15, y: y + 0.15, w: 0.6, h: 0.6, fontSize: 28, align: "center"
    });
    s.addText(a.title, {
      x: x + 0.9, y: y + 0.15, w: w - 1.1, h: 0.5,
      fontSize: 14, bold: true, color: C.black, fontFace: FONT_H
    });
    s.addText(a.desc, {
      x: x + 0.3, y: y + 0.8, w: w - 0.6, h: 1.1,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B, valign: "top"
    });
  });
  addFooter(s, 10);
})();

// ============================ 第 11 页：向量数据库 ============================
(function slide11() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "04  向量数据库", "专门存储和检索高维语义向量", 11);
  
  grayCard(s, LX, LY + 1.5, MW, 0.85,
    "为什么需要向量数据库？",
    "传统数据库无法进行语义匹配。向量数据库用索引算法（HNSW/IVF）在大规模向量集中毫秒级找到最相似的 Top-K 结果。"
  );
  
  const algos = [
    { tag: "最常用 · 高精度", title: "HNSW 分层导航", desc: "分层可导航小世界图\n毫秒级搜索响应\n适合高精度场景" },
    { tag: "速度快 · 精度略低", title: "IVF 倒排索引", desc: "将向量空间分为多个聚类\n只在相近聚类内搜索\n适合超大规模数据" },
    { tag: "核心思想", title: "ANN 近似最近邻", desc: "牺牲极小精度\n换取千倍以上的搜索速度\n是向量数据库的默认搜索方式" },
  ];
  algos.forEach((a, i) => {
    const x = LX + i * (MW / 3 + 0.1);
    const w = MW / 3 - 0.2;
    grayCard(s, x, LY + 2.7, w, 3.2, null, null, 0);
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.15, y: LY + 2.85, w: w - 0.3, h: 0.4,
      fill: { color: C.accentBg }, line: { color: C.accent, width: 0.5 }, rectRadius: 0.04
    });
    s.addText(a.tag, {
      x: x + 0.15, y: LY + 2.85, w: w - 0.3, h: 0.4,
      fontSize: 12, color: C.accent, fontFace: FONT_B, align: "center", valign: "middle"
    });
    s.addText(a.title, {
      x: x + 0.15, y: LY + 3.4, w: w - 0.3, h: 0.5,
      fontSize: 15, bold: true, color: C.black, fontFace: FONT_H, align: "center"
    });
    s.addText(a.desc, {
      x: x + 0.15, y: LY + 3.9, w: w - 0.3, h: 1.8,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B, align: "center", valign: "top"
    });
  });
  addFooter(s, 11);
})();

// ============================ 第 12 页：主流向量数据库对比 ============================
(function slide12() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "主流向量数据库对比", "选择适合你场景的向量数据库", 12);
  
  const headerY = LY + 1.5;
  const colW = [2.5, 2.0, 2.5, 3.0];
  const colX = [LX];
  for (let i = 1; i < 4; i++) colX.push(colX[i - 1] + colW[i - 1]);
  
  ["名称", "部署方式", "核心特点", "适用场景"].forEach((h, i) => {
    s.addShape(pptx.ShapeType.rect, {
      x: colX[i], y: headerY, w: colW[i], h: 0.5, fill: { color: C.accent }
    });
    s.addText(h, {
      x: colX[i], y: headerY, w: colW[i], h: 0.5,
      fontSize: 12, bold: true, color: C.white, fontFace: FONT_H, align: "center", valign: "middle"
    });
  });
  
  const dbs = [
    ["Pinecone", "全托管 SaaS", "零运维 · 自动扩缩", "生产环境快速上手"],
    ["Milvus", "自建/托管", "云原生 · GPU 加速", "企业级大规模部署"],
    ["Qdrant", "自建/托管", "轻量 · Rust 编写", "中小规模 / 边缘计算"],
    ["Chroma", "嵌入式", "Python 原生 · 开发友好", "原型开发 / 学习实验"],
  ];
  dbs.forEach((db, row) => {
    const y = headerY + 0.55 + row * 0.7;
    db.forEach((cell, col) => {
      s.addShape(pptx.ShapeType.rect, {
        x: colX[col], y, w: colW[col], h: 0.65,
        fill: { color: row % 2 === 0 ? C.white : C.cardBg }
      });
      s.addText(cell, {
        x: colX[col] + 0.1, y, w: colW[col] - 0.2, h: 0.65,
        fontSize: 12, bold: col === 0, color: col === 0 ? C.black : C.darkGray,
        fontFace: FONT_B, align: col === 0 ? "center" : "left", valign: "middle"
      });
    });
  });
  addFooter(s, 12);
})();

// ============================ 第 13 页：RAG 检索增强生成 ============================
(function slide13() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "05  RAG 检索增强生成", "给 LLM 装上一个\u201C随身图书馆\u201D", 13);
  
  const ragSteps = [
    { icon: "📄", title: "文档切分", desc: "PDF/网页 → 语义片段" },
    { icon: "🔢", title: "Embedding", desc: "文本片段 → 语义向量" },
    { icon: "🗄️", title: "向量存储", desc: "语义向量存入向量数据库" },
    { icon: "🔍", title: "检索", desc: "查询向量化 → 搜索 Top-K 相似片段" },
    { icon: "🧠", title: "LLM 生成", desc: "参考检索到的资料 + 用户问题 → 生成准确答案" },
  ];
  ragSteps.forEach((st, i) => {
    const y = LY + 1.5 + i * 0.95;
    grayCard(s, LX, y, MW, 0.82, null, null, 0);
    s.addShape(pptx.ShapeType.ellipse, {
      x: LX + 0.15, y: y + 0.12, w: 0.55, h: 0.55, fill: { color: C.accent }
    });
    s.addText(`${i + 1}`, {
      x: LX + 0.15, y: y + 0.12, w: 0.55, h: 0.55,
      fontSize: 14, bold: true, color: C.white, fontFace: FONT_H, align: "center", valign: "middle"
    });
    s.addText(st.icon, {
      x: LX + 0.85, y: y, w: 0.5, h: 0.82, fontSize: 18, align: "center", valign: "middle"
    });
    s.addText(st.title, {
      x: LX + 1.4, y: y + 0.05, w: 2.5, h: 0.7,
      fontSize: 15, bold: true, color: C.black, fontFace: FONT_H, valign: "middle"
    });
    s.addText(st.desc, {
      x: LX + 4.0, y: y + 0.05, w: MW - 4.2, h: 0.7,
      fontSize: 12, color: C.midGray, fontFace: FONT_B, valign: "middle"
    });
  });
  addFooter(s, 13);
})();

// ============================ 第 14 页：RAG vs 纯 LLM ============================
(function slide14() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "RAG vs 纯 LLM", "从\u201C闭卷考试\u201D到\u201C开卷考试\u201D", 14);
  
  // 左侧
  grayCard(s, LX, LY + 1.5, MW / 2 - 0.15, 4.5, null, null, 0);
  s.addShape(pptx.ShapeType.roundRect, {
    x: LX, y: LY + 1.5, w: MW / 2 - 0.15, h: 0.7, fill: { color: C.midGray }, rectRadius: 0.06
  });
  s.addText("❌  纯 LLM（闭卷）", {
    x: LX, y: LY + 1.5, w: MW / 2 - 0.15, h: 0.7,
    fontSize: 14, bold: true, color: C.white, fontFace: FONT_H, align: "center", valign: "middle"
  });
  const bad = ["依赖训练数据(有截止日期)", "可能产生幻觉", "无法访问最新信息", "无法溯源答案依据", "知识不能动态更新"];
  bad.forEach((t, i) => s.addText(`· ${t}`, {
    x: LX + 0.3, y: LY + 2.6 + i * 0.55, w: MW / 2 - 0.8, h: 0.45,
    fontSize: 12, color: C.darkGray, fontFace: FONT_B
  }));
  
  // 右侧
  grayCard(s, LX + MW / 2 + 0.15, LY + 1.5, MW / 2 - 0.15, 4.5, null, null, 0);
  s.addShape(pptx.ShapeType.roundRect, {
    x: LX + MW / 2 + 0.15, y: LY + 1.5, w: MW / 2 - 0.15, h: 0.7, fill: { color: C.accent }, rectRadius: 0.06
  });
  s.addText("✅  RAG（开卷）", {
    x: LX + MW / 2 + 0.15, y: LY + 1.5, w: MW / 2 - 0.15, h: 0.7,
    fontSize: 14, bold: true, color: C.white, fontFace: FONT_H, align: "center", valign: "middle"
  });
  const good = ["答案基于外部知识库", "准确可靠 · 减少幻觉", "知识可实时动态更新", "每条答案可溯源", "支持文档管理"];
  good.forEach((t, i) => s.addText(`· ${t}`, {
    x: LX + MW / 2 + 0.45, y: LY + 2.6 + i * 0.55, w: MW / 2 - 0.8, h: 0.45,
    fontSize: 12, color: C.darkGray, fontFace: FONT_B
  }));
  addFooter(s, 14);
})();

// ============================ 第 15 页：MCP 模型上下文协议 ============================
(function slide15() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "06  MCP 模型上下文协议", "给 LLM 装上一套\u201CUSB 接口\u201D", 15);
  
  grayCard(s, LX, LY + 1.5, MW, 1.1,
    "Anthropic 2024 年提出的开放标准协议",
    "让 LLM 能安全、统一地连接外部工具和数据源。无论后面接的是数据库、文件系统还是第三方 API，都通过同一个标准协议通信——开发者只需实现一次 MCP Server，即可被任何 LLM 客户端复用。"
  );
  
  const concepts = [
    { icon: "📁", title: "资源 Resources", desc: "只读数据源\n文件内容 / 数据库记录\n通过 URI 地址访问" },
    { icon: "🔧", title: "工具 Tools", desc: "动态操作\n写文件 / 发邮件 / 查天气\n有清晰的入参出参 Schema" },
    { icon: "📋", title: "提示词 Prompts", desc: "预置 Prompt 模板\n帮助 LLM 理解特定场景\n如何调用工具或使用资源" },
  ];
  concepts.forEach((c, i) => {
    const x = LX + i * (MW / 3 + 0.1);
    const w = MW / 3 - 0.2;
    grayCard(s, x, LY + 3.0, w, 2.8);
    s.addText(c.icon, {
      x, y: LY + 3.15, w, h: 0.5, fontSize: 28, align: "center"
    });
    s.addShape(pptx.ShapeType.rect, {
      x: x, y: LY + 3.0, w, h: 0.04, fill: { color: C.accent }
    });
    s.addText(c.title, {
      x: x + 0.15, y: LY + 3.7, w: w - 0.3, h: 0.5,
      fontSize: 13, bold: true, color: C.black, fontFace: FONT_H, align: "center"
    });
    s.addText(c.desc, {
      x: x + 0.15, y: LY + 4.2, w: w - 0.3, h: 1.5,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B, align: "center", valign: "top"
    });
  });
  addFooter(s, 15);
})();

// ============================ 第 16 页：MCP 架构详解 ============================
(function slide16() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "MCP 架构详解", "Server → Client → Transport 三层架构", 16);
  
  // Server
  grayCard(s, LX, LY + 1.5, MW / 2 - 0.25, 2.0,
    "MCP Server（服务端）",
    "· 暴露资源、工具和 Prompt 模板\n· 独立服务进程\n· 遵循 MCP 标准协议通信"
  );
  s.addShape(pptx.ShapeType.rect, {
    x: LX, y: LY + 1.5, w: MW / 2 - 0.25, h: 0.04, fill: { color: C.accent }
  });
  
  // Client
  grayCard(s, LX + MW / 2 + 0.25, LY + 1.5, MW / 2 - 0.25, 2.0,
    "MCP Client（客户端）",
    "· 运行在 LLM 侧\n· 发现 Server 能力\n· 调度工具调用"
  );
  s.addShape(pptx.ShapeType.rect, {
    x: LX + MW / 2 + 0.25, y: LY + 1.5, w: MW / 2 - 0.25, h: 0.04, fill: { color: C.accent2 }
  });
  
  // 箭头
  s.addText("⟷  双向通信", {
    x: LX, y: LY + 3.6, w: MW, h: 0.4,
    fontSize: 12, color: C.accent, fontFace: FONT_B, align: "center"
  });
  
  // Transport
  grayCard(s, LX, LY + 4.1, MW, 1.6,
    "Transport 传输层",
    ""
  );
  s.addText("stdio（本地进程通信）", {
    x: LX, y: LY + 4.7, w: MW / 2, h: 0.4,
    fontSize: 13, bold: true, color: C.accent, fontFace: FONT_H, align: "center"
  });
  s.addText("适用本地工具 · 零网络开销", {
    x: LX, y: LY + 5.05, w: MW / 2, h: 0.3,
    fontSize: 12, color: C.midGray, fontFace: FONT_B, align: "center"
  });
  s.addText("SSE（远程 HTTP 长连接）", {
    x: LX + MW / 2, y: LY + 4.7, w: MW / 2, h: 0.4,
    fontSize: 13, bold: true, color: C.accent2, fontFace: FONT_H, align: "center"
  });
  s.addText("适用云端服务 · 远程调用", {
    x: LX + MW / 2, y: LY + 5.05, w: MW / 2, h: 0.3,
    fontSize: 12, color: C.midGray, fontFace: FONT_B, align: "center"
  });
  addFooter(s, 16);
})();

// ============================ 第 17 页：知识全景图 ============================
(function slide17() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "07  知识全景图", "6 个概念的关联关系总览", 17);
  
  const CX = LX + MW / 2;     // 页面中心 X
  const BOX_W = 2.3;           // 概念框宽度
  const BOX_H = 0.5;           // 概念框高度
  const CENTER_W = 2.2;        // 中心 LLM 圆宽度
  const CENTER_H = 1.3;        // 中心 LLM 圆高度
  
  // ===== 概念框位置（左右两列,各3行）=====
  const leftConcepts = [
    { name: "Transformer", rel: "核心架构" },
    { name: "Token 分词", rel: "最小处理单位" },
    { name: "Embedding", rel: "语义向量化" },
  ];
  const rightConcepts = [
    { name: "向量数据库", rel: "存储与检索" },
    { name: "RAG", rel: "检索增强生成" },
    { name: "MCP 协议", rel: "连接外部工具" },
  ];
  
  const rowH = 1.6;
  const colStartY = LY + 1.5;
  const leftX = LX + 0.3;
  const rightX = LX + MW - BOX_W - 0.3;
  const centerX1 = CX - CENTER_W / 2;
  const centerY1 = colStartY + rowH;  // LLM center line
  
  // 画概念框
  leftConcepts.forEach((c, i) => {
    const y = colStartY + i * rowH;
    // 框
    s.addShape(pptx.ShapeType.roundRect, {
      x: leftX, y, w: BOX_W, h: BOX_H, fill: { color: C.cardBg },
      line: { color: C.lightGray, width: 0.5 }, rectRadius: 0.04
    });
    s.addText(c.name, {
      x: leftX, y, w: BOX_W, h: BOX_H, fontSize: 12, bold: true,
      color: C.black, fontFace: FONT_H, align: "center", valign: "middle"
    });
    
    // 水平连线（用细矩形模拟）
    const lineX = leftX + BOX_W;
    const lineW = centerX1 - lineX;
    const lineY = y + BOX_H / 2 - 0.03;
    s.addShape(pptx.ShapeType.rect, {
      x: lineX, y: lineY, w: lineW, h: 0.06, fill: { color: C.accent }
    });
    
    // 关系标签
    s.addText(c.rel, {
      x: lineX + 0.15, y: lineY - 0.3, w: lineW - 0.3, h: 0.25,
      fontSize: 12, color: C.accent, fontFace: FONT_B, align: "center", italic: true
    });
  });
  
  rightConcepts.forEach((c, i) => {
    const y = colStartY + i * rowH;
    s.addShape(pptx.ShapeType.roundRect, {
      x: rightX, y, w: BOX_W, h: BOX_H, fill: { color: C.cardBg },
      line: { color: C.lightGray, width: 0.5 }, rectRadius: 0.04
    });
    s.addText(c.name, {
      x: rightX, y, w: BOX_W, h: BOX_H, fontSize: 12, bold: true,
      color: C.black, fontFace: FONT_H, align: "center", valign: "middle"
    });
    
    const lineX = centerX1 + CENTER_W;
    const lineW = rightX - lineX;
    const lineY = y + BOX_H / 2 - 0.03;
    s.addShape(pptx.ShapeType.rect, {
      x: lineX, y: lineY, w: lineW, h: 0.06, fill: { color: C.accent }
    });
    s.addText(c.rel, {
      x: lineX + 0.15, y: lineY - 0.3, w: lineW - 0.3, h: 0.25,
      fontSize: 12, color: C.accent, fontFace: FONT_B, align: "center", italic: true
    });
  });
  
  // 中心 LLM 椭圆
  s.addShape(pptx.ShapeType.ellipse, {
    x: centerX1, y: centerY1, w: CENTER_W, h: CENTER_H, fill: { color: C.accent }
  });
  s.addText("LLM\n大语言模型", {
    x: centerX1, y: centerY1, w: CENTER_W, h: CENTER_H,
    fontSize: 15, bold: true, color: C.white, fontFace: FONT_H, align: "center", valign: "middle"
  });
  
  // 底部流程总结
  s.addText("Token → Embedding → 向量数据库 → RAG → MCP 协议", {
    x: LX, y: CH - M.bottom - 0.3, w: MW, h: 0.25,
    fontSize: 12, color: C.midGray, fontFace: FONT_B, align: "center"
  });
  
  addFooter(s, 17);
})();

// ============================ 第 18 页：学习路线 ============================
(function slide18() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "学习路线建议", "从基础到高级，循序渐进", 18);
  
  const route = [
    { step: "1", title: "Token 分词", desc: "理解 LLM 的\u201C语言\u201D", days: "1~2 天" },
    { step: "2", title: "LLM 架构", desc: "Transformer + 训练范式", days: "3~5 天" },
    { step: "3", title: "Embedding", desc: "语义向量与相似度", days: "2~3 天" },
    { step: "4", title: "向量数据库", desc: "存储与检索高维向量", days: "3~5 天" },
    { step: "5", title: "RAG 实战", desc: "搭建一个智能问答系统", days: "5~7 天" },
    { step: "6", title: "MCP 协议", desc: "LLM 连接万物的接口", days: "3~5 天" },
  ];
  route.forEach((r, i) => {
    const y = LY + 1.5 + i * 0.8;
    grayCard(s, LX, y, MW, 0.68, null, null, 0);
    if (i % 2 === 0) {
      s.addShape(pptx.ShapeType.rect, {
        x: LX, y: y, w: 0.05, h: 0.68, fill: { color: C.accent }
      });
    } else {
      s.addShape(pptx.ShapeType.rect, {
        x: LX, y: y, w: 0.05, h: 0.68, fill: { color: C.accent2 }
      });
    }
    s.addShape(pptx.ShapeType.ellipse, {
      x: LX + 0.3, y: y + 0.09, w: 0.5, h: 0.5, fill: { color: C.accent }
    });
    s.addText(r.step, {
      x: LX + 0.3, y: y + 0.09, w: 0.5, h: 0.5,
      fontSize: 14, bold: true, color: C.white, fontFace: FONT_H, align: "center", valign: "middle"
    });
    s.addText(r.title, {
      x: LX + 1.1, y: y + 0.05, w: 2.5, h: 0.55,
      fontSize: 15, bold: true, color: C.black, fontFace: FONT_H, valign: "middle"
    });
    s.addText(r.desc, {
      x: LX + 3.8, y: y + 0.05, w: 3.5, h: 0.55,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B, valign: "middle"
    });
    s.addText(r.days, {
      x: LX + 7.5, y: y + 0.05, w: MW - 7.7, h: 0.55,
      fontSize: 12, bold: true, color: C.accent, fontFace: FONT_B, valign: "middle"
    });
  });
  addFooter(s, 18);
})();

// ============================ 第 19 页：总结与展望 ============================
(function slide19() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addTitle(s, "总结与展望", "核心要点回顾", 19);
  
  const summaries = [
    { icon: "🧠", title: "LLM 是核心", desc: "Transformer 架构 + 三阶段训练\n所有 AI 应用的\u201C大脑\u201D" },
    { icon: "🔤", title: "Token 是基础", desc: "计费、速度、上下文的计算单位\n简单但影响深远" },
    { icon: "🔢", title: "Embedding 是桥梁", desc: "让计算机理解语义\n是 RAG 和搜索的关键" },
    { icon: "🗄️", title: "向量数据库是引擎", desc: "存储和检索语义向量\n核心基础设施" },
    { icon: "📚", title: "RAG 是应用范式", desc: "外挂知识库\n让 LLM 从闭卷变开卷" },
    { icon: "🔌", title: "MCP 是未来", desc: "开放标准\n让 LLM 安全连接万物" },
  ];
  summaries.forEach((sm, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = LX + col * (MW / 3 + 0.12);
    const w = MW / 3 - 0.2;
    const y = LY + 1.5 + row * 2.3;
    grayCard(s, x, y, w, 2.1);
    s.addText(sm.icon, {
      x, y: y + 0.15, w, h: 0.45, fontSize: 24, align: "center"
    });
    s.addText(sm.title, {
      x: x + 0.1, y: y + 0.6, w: w - 0.2, h: 0.4,
      fontSize: 13, bold: true, color: C.accent, fontFace: FONT_H, align: "center"
    });
    s.addText(sm.desc, {
      x: x + 0.1, y: y + 1.1, w: w - 0.2, h: 0.8,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B, align: "center"
    });
  });
  addFooter(s, 19);
})();

// ============================ 第 20 页：Q&A ============================
(function slide20() {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  // 红色宽条
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: CW, h: 2.0, fill: { color: C.accent }
  });
  s.addText("Q & A", {
    x: 0, y: 0.3, w: CW, h: 1.0,
    fontSize: 32, bold: true, color: C.white, fontFace: FONT_H, align: "center"
  });
  s.addText("欢迎提问", {
    x: 0, y: 1.2, w: CW, h: 0.5,
    fontSize: 16, color: C.white, fontFace: FONT_B, align: "center", transparency: "20%"
  });
  
  s.addText("推荐学习资源", {
    x: LX, y: 2.5, w: MW, h: 0.5,
    fontSize: 16, bold: true, color: C.accent, fontFace: FONT_H
  });
  
  const refs = [
    "Attention Is All You Need (2017) — Transformer 原论文",
    "OpenAI GPT-4 Technical Report",
    "Anthropic MCP 官方文档 & GitHub",
    "Pinecone / Milvus 向量数据库官方文档",
    "LangChain / LlamaIndex RAG 框架文档",
  ];
  refs.forEach((r, i) => {
    s.addText(`📖  ${r}`, {
      x: LX, y: 3.2 + i * 0.45, w: MW, h: 0.4,
      fontSize: 12, color: C.darkGray, fontFace: FONT_B
    });
  });
  
  addFooter(s, 20);
})();

// ====== 输出 ======
const OUTPUT = "LLM_核心概念入门.pptx";
pptx.writeFile({ fileName: OUTPUT }).then(() => {
  console.log("✅ PPT 生成成功: " + OUTPUT);
  console.log("   共 20 页 | 16:9 | 白底黑字红灰配色 | 微软雅黑");
  console.log("   参考线: 上6 下6 左12 右24 (0.1英寸)");
}).catch(err => {
  console.error("❌ 生成失败:", err);
});
