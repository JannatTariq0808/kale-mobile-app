/* eslint-disable */
// "Lumen" reskin — main app (Home, Fitness · Cardio/VO₂/Intensity).
// Applies the Lumen language to the dense app screens: bright teal surface with
// the curved glass divider behind the header, giant LIME hero numerals, mint
// pill buttons, cream text, pillar-dot eyebrows. Reuses the established cards
// and charts (exported to window from KaleApp/KaleApp2) for secondary content.

// ---------- Lumen app palette ----------
const LP = {
  bgDark:  '#004C4C',
  bgLight: '#08615A',
  fg:      '#EAF3E4',
  fgMuted: 'rgba(234,243,228,0.58)',
  fgFaint: 'rgba(234,243,228,0.32)',
  hairline:'rgba(234,243,228,0.12)',
  lime:    '#CCFA7D',
  mint:    '#00C896',
  coral:   '#E8826E',
  yellow:  '#F5E94E',
  track:   '#45807E',
};
const LPILLAR = { cardio: '#00C896', strength: '#E8826E', knowledge: '#F5E94E' };

// ---------- Header-zone curved backdrop (divider sits high, behind the header) ----------
function LumAppBg({ peak = 150 }) {
  const W = 390, H = 844;
  const a = peak, b = peak + 70;
  const upperVals = [
    `M0,0 H390 V${a} C 250,${a+40} 150,${b} 0,${b} Z`,
    `M0,0 H390 V${a+12} C 240,${a+30} 150,${b+16} 0,${b-8} Z`,
    `M0,0 H390 V${a-8} C 262,${a+52} 132,${b-6} 0,${b+14} Z`,
    `M0,0 H390 V${a} C 250,${a+40} 150,${b} 0,${b} Z`,
  ].join(';');
  const curveVals = [
    `M0,${b} C 150,${b} 250,${a+40} 390,${a}`,
    `M0,${b-8} C 150,${b+16} 240,${a+30} 390,${a+12}`,
    `M0,${b+14} C 132,${b-6} 262,${a+52} 390,${a-8}`,
    `M0,${b} C 150,${b} 250,${a+40} 390,${a}`,
  ].join(';');
  const aProps = { dur: '14s', repeatCount: 'indefinite', calcMode: 'spline', keyTimes: '0;0.34;0.7;1', keySplines: '.45 0 .55 1;.45 0 .55 1;.45 0 .55 1' };
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="lumAppUpper" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#0A6B61"/>
            <stop offset="1" stopColor="#075049"/>
          </linearGradient>
          <radialGradient id="lumAppGloss" cx="0.18" cy="0.06" r="0.8">
            <stop offset="0" stopColor="#EAF3E4" stopOpacity="0.06"/>
            <stop offset="0.6" stopColor="#EAF3E4" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill={LP.bgDark}/>
        <path d={`M0,0 H390 V${a} C 250,${a+40} 150,${b} 0,${b} Z`} fill="url(#lumAppUpper)">
          <animate attributeName="d" values={upperVals} {...aProps}/>
        </path>
        <rect x="0" y="0" width={W} height={H} fill="url(#lumAppGloss)"/>
        <path d={`M0,${b} C 150,${b} 250,${a+40} 390,${a}`} fill="none" stroke="#EAF3E4" strokeOpacity="0.13" strokeWidth="1.4">
          <animate attributeName="d" values={curveVals} {...aProps}/>
        </path>
      </svg>
    </div>
  );
}

