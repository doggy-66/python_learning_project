# AGENTS.md

一个 Python 学习项目，目前包含一个俄罗斯方块游戏。

## 项目结构

- `tetris.html` — 独立的俄罗斯方块游戏，双击即玩，纯前端（无依赖）
- `tetris.py` — Python HTTP 服务器版本（内置 `http.server`，无第三方依赖）
- `math_test.py` — 数学运算工具，包含 add/subtract/multiply/divide 等方法及 main 复杂计算测试
- `SkillGuide.md` — 已安装 Skill 的功能说明、用法和注意事项汇总

## 启动方式

```bash
python3 tetris.py          # 启动游戏服务器，打开 http://localhost:8080
python3 math_test.py       # 运行数学运算测试
```

或直接双击 `tetris.html` 在浏览器中游玩。

## 技术要点

- 无 pip 依赖，所有 Python 代码只用标准库
- 环境无 `pip`/`ensurepip`，不要引入第三方包
- 游戏排行榜存储在浏览器 `localStorage`，前端 JS 实现

## OpenCode 扩展

### 自定义命令（`.opencode/commands/`）
- `/game` — 启动俄罗斯方块游戏服务器
- `/test-math` — 运行数学运算测试
- `/myreview $ARGUMENTS` — 审查指定文件的代码质量
- `/docx $ARGUMENTS` — 创建、编辑或分析 Word 文档
- `/pptx $ARGUMENTS` — 创建、编辑或分析 PowerPoint 演示文稿
- `/pdf $ARGUMENTS` — 读取、创建、编辑或处理 PDF 文件
- `/xlsx $ARGUMENTS` — 读取、创建、编辑或分析 Excel 电子表格
- `/frontend-design $ARGUMENTS` — 创建高质量前端界面设计
- `/web-access $ARGUMENTS` — 联网搜索、网页读取、浏览器自动化
- `/skill-creator $ARGUMENTS` — 创建、评估、改进和基准测试 Skills
- `/claude-mem $ARGUMENTS` — 审计代码反模式（空 catch、无声异常等）
- `/llm-concepts-ppt $ARGUMENTS` — 生成 LLM 核心概念入门 PPT

### 技能（`.opencode/skills/`）
- `docx` — Word 文档（.docx）处理技能
- `pptx` — PowerPoint（.pptx）处理技能
- `pdf` — PDF 处理技能
- `xlsx` — Excel 电子表格技能
- `frontend-design` — 前端界面设计指导技能
- `web-access` — AI Agent 联网与浏览器自动化技能
- `skill-creator` — Skill 开发、评估与基准测试工具包
- `claude-mem` — 代码反模式审查（反模式沙皇）
- `llm-concepts-ppt` — LLM 概念入门 PPT 生成器

## 环境配置

### docx/pptx 技能依赖（已安装在 `/tmp/opencode/bin/`）

| 工具 | 用途 | 状态 |
|------|------|------|
| `pandoc` 3.7 | 文本提取 | ✅ |
| `node` 22.14 | 运行 docx-js/pptxgenjs | ✅ |
| `docx-js` | 创建 Word 文档 | ✅ |
| `pptxgenjs` | 创建 PPT 演示文稿 | ✅ |
| `markitdown` | PPT/文档文本提取 | ✅ |
| `Pillow` | 图片缩略图生成 | ✅ |
| `pdftoppm` | PDF 转图片 | ✅ |
| `LibreOffice` | PDF 转换/渲染 | ✅ |
| `pypdf` | PDF 读取/写入/表单 | ✅ |
| `pdf2image` | PDF 转图片 | ✅ |
| `pytesseract` | OCR 文字识别 | ✅ |
| `openpyxl` | Excel 创建/编辑/读取 | ✅ |
| `tesseract` (系统) | OCR 引擎 | ✅ |

使用 `skill` docx 前，确保以下环境变量已设置：
```bash
export PATH="/tmp/opencode/bin:$HOME/.local/bin:$PATH"
export NODE_PATH="/tmp/opencode/npm_global/lib/node_modules"
```

若工具丢失（重启后 /tmp 被清理），运行：
```bash
bash .opencode/skills/docx/scripts/setup.sh
```

## 维护规则

- 每次代码变更后，**主动**更新本文件以反映最新的项目结构、启动方式和技术要点
- 控制台输出使用中文（`print`、`console.log`、UI 文字等）
- 所有对话使用中文
- pip 仅用于 skill 外部工具依赖（markitdown/Pillow），项目 Python 代码只用标准库
- 每次学习/安装新 Skill 后，**主动**更新 `SkillGuide.md`
