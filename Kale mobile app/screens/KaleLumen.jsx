/* eslint-disable */
// "Lumen" — proposed reskin direction for the Kale app (from the reference comp).
// Signature: glossy teal surface split by a hard diagonal glass-edge line, the
// figure rendered as one giant lime numeral in a ring gauge, vertical-rule
// caption. The Kale glyph is a *person* — top arms + dot head, bottom legs —
// and animates by folding out from the centre, the dot (head) appearing last.

// ---------- Palette ----------
const Lumen = {
  bgLight:  '#08615A',   // upper zone
  bgDark:   '#004C4C',   // lower zone (matches reference)
  lime:     '#CCFA7D',   // hero numeral / ring fill
  cream:    '#EAF3E4',
  green:    '#14C088',   // caption + glyph green (matches reference)
  track:    '#45807E',   // ring track gray-teal (matches reference gap)
  hair:     'rgba(234,243,228,0.14)',
  muted:    'rgba(234,243,228,0.55)',
};

// Kale brand colours the loader cycles through before the reveal
const LUMEN_BRAND = ['#00C896', '#00A284', '#E8826E', '#F5E94E', '#CCFA7D'];

// ---------- Keyframes (injected once) ----------
function LumenStyles() {
  return (
    <style>{`
      @keyframes lumenArms {
        0%   { transform: perspective(680px) rotateX(88deg);  opacity: 0; }
        70%  { transform: perspective(680px) rotateX(-4deg);  opacity: 1; }
        100% { transform: perspective(680px) rotateX(0deg);   opacity: 1; }
      }
      @keyframes lumenLegs {
        0%   { transform: perspective(680px) rotateX(-88deg); opacity: 0; }
        70%  { transform: perspective(680px) rotateX(4deg);   opacity: 1; }
        100% { transform: perspective(680px) rotateX(0deg);   opacity: 1; }
      }
      @keyframes lumenDot {
        0%   { transform: scale(0);    opacity: 0; }
        60%  { transform: scale(1.35); opacity: 1; }
        100% { transform: scale(1);    opacity: 1; }
      }
      .lumen-glyph .lg-arms { transform-box: fill-box; transform-origin: 50% 100%;
        animation: lumenArms .62s cubic-bezier(.34,1.4,.5,1) .12s both; }
      .lumen-glyph .lg-legs { transform-box: fill-box; transform-origin: 50% 0%;
        animation: lumenLegs .62s cubic-bezier(.34,1.4,.5,1) .42s both; }
      .lumen-glyph .lg-dot  { transform-box: fill-box; transform-origin: 50% 50%;
        animation: lumenDot .5s cubic-bezier(.34,1.7,.5,1) .92s both; }
      .lumen-glyph .lg-arms-l { transform-box: fill-box; transform-origin: 0% 50%;
        animation: lumenFoldL .6s cubic-bezier(.34,1.25,.5,1) .12s both; }
      .lumen-glyph .lg-legs-l { transform-box: fill-box; transform-origin: 0% 50%;
        animation: lumenFoldL .6s cubic-bezier(.34,1.25,.5,1) .34s both; }
      .lumen-glyph .lg-dot-l  { transform-box: fill-box; transform-origin: 50% 50%;
        animation: lumenDot .5s cubic-bezier(.34,1.7,.5,1) .82s both; }
      @keyframes lumenFoldL {
        0%   { transform: perspective(700px) rotateY(-92deg); opacity: 0; }
        70%  { transform: perspective(700px) rotateY(7deg);   opacity: 1; }
        100% { transform: perspective(700px) rotateY(0deg);   opacity: 1; }
      }
      @keyframes lumenRingFill {
        0%   { stroke-dashoffset: 100; }
        20%  { stroke-dashoffset: 100; }
        66%  { stroke-dashoffset: 0; }
        88%  { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: 100; }
      }
      @keyframes lumenSpin { to { transform: rotate(360deg); } }
    `}</style>
  );
}

