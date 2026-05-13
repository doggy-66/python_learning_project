#!/usr/bin/env python3
"""俄罗斯方块游戏 - Python HTTP 服务器"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
HOST = "localhost"

GAME_HTML = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>俄罗斯方块</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #1a1a2e;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #eee;
}
.container { display: flex; gap: 30px; align-items: flex-start; }
#gameCanvas { border: 2px solid #444; background: #16213e; border-radius: 4px; }
.sidebar {
  display: flex; flex-direction: column; gap: 20px;
  min-width: 180px;
}
.panel {
  background: #16213e;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 16px;
}
.panel h3 { font-size: 14px; color: #888; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
#nextCanvas { display: block; margin: 0 auto; background: #0f1a2e; border-radius: 4px; }
#score { font-size: 32px; font-weight: bold; color: #e94560; }
#level { font-size: 18px; color: #0f3460; }
#lines { font-size: 18px; color: #533483; }
.controls { font-size: 12px; color: #666; line-height: 1.8; }
.controls span { color: #aaa; }
#gameOver {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.85); color: #e94560;
  padding: 30px 50px; border-radius: 10px;
  font-size: 28px; font-weight: bold; text-align: center;
  display: none; z-index: 10;
}
#gameOver button {
  display: block; margin: 15px auto 0;
  padding: 10px 30px; font-size: 16px;
  background: #e94560; color: white; border: none;
  border-radius: 5px; cursor: pointer;
}
#gameOver button:hover { background: #c73652; }
.game-area { position: relative; }
</style>
</head>
<body>

<div class="container">
  <div class="game-area">
    <canvas id="gameCanvas"></canvas>
    <div id="gameOver">
      游戏结束
      <button onclick="restartGame()">重新开始</button>
    </div>
  </div>
  <div class="sidebar">
    <div class="panel">
      <h3>下一个方块</h3>
      <canvas id="nextCanvas"></canvas>
    </div>
    <div class="panel">
      <h3>分数</h3>
      <div id="score">0</div>
    </div>
    <div class="panel">
      <h3>等级</h3>
      <div id="level">1</div>
    </div>
    <div class="panel">
      <h3>消除行数</h3>
      <div id="lines">0</div>
    </div>
    <div class="panel controls">
      <span>← →</span> 移动<br>
      <span>↑</span> 旋转<br>
      <span>↓</span> 加速下落<br>
      <span>空格</span> 直接落下<br>
      <span>P</span> 暂停
    </div>
  </div>
</div>

<script>
// ==================== 游戏常量 ====================
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 22;

const COLORS = [
  null,
  '#00f0f0', // I - 青色
  '#f0f000', // O - 黄色
  '#a000f0', // T - 紫色
  '#00f000', // S - 绿色
  '#f00000', // Z - 红色
  '#0000f0', // J - 蓝色
  '#f0a000', // L - 橙色
];

// I, O, T, S, Z, J, L
const SHAPES = [
  [],
  [[1,1,1,1]],                        // I
  [[1,1],[1,1]],                      // O
  [[0,1,0],[1,1,1]],                  // T
  [[0,1,1],[1,1,0]],                  // S
  [[1,1,0],[0,1,1]],                  // Z
  [[1,0,0],[1,1,1]],                  // J
  [[0,0,1],[1,1,1]],                  // L
];

// ==================== DOM 元素 ====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
nextCanvas.width = 4 * NEXT_BLOCK_SIZE;
nextCanvas.height = 4 * NEXT_BLOCK_SIZE;

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const gameOverEl = document.getElementById('gameOver');

// ==================== 游戏状态 ====================
let board = [];
let score = 0;
let level = 1;
let totalLines = 0;
let current = null;
let next = null;
let gameRunning = false;
let paused = false;
let dropInterval = 1000;
let lastDrop = 0;
let animationId = null;

function createBoard() {
  board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
}

function randomPiece() {
  const type = Math.floor(Math.random() * 7) + 1;
  const shape = SHAPES[type].map(row => [...row]);
  const piece = { type, shape, x: Math.floor((COLS - shape[0].length) / 2), y: 0 };
  return piece;
}

// ==================== 碰撞检测 ====================
function collide(piece) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const x = piece.x + c;
      const y = piece.y + r;
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && board[y][x]) return true;
    }
  }
  return false;
}

// ==================== 操作 ====================
function rotate(piece) {
  const shape = piece.shape;
  const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
  const test = {...piece, shape: rotated};
  if (!collide(test)) return test;
  // 墙踢：尝试左右偏移
  for (const offset of [-1, 1, -2, 2]) {
    const kicked = {...test, x: test.x + offset};
    if (!collide(kicked)) return kicked;
  }
  return piece;
}

function moveLeft() {
  const test = {...current, x: current.x - 1};
  if (!collide(test)) current = test;
}

function moveRight() {
  const test = {...current, x: current.x + 1};
  if (!collide(test)) current = test;
}

function moveDown() {
  const test = {...current, y: current.y + 1};
  if (!collide(test)) { current = test; return true; }
  return false;
}

function hardDrop() {
  while (moveDown()) {}
  lock();
}

function lock() {
  for (let r = 0; r < current.shape.length; r++) {
    for (let c = 0; c < current.shape[r].length; c++) {
      if (!current.shape[r][c]) continue;
      const y = current.y + r;
      if (y < 0) { gameOver(); return; }
      board[y][current.x + c] = current.type;
    }
  }
  clearLines();
  current = next;
  next = randomPiece();
  if (collide(current)) gameOver();
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++;
      r++; // 重新检查当前行
    }
  }
  if (cleared > 0) {
    totalLines += cleared;
    const points = [0, 100, 300, 500, 800];
    score += points[cleared] * level;
    level = Math.floor(totalLines / 10) + 1;
    dropInterval = Math.max(50, 1000 - (level - 1) * 80);
    scoreEl.textContent = score;
    levelEl.textContent = level;
    linesEl.textContent = totalLines;
  }
}

function gameOver() {
  gameRunning = false;
  gameOverEl.style.display = 'block';
}

// ==================== 渲染 ====================
function drawBlock(context, x, y, colorIdx, size) {
  if (!colorIdx) return;
  const sz = size;
  context.fillStyle = COLORS[colorIdx];
  context.fillRect(x * sz, y * sz, sz, sz);
  // 高光
  context.fillStyle = 'rgba(255,255,255,0.2)';
  context.fillRect(x * sz, y * sz, sz, 2);
  context.fillRect(x * sz, y * sz, 2, sz);
  // 阴影
  context.fillStyle = 'rgba(0,0,0,0.3)';
  context.fillRect(x * sz + sz - 2, y * sz, 2, sz);
  context.fillRect(x * sz, y * sz + sz - 2, sz, 2);
  // 描边
  context.strokeStyle = 'rgba(0,0,0,0.5)';
  context.lineWidth = 1;
  context.strokeRect(x * sz, y * sz, sz, sz);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 网格线
  ctx.strokeStyle = '#1a1a3e';
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * BLOCK_SIZE);
    ctx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE);
    ctx.stroke();
  }
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * BLOCK_SIZE, 0);
    ctx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    ctx.stroke();
  }
  // 已固定的方块
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) drawBlock(ctx, c, r, board[r][c], BLOCK_SIZE);
    }
  }
  // 当前方块
  if (current) {
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (current.shape[r][c]) {
          drawBlock(ctx, current.x + c, current.y + r, current.type, BLOCK_SIZE);
        }
      }
    }
  }
}

function drawNext() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  if (!next) return;
  const shape = next.shape;
  const offsetX = (4 - shape[0].length) / 2;
  const offsetY = (4 - shape.length) / 2;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        drawBlock(nextCtx, offsetX + c, offsetY + r, next.type, NEXT_BLOCK_SIZE);
      }
    }
  }
}

// ==================== 游戏循环 ====================
function gameLoop(timestamp) {
  if (!gameRunning) return;
  animationId = requestAnimationFrame(gameLoop);

  if (paused) return;

  if (timestamp - lastDrop >= dropInterval) {
    if (!moveDown()) lock();
    lastDrop = timestamp;
  }

  drawBoard();
  drawNext();
}

function startGame() {
  createBoard();
  score = 0; level = 1; totalLines = 0;
  dropInterval = 1000;
  scoreEl.textContent = '0';
  levelEl.textContent = '1';
  linesEl.textContent = '0';
  gameOverEl.style.display = 'none';
  current = randomPiece();
  next = randomPiece();
  gameRunning = true;
  paused = false;
  lastDrop = performance.now();
  drawBoard();
  drawNext();
  if (animationId) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(gameLoop);
}

function restartGame() { startGame(); }

// ==================== 键盘控制 ====================
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;

  switch (e.code) {
    case 'ArrowLeft':  moveLeft(); break;
    case 'ArrowRight': moveRight(); break;
    case 'ArrowDown':  moveDown(); lastDrop = performance.now(); break;
    case 'ArrowUp':    current = rotate(current); break;
    case 'Space':      hardDrop(); lastDrop = performance.now(); break;
    case 'KeyP':
      paused = !paused;
      if (!paused) lastDrop = performance.now();
      break;
    default: return;
  }
  e.preventDefault();
  drawBoard();
  drawNext();
});

// ==================== 启动 ====================
startGame();
</script>
</body>
</html>
"""


class TetrisHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(GAME_HTML.encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # 隐藏访问日志


def main():
    with socketserver.TCPServer((HOST, PORT), TetrisHandler) as httpd:
        url = f"http://{HOST}:{PORT}"
        print(f"🎮 俄罗斯方块服务器已启动: {url}")
        print("按 Ctrl+C 退出")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")
            sys.exit(0)


if __name__ == "__main__":
    main()
