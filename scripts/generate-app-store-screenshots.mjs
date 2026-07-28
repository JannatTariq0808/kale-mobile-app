/**
 * Generate App Store Connect screenshots at exact pixel sizes.
 *
 * Outputs:
 *   app-store-screenshots/iphone-6.5/  → 1284 × 2778
 *   app-store-screenshots/ipad-13/     → 2064 × 2752
 *
 * Run: node scripts/generate-app-store-screenshots.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outRoot = path.join(root, 'app-store-screenshots');

const BG = '#004C4C';
const BG_DARK = '#082B25';
const LIME = '#CCFA7D';
const MINT = '#00C896';
const FG = '#EAF3E4';
const FG_MUTED = 'rgba(234,243,228,0.58)';
const CORAL = '#E8826E';
const YELLOW = '#F5E94E';

const SIZES = {
  'iphone-6.5': { w: 1284, h: 2778, label: 'iPhone 6.5"' },
  'ipad-13': { w: 2064, h: 2752, label: 'iPad 13"' },
};

const SCREENS = [
  {
    id: '01-welcome',
    headline: 'Fitness that\nshapes tomorrow',
    sub: 'Assess. Level up. Earn rewards.',
    kind: 'welcome',
  },
  {
    id: '02-longevity',
    headline: 'Know your\nlongevity level',
    sub: 'See the healthy years you’ve added.',
    kind: 'longevity',
  },
  {
    id: '03-fitness',
    headline: 'Cardio, strength\n& knowledge',
    sub: 'Three short tests. One clear score.',
    kind: 'fitness',
  },
  {
    id: '04-kalettes',
    headline: 'Earn Kalettes\nevery quarter',
    sub: 'Rewards for staying on track.',
    kind: 'kalettes',
  },
  {
    id: '05-level',
    headline: 'Track progress\nover time',
    sub: 'Level up with every assessment.',
    kind: 'level',
  },
];

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function headlineLines(text, x, startY, fontSize, lineGap) {
  return text.split('\n').map((line, i) => {
    const y = startY + i * (fontSize + lineGap);
    return `<text x="${x}" y="${y}" fill="${LIME}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800">${esc(line)}</text>`;
  }).join('\n');
}

function phoneChrome({ x, y, w, h, radius = 48 }) {
  const bezel = 14;
  const screenX = x + bezel;
  const screenY = y + bezel;
  const screenW = w - bezel * 2;
  const screenH = h - bezel * 2;
  const screenR = Math.max(28, radius - 8);
  return {
    frame: `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="#0A1F1C"/>
      <rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" rx="${screenR}" fill="${BG_DARK}"/>
      <rect x="${x + w / 2 - 70}" y="${y + 22}" width="140" height="28" rx="14" fill="#000"/>
    `,
    screen: { x: screenX, y: screenY, w: screenW, h: screenH, r: screenR },
  };
}

function uiWelcome(s) {
  const cx = s.x + s.w / 2;
  const heroR = Math.min(s.w, s.h) * 0.16;
  return `
    <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${BG}"/>
    <circle cx="${cx}" cy="${s.y + s.h * 0.28}" r="${heroR}" fill="${MINT}" opacity="0.25"/>
    <circle cx="${cx}" cy="${s.y + s.h * 0.28}" r="${heroR * 0.72}" fill="none" stroke="${LIME}" stroke-width="4"/>
    <text x="${cx}" y="${s.y + s.h * 0.29}" text-anchor="middle" fill="${LIME}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.07)}" font-weight="800">K</text>
    <text x="${s.x + s.w * 0.08}" y="${s.y + s.h * 0.48}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.085)}" font-weight="800">Welcome to</text>
    <text x="${s.x + s.w * 0.08}" y="${s.y + s.h * 0.55}" fill="${LIME}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.085)}" font-weight="800">Kale</text>
    <text x="${s.x + s.w * 0.08}" y="${s.y + s.h * 0.62}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.038)}">Assess your longevity in minutes.</text>
    <rect x="${s.x + s.w * 0.08}" y="${s.y + s.h * 0.78}" width="${s.w * 0.84}" height="${s.h * 0.07}" rx="16" fill="${LIME}"/>
    <text x="${cx}" y="${s.y + s.h * 0.825}" text-anchor="middle" fill="${BG_DARK}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.045)}" font-weight="700">Get started</text>
  `;
}

function uiLongevity(s) {
  const pad = s.w * 0.07;
  const cardW = s.w - pad * 2;
  const cardX = s.x + pad;
  return `
    <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${BG}"/>
    <text x="${cardX}" y="${s.y + s.h * 0.1}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.055)}" font-weight="800">Longevity</text>
    <rect x="${cardX}" y="${s.y + s.h * 0.14}" width="${cardW}" height="${s.h * 0.28}" rx="24" fill="#0A5C55"/>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.22}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.032)}">Your level</text>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.32}" fill="${LIME}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.14)}" font-weight="800">7</text>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.38}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.038)}">+5 healthy years</text>
    <rect x="${cardX}" y="${s.y + s.h * 0.46}" width="${cardW}" height="${s.h * 0.12}" rx="18" fill="#0A5C55"/>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.515}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.04)}" font-weight="700">Assessment live</text>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.555}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.03)}">Complete this quarter for Kalettes</text>
    <rect x="${cardX}" y="${s.y + s.h * 0.62}" width="${cardW * 0.48}" height="${s.h * 0.14}" rx="18" fill="#0A5C55"/>
    <rect x="${cardX + cardW * 0.52}" y="${s.y + s.h * 0.62}" width="${cardW * 0.48}" height="${s.h * 0.14}" rx="18" fill="#0A5C55"/>
    <text x="${cardX + pad * 0.5}" y="${s.y + s.h * 0.68}" fill="${MINT}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.03)}">Cardio</text>
    <text x="${cardX + pad * 0.5}" y="${s.y + s.h * 0.73}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.05)}" font-weight="700">Level 7</text>
    <text x="${cardX + cardW * 0.52 + pad * 0.5}" y="${s.y + s.h * 0.68}" fill="${CORAL}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.03)}">Strength</text>
    <text x="${cardX + cardW * 0.52 + pad * 0.5}" y="${s.y + s.h * 0.73}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.05)}" font-weight="700">Level 7</text>
  `;
}

function uiFitness(s) {
  const pad = s.w * 0.07;
  const cardX = s.x + pad;
  const cardW = s.w - pad * 2;
  const pillars = [
    { label: 'Cardio', color: MINT, pct: 0.72 },
    { label: 'Strength', color: CORAL, pct: 0.64 },
    { label: 'Knowledge', color: YELLOW, pct: 0.81 },
  ];
  const rows = pillars
    .map((p, i) => {
      const y = s.y + s.h * 0.22 + i * s.h * 0.18;
      const barW = cardW * 0.9;
      const fillW = barW * p.pct;
      return `
        <text x="${cardX}" y="${y}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.045)}" font-weight="700">${p.label}</text>
        <rect x="${cardX}" y="${y + s.h * 0.03}" width="${barW}" height="${s.h * 0.025}" rx="8" fill="#45807E"/>
        <rect x="${cardX}" y="${y + s.h * 0.03}" width="${fillW}" height="${s.h * 0.025}" rx="8" fill="${p.color}"/>
        <text x="${cardX}" y="${y + s.h * 0.09}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.03)}">${Math.round(p.pct * 100)}% relative performance</text>
      `;
    })
    .join('');
  return `
    <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${BG}"/>
    <text x="${cardX}" y="${s.y + s.h * 0.1}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.055)}" font-weight="800">Fitness</text>
    <text x="${cardX}" y="${s.y + s.h * 0.145}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.032)}">Your pillars this cycle</text>
    ${rows}
  `;
}

function uiKalettes(s) {
  const pad = s.w * 0.07;
  const cardX = s.x + pad;
  const cardW = s.w - pad * 2;
  return `
    <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${BG}"/>
    <text x="${cardX}" y="${s.y + s.h * 0.1}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.055)}" font-weight="800">Kalettes</text>
    <rect x="${cardX}" y="${s.y + s.h * 0.16}" width="${cardW}" height="${s.h * 0.28}" rx="24" fill="#0A5C55"/>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.24}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.032)}">Banked balance</text>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.34}" fill="${LIME}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.12)}" font-weight="800">486</text>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.4}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.035)}">+120 pending this quarter</text>
    <rect x="${cardX}" y="${s.y + s.h * 0.5}" width="${cardW}" height="${s.h * 0.12}" rx="18" fill="#0A5C55"/>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.555}" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.04)}" font-weight="700">Rewards marketplace</text>
    <text x="${cardX + pad * 0.6}" y="${s.y + s.h * 0.595}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.03)}">Spend Kalettes on products &amp; perks</text>
    <rect x="${cardX}" y="${s.y + s.h * 0.68}" width="${cardW}" height="${s.h * 0.08}" rx="16" fill="${LIME}"/>
    <text x="${s.x + s.w / 2}" y="${s.y + s.h * 0.73}" text-anchor="middle" fill="${BG_DARK}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.04)}" font-weight="700">Browse rewards</text>
  `;
}

function uiLevel(s) {
  const cx = s.x + s.w / 2;
  const cy = s.y + s.h * 0.42;
  const r = Math.min(s.w, s.h) * 0.22;
  return `
    <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${BG}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#45807E" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LIME}" stroke-width="10" stroke-dasharray="${Math.round(r * 5.2)} ${Math.round(r * 1.1)}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy + s.w * 0.06}" text-anchor="middle" fill="${LIME}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.18)}" font-weight="800">7</text>
    <text x="${cx}" y="${s.y + s.h * 0.68}" text-anchor="middle" fill="${FG}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.05)}" font-weight="700">Level 7 Athlete</text>
    <text x="${cx}" y="${s.y + s.h * 0.73}" text-anchor="middle" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(s.w * 0.032)}">Keep training to level up</text>
  `;
}

function screenUi(kind, screen) {
  switch (kind) {
    case 'welcome':
      return uiWelcome(screen);
    case 'longevity':
      return uiLongevity(screen);
    case 'fitness':
      return uiFitness(screen);
    case 'kalettes':
      return uiKalettes(screen);
    case 'level':
      return uiLevel(screen);
    default:
      return uiWelcome(screen);
  }
}

function composeSvg(sizeKey, screen) {
  const { w, h } = SIZES[sizeKey];
  const isPad = sizeKey === 'ipad-13';

  const headlineSize = isPad ? 72 : 64;
  const subSize = isPad ? 28 : 26;
  const topPad = isPad ? 100 : 120;
  const sidePad = isPad ? 120 : 72;

  const phoneW = isPad ? Math.round(w * 0.42) : Math.round(w * 0.78);
  const phoneH = Math.round(phoneW * (2778 / 1284));
  const phoneX = Math.round((w - phoneW) / 2);
  const phoneY = Math.round(h - phoneH - (isPad ? 80 : 40));

  const chrome = phoneChrome({ x: phoneX, y: phoneY, w: phoneW, h: phoneH, radius: isPad ? 56 : 52 });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="55%" stop-color="${BG_DARK}"/>
      <stop offset="100%" stop-color="#063A36"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${w * 0.9}" cy="${h * 0.08}" r="${w * 0.28}" fill="${MINT}" opacity="0.08"/>
  <circle cx="${w * 0.05}" cy="${h * 0.35}" r="${w * 0.2}" fill="${LIME}" opacity="0.05"/>

  <text x="${sidePad}" y="${topPad}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${isPad ? 22 : 20}" font-weight="700" letter-spacing="4">KALE</text>
  ${headlineLines(screen.headline, sidePad, topPad + headlineSize + 12, headlineSize, 10)}
  <text x="${sidePad}" y="${topPad + headlineSize * 2.6}" fill="${FG_MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="${subSize}">${esc(screen.sub)}</text>

  ${chrome.frame}
  ${screenUi(screen.kind, chrome.screen)}
</svg>`;
}

async function renderPng(svg, outPath) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'original' },
    font: { loadSystemFonts: true },
  });
  const png = resvg.render().asPng();
  await sharp(png).png({ compressionLevel: 9 }).toFile(outPath);
}

async function main() {
  for (const sizeKey of Object.keys(SIZES)) {
    const dir = path.join(outRoot, sizeKey);
    fs.mkdirSync(dir, { recursive: true });
    const { w, h, label } = SIZES[sizeKey];
    console.log(`\n${label} (${w}×${h})`);

    for (const screen of SCREENS) {
      const svg = composeSvg(sizeKey, screen);
      const outPath = path.join(dir, `${screen.id}.png`);
      await renderPng(svg, outPath);
      const meta = await sharp(outPath).metadata();
      console.log(`  ✓ ${screen.id}.png  ${meta.width}×${meta.height}`);
    }
  }

  console.log(`\nDone → ${outRoot}`);
  console.log('Upload iPhone set to App Store Connect → iPhone 6.5" Display');
  console.log('Upload iPad set to App Store Connect → iPad (13" / 12.9")');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