// ---------- Kale glyph (person), folds out from the centre ----------
// path order: dot(head), legs(bottom), arms(top)
function LumenGlyph({ color = Lumen.lime, height = 38, animated = false, mode = 'center', style }) {
  const w = (618 / 886) * height;
  const suf = animated && mode === 'left' ? '-l' : '';
  return (
    <svg className={animated ? 'lumen-glyph' : ''} width={w} height={height} viewBox="0 0 618 886" fill={color} style={{ fill: color, transition: 'fill 0.18s linear', ...style }} aria-hidden="true">
      <path className={animated ? 'lg-dot' + suf : ''} d="M264.64 0.608C314.937 -6.071 361.09 29.302 367.533 79.47C373.976 129.637 338.253 175.459 287.889 181.624C237.889 187.746 192.322 152.45 185.925 102.645C179.528 52.838 214.704 7.239 264.64 0.608Z"/>
      <path className={animated ? 'lg-legs' + suf : ''} d="M0 463.977L133.083 463.843C161.008 463.845 195.432 462.96 222.776 464.781C325.987 471.649 421.063 514.563 494.631 587.483C574.113 666.576 618.545 774.077 618.025 886.024L480.775 886.008C479.31 807.339 451.11 736.066 393.799 681.013C347.486 636.136 287.253 608.271 222.971 601.983C194.132 599.173 161.375 600.11 132.161 600.246L132.186 786.827C132.181 819.302 132.73 853.801 132.02 886.102C89.107 885.736 42.28 887.074 0 885.646V463.977Z"/>
      <path className={animated ? 'lg-arms' + suf : ''} d="M0 0.425L84.979 0.417C97.472 0.418 120.082 1.048 132.113 -0.137L132.197 198.082C132.195 226.172 131.616 256.762 132.363 284.608C162.676 284.477 199.85 286.366 229.325 282.68C375.167 264.445 478.426 143.942 480.846 0.371C526.008 0.376 572.88 1.005 617.903 0.214C618.401 112.573 573.45 220.392 493.209 299.309C422.59 369.212 329.463 411.996 230.271 420.107C201.34 422.63 161.856 421.575 131.984 421.569L3.077 421.504L0 421.464V0.425Z"/>
    </svg>
  );
}

// ---------- Background: curved glass-edge sweep (mirrors reference) ----------
function LumenBackdrop({ gradientUpper = false, animateCurve = true }) {
  const W = 390, H = 844;
  // A gentle curve rising to the right: lighter above, darker below, with a
  // bright glass edge — matching the reference's curved sheen across the panel.
  const curve = `M0,432 C 140,506 268,322 390,232`;
  const upperPath = `M0,0 H${W} V232 C 268,322 140,506 0,432 Z`;
  // Subtle drift keyframes — the line breathes a few px without changing character.
  const upperVals = [
    'M0,0 H390 V232 C 268,322 140,506 0,432 Z',
    'M0,0 H390 V244 C 258,338 152,478 0,420 Z',
    'M0,0 H390 V226 C 276,312 132,520 0,440 Z',
    'M0,0 H390 V232 C 268,322 140,506 0,432 Z',
  ].join(';');
  const curveVals = [
    'M0,432 C 140,506 268,322 390,232',
    'M0,420 C 152,478 258,338 390,244',
    'M0,440 C 132,520 276,312 390,226',
    'M0,432 C 140,506 268,322 390,232',
  ].join(';');
  const aProps = {
    dur: '13s', repeatCount: 'indefinite', calcMode: 'spline',
    keyTimes: '0;0.34;0.7;1',
    keySplines: '.45 0 .55 1;.45 0 .55 1;.45 0 .55 1',
  };
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="lumUpperGrad" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="#00484A"/>
            <stop offset="1" stopColor="#0A675D"/>
          </linearGradient>
          <radialGradient id="lumGloss" cx="0.18" cy="0.10" r="0.85">
            <stop offset="0" stopColor="#EAF3E4" stopOpacity="0.055"/>
            <stop offset="0.55" stopColor="#EAF3E4" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="lumVignette" cx="0.12" cy="0.96" r="0.7">
            <stop offset="0" stopColor="#002F30" stopOpacity="0.45"/>
            <stop offset="1" stopColor="#002F30" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill={Lumen.bgDark}/>
        <path d={upperPath} fill={gradientUpper ? 'url(#lumUpperGrad)' : Lumen.bgLight}>
          {animateCurve && <animate attributeName="d" values={upperVals} {...aProps}/>}
        </path>
        <rect x="0" y="0" width={W} height={H} fill="url(#lumVignette)"/>
        <rect x="0" y="0" width={W} height={H} fill="url(#lumGloss)"/>
        <path d={curve} fill="none" stroke="#EAF3E4" strokeOpacity="0.13" strokeWidth="1.4">
          {animateCurve && <animate attributeName="d" values={curveVals} {...aProps}/>}
        </path>
      </svg>
    </div>
  );
}