// ---------- Lumen app header ----------
function LumHeader({ back, count, page }) {
  return (
    <div style={{ padding: '8px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {back
        ? <button style={{ background: 'transparent', border: 'none', color: LP.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}><IconArrowLeft w={20} h={20}/></button>
        : <Wordmark tone="white" size={20}/>}
      {page && <span style={{ fontSize: 12, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.1em' }}>{page}</span>}
      {!page && <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${LP.hairline}` }}/>}
    </div>
  );
}

// ---------- Lumen bottom tab bar ----------
function LumTabBar({ active = 'home' }) {
  const items = [
    { id: 'home',     label: 'Longevity', icon: 'home' },
    { id: 'fitness',  label: 'Fitness',   icon: 'pulse' },
    { id: 'rewards',  label: 'Kalettes',  icon: 'gift' },
    { id: 'settings', label: 'Settings',  icon: 'gear' },
  ];
  const Icon = ({ id }) => {
    const sw = 1.8;
    if (id === 'home')  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-4v-7h-8v7H4a1 1 0 0 1-1-1Z"/></svg>;
    if (id === 'pulse') return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>;
    if (id === 'gift')  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13M7 8a2.5 2.5 0 1 1 0-5c1.5 0 3 1.5 5 5-3 0-4 0-5 0Zm10 0a2.5 2.5 0 1 0 0-5c-1.5 0-3 1.5-5 5 3 0 4 0 5 0Z"/></svg>;
    return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.5-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.4a7 7 0 0 0-2 1.2l-2.4-.9-2 3.5 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.4-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.4c.7-.3 1.4-.7 2-1.2l2.4.9 2-3.5-2-1.6c.1-.4.1-.8.1-1.2Z"/></svg>;
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 64, paddingBottom: 6, borderTop: `1px solid ${LP.hairline}`, background: 'rgba(0,52,52,0.6)', backdropFilter: 'blur(8px)' }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button key={it.id} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: on ? LP.lime : LP.fgMuted, padding: '6px 12px', fontFamily: 'var(--font-sans)', fontWeight: on ? 700 : 600, fontSize: 11 }}>
            <Icon id={it.icon}/>
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Pillar-dot eyebrow (small, inline)
function LumDot({ pillar = 'cardio', label, step }) {
  const c = LPILLAR[pillar] || LP.mint;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, boxShadow: `0 0 12px ${c}` }}/>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: c }}>{label}{step ? <span style={{ color: LP.fgMuted }}> · {step}</span> : null}</span>
    </div>
  );
}

// Lime hero ring with lime numeral
function LumHeroRing({ value, suffix, pct = 100, size = 96, stroke = 7, accent }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const fill = accent || LP.lime;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={LP.track} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={fill} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(pct/100)*c} ${c}`} transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.4, color: LP.lime, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {suffix ? <span style={{ alignSelf: 'flex-end', marginBottom: size*0.18, fontSize: size*0.12, color: LP.fgMuted, fontWeight: 600 }}>{suffix}</span> : null}
      </div>
    </div>
  );
}

// ============================================================
// ---------- Longevity Level over time (Lumen line chart, per cycle) ----------
function LumLevelChart({ levels = [3, 4, 5, 6], labels = ['C1', 'C2', 'C3', 'Now'], maxL = 10 }) {
  const W = 304, H = 130, padL = 10, padR = 10, padT = 16, padB = 24;
  const n = levels.length;
  const x = i => padL + (n === 1 ? 0 : (i / (n - 1)) * (W - padL - padR));
  const y = v => padT + (1 - v / maxL) * (H - padT - padB);
  const pts = levels.map((v, i) => [x(i), y(v)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L ${x(n - 1).toFixed(1)} ${H - padB} L ${x(0).toFixed(1)} ${H - padB} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="lumLvlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LP.lime} stopOpacity="0.28"/>
          <stop offset="1" stopColor={LP.lime} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((g, i) => (
        <line key={i} x1={padL} x2={W - padR} y1={padT + g * (H - padT - padB)} y2={padT + g * (H - padT - padB)} stroke="rgba(234,243,228,0.08)" strokeWidth="1"/>
      ))}
      <path d={area} fill="url(#lumLvlGrad)"/>
      <path d={line} fill="none" stroke={LP.lime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => {
        const last = i === n - 1;
        return (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r={last ? 5.5 : 3.5} fill={last ? LP.lime : LP.bgDark} stroke={LP.lime} strokeWidth={last ? 0 : 2}/>
            {last && <text x={p[0]} y={p[1] - 12} textAnchor="middle" fill={LP.lime} fontSize="15" fontWeight="700" fontFamily="var(--font-sans)">{levels[i]}</text>}
            <text x={p[0]} y={H - 6} textAnchor="middle" fill={LP.fgMuted} fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// 12 · HOME (Lumen)
// ============================================================
function KaleHomeLumen({ assessmentLive = false }) {
  return (
    <>
      <LumAppBg peak={150}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ padding: '18px 22px 8px', flex: 1, overflowY: 'auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 21, lineHeight: 1.25, letterSpacing: '-0.015em', color: LP.fg, margin: 0 }}>
            Alex, training today is training for <span style={{ color: LP.lime }}>your future</span>.
          </h2>

          {/* Big level */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 16 }}>
            <LumHeroRing value="6" pct={60} size={104} stroke={8}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: LP.fg, letterSpacing: '-0.025em', lineHeight: 1 }}>Level <span style={{ color: LP.lime }}>6</span></div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: LP.fgMuted, marginTop: 6 }}>Your Longevity Level</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, marginTop: 10, background: 'rgba(0,200,150,0.15)', color: LP.mint, fontSize: 12, fontWeight: 700 }}>
                <IconUp w={11} h={11} sw={3}/> +1 this cycle
              </div>
            </div>
          </div>

          {/* Next assessment / live */}
          {assessmentLive
            ? <div style={{ marginTop: 16 }}><KAAssessmentLiveCard/></div>
            : (
              <div style={{ marginTop: 16, padding: 20, borderRadius: 16, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}`, boxShadow: `inset 4px 0 0 0 ${LP.coral}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: LP.coral, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Next assessment</div>
                  <div style={{ fontSize: 12, color: LP.fgMuted, fontWeight: 600 }}>30% through cycle</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 46, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>9</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: LP.fgMuted }}>weeks</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginLeft: 10 }}>3</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: LP.fgMuted }}>days</span>
                </div>
                <div style={{ marginTop: 14, height: 6, borderRadius: 3, background: 'rgba(234,243,228,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '30%', background: LP.lime, borderRadius: 3 }}/>
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: LP.fg, fontWeight: 600 }}>Complete it to bank <span style={{ color: LP.lime, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>486 Kalettes</span>.</div>
              </div>
            )}

          {/* Health Years chart (reused) */}
          <div style={{ marginTop: 16 }}>
            <KACard padding={20}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Health Years over time</span>
                <span style={{ fontSize: 12, color: LP.fgMuted, fontWeight: 600 }}>5y outlook</span>
              </div>
              <KAHealthYearsChart/>
              <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
                <KALegendDot color={LPILLAR.cardio} label="Lifespan +4.2y"/>
                <KALegendDot color={LPILLAR.knowledge} label="Healthspan +6.8y"/>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: LP.fgMuted, fontWeight: 600 }}>at Level 6</span>
              </div>
            </KACard>
          </div>

          {/* Level over time (Lumen line chart) */}
          <div style={{ marginTop: 14 }}>
            <KACard padding={20}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Longevity Level over time</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: LP.lime, letterSpacing: '0.08em' }}>4 CYCLES</span>
              </div>
              <LumLevelChart levels={[3, 4, 5, 6]} labels={['C1', 'C2', 'C3', 'Now']}/>
            </KACard>
          </div>

          {/* Quick stats */}
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <KAQuickStat pillar="Cardio" level={6} color={LPILLAR.cardio}/>
            <KAQuickStat pillar="Strength" level={5} color={LPILLAR.strength}/>
            <KAQuickStat pillar="Knowledge" level={7} color={LPILLAR.knowledge}/>
          </div>

          {/* Your Running Years — feature promo */}
          <div style={{ marginTop: 14, marginBottom: 14, borderRadius: 18, overflow: 'hidden', border: `1px solid rgba(204,250,125,0.28)`, background: 'linear-gradient(150deg, rgba(204,250,125,0.14) 0%, rgba(0,200,150,0.08) 55%, rgba(234,243,228,0.04) 100%)' }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: LP.lime }}>New</span>
                <span style={{ flex: 1, height: 1, background: 'rgba(204,250,125,0.25)' }}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 23, lineHeight: 1.08, letterSpacing: '-0.025em', color: LP.fg, margin: 0 }}>
                    Your <span style={{ color: LP.lime }}>Running Years</span>
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13.5, lineHeight: 1.45, color: LP.fgMuted, margin: '8px 0 0', maxWidth: 220 }}>
                    See the good years you've got ahead — and the moments worth training for.
                  </p>
                </div>
                {/* tiny altitude motif */}
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: LP.fgMuted }}>~</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 52, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums' }}>31</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, color: LP.fg, maxWidth: 56, lineHeight: 1.05 }}>years ahead</span>
                </div>
              </div>
              <button style={{ marginTop: 18, width: '100%', height: 50, borderRadius: 9999, background: LP.lime, color: '#003A38', border: 'none', fontWeight: 700, fontSize: 14.5, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                Explore your Running Years <IconArrowRight w={16} h={16}/>
              </button>
            </div>
          </div>
        </div>
        <LumTabBar active="home"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}
function KaleHomeLumenLive() { return <KaleHomeLumen assessmentLive/>; }

// ============================================================
// FITNESS SHELL (Lumen)
// ============================================================
function LumFitnessShell({ active, subactive, children }) {
  const subItems = active === 'cardio' ? [{ id: 'log', label: 'Activity log' }, { id: 'vo2max', label: 'VO₂max' }] : [];
  const hc = LPILLAR[active] || LP.mint;
  const pillars = [{ id: 'cardio', label: 'Cardio' }, { id: 'strength', label: 'Strength' }, { id: 'knowledge', label: 'Knowledge' }];
  return (
    <>
      <LumAppBg peak={120}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        {/* pillar segmented */}
        <div style={{ padding: '16px 22px 0' }}>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: 'rgba(234,243,228,0.05)', borderRadius: 999, width: 'fit-content', border: `1px solid ${LP.hairline}` }}>
            {pillars.map(p => {
              const on = p.id === active;
              return <button key={p.id} style={{ padding: '8px 16px', borderRadius: 999, background: on ? LPILLAR[p.id] : 'transparent', color: on ? '#003A38' : LP.fgMuted, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13 }}>{p.label}</button>;
            })}
          </div>
        </div>
        <div style={{ padding: '16px 22px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 32, color: LP.fg, letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>{active.charAt(0).toUpperCase() + active.slice(1)}</h1>
          <span style={{ fontSize: 12, fontWeight: 700, color: hc, letterSpacing: '0.08em' }}>LEVEL 6</span>
        </div>
        {subItems.length > 0 && (
          <div style={{ display: 'flex', gap: 4, padding: '14px 22px 0', borderBottom: `1px solid ${LP.hairline}`, marginBottom: 4 }}>
            {subItems.map(s => {
              const on = s.id === subactive;
              return <button key={s.id} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 4px 12px', marginRight: 16, color: on ? LP.fg : LP.fgMuted, fontFamily: 'var(--font-sans)', fontWeight: on ? 700 : 600, fontSize: 13, borderBottom: on ? `2px solid ${hc}` : '2px solid transparent' }}>{s.label}</button>;
            })}
          </div>
        )}
        <div style={{ padding: '16px 22px 12px', flex: 1, overflowY: 'auto' }}>{children}</div>
        <LumTabBar active="fitness"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// 13 · CARDIO · ACTIVITY LOG (Lumen)
function KaleFitnessCardioLumen() {
  const runs = [
    { type: 'run',  name: 'Morning long run',  date: '14 Feb · 7:42am', dist: '12.4km', metric: '4:48', metricUnit: '/km', hr: '148', counted: true },
    { type: 'ride', name: 'Commute home',      date: '13 Feb · 5:55pm', dist: '14.8km', metric: '28.4', metricUnit: 'km/h', hr: '136', counted: true },
    { type: 'run',  name: 'Threshold session', date: '11 Feb · 6:30pm', dist: '8.0km',  metric: '4:12', metricUnit: '/km', hr: '162', counted: true },
    { type: 'ride', name: 'Sunday hills',      date: '10 Feb · 9:15am', dist: '42.1km', metric: '26.1', metricUnit: 'km/h', hr: '158', counted: true },
    { type: 'run',  name: 'Easy recovery jog', date: '09 Feb · 7:10am', dist: '5.2km',  metric: '5:34', metricUnit: '/km', hr: '132', counted: true },
    { type: 'run',  name: 'Treadmill 5k',      date: '07 Feb · 1:15pm', dist: '5.0km',  metric: '4:55', metricUnit: '/km', hr: '—', counted: false, reason: 'Incomplete HR data' },
    { type: 'run',  name: 'Sunday long run',   date: '04 Feb · 8:00am', dist: '15.0km', metric: '5:02', metricUnit: '/km', hr: '146', counted: true },
  ];
  return (
    <LumFitnessShell active="cardio" subactive="log">
      {/* summary hero */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 18, borderBottom: `1px solid ${LP.hairline}`, paddingBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Counted · 12 wks</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 40, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>34</span><span style={{ fontSize: 12, color: LP.fgMuted, fontWeight: 600 }}>runs</span></div>
        </div>
        <div style={{ width: 1, background: LP.hairline, margin: '0 16px' }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Distance</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 40, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>312</span><span style={{ fontSize: 12, color: LP.fgMuted, fontWeight: 600 }}>km</span></div>
        </div>
      </div>
      <KACard padding={0}>
        {runs.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < runs.length - 1 ? `1px solid ${LP.hairline}` : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: r.counted ? (r.type === 'ride' ? 'rgba(245,233,78,0.15)' : 'rgba(0,200,150,0.15)') : 'rgba(234,243,228,0.04)', border: `1px solid ${r.counted ? (r.type === 'ride' ? 'rgba(245,233,78,0.4)' : 'rgba(0,200,150,0.4)') : LP.hairline}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <KAActivityIcon type={r.type} size={16} color={r.counted ? (r.type === 'ride' ? LP.yellow : LP.mint) : LP.fgMuted}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: LP.fg }}>{r.name}</div>
              <div style={{ fontSize: 11, color: LP.fgMuted, fontWeight: 600, marginTop: 2 }}>{r.date}{!r.counted && <span style={{ color: LP.coral }}> · {r.reason}</span>}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14, color: LP.fg, fontVariantNumeric: 'tabular-nums' }}>{r.dist}</div>
              <div style={{ fontSize: 10, color: LP.fgMuted, fontWeight: 600, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{r.metric} {r.metricUnit} · {r.hr} bpm</div>
            </div>
          </div>
        ))}
      </KACard>
    </LumFitnessShell>
  );
}

// 14 · CARDIO · VO₂max (Lumen)
function KaleFitnessVO2Lumen() {
  const rows = [
    { src: 'Garmin device', val: '52.3', acc: 3, date: 'Jan 2026', live: false },
    { src: 'Kale pace + HR', val: '50.8', acc: 4, date: 'Feb 2026', live: false },
    { src: 'Validated lab', val: '54.1', acc: 5, date: 'Nov 2025', live: false },
    { src: 'HRR formula', val: '51.6', acc: 3, date: 'Live', live: true },
  ];
  return (
    <LumFitnessShell active="cardio" subactive="vo2max">
      <div style={{ paddingBottom: 18, borderBottom: `1px solid ${LP.hairline}`, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: LPILLAR.cardio, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Your best estimate</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 72, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>52.6</span>
          <span style={{ fontSize: 13, color: LP.fgMuted, fontWeight: 600 }}>ml/kg/min</span>
        </div>
        <p style={{ color: LP.fg, fontSize: 13, lineHeight: 1.5, margin: '10px 0 0' }}>Average of validated sources. <span style={{ color: LPILLAR.cardio, fontWeight: 700 }}>Excellent</span> for your age group.</p>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Running VO₂max — by source</div>
      <KACard padding={0}>
        <div style={{ display: 'flex', padding: '12px 16px', borderBottom: `1px solid ${LP.hairline}`, fontSize: 10, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span style={{ flex: 1.4 }}>Source</span><span style={{ flex: 0.9, textAlign: 'right' }}>Estimate</span><span style={{ flex: 1.1, textAlign: 'right' }}>Accuracy</span><span style={{ flex: 0.7, textAlign: 'right' }}>Date</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: i < rows.length - 1 ? `1px solid ${LP.hairline}` : 'none', background: r.live ? 'rgba(204,250,125,0.06)' : 'transparent' }}>
            <span style={{ flex: 1.4, fontSize: 13, color: LP.fg, fontWeight: 600 }}>{r.src}</span>
            <span style={{ flex: 0.9, textAlign: 'right', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14, color: r.live ? LP.lime : LP.fg, fontVariantNumeric: 'tabular-nums' }}>{r.val}</span>
            <span style={{ flex: 1.1, textAlign: 'right' }}>{Array.from({length:5}).map((_,k)=><span key={k} style={{ color: k < r.acc ? LPILLAR.cardio : 'rgba(234,243,228,0.18)', fontSize: 11 }}>★</span>)}</span>
            <span style={{ flex: 0.7, textAlign: 'right', fontSize: 11, color: r.live ? LPILLAR.cardio : LP.fgMuted, fontWeight: 700 }}>{r.date}</span>
          </div>
        ))}
      </KACard>
      <div style={{ marginTop: 16 }}>
        <KACard>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 17, color: LP.fg, padding: '10px 14px', borderRadius: 10, background: 'rgba(204,250,125,0.10)', border: `1px solid rgba(204,250,125,0.25)`, display: 'inline-block' }}>VO₂max ≈ 15 × (HRmax / HRrest)</div>
          <p style={{ color: LP.fgMuted, fontSize: 13, lineHeight: 1.55, margin: '12px 0 0' }}>The Heart Rate Reserve method. Two data points, no effort required, reliable for tracking trends.</p>
        </KACard>
      </div>
      <div style={{ height: 14 }}/>
    </LumFitnessShell>
  );
}

// 15 · CARDIO · INTENSITY (Lumen)
function KaleFitnessIntensityLumen() {
  const weeks = [[25,50,14,8,3],[22,56,12,7,3],[28,55,10,5,2],[20,48,18,9,5],[24,58,10,6,2],[26,56,12,4,2],[22,52,14,8,4],[28,54,11,5,2]];
  return (
    <LumFitnessShell active="cardio" subactive="intensity">
      <div style={{ paddingBottom: 16, borderBottom: `1px solid ${LP.hairline}`, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>This week · easy / hard</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 60, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>82</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22, color: LP.fgMuted }}>/ 18</span>
          <span style={{ marginLeft: 6, fontSize: 13, color: LPILLAR.cardio, fontWeight: 800 }}>sweet spot</span>
        </div>
      </div>
      <KACard padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Training load — by zone</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: LPILLAR.cardio, letterSpacing: '0.08em' }}>80 / 20 rule</span>
        </div>
        <KAZoneBars weeks={weeks}/>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          {['Z1','Z2','Z3','Z4','Z5'].map(z => <KAZoneLegend key={z} color={KAColors['z'+z[1]]} label={z}/>)}
        </div>
      </KACard>
      <div style={{ marginTop: 14, fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>More longevity data</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <KAMicroCard label="Resting HR" value="52" unit="bpm" delta={-3}/>
        <KAMicroCard label="HRV (7d avg)" value="68" unit="ms" delta={+4}/>
        <KAMicroCard label="Fitness age" value="34" unit="yrs" delta={-2}/>
        <KAMicroCard label="Active min / wk" value="218" unit="of 225" delta={null}/>
      </div>
      <div style={{ height: 14 }}/>
    </LumFitnessShell>
  );
}

Object.assign(window, {
  LP, LPILLAR, LumAppBg, LumHeader, LumTabBar, LumDot, LumHeroRing, LumFitnessShell,
  KaleHomeLumen, KaleHomeLumenLive, KaleFitnessCardioLumen, KaleFitnessVO2Lumen, KaleFitnessIntensityLumen,
});
