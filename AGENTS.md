# AGENTS.md

一个 Python 学习项目，目前包含一个俄罗斯方块游戏。

## 项目结构

- `tetris.html` — 独立的俄罗斯方块游戏，双击即玩，纯前端（无依赖）
- `tetris.py` — Python HTTP 服务器版本（内置 `http.server`，无第三方依赖）
- `math_test.py` — 数学运算工具，包含 add/subtract/multiply/divide 等方法及 main 复杂计算测试

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

## 维护规则

- 每次代码变更后，**主动**更新本文件以反映最新的项目结构、启动方式和技术要点
- 控制台输出使用中文（`print`、`console.log`、UI 文字等）
- 所有对话使用中文