// ---------- Vertical-rule caption ----------
function LumenRuleCaption({ children, align = 'right', color = Lumen.green, max = 230, size = 22 }) {
  return (
    <div style={{ display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', gap: 16, maxWidth: max }}>
        <span style={{ width: 2, alignSelf: 'stretch', background: color, opacity: 0.85, flexShrink: 0 }}/>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: size, lineHeight: 1.22, letterSpacing: '-0.01em', color }}>{children}</div>
      </div>
    </div>
  );
}

// ---------- Kale logotype, cropped to the wordmark only (no tagline) ----------
// Inline so it inherits colour (currentColor) and scales with the headline.
function LumenLogotype({ style }) {
  return (
    <svg viewBox="0 0 91 37" role="img" aria-label="Kale" style={{ height: '0.72em', width: 'auto', display: 'inline-block', verticalAlign: '-0.03em', fill: 'currentColor', ...style }}>
      <path d="M37.8577 9.14773C40.3183 9.05611 42.7559 9.65624 44.9023 10.882C45.6298 11.3042 46.1751 11.7178 46.8458 12.2226C46.8647 11.531 46.8876 10.2358 46.8352 9.57374C47.1453 9.59119 47.4919 9.59459 47.8019 9.58734C49.2632 9.5533 50.7914 9.65065 52.2456 9.56645C52.2152 10.7723 52.2377 12.0797 52.2377 13.2923L52.2372 20.1794L52.2438 36.1555C51.1014 36.0509 49.7763 36.1766 48.6109 36.1325C48.0635 36.1118 47.3813 36.1242 46.841 36.1584C46.8815 35.2713 46.8493 34.2062 46.8445 33.3054C45.6897 34.1055 45.0468 34.6819 43.6834 35.2498C42.2664 35.9225 40.7594 36.2487 39.2026 36.3485C35.5359 36.5991 32.0458 35.3974 29.304 32.8989C23.7579 27.845 23.3591 19.2402 28.3082 13.6227C30.3294 11.3435 33.0489 9.82433 36.0261 9.31139C36.5779 9.21726 37.2965 9.1795 37.8577 9.14773ZM38.9227 30.9138C43.3451 30.5593 46.6529 26.6387 46.3208 22.1448C45.9892 17.6509 42.1427 14.2755 37.7178 14.5951C33.2684 14.9164 29.9234 18.8501 30.257 23.3689C30.5907 27.8876 34.4759 31.2704 38.9227 30.9138Z"/>
      <path d="M76.3824 9.14763C81.0895 8.91422 85.5926 11.4118 88.1333 15.4031C90.0178 18.3617 90.6824 21.9544 89.983 25.4061C88.346 25.3358 86.303 25.3905 84.6427 25.3904L74.5653 25.3909L71.1416 25.3943C70.5687 25.3949 69.7539 25.4196 69.1951 25.3746C69.4091 26.2065 70.0745 27.3521 70.6294 28.0027C72.1004 29.7271 73.9501 30.7289 76.1891 30.9072C78.1507 31.0769 80.1034 30.4937 81.662 29.2727C82.1848 28.8605 82.5102 28.4634 82.9907 28.0458C83.583 27.9701 85.5556 28.0227 86.2655 28.0254C87.053 28.0256 88.4865 28.066 89.2215 27.9938C88.6257 29.4365 87.7964 30.7679 86.768 31.9329C84.4471 34.5349 81.2203 36.117 77.7715 36.3443C74.0694 36.5631 70.6832 35.4784 67.8998 32.9601C65.1922 30.5384 63.5663 27.1053 63.3936 23.4447C63.2152 19.8431 64.444 16.3156 66.8125 13.6297C68.8423 11.3496 71.5662 9.82709 74.5482 9.30596C75.0899 9.21442 75.8311 9.17747 76.3824 9.14763ZM69.232 19.9164C70.1908 19.9654 71.3068 19.939 72.2827 19.9384L77.4134 19.9385C79.7295 19.9382 82.0782 19.9586 84.3916 19.9314C83.3809 17.6229 82.1064 16.1275 79.7128 15.113C78.7945 14.7237 77.3077 14.4811 76.3098 14.6041C72.9772 14.7569 70.5326 16.9044 69.232 19.9164Z"/>
      <path d="M60.7045 0.558698C60.8265 0.555258 61.0154 0.567744 61.1427 0.571802L61.1457 26.7249C61.1453 29.8197 61.0898 33.0718 61.1497 36.1524C60.7269 36.1125 59.8391 36.131 59.3969 36.1313L56.2035 36.1388L55.805 36.1594C55.7583 33.2457 55.794 30.2408 55.794 27.3218L55.7935 10.9867L55.7948 4.04658C55.7957 3.24425 55.8512 1.30822 55.775 0.570035C57.4182 0.574755 59.0613 0.570979 60.7045 0.558698Z"/>
      <path d="M11.0455 0.606419C13.0094 0.231662 14.8997 1.54747 15.2648 3.54327C15.6298 5.53907 14.3309 7.45687 12.3655 7.82378C10.4057 8.18966 8.52423 6.87454 8.1602 4.88431C7.79616 2.89405 9.08703 0.980136 11.0455 0.606419Z"/>
      <path d="M19.7316 0.580313C21.5511 0.553577 23.3707 0.582734 25.1883 0.553662C25.1503 1.64959 25.0616 2.83075 24.8521 3.9107C24.1494 7.39825 22.387 10.5739 19.8136 12.9901C17.0963 15.5451 13.6206 17.1109 9.93232 17.4416C8.78591 17.5513 7.68913 17.5103 6.54606 17.5231C4.64235 17.5446 2.70512 17.4921 0.805176 17.5236V0.576367C2.34496 0.567907 4.54407 0.495671 6.04541 0.572752L6.03973 12.0226C7.06913 11.9633 8.11187 12.0305 9.1459 11.9727C14.5933 11.6683 19.2477 7.19218 19.6804 1.63861C19.7064 1.30423 19.7442 0.916673 19.7316 0.580313Z"/>
      <path d="M0.805176 19.1932L6.39214 19.1873C7.83036 19.1875 9.63695 19.1569 11.0576 19.3724C14.5683 19.9401 17.8118 21.6231 20.3224 24.1799C22.6468 26.5537 24.2259 29.5746 24.8599 32.8603C25.0946 34.1433 25.1143 34.921 25.1885 36.1617C24.3857 36.0916 23.1259 36.1313 22.2717 36.1317C21.5903 36.1321 20.3959 36.101 19.7503 36.1512C19.7124 35.5271 19.6655 34.5114 19.5456 33.9175C19.0528 31.4742 17.8182 29.2719 15.9908 27.6083C14.3742 26.1366 12.2049 25.0739 10.0515 24.7905C8.88993 24.6377 7.21768 24.7166 6.01427 24.7084C6.07091 25.5161 6.03766 26.6364 6.03753 27.4755L6.03638 33.2275C6.0362 34.0857 5.99718 35.3207 6.04321 36.1551C4.62479 36.0636 2.26958 36.1328 0.805176 36.1335V19.1932Z"/>
    </svg>
  );
}

