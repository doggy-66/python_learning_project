# SkillGuide.md

OpenCode 技能使用指南。记录每个已安装 Skill 的功能、用法和注意事项。

## 技能总览

| 技能 | 命令 | 一句话介绍 |
|------|------|-----------|
| [docx](#docx--word-文档处理) | `/docx` | 创建、编辑、读取 Word 文档，支持审阅修订与批注 |
| [pptx](#pptx--powerpoint-演示文稿处理) | `/pptx` | 创建、编辑、读取 PPT 演示文稿，内置设计配色与布局方案 |
| [pdf](#pdf--pdf-文件处理) | `/pdf` | 读取、合并、拆分 PDF，支持表单填写与 OCR 文字识别 |
| [xlsx](#xlsx--excel-电子表格处理) | `/xlsx` | 创建、编辑、读取 Excel 表格，支持公式、图表与数据清洗 |
| [frontend-design](#frontend-design--高质量前端界面设计) | `/frontend-design` | 前端界面设计指导，避免通用 AI 美学，打造独特视觉风格 |
| [web-access](#web-access--ai-agent-联网与浏览器自动化) | `/web-access` | 联网搜索、网页读取与 Chrome 浏览器自动化操作 |

---

## docx — Word 文档处理

### 功能介绍

处理 `.docx` 文件的全功能技能，来源：anthropics/skills。

| 能力 | 说明 |
|------|------|
| 创建新文档 | 用 `docx-js` 生成，支持标题、目录、表格、图片、超链接、页眉页脚、分页、脚注等 |
| 编辑现有文档 | 解包(XML) → 编辑 → 重新打包，支持审阅修订、批注、查找替换 |
| 读取内容 | `pandoc` 提取文本，或解包查看原始 XML |
| 格式转换 | `.doc` → `.docx`（需 LibreOffice），`.docx` → `.md` 文本 |

### 使用方法

在 OpenCode 中输入：

```
/docx 帮我创建一个会议纪要的 Word 文档
/docx 读取这个合同.docx 的内容
/docx 修改 report.docx，把所有 "2024" 改成 "2025"
/docx 接受 document.docx 中的所有修订批注
```

### 依赖

| 工具 | 用途 | 状态 |
|------|------|------|
| `pandoc` 3.7 | 文本提取 | ✅ |
| `node` 22.14 + `docx-js` | 创建文档 | ✅ |
| Python 脚本（解包/打包） | 编辑文档 | ✅ |
| `LibreOffice` | PDF/格式转换 | ✅ |

### 注意事项

- 创建文档时颜色默认使用 **Arial 字体**，非中文友好；如涉及中文内容建议指定中文字体
- 表格宽度使用 `DXA` 单位（1440 = 1 英寸），避免百分比（Google Docs 不兼容）
- 解包/打包的临时文件在 `.opencode/skills/docx/scripts/` 下执行
- 环境变量需设置：`PATH="/tmp/opencode/bin:$PATH"` 和 `NODE_PATH="/tmp/opencode/npm_global/lib/node_modules"`
- LibreOffice 已安装，支持 `.docx` → `.pdf` 转换和修订批注接受

---

## pptx — PowerPoint 演示文稿处理

### 功能介绍

处理 `.pptx` 文件的全功能技能，来源：anthropics/skills。

| 能力 | 说明 |
|------|------|
| 从零创建 | 用 `pptxgenjs` 生成，内置 10+ 配色主题、字体搭配、布局建议 |
| 编辑已有 PPT | 解包(XML) → 编辑 → 清理 → 重新打包 |
| 读取内容 | `markitdown` 提取文本，或解包查看 XML |
| 视觉检查 | 转换为图片后逐页检查布局、溢出、对比度等问题 |

### 使用方法

在 OpenCode 中输入：

```
/pptx 帮我创建一个 5 页的产品介绍 PPT
/pptx 读取这个 presentation.pptx 的所有文字内容
/pptx 修改 deck.pptx 第 3 页标题为 "年度总结"
/pptx 把 A.pptx 和 B.pptx 合并成一个文件
```

### 依赖

| 工具 | 用途 | 状态 |
|------|------|------|
| `node` 22.14 + `pptxgenjs` | 创建演示文稿 | ✅ |
| `markitdown` | 文本提取 | ✅ |
| `Pillow` | 缩略图生成 | ✅ |
| `pdftoppm` | PDF 转图片 | ✅ |
| Python 脚本（解包/打包） | 编辑 PPT | ✅ |
| `LibreOffice` | PDF 渲染 | ✅ |

### 注意事项

- LibreOffice 已安装，可将 `.pptx` 转为 PDF/图片用于视觉 QA
- `markitdown` 提取文本可能不保留表格结构，复杂布局建议解包读 XML
- 颜色方案在 `SKILL.md` 中有详细参考，创建时技能会自动选用匹配主题的配色
- 环境变量需额外包含 `$HOME/.local/bin:PATH`（pip 安装路径）
- LibreOffice 已安装，可将 `.pptx` 转为 PDF/图片进行视觉 QA

---

## pdf — PDF 文件处理

### 功能介绍

处理 `.pdf` 文件的全功能技能，来源：anthropics/skills。

| 能力 | 说明 |
|------|------|
| 读取/提取文本 | 提取 PDF 中的文字、表格数据 |
| 创建新 PDF | 从 HTML、图片等生成 PDF |
| 编辑 PDF | 合并、拆分、旋转页面、添加水印 |
| 提取图片 | 从 PDF 中提取嵌入的图片 |
| 表单处理 | 填写、读取 PDF 表单字段 |
| OCR 识别 | 对扫描版 PDF 进行文字识别（需 `tesseract` 系统库） |
| 加密/解密 | PDF 加密、解密、权限管理 |

### 使用方法

在 OpenCode 中输入：

```
/pdf 读取这个合同.pdf 的内容
/pdf 把 A.pdf 和 B.pdf 合并成一个文件
/pdf 填写这个税表的表单字段
/pdf 把 scanned.pdf 做 OCR 识别提取文字
/pdf 提取 report.pdf 中的所有图片
```

### 依赖

| 工具 | 用途 | 状态 |
|------|------|------|
| `pypdf` | PDF 读取/写入/合并/表单 | ✅ |
| `pdf2image` + `pdftoppm` | PDF 转图片 | ✅ |
| `pytesseract` | OCR 文字识别 | ✅ |
| `Pillow` | 图片处理 | ✅ |
| `tesseract` (系统) | OCR 引擎 | ✅ |

### 注意事项

- OCR 功能已安装 `tesseract` 5.5（中/英语言包），可直接使用
- `pypdf` 对中文 PDF 的文本提取效果取决于 PDF 本身的编码方式
- 填写表单脚本在 `scripts/fill_fillable_fields.py`，需要先读取表单字段再填值

---

## xlsx — Excel 电子表格处理

### 功能介绍

处理 `.xlsx` / `.xlsm` / `.csv` / `.tsv` 文件的全功能技能，来源：anthropics/skills。

| 能力 | 说明 |
|------|------|
| 创建新表格 | 用 `openpyxl` 生成，支持公式、图表、格式化、数据验证 |
| 编辑现有表格 | 添加/修改列、计算公式、格式化、图表 |
| 读取数据 | 提取单元格数据、公式、样式信息 |
| 数据清洗 | 修复格式混乱的行、错误表头、脏数据 |
| 格式转换 | `.csv` ↔ `.xlsx`、`.tsv` ↔ `.xlsx` |
| 公式重算 | 用 LibreOffice 重新计算所有公式值（⚠️ 需 LibreOffice） |

### 使用方法

在 OpenCode 中输入：

```
/xlsx 帮我创建一个销售数据表格，包含图表
/xlsx 读取这个财务报表.xlsx 的数据
/xlsx 清理 data.csv 中的脏数据并保存为 .xlsx
/xlsx 给 budget.xlsx 添加一列总计公式
/xlsx 把 contacts.tsv 转成 .xlsx 格式
```

### 依赖

| 工具 | 用途 | 状态 |
|------|------|------|
| `openpyxl` | 创建/编辑/读取 Excel | ✅ |
| Python 脚本（解包/打包） | 编辑原始 XML | ✅ |
| `LibreOffice` | 公式重算 | ✅ |

### 注意事项

- 公式重算需要 LibreOffice（已安装），复杂公式建议验证后交付
- 解包/编辑/打包流程与 docx 类似，参见 `scripts/` 下的工具

---

## frontend-design — 高质量前端界面设计

### 功能介绍

前端界面设计指导技能，来源：anthropics/skills。提供创建有独特设计感、避免通用 AI 美学风格的前端界面的设计方法论。

| 能力 | 说明 |
|------|------|
| 网页/组件设计 | 着陆页、仪表盘、React 组件、HTML/CSS 布局 |
| 美学指导 | 配色、字体、间距、排版、动效的设计原则 |
| 创意方向 | 避免"AI 风格"，提供独特的视觉语言 |

### 使用方法

在 OpenCode 中输入：

```
/frontend-design 帮我设计一个暗色主题的数据仪表盘
/frontend-design 创建一个产品展示的落地页
/frontend-design 美化这个表单页面的 UI
/frontend-design 给我设计一个个人博客首页
```

### 依赖

无依赖。纯设计指导性技能，不依赖任何外部工具。

### 注意事项

- 该技能仅提供设计指导和代码输出，不修改已有项目架构
- 强调"反 AI 风格"设计，会主动避免蓝紫渐变、居中大标题等常见 AI 生成特征
- 适合需要快速出界面原型或美化现有页面的场景

---

## web-access — AI Agent 联网与浏览器自动化

### 功能介绍

给 AI Agent 装上完整联网能力的 Skill，来源：[eze-is/web-access](https://github.com/eze-is/web-access)。

| 能力 | 说明 |
|------|------|
| 联网工具自动选择 | WebSearch / WebFetch / curl / Jina / CDP 按场景自动判断 |
| CDP 浏览器操作 | 直连本地 Chrome，携带登录态，支持动态页面、点击、截图 |
| 并行分治 | 多目标时分发子 Agent 并行执行，共享同一个 Proxy |
| 站点经验积累 | 按域名存储操作经验，跨 session 复用 |
| 本地书签/历史检索 | `find-url.mjs` 查询 Chrome 书签和浏览历史中的 URL |
| 媒体提取 | 从 DOM 提取图片/视频 URL，或视频任意时间点截帧 |

### 使用方法

在 OpenCode 中输入：

```
/web-access 帮我搜索 GPT-5 最新进展
/web-access 读一下这个页面：https://example.com/article
/web-access 去小红书搜索 xxx 的账号
/web-access 同时调研这 5 个产品的官网，给我对比摘要
/web-access 帮我在创作者平台发一篇图文
```

### 依赖

| 工具 | 用途 | 状态 |
|------|------|------|
| `node` 22+ | 运行 CDP Proxy / 检查脚本 | ✅ |
| `Chrome` | CDP 浏览器自动化 | ⚠️ 需自行安装 |

### 注意事项

- **CDP 模式需开启 Chrome 远程调试**：地址栏打开 `chrome://inspect/#remote-debugging`，勾选允许远程调试，重启浏览器
- 通过浏览器自动化操作社交平台存在账号限流/封禁风险，建议用小号
- Proxy 默认端口 `3456`，脚本自动管理生命周期
- 脚本路径使用 `${CLAUDE_SKILL_DIR}` 变量，OpenCode 中可能需调整路径引用
- `.gitkeep` 文件为占位，站点经验会自动写入 `references/site-patterns/`

---

## 环境恢复

重启 WSL 后 `/tmp` 可能被清空，运行以下命令恢复所有依赖：

```bash
bash .opencode/skills/docx/scripts/setup.sh
```

---

## 更新记录

| 日期 | 变更 |
|------|------|
| 2026-05-14 | 初始创建，记录 docx 和 pptx 两个技能 |
| 2026-05-14 | 新增 pdf 和 xlsx 两个技能 |
| 2026-05-14 | 新增 frontend-design 技能 |
| 2026-05-14 | 新增 web-access 技能（联网+浏览器自动化） |
