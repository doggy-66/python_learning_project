#!/bin/bash
# docx & pptx skill 依赖自动安装脚本（无需 root）
set -e

TOOLS_DIR="/tmp/opencode/bin"
NPM="/tmp/opencode/node-v22.14.0-linux-x64/bin/npm"
NPM_GLOBAL="/tmp/opencode/npm_global"
POPPLER_DIR="/tmp/opencode/poppler"
PANDOC_DIR="/tmp/opencode/pandoc-deb"
LD_SEARCH="$POPPLER_DIR/usr/lib/x86_64-linux-gnu:$PANDOC_DIR/usr/lib/x86_64-linux-gnu"

mkdir -p "$TOOLS_DIR"

# 1. Node.js
if ! "$TOOLS_DIR/node" --version &>/dev/null; then
  echo "[1/7] 安装 Node.js..."
  cd /tmp/opencode
  curl -fsSL "https://nodejs.org/dist/v22.14.0/node-v22.14.0-linux-x64.tar.xz" -o node.tar.xz
  tar xf node.tar.xz
  cp node-v22.14.0-linux-x64/bin/node "$TOOLS_DIR/node"
  rm -rf node.tar.xz node-v22.14.0-linux-x64
fi

# 2. Pandoc
if ! "$TOOLS_DIR/pandoc" --version &>/dev/null; then
  echo "[2/7] 安装 Pandoc..."
  mkdir -p "$PANDOC_DIR" && cd "$PANDOC_DIR"
  for pkg in pandoc liblua5.4-0 libnuma1; do apt download $pkg 2>/dev/null; done
  for f in *.deb; do dpkg -x "$f" .; done
  cat > "$TOOLS_DIR/pandoc" << 'EOF'
#!/bin/bash
LD_SEARCH="/tmp/opencode/poppler/usr/lib/x86_64-linux-gnu:/tmp/opencode/pandoc-deb/usr/lib/x86_64-linux-gnu"
export LD_LIBRARY_PATH="$LD_SEARCH:$LD_LIBRARY_PATH"
exec /tmp/opencode/pandoc-deb/usr/bin/pandoc "$@"
EOF
  chmod +x "$TOOLS_DIR/pandoc"
fi

# 3. Tesseract OCR
if ! "$TOOLS_DIR/tesseract" --version &>/dev/null; then
  echo "[4/7] 安装 Tesseract OCR..."
  mkdir -p /tmp/opencode/tesseract && cd /tmp/opencode/tesseract
  TESS_PKGS="tesseract-ocr tesseract-ocr-eng tesseract-ocr-chi-sim libtesseract5 libleptonica6 libarchive13t64 libgomp1 libgif7 libwebpmux3"
  for pkg in $TESS_PKGS; do apt download $pkg 2>/dev/null; done
  for f in *.deb; do dpkg -x "$f" .; done
  cat > "$TOOLS_DIR/tesseract" << 'EOF'
#!/bin/bash
LD_SEARCH="/tmp/opencode/tesseract/usr/lib/x86_64-linux-gnu:/tmp/opencode/poppler/usr/lib/x86_64-linux-gnu:/tmp/opencode/pandoc-deb/usr/lib/x86_64-linux-gnu"
export LD_LIBRARY_PATH="$LD_SEARCH:$LD_LIBRARY_PATH"
export TESSDATA_PREFIX="/tmp/opencode/tesseract/usr/share/tesseract-ocr/5/tessdata"
exec /tmp/opencode/tesseract/usr/bin/tesseract "$@"
EOF
  chmod +x "$TOOLS_DIR/tesseract"
fi
if ! "$TOOLS_DIR/pdftoppm" -v &>/dev/null; then
  echo "[4/7] 安装 Poppler..."
  mkdir -p "$POPPLER_DIR" && cd "$POPPLER_DIR"
  LIBS="poppler-utils libjpeg-turbo8 libpng16-16t64 libopenjp2-7 libtiff6 liblcms2-2 libgpgme45 libwebp7 liblerc4 libjbig0 libdeflate0 libnss3 libnspr4 libgpgmepp7"
  PKGS="libpoppler156"
  for pkg in $LIBS $PKGS; do apt download $pkg 2>/dev/null; done
  for f in *.deb; do dpkg -x "$f" .; done
  cat > "$TOOLS_DIR/pdftoppm" << 'EOF'
#!/bin/bash
LD_SEARCH="/tmp/opencode/poppler/usr/lib/x86_64-linux-gnu:/tmp/opencode/pandoc-deb/usr/lib/x86_64-linux-gnu"
export LD_LIBRARY_PATH="$LD_SEARCH:$LD_LIBRARY_PATH"
exec /tmp/opencode/poppler/usr/bin/pdftoppm "$@"
EOF
  chmod +x "$TOOLS_DIR/pdftoppm"
fi

# 4. Python pip + markitdown + Pillow
if ! python3 -c "import markitdown" &>/dev/null; then
  echo "[5/7] 安装 markitdown..."
  if ! python3 -m pip --version &>/dev/null; then
    curl -fsSL https://bootstrap.pypa.io/get-pip.py -o /tmp/opencode/get-pip.py
    python3 /tmp/opencode/get-pip.py --user --break-system-packages 2>/dev/null
  fi
  export PATH="$HOME/.local/bin:$PATH"
  python3 -m pip install --user --break-system-packages -i https://pypi.tuna.tsinghua.edu.cn/simple "markitdown[pptx]" Pillow pytesseract pdf2image pypdf openpyxl 2>/dev/null
fi

# 5. docx & pptxgenjs (npm)
if ! "$TOOLS_DIR/node" -e "require('docx')" &>/dev/null; then
  echo "[6/7] 安装 docx-js..."
  mkdir -p "$NPM_GLOBAL"
  "$TOOLS_DIR/node" "$NPM" install -g docx --prefix "$NPM_GLOBAL" 2>/dev/null
fi

if ! "$TOOLS_DIR/node" -e "require('pptxgenjs')" &>/dev/null; then
  echo "[6/7] 安装 pptxgenjs..."
  mkdir -p "$NPM_GLOBAL"
  "$TOOLS_DIR/node" "$NPM" install -g pptxgenjs --prefix "$NPM_GLOBAL" 2>/dev/null
fi

# 6. 验证
echo "[7/7] 验证..."
export PATH="$TOOLS_DIR:$HOME/.local/bin:$PATH"
export NODE_PATH="$NPM_GLOBAL/lib/node_modules"
  echo "  pandoc:      $($TOOLS_DIR/pandoc --version | head -1)"
  echo "  tesseract:   $($TOOLS_DIR/tesseract --version 2>/dev/null | head -1)"
  echo "  pdftoppm:    $($TOOLS_DIR/pdftoppm -v 2>/dev/null | head -1)"
echo "  node:        $($TOOLS_DIR/node --version)"
echo "  docx-js:     $($TOOLS_DIR/node -e "require('docx'); console.log('OK')")"
echo "  pptxgenjs:   $($TOOLS_DIR/node -e "require('pptxgenjs'); console.log('OK')")"
echo "  markitdown:  $(python3 -c "import markitdown; print('OK')")"
echo "  Pillow:      $(python3 -c "from PIL import Image; print('OK')")"
echo ""
echo "全部依赖就绪！"
echo "添加以下环境变量到你使用的脚本中："
echo "  export PATH=\"$TOOLS_DIR:\$HOME/.local/bin:\$PATH\""
echo "  export NODE_PATH=\"$NPM_GLOBAL/lib/node_modules\""
