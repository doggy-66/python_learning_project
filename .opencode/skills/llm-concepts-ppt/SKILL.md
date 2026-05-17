---
name: llm-concepts-ppt
description: 生成《大语言模型核心概念入门》授课/自学 PPT（20 页）。当用户需要 LLM 入门课件、Token/Embedding/RAG/MCP 概念讲解 PPT 时触发。
---

# LLM 核心概念 PPT 生成器

自动生成 20 页 16:9 中文 PPT，涵盖 LLM 6 个核心子概念。

## 触发条件

用户提到以下任一关键词时使用此 Skill：
- "LLM 课件" / "LLM PPT" / "大语言模型讲义"
- "Token 分词 PPT" / "Embedding PPT" / "RAG PPT" / "MCP PPT"
- "AI 概念入门 PPT" / "LLM 培训课件"

## 设计规范

| 项目 | 值 |
|------|-----|
| 格式 | 16:9 (LAYOUT_WIDE) |
| 底色 | 白色 |
| 主文字 | 黑色 |
| 强调色 | 红色（#c0392b / #e74c3c） |
| 辅助色 | 灰色（卡片底 #f5f5f5，次要文字 #666666，线条 #cccccc） |
| 字体 | 微软雅黑 |
| 字号 | 12pt ~ 32pt |
| 参考线 | 上 0.6" 下 0.6" 左 1.2" 右 2.4" |

## 生成方式

### 方式一：直接运行脚本

```bash
node .opencode/skills/llm-concepts-ppt/generate.js
```

输出：`LLM_核心概念入门.pptx`（当前目录）

### 方式二：在对话中生成

```
/llm-concepts-ppt
```

或描述需求，Skill 会自动接管设计规范。

## 幻灯片结构

| 页码 | 标题 |
|------|------|
| 1 | 封面 |
| 2 | 目录 |
| 3 | 什么是 LLM |
| 4 | Transformer 架构 |
| 5 | LLM 训练三阶段 |
| 6 | 知名模型一览 |
| 7 | Token 分词 |
| 8 | Token 成本与上下文窗口 |
| 9 | Embedding 向量化 |
| 10 | Embedding 应用场景 |
| 11 | 向量数据库 |
| 12 | 主流向量数据库对比 |
| 13 | RAG 检索增强生成 |
| 14 | RAG vs 纯 LLM |
| 15 | MCP 模型上下文协议 |
| 16 | MCP 架构详解 |
| 17 | 知识全景图 |
| 18 | 学习路线建议 |
| 19 | 总结与展望 |
| 20 | Q&A / 参考资料 |

## 依赖

- Node.js 22+
- pptxgenjs (`npm install -g pptxgenjs`)

## 自定义

修改 `generate.js` 中的 `config` 对象可调整配色、字体、参考线等。内容可直接编辑 `SLIDES` 数组。
