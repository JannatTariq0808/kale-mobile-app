#!/usr/bin/env node
/** Generate Kale brand PNGs from assets/splash-glyph.svg */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const assets = path.join(root, 'assets');
const glyphSvg = fs.readFileSync(path.join(assets, 'splash-glyph.svg'), 'utf8');

/** Splash + iOS icon shell */
const BG = '#082B25';
/** In-app / Android window shell */
const BG_DEEP = '#004C4C';
const GLYPH = '#14C088';
/** Brighter glyph for adaptive-icon foreground (green-on-green is hard to see on launchers) */
const GLYPH_ADAPTIVE = '#CCFA7D';
const VIEW_W = 618;
const VIEW_H = 886;

function glyphPaths() {
  const matches = [...glyphSvg.matchAll(/<path d="([^"]+)" fill="#14C088"\/>/g)];
  return matches.map((m) => m[1]);
}

function pathMarkup(fill) {
  return glyphPaths()
    .map((d) => `<path d="${d}" fill="${fill}"/>`)
    .join('\n    ');
}

function composeSquareSvg(
  size,
  { background = null, glyphScale = 0.58, glyphFill = GLYPH } = {},
) {
  const scaledW = VIEW_W * glyphScale;
  const scaledH = VIEW_H * glyphScale;
  const x = (size - scaledW) / 2;
  const y = (size - scaledH) / 2;
  const bgRect = background
    ? `<rect width="${size}" height="${size}" fill="${background}"/>`
    : '';

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${bgRect}
  <g transform="translate(${x} ${y}) scale(${glyphScale})">
    ${pathMarkup(glyphFill)}
  </g>
</svg>`;
}

/** Full-screen splash — background baked in so Expo Go never falls back to defaults. */
function composePortraitSplashSvg(width, height) {
  const glyphScale = (height * 0.12) / VIEW_H;
  const scaledW = VIEW_W * glyphScale;
  const scaledH = VIEW_H * glyphScale;
  const x = (width - scaledW) / 2;
  const y = (height - scaledH) / 2;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${BG_DEEP}"/>
  <g transform="translate(${x} ${y}) scale(${glyphScale})">
    ${pathMarkup(GLYPH)}
  </g>
</svg>`;
}

function render(svg, outName) {
  const width = parseInt(svg.match(/width="(\d+)"/)[1], 10);
  const resvg = new Resvg(Buffer.from(svg), {
    fitTo: { mode: 'width', value: width },
  });
  const png = resvg.render().asPng();
  const outPath = path.join(assets, outName);
  fs.writeFileSync(outPath, png);
  console.log(`wrote ${outName} (${png.length} bytes)`);
}

render(composePortraitSplashSvg(1284, 2778), 'splash.png');
render(
  composeSquareSvg(1024, { background: null, glyphScale: 0.42, glyphFill: GLYPH }),
  'splash-icon.png',
);
render(composeSquareSvg(1024, { background: BG, glyphScale: 0.58 }), 'icon.png');
render(
  composeSquareSvg(1024, {
    background: null,
    glyphScale: 0.64,
    glyphFill: GLYPH_ADAPTIVE,
  }),
  'android-icon-foreground.png',
);
render(
  composeSquareSvg(1024, {
    background: null,
    glyphScale: 0.64,
    glyphFill: '#FFFFFF',
  }),
  'android-icon-monochrome.png',
);
render(composeSquareSvg(48, { background: BG, glyphScale: 0.58 }), 'favicon.png');
