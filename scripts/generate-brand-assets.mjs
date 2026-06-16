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
const LOGOTYPE_LIME = '#CCFA7D';
const LOGOTYPE_PATHS = [
  'M37.8577 9.14773C40.3183 9.05611 42.7559 9.65624 44.9023 10.882C45.6298 11.3042 46.1751 11.7178 46.8458 12.2226C46.8647 11.531 46.8876 10.2358 46.8352 9.57374C47.1453 9.59119 47.4919 9.59459 47.8019 9.58734C49.2632 9.5533 50.7914 9.65065 52.2456 9.56645C52.2152 10.7723 52.2377 12.0797 52.2377 13.2923L52.2372 20.1794L52.2438 36.1555C51.1014 36.0509 49.7763 36.1766 48.6109 36.1325C48.0635 36.1118 47.3813 36.1242 46.841 36.1584C46.8815 35.2713 46.8493 34.2062 46.8445 33.3054C45.6897 34.1055 45.0468 34.6819 43.6834 35.2498C42.2664 35.9225 40.7594 36.2487 39.2026 36.3485C35.5359 36.5991 32.0458 35.3974 29.304 32.8989C23.7579 27.845 23.3591 19.2402 28.3082 13.6227C30.3294 11.3435 33.0489 9.82433 36.0261 9.31139C36.5779 9.21726 37.2965 9.1795 37.8577 9.14773ZM38.9227 30.9138C43.3451 30.5593 46.6529 26.6387 46.3208 22.1448C45.9892 17.6509 42.1427 14.2755 37.7178 14.5951C33.2684 14.9164 29.9234 18.8501 30.257 23.3689C30.5907 27.8876 34.4759 31.2704 38.9227 30.9138Z',
  'M76.3824 9.14763C81.0895 8.91422 85.5926 11.4118 88.1333 15.4031C90.0178 18.3617 90.6824 21.9544 89.983 25.4061C88.346 25.3358 86.303 25.3905 84.6427 25.3904L74.5653 25.3909L71.1416 25.3943C70.5687 25.3949 69.7539 25.4196 69.1951 25.3746C69.4091 26.2065 70.0745 27.3521 70.6294 28.0027C72.1004 29.7271 73.9501 30.7289 76.1891 30.9072C78.1507 31.0769 80.1034 30.4937 81.662 29.2727C82.1848 28.8605 82.5102 28.4634 82.9907 28.0458C83.583 27.9701 85.5556 28.0227 86.2655 28.0254C87.053 28.0256 88.4865 28.066 89.2215 27.9938C88.6257 29.4365 87.7964 30.7679 86.768 31.9329C84.4471 34.5349 81.2203 36.117 77.7715 36.3443C74.0694 36.5631 70.6832 35.4784 67.8998 32.9601C65.1922 30.5384 63.5663 27.1053 63.3936 23.4447C63.2152 19.8431 64.444 16.3156 66.8125 13.6297C68.8423 11.3496 71.5662 9.82709 74.5482 9.30596C75.0899 9.21442 75.8311 9.17747 76.3824 9.14763ZM69.232 19.9164C70.1908 19.9654 71.3068 19.939 72.2827 19.9384L77.4134 19.9385C79.7295 19.9382 82.0782 19.9586 84.3916 19.9314C83.3809 17.6229 82.1064 16.1275 79.7128 15.113C78.7945 14.7237 77.3077 14.4811 76.3098 14.6041C72.9772 14.7569 70.5326 16.9044 69.232 19.9164Z',
  'M60.7045 0.558698C60.8265 0.555258 61.0154 0.567744 61.1427 0.571802L61.1457 26.7249C61.1453 29.8197 61.0898 33.0718 61.1497 36.1524C60.7269 36.1125 59.8391 36.131 59.3969 36.1313L56.2035 36.1388L55.805 36.1594C55.7583 33.2457 55.794 30.2408 55.794 27.3218L55.7935 10.9867L55.7948 4.04658C55.7957 3.24425 55.8512 1.30822 55.775 0.570035C57.4182 0.574755 59.0613 0.570979 60.7045 0.558698Z',
  'M11.0455 0.606419C13.0094 0.231662 14.8997 1.54747 15.2648 3.54327C15.6298 5.53907 14.3309 7.45687 12.3655 7.82378C10.4057 8.18966 8.52423 6.87454 8.1602 4.88431C7.79616 2.89405 9.08703 0.980136 11.0455 0.606419Z',
  'M19.7316 0.580313C21.5511 0.553577 23.3707 0.582734 25.1883 0.553662C25.1503 1.64959 25.0616 2.83075 24.8521 3.9107C24.1494 7.39825 22.387 10.5739 19.8136 12.9901C17.0963 15.5451 13.6206 17.1109 9.93232 17.4416C8.78591 17.5513 7.68913 17.5103 6.54606 17.5231C4.64235 17.5446 2.70512 17.4921 0.805176 17.5236V0.576367C2.34496 0.567907 4.54407 0.495671 6.04541 0.572752L6.03973 12.0226C7.06913 11.9633 8.11187 12.0305 9.1459 11.9727C14.5933 11.6683 19.2477 7.19218 19.6804 1.63861C19.7064 1.30423 19.7442 0.916673 19.7316 0.580313Z',
  'M0.805176 19.1932L6.39214 19.1873C7.83036 19.1875 9.63695 19.1569 11.0576 19.3724C14.5683 19.9401 17.8118 21.6231 20.3224 24.1799C22.6468 26.5537 24.2259 29.5746 24.8599 32.8603C25.0946 34.1433 25.1143 34.921 25.1885 36.1617C24.3857 36.0916 23.1259 36.1313 22.2717 36.1317C21.5903 36.1321 20.3959 36.101 19.7503 36.1512C19.7124 35.5271 19.6655 34.5114 19.5456 33.9175C19.0528 31.4742 17.8182 29.2719 15.9908 27.6083C14.3742 26.1366 12.2049 25.0739 10.0515 24.7905C8.88993 24.6377 7.21768 24.7166 6.01427 24.7084C6.07091 25.5161 6.03766 26.6364 6.03753 27.4755L6.03638 33.2275C6.0362 34.0857 5.99718 35.3207 6.04321 36.1551C4.62479 36.0636 2.26958 36.1328 0.805176 36.1335V19.1932Z',
];
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

function composeLogotypeSvg(height, fill = LOGOTYPE_LIME) {
  const width = Math.round((91 / 37) * height);
  const paths = LOGOTYPE_PATHS.map((d) => `<path fill="${fill}" d="${d}"/>`).join('\n  ');

  return `<svg width="${width}" height="${height}" viewBox="0 0 91 37" xmlns="http://www.w3.org/2000/svg">
  ${paths}
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
/** Android launcher — same colours as icon.png, smaller glyph for adaptive-icon safe zone. */
render(composeSquareSvg(1024, { background: BG, glyphScale: 0.42 }), 'android-launcher-icon.png');
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
render(composeLogotypeSvg(74), 'kale-logotype-lime.png');
