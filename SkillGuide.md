# SkillGuide.md

OpenCode 技能使用指南。记录每个已安装 Skill 的功能、用法和注意事项。

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

- 缺少 LibreOffice 无法将 `.pptx` 转为 PDF/图片进行视觉 QA
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

- OCR 功能需要系统级 `tesseract-ocr` 包，当前环境可能未安装（`sudo apt install tesseract-ocr`）
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