function LumenButton({ children }) {
  return (
    <button style={{
      width: '100%', height: 58, borderRadius: 9999, background: 'var(--lumen-btn, #CCFA7D)', color: 'var(--lumen-btn-fg, #004C4C)',
      border: 'none', fontWeight: 700, fontSize: 16.5, fontFamily: 'var(--font-sans)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, letterSpacing: '-0.01em',
    }}>
      {children} <IconArrowRight w={19} h={19}/>
    </button>
  );
}

// ---------- Lumen text input field (dark teal surface) ----------
// Live validation glow: yellow = being entered but not yet valid, green = valid,
// red = invalid (left non-valid). Pass validate(value)=>bool; canReveal adds a
// show/hide toggle for passwords.
const LUMEN_VALID = '#3FD08B', LUMEN_PENDING = '#F5E94E', LUMEN_INVALID = '#E8826E';
function LumenField({ label, type = 'text', value = '', placeholder, validate, canReveal }) {
  const [val, setVal] = React.useState(value);
  const [focused, setFocused] = React.useState(false);
  const [reveal, setReveal] = React.useState(false);

  const isValid = validate ? !!validate(val) : val.trim().length > 0;
  let status = 'neutral';
  if (val.length === 0) status = focused ? 'pending' : 'neutral';
  else if (isValid) status = 'valid';
  else status = focused ? 'pending' : 'invalid';

  const tone = { neutral: Lumen.hair, pending: LUMEN_PENDING, valid: LUMEN_VALID, invalid: LUMEN_INVALID }[status];
  const glow = {
    neutral: 'none',
    pending: `0 0 0 3px rgba(245,233,78,0.16), 0 0 16px rgba(245,233,78,0.28)`,
    valid:   `0 0 0 3px rgba(63,208,139,0.16), 0 0 16px rgba(63,208,139,0.28)`,
    invalid: `0 0 0 3px rgba(232,130,110,0.16), 0 0 16px rgba(232,130,110,0.30)`,
  }[status];
  const inputType = canReveal ? (reveal ? 'text' : 'password') : type;

  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: Lumen.muted, marginBottom: 8 }}>{label}</span>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={inputType}
          value={val}
          placeholder={placeholder}
          onChange={e => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 54, borderRadius: 14, border: `1.5px solid ${tone}`,
            background: 'rgba(234,243,228,0.05)', color: Lumen.cream, padding: '0 16px',
            paddingRight: (canReveal ? 96 : 44),
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, outline: 'none', boxSizing: 'border-box',
            boxShadow: glow, transition: 'border-color .18s ease, box-shadow .18s ease',
          }}/>
        <div style={{ position: 'absolute', right: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          {canReveal && (
            <span onMouseDown={e => { e.preventDefault(); setReveal(r => !r); }} style={{ fontSize: 13, fontWeight: 700, color: Lumen.green, cursor: 'pointer' }}>{reveal ? 'Hide' : 'Show'}</span>
          )}
          {status === 'valid' && (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill={LUMEN_VALID}/><path d="M4.5 9.2L7.6 12L13 6" stroke="#04413E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
          {status === 'invalid' && (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill={LUMEN_INVALID}/><path d="M5.5 5.5l7 7M12.5 5.5l-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
          {status === 'pending' && (
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: LUMEN_PENDING, boxShadow: `0 0 10px ${LUMEN_PENDING}` }}/>
          )}
        </div>
      </div>
    </label>
  );
}

// ============================================================
// 01 · WELCOME (Lumen) — glyph folds out from centre, dot last, looping
// What Kale does, framed for policy holders. Primary CTA = log in.
// ============================================================
function KaleWelcomeLumen() {
  const [cycle, setCycle] = React.useState(0);
  React.useEffect(() => {
    const iv = setInterval(() => setCycle(c => c + 1), 4600);
    return () => clearInterval(iv);
  }, []);

  const size = 152, stroke = 8, r = (size - stroke) / 2;

  const steps = [
    { c: Lumen.green,  t: 'Assess your longevity', s: 'Three short tests — cardio, strength & knowledge.' },
    { c: '#E8826E',    t: 'Know your level', s: 'See the healthy years you’ve added — and how to add more.' },
    { c: '#F5E94E',    t: 'Earn Kalettes', s: 'Rewards every quarter you complete an assessment.' },
  ];

  return (
    <>
      <LumenStyles/>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        {/* Hero: compact glyph ring + headline */}
        <div style={{ padding: '20px 30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={Lumen.track} strokeWidth={stroke}/>
              <circle key={cycle} cx={size/2} cy={size/2} r={r} fill="none"
                stroke={Lumen.green} strokeWidth={stroke} strokeLinecap="round"
                pathLength="100" strokeDasharray="100"
                transform={`rotate(-90 ${size/2} ${size/2})`}
                style={{ animation: 'lumenRingFill 4.6s cubic-bezier(.4,0,.2,1) both' }}/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LumenGlyph key={cycle} color={Lumen.green} height={size * 0.44} animated={true} mode="left"/>
            </div>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 38, lineHeight: 1.0,
            letterSpacing: '-0.035em', color: Lumen.cream, textAlign: 'center', margin: '26px 0 0',
          }}>
            Welcome to <LumenLogotype style={{ color: Lumen.lime }}/>
          </h1>
          <p style={{
            marginTop: 12, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
            lineHeight: 1.45, color: Lumen.muted, textAlign: 'center', maxWidth: 300,
          }}>
            The longevity programme inside your Kale policy.
          </p>
        </div>

        {/* What Kale does — three steps */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((st, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 0', borderBottom: i < steps.length - 1 ? `1px solid ${Lumen.hair}` : 'none' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: st.c, boxShadow: `0 0 12px ${st.c}`, marginTop: 5, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 17, color: Lumen.cream, letterSpacing: '-0.015em' }}>{st.t}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13.5, lineHeight: 1.4, color: Lumen.muted, marginTop: 3 }}>{st.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA — log in (policy holders) + reset password */}
        <div style={{ padding: '0 30px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <LumenButton>Log in to Kale</LumenButton>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', color: Lumen.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, padding: 4 }}>Reset password</button>
          </div>
        </div>

        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 01b · SIGN IN (Lumen) — log in with Kale credentials
// ============================================================
function KaleSignInLumen() {
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        {/* Top chrome: back */}
        <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
          <button style={{ background: 'transparent', border: 'none', color: Lumen.cream, cursor: 'pointer', padding: 6, marginLeft: -6, opacity: 0.85 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
        </div>

        <div style={{ padding: '18px 30px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* small glyph mark */}
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(234,243,228,0.06)', border: `1px solid ${Lumen.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
            <LumenGlyph color={Lumen.green} height={26}/>
          </div>

          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 38, lineHeight: 1.0, letterSpacing: '-0.035em', color: Lumen.cream, margin: 0 }}>
            Welcome <span style={{ color: Lumen.lime }}>back</span>.
          </h1>
          <p style={{ marginTop: 12, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.45, color: Lumen.muted, maxWidth: 300 }}>
            Log in with your Kale account to pick up your longevity programme.
          </p>

          {/* form */}
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <LumenField label="Email" type="email" value="alex@pendragon.io" validate={v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}/>
            <div>
              <LumenField label="Password" value="quinoa2024" canReveal validate={v => v.length >= 8}/>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button style={{ background: 'transparent', border: 'none', color: Lumen.green, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 2 }}>Forgot password?</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <LumenButton>Log in</LumenButton>
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 22, textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, lineHeight: 1.5, color: Lumen.muted, margin: 0 }}>
              Kale is available to policy holders. Your login arrives by email when your policy begins.
            </p>
          </div>
        </div>

        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 02 · CARDIO REVIEW (Lumen) — K loads (folds out), transitions to 90 reveal
// ============================================================
function KaleCardioReviewLumen() {
  const [phase, setPhase] = React.useState('load'); // load -> reveal -> hold
  const [cycle, setCycle] = React.useState(0);
  const [num, setNum] = React.useState(0);
  const [glyphColor, setGlyphColor] = React.useState(LUMEN_BRAND[0]);

  React.useEffect(() => {
    const timers = [];
    const intervals = [];
    setPhase('load'); setNum(0);
    // cycle the loader through brand colours while loading
    setGlyphColor(LUMEN_BRAND[0]);
    let ci = 0;
    const colorIv = setInterval(() => { ci = (ci + 1) % LUMEN_BRAND.length; setGlyphColor(LUMEN_BRAND[ci]); }, 260);
    intervals.push(colorIv);
    timers.push(setTimeout(() => clearInterval(colorIv), 1700));
    timers.push(setTimeout(() => setPhase('reveal'), 1750));
    timers.push(setTimeout(() => {
      let v = 0;
      const iv = setInterval(() => { v += 3; if (v >= 90) { v = 90; clearInterval(iv); } setNum(v); }, 26);
      intervals.push(iv);
    }, 1820));
    timers.push(setTimeout(() => setPhase('hold'), 3050));
    timers.push(setTimeout(() => setCycle(c => c + 1), 6400)); // loop
    return () => { timers.forEach(clearTimeout); intervals.forEach(clearInterval); };
  }, [cycle]);

  const size = 272, stroke = 11, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const filled = phase !== 'load';
  const offset = filled ? c * (1 - 0.90) : c;

  return (
    <>
      <LumenStyles/>
      <LumenBackdrop/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        {/* Top chrome: back only (glyph removed — it's now the loader) */}
        <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
          <button style={{ background: 'transparent', border: 'none', color: Lumen.cream, cursor: 'pointer', padding: 6, marginLeft: -6, opacity: 0.85 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
        </div>

        {/* Step eyebrow */}
        <div style={{ textAlign: 'center', marginTop: 10, height: 16,
          opacity: filled ? 1 : 0, transition: 'opacity .5s ease' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: Lumen.green }}>
            Cardio · Test 1 of 3
          </span>
        </div>

        {/* Hero ring — loader → 90 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={Lumen.track} strokeWidth={stroke}/>
              {/* progress fill (90%) */}
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={Lumen.lime}
                strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={offset}
                transform={`rotate(-90 ${size/2} ${size/2})`}
                style={{ transition: 'stroke-dashoffset 1.15s cubic-bezier(.2,.8,.2,1)' }}/>
              {/* loading spinner arc (load phase only) */}
              {!filled && (
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={Lumen.lime}
                  strokeWidth={stroke} strokeLinecap="round"
                  strokeDasharray={`${c*0.16} ${c}`}
                  style={{ transformOrigin: '50% 50%', animation: 'lumenSpin 1s linear infinite' }}/>
              )}
            </svg>

            {/* Centre: glyph loader, fades to the number */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: filled ? 0 : 1, transform: filled ? 'scale(.7)' : 'scale(1)', transition: 'opacity .35s ease, transform .35s ease' }}>
              <LumenGlyph key={'g' + cycle} color={glyphColor} height={size * 0.26} animated={true}/>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: filled ? 1 : 0, transform: filled ? 'scale(1)' : 'scale(.85)', transition: 'opacity .4s ease .15s, transform .4s ease .15s' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.46, color: Lumen.lime, lineHeight: 0.9, letterSpacing: '0', fontVariantNumeric: 'tabular-nums' }}>{num}</span>
            </div>
          </div>
        </div>

        {/* Vertical-rule caption */}
        <div style={{ padding: '0 26px', opacity: filled ? 1 : 0, transform: filled ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity .5s ease .25s, transform .5s ease .25s' }}>
          <LumenRuleCaption align="right" color={Lumen.green} max={250}>
            You are at the 90th percentile for men your age.
          </LumenRuleCaption>
        </div>

        {/* Qualifying-run strip */}
        <div style={{ padding: '24px 26px 0', opacity: filled ? 1 : 0, transform: filled ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity .5s ease .38s, transform .5s ease .38s' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13.5, color: Lumen.cream }}>Best qualifying run</span>
            <span style={{ fontSize: 12, color: Lumen.muted }}>14 Feb · 12.4 km</span>
          </div>
          <div style={{ display: 'flex', borderTop: `1px solid ${Lumen.hair}`, borderBottom: `1px solid ${Lumen.hair}` }}>
            <LumenStat label="VO₂max" value="54" unit="ml/kg"/>
            <div style={{ width: 1, background: Lumen.hair }}/>
            <LumenStat label="Pace" value="4:48" unit="/km"/>
            <div style={{ width: 1, background: Lumen.hair }}/>
            <LumenStat label="Avg HR" value="148" unit="bpm"/>
          </div>
        </div>

        <div style={{ padding: '22px 26px 26px' }}>
          <LumenButton>Next — Strength</LumenButton>
        </div>

        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function LumenStat({ label, value, unit }) {
  return (
    <div style={{ flex: 1, padding: '14px 0' }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: Lumen.muted, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 24, color: Lumen.cream, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        <span style={{ fontSize: 11, color: Lumen.muted }}>{unit}</span>
      </div>
    </div>
  );
}

// ---------- Export Lumen system + screens to window (shared with onboarding file) ----------
// Pillar accents reused across the Lumen onboarding flow.
const LumenPillars = { cardio: '#00C896', strength: '#E8826E', knowledge: '#F5E94E' };
Object.assign(window, {
  Lumen, LUMEN_BRAND, LumenPillars,
  LumenStyles, LumenGlyph, LumenLogotype, LumenBackdrop, LumenRuleCaption, LumenButton, LumenStat, LumenField,
  KaleWelcomeLumen, KaleSignInLumen, KaleCardioReviewLumen,
});
