#!/usr/bin/env node
// Generates assets/icon.png (128×128 RGBA PNG) using only built-in Node.js modules.
// Run: node scripts/generate-icon.js

const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

// --- CRC32 ---
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
  crcTable[n] = c
}
function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function makeChunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length, 0)
  const crc = Buffer.allocUnsafe(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0)
  return Buffer.concat([len, t, data, crc])
}

// --- Canvas ---
const W = 128, H = 128
const pixels = Buffer.alloc(W * H * 4)

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return
  const i = (y * W + x) * 4
  pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = a
}

function fillRect(x, y, w, h, r, g, b, a = 255) {
  for (let ry = y; ry < y + h; ry++)
    for (let rx = x; rx < x + w; rx++)
      setPixel(rx, ry, r, g, b, a)
}

function fillRoundedRect(x, y, w, h, radius, r, g, b, a = 255) {
  for (let ry = y; ry < y + h; ry++) {
    for (let rx = x; rx < x + w; rx++) {
      const dx = Math.max(x + radius - rx, 0, rx - (x + w - radius - 1))
      const dy = Math.max(y + radius - ry, 0, ry - (y + h - radius - 1))
      if (dx * dx + dy * dy <= radius * radius)
        setPixel(rx, ry, r, g, b, a)
    }
  }
}

// Background: #0f172a (dark slate)
fillRect(0, 0, W, H, 15, 23, 42)

// Purple rounded rect: #7c3aed
fillRoundedRect(12, 12, 104, 104, 20, 124, 58, 237)

// Letter "P" pixel font — 5 cols × 7 rows, scaled 8px
const P_BITMAP = [
  [1,1,1,1,0],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,1,1,1,0],
  [1,0,0,0,0],
  [1,0,0,0,0],
  [1,0,0,0,0],
]
const SCALE = 8
const LX = Math.floor((W - 5 * SCALE) / 2) - 2
const LY = Math.floor((H - 7 * SCALE) / 2)

for (let row = 0; row < 7; row++)
  for (let col = 0; col < 5; col++)
    if (P_BITMAP[row][col])
      fillRect(LX + col * SCALE, LY + row * SCALE, SCALE, SCALE, 255, 255, 255)

// --- Build PNG ---
const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const ihdr = Buffer.allocUnsafe(13)
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0 // 8-bit RGBA

// Filter scanlines (filter type 0 = None per row)
const scanSize = 1 + W * 4
const raw = Buffer.allocUnsafe(H * scanSize)
for (let y = 0; y < H; y++) {
  raw[y * scanSize] = 0
  pixels.copy(raw, y * scanSize + 1, y * W * 4, (y + 1) * W * 4)
}

const compressed = zlib.deflateSync(raw, { level: 9 })
const png = Buffer.concat([sig, makeChunk('IHDR', ihdr), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))])

const assetsDir = path.join(__dirname, '..', 'assets')
fs.mkdirSync(assetsDir, { recursive: true })
fs.writeFileSync(path.join(assetsDir, 'icon.png'), png)
console.log('✓ Generated assets/icon.png (128×128 RGBA PNG)')
