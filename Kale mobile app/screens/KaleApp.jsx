/* eslint-disable */
// Kale Main App — pass 2 of the design brief.
// Home (full), Fitness tab > Cardio sub-pages (activity log / VO2max / training
// intensity), Rewards tab (balance + cycle tracker, marketplace preview).
// Reuses ForestPalette + KOnbColors + Wordmark from global scope.

const KAP = ForestPalette;
const KAColors = {
  cardio:    '#00C896',
  strength:  '#E8826E',
  knowledge: '#F5E94E',
  // Zone palette for 80/20 training intensity bars
  z1: 'rgba(0,200,150,0.25)',
  z2: 'rgba(0,200,150,0.7)',
  z3: '#F5E94E',
  z4: '#E8826E',
  z5: '#D14B3B',
};

// ============================================================
// Shared chrome — bottom tab bar (4 items per brief)
// ============================================================
function KATabBar({ active = 'home' }) {
  const items = [
    { id: 'home',     label: 'Longevity', icon: 'home' },
    { id: 'fitness',  label: 'Fitness',   icon: 'pulse' },
    { id: 'rewards',  label: 'Kalettes',  icon: 'gift' },
    { id: 'settings', label: 'Settings',  icon: 'gear' },
  ];
  const Icon = ({ id }) => {
    const sw = 1.8;
    if (id === 'home')    return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-4v-7h-8v7H4a1 1 0 0 1-1-1Z"/></svg>;
    if (id === 'pulse')   return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>;
    if (id === 'gift')    return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13M7 8a2.5 2.5 0 1 1 0-5c1.5 0 3 1.5 5 5-3 0-4 0-5 0Zm10 0a2.5 2.5 0 1 0 0-5c-1.5 0-3 1.5-5 5 3 0 4 0 5 0Z"/></svg>;
    if (id === 'gear')    return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.5-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.4a7 7 0 0 0-2 1.2l-2.4-.9-2 3.5 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.4-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.4c.7-.3 1.4-.7 2-1.2l2.4.9 2-3.5-2-1.6c.1-.4.1-.8.1-1.2Z"/></svg>;
    return null;
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      height: 64, paddingBottom: 6, borderTop: `1px solid ${KAP.hairline}`,
      background: KAP.bg,
    }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button key={it.id} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: on ? KAP.fg : KAP.fgMuted, padding: '6px 12px',
            fontFamily: 'var(--font-sans)', fontWeight: on ? 700 : 600, fontSize: 11, letterSpacing: '0.02em',
          }}>
            <Icon id={it.icon}/>
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Sub-section tab bar used in the Fitness tab
function KASubTabs({ active = 'cardio', onChange }) {
  const items = [
    { id: 'cardio',    label: 'Cardio',    color: KAColors.cardio },
    { id: 'strength',  label: 'Strength',  color: KAColors.strength },
    { id: 'knowledge', label: 'Knowledge', color: KAColors.knowledge },
  ];
  return (
    <div style={{ display: 'flex', gap: 6, padding: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: 999, width: 'fit-content', border: `1px solid ${KAP.hairline}` }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button key={it.id} onClick={() => onChange && onChange(it.id)} style={{
            padding: '8px 16px', borderRadius: 999,
            background: on ? it.color : 'transparent',
            color: on ? 'var(--kale-dark)' : KAP.fgMuted,
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, letterSpacing: '-0.005em',
          }}>{it.label}</button>
        );
      })}
    </div>
  );
}

// ============================================================
// HOME (v2 per brief)
// ============================================================
function KaleHomeV2({ assessmentLive = false }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KAP.bg }}/>
      <img src="assets/kale-watermark.svg" alt="" aria-hidden="true" style={{
        position: 'absolute', right: -80, top: 60,
        width: 320, height: 'auto', opacity: 0.06, pointerEvents: 'none', transform: 'rotate(-10deg)',
      }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${KAP.hairline}` }}/>
        </div>

        <div style={{ padding: '20px 24px 8px', flex: 1, overflowY: 'auto' }}>
          <Eyebrow>Morning, Alex.</Eyebrow>

          {/* Big level + delta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 14 }}>
            <KARingBig level={6}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: KAP.fg, letterSpacing: '-0.025em', lineHeight: 1 }}>
                Level <span style={{ color: KAP.mint }}>6</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: KAP.fgMuted, marginTop: 6 }}>Your Longevity Level</div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 999, marginTop: 10,
                background: 'rgba(0,200,150,0.15)', color: KAP.mint,
                fontSize: 12, fontWeight: 700,
              }}>
                <IconUp w={11} h={11} sw={3}/> +1 this cycle
              </div>
            </div>
          </div>

          {/* Inspiration quote — quiet editorial break */}
          <div style={{
            marginTop: 22, padding: '20px 22px',
            borderTop: `1px solid ${KAP.hairline}`,
            borderBottom: `1px solid ${KAP.hairline}`,
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute', top: -2, left: 8,
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 64,
              color: KAP.mint, opacity: 0.5, lineHeight: 1,
              letterSpacing: '-0.05em', pointerEvents: 'none',
            }}>“</span>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17,
              color: KAP.fg, letterSpacing: '-0.015em', lineHeight: 1.3,
              margin: 0, fontStyle: 'italic', paddingLeft: 18,
            }}>
              The first wealth is <span style={{ color: KAP.mint }}>health</span>.
            </p>
            <div style={{
              marginTop: 8, paddingLeft: 18,
              fontSize: 11, fontWeight: 700, color: KAP.fgMuted,
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>— Ralph Waldo Emerson</div>
          </div>

          {/* Countdown / Live assessment card */}
          {assessmentLive
            ? <KAAssessmentLiveCard/>
            : (
              <KACard accent={KAColors.strength} style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: KAColors.strength, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Next assessment</div>
                  <div style={{ fontSize: 12, color: KAP.fgMuted, fontWeight: 600 }}>30% through cycle</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 40, color: KAP.fg, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>9</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KAP.fgMuted }}>weeks</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: KAP.fg, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginLeft: 8 }}>3</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KAP.fgMuted }}>days</span>
                </div>
                <div style={{ marginTop: 14, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '30%', background: KAP.mint, borderRadius: 3 }}/>
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: KAP.fg, fontWeight: 600 }}>
                  Complete it to bank <span style={{ color: KAP.mint, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>486 Kalettes</span>.
                </div>
              </KACard>
            )
          }

          {/* Health Years chart */}
          <div style={{ marginTop: 16 }}>
            <KACard padding={20}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Health Years over time</span>
                <span style={{ fontSize: 12, color: KAP.fgMuted, fontWeight: 600 }}>5y outlook</span>
              </div>
              <KAHealthYearsChart/>
              <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
                <KALegendDot color={KAColors.cardio}    label="Lifespan +4.2y"/>
                <KALegendDot color={KAColors.knowledge} label="Healthspan +6.8y"/>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: KAP.fgMuted, fontWeight: 600 }}>at Level 6</span>
              </div>
              <button style={{
                marginTop: 16, paddingTop: 14, borderTop: `1px solid ${KAP.hairline}`,
                width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                color: KAColors.cardio, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                letterSpacing: '-0.005em', padding: '14px 0 0',
              }}>
                Learn how we calculate this
                <IconArrowRight w={14} h={14} stroke={KAColors.cardio}/>
              </button>
            </KACard>
          </div>

          {/* Level over time chart */}
          <div style={{ marginTop: 14 }}>
            <KACard padding={20}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your Longevity Level</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: KAP.mint, letterSpacing: '0.08em' }}>4 CYCLES</span>
              </div>
              <KALevelStepChart/>
              <button style={{
                marginTop: 16, paddingTop: 14, borderTop: `1px solid ${KAP.hairline}`,
                width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                color: KAP.mint, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                letterSpacing: '-0.005em', padding: '14px 0 0',
              }}>
                See your full level history
                <IconArrowRight w={14} h={14} stroke={KAP.mint}/>
              </button>
            </KACard>
          </div>

          {/* Quick stats row */}
          <div style={{ marginTop: 14, marginBottom: 14, display: 'flex', gap: 10 }}>
            <KAQuickStat pillar="Cardio"    level={6} color={KAColors.cardio}/>
            <KAQuickStat pillar="Strength"  level={5} color={KAColors.strength}/>
            <KAQuickStat pillar="Knowledge" level={7} color={KAColors.knowledge}/>
          </div>
        </div>

        <KATabBar active="home"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function KARingBig({ level }) {
  const size = 96;
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const dash = (level / 10) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={KAP.mint} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44,
        color: KAP.fg, letterSpacing: '-0.05em', lineHeight: 1,
      }}>{level}</div>
    </div>
  );
}

function KALegendDot({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: KAP.fg, fontWeight: 600 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }}/>
      {label}
    </span>
  );
}

function KAHealthYearsChart() {
  // Two area-ish lines over 5 quarters; forward projection dashed
  const W = 300, H = 120;
  // Points: x for each quarter (0..4), y inverted
  const lifeNow = [2.6, 3.0, 3.4, 3.8, 4.2];
  const healthNow = [4.8, 5.4, 5.8, 6.4, 6.8];
  const lifeFut = [4.2, 4.6, 5.1];   // at level 7+
  const healthFut = [6.8, 7.4, 8.0];
  const xAt = (i, total) => (i / (total - 1)) * (W - 20) + 10;
  const yAt = (v) => H - 12 - (v / 10) * (H - 24);
  const linePath = (arr, totalForX) => arr.map((v, i) => `${i ? 'L' : 'M'} ${xAt(i, totalForX)} ${yAt(v)}`).join(' ');
  // For the future line, x continues from cur length
  const futPath = (cur, fut) => {
    const total = cur.length + fut.length - 1;
    return fut.map((v, i) => {
      const x = ((cur.length - 1 + i) / total) * (W - 20) + 10;
      return `${i ? 'L' : 'M'} ${x} ${yAt(v)}`;
    }).join(' ');
  };
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* faint horizontal gridlines */}
      {[2, 4, 6, 8].map(g => (
        <line key={g} x1={10} x2={W-10} y1={yAt(g)} y2={yAt(g)} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}
      {/* Healthspan area+line */}
      <path d={`${linePath(healthNow, healthNow.length)} L ${xAt(healthNow.length-1, healthNow.length)} ${H-12} L ${xAt(0, healthNow.length)} ${H-12} Z`} fill={KAColors.knowledge} opacity="0.10"/>
      <path d={linePath(healthNow, healthNow.length)} stroke={KAColors.knowledge} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {healthNow.map((v, i) => <circle key={'h'+i} cx={xAt(i, healthNow.length)} cy={yAt(v)} r={i === healthNow.length - 1 ? 4 : 2.5} fill={KAColors.knowledge}/>)}
      {/* Lifespan area+line */}
      <path d={linePath(lifeNow, lifeNow.length)} stroke={KAColors.cardio} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {lifeNow.map((v, i) => <circle key={'l'+i} cx={xAt(i, lifeNow.length)} cy={yAt(v)} r={i === lifeNow.length - 1 ? 4 : 2.5} fill={KAColors.cardio}/>)}
      {/* Future projections dashed */}
      <path d={futPath(lifeNow, lifeFut)} stroke={KAColors.cardio} strokeWidth="1.8" fill="none" strokeDasharray="3 4" opacity="0.6"/>
      <path d={futPath(healthNow, healthFut)} stroke={KAColors.knowledge} strokeWidth="1.8" fill="none" strokeDasharray="3 4" opacity="0.6"/>
      {/* x labels — quarters */}
      {['Q1', 'Q2', 'Q3', 'Q4', 'Now', '→', '→'].map((lbl, i) => {
        const totalSlots = 7;
        const x = (i / (totalSlots - 1)) * (W - 20) + 10;
        return <text key={i} x={x} y={H - 1} fill={KAP.fgMuted} fontSize="9" fontWeight="600" textAnchor="middle">{lbl}</text>;
      })}
    </svg>
  );
}

function KALevelStepChart() {
  const W = 300, H = 100;
  const pts = [4, 5, 5, 6]; // four cycles
  const xAt = (i) => (i / (pts.length - 1)) * (W - 24) + 12;
  const yAt = (v) => H - 18 - (v / 10) * (H - 32);
  let d = '';
  pts.forEach((v, i) => {
    const x = xAt(i);
    const y = yAt(v);
    if (i === 0) d += `M ${x} ${y}`;
    else {
      const px = xAt(i - 1);
      const py = yAt(pts[i - 1]);
      const midX = (px + x) / 2;
      d += ` L ${midX} ${py} L ${midX} ${y} L ${x} ${y}`;
    }
  });
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* faint level guides */}
      {[2, 4, 6, 8].map(g => (
        <g key={g}>
          <line x1={12} x2={W-12} y1={yAt(g)} y2={yAt(g)} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <text x={2} y={yAt(g)+3} fill={KAP.fgMuted} fontSize="9" fontWeight="600">{g}</text>
        </g>
      ))}
      <path d={d} stroke={KAP.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((v, i) => {
        const isLast = i === pts.length - 1;
        return (
          <g key={i}>
            {isLast && <circle cx={xAt(i)} cy={yAt(v)} r="9" fill="rgba(0,200,150,0.18)"/>}
            <circle cx={xAt(i)} cy={yAt(v)} r={isLast ? 5 : 3.5} fill={KAP.mint}/>
            <text x={xAt(i)} y={H - 4} fill={KAP.fgMuted} fontSize="9" fontWeight="600" textAnchor="middle">{['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4'][i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function KAQuickStat({ pillar, level, color }) {
  return (
    <button style={{
      flex: 1, padding: '14px 12px', borderRadius: 14,
      background: 'rgba(255,255,255,0.04)', border: `1px solid ${KAP.hairline}`,
      cursor: 'pointer', textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{pillar}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: KAP.fg, letterSpacing: '-0.03em', lineHeight: 1 }}>{level}</span>
        <KARingMini level={level} color={color}/>
      </div>
    </button>
  );
}

function KARingMini({ level, color }) {
  const size = 26, sw = 3;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${(level/10)*c} ${c}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
    </svg>
  );
}

function KACard({ children, accent, padding = 20, style }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${KAP.hairline}`,
      borderRadius: 16, padding,
      ...(accent ? { borderLeftWidth: 0, boxShadow: `inset 4px 0 0 0 ${accent}` } : {}),
      ...style,
    }}>{children}</div>
  );
}

// Live-assessment variant of the countdown card — pulses, replaces dates
// with hours-remaining, and adds a primary CTA. Used on KaleHomeV2 when
// the assessment window is open.
function KAAssessmentLiveCard() {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  // Fake deadline: ~2 days 14 hrs 32 min from "now"
  const totalSecs = 2 * 86400 + 14 * 3600 + 32 * 60 - (Math.floor(now / 1000) % 60);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  // Window: started 5 days ago, ends in 2.6 days — total 7d window
  const windowPct = 5 / 7;
  return (
    <>
      <style>{`
        @keyframes ka-live-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,200,150,0); }
          50%      { box-shadow: 0 0 0 5px rgba(0,200,150,0.18); }
        }
        @keyframes ka-live-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
      <div style={{
        marginTop: 16, padding: 20, borderRadius: 16,
        background: 'linear-gradient(180deg, rgba(0,200,150,0.10) 0%, rgba(0,200,150,0.04) 100%)',
        border: `1.5px solid ${KAP.mint}`,
        animation: 'ka-live-pulse 2.4s ease-in-out infinite',
      }}>
        {/* Live header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 10px 4px 8px', borderRadius: 999,
            background: KAP.mint, color: 'var(--kale-dark)',
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--kale-dark)',
              animation: 'ka-live-dot 1.4s ease-in-out infinite',
            }}/>
            Assessment live
          </div>
          <div style={{ fontSize: 11, color: KAP.fgMuted, fontWeight: 600, letterSpacing: '0.04em' }}>Cycle 5</div>
        </div>

        {/* Headline */}
        <h3 style={{
          fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 22,
          color: KAP.fg, letterSpacing: '-0.02em', lineHeight: 1.15,
          margin: '0 0 14px',
        }}>
          Take your <em style={{ color: KAP.mint, fontStyle: 'italic' }}>assessment</em>.
        </h3>

        {/* Countdown grid */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'baseline' }}>
          <KATimeUnit value={days} unit="days"/>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: KAP.fgFaint, letterSpacing: '-0.03em', margin: '0 6px', lineHeight: 1 }}>:</span>
          <KATimeUnit value={hours} unit="hrs"/>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: KAP.fgFaint, letterSpacing: '-0.03em', margin: '0 6px', lineHeight: 1 }}>:</span>
          <KATimeUnit value={mins} unit="min"/>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: KAP.fgFaint, letterSpacing: '-0.03em', margin: '0 6px', lineHeight: 1 }}>:</span>
          <KATimeUnit value={secs} unit="sec" muted/>
        </div>

        {/* Window progress bar */}
        <div style={{ marginTop: 14, height: 5, borderRadius: 3, background: 'rgba(0,200,150,0.15)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, height: '100%', width: `${windowPct * 100}%`, background: KAP.mint, borderRadius: 3 }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: KAP.fgMuted, fontWeight: 700, letterSpacing: '0.08em' }}>
          <span>WINDOW OPENED 5 DAYS AGO</span>
          <span>CLOSES SUN 11 PM</span>
        </div>

        {/* CTA + bank copy */}
        <button style={{
          marginTop: 16, width: '100%', height: 48, borderRadius: 9999,
          background: KAP.mint, color: 'var(--kale-dark)',
          border: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>Start assessment <IconArrowRight w={16} h={16}/></button>

        <div style={{ marginTop: 12, fontSize: 13, color: KAP.fg, fontWeight: 600, textAlign: 'center' }}>
          Complete it to bank <span style={{ color: KAP.mint, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>486 Kalettes</span>.
        </div>
      </div>
    </>
  );
}

function KATimeUnit({ value, unit, muted }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 32,
        color: muted ? KAP.fgMuted : KAP.fg, letterSpacing: '-0.04em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>{String(value).padStart(2, '0')}</div>
      <div style={{
        fontSize: 9, fontWeight: 700, color: KAP.fgMuted,
        letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 6,
      }}>{unit}</div>
    </div>
  );
}

// Convenience export: home with the live-assessment card
function KaleHomeAssessmentLive() {
  return <KaleHomeV2 assessmentLive/>;
}

// ============================================================
// FITNESS · CARDIO · ACTIVITY LOG
// ============================================================
function KaleFitnessCardio() {
  const runs = [
    { type: 'run',  name: 'Morning long run',    date: '14 Feb · 7:42am', dist: '12.4km', metric: '4:48',  metricUnit: '/km', hr: '148', counted: true },
    { type: 'ride', name: 'Commute home',        date: '13 Feb · 5:55pm', dist: '14.8km', metric: '28.4',  metricUnit: 'km/h', hr: '136', counted: true },
    { type: 'run',  name: 'Threshold session',   date: '11 Feb · 6:30pm', dist: '8.0km',  metric: '4:12',  metricUnit: '/km', hr: '162', counted: true },
    { type: 'ride', name: 'Sunday hills',        date: '10 Feb · 9:15am', dist: '42.1km', metric: '26.1',  metricUnit: 'km/h', hr: '158', counted: true },
    { type: 'run',  name: 'Easy recovery jog',   date: '09 Feb · 7:10am', dist: '5.2km',  metric: '5:34',  metricUnit: '/km', hr: '132', counted: true },
    { type: 'run',  name: 'Treadmill 5k',        date: '07 Feb · 1:15pm', dist: '5.0km',  metric: '4:55',  metricUnit: '/km', hr: '—',   counted: false, reason: 'Incomplete HR data' },
    { type: 'run',  name: 'Sunday long run',     date: '04 Feb · 8:00am', dist: '15.0km', metric: '5:02',  metricUnit: '/km', hr: '146', counted: true },
    { type: 'ride', name: 'Lunchtime spin',      date: '01 Feb · 12:40pm', dist: '8.2km',  metric: '22.0', metricUnit: 'km/h', hr: '118', counted: false, reason: 'Too short' },
  ];
  const [filter, setFilter] = React.useState('All');
  const [typeFilter, setTypeFilter] = React.useState('All sports');
  const visible = runs.filter(r => {
    if (filter === 'Counted' && !r.counted) return false;
    if (filter === 'Not counted' && r.counted) return false;
    if (typeFilter === 'Runs' && r.type !== 'run') return false;
    if (typeFilter === 'Rides' && r.type !== 'ride') return false;
    return true;
  });

  return (
    <KaleFitnessShell active="cardio" subactive="log">
      {/* Sport-type pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {[
          { id: 'All sports', icon: null },
          { id: 'Runs',       icon: 'run' },
          { id: 'Rides',      icon: 'ride' },
        ].map(o => {
          const on = typeFilter === o.id;
          return (
            <button key={o.id} onClick={() => setTypeFilter(o.id)} style={{
              padding: '7px 14px', borderRadius: 999, flex: 1,
              background: on ? KAColors.cardio : 'transparent',
              color: on ? 'var(--kale-dark)' : KAP.fg,
              border: `1.5px solid ${on ? KAColors.cardio : KAP.hairline}`,
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {o.icon && <KAActivityIcon type={o.icon} size={13} color="currentColor"/>}
              {o.id}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['All', 'Counted', 'Not counted'].map(f => {
          const on = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 12px', borderRadius: 999,
              background: on ? KAP.fg : 'transparent',
              color: on ? 'var(--kale-dark)' : KAP.fgMuted,
              border: `1px solid ${on ? KAP.fg : KAP.hairline}`,
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, cursor: 'pointer',
            }}>{f}</button>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: KAP.fgMuted, fontWeight: 600 }}>Last 12 weeks</span>
      </div>

      <KACard padding={0}>
        {visible.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px',
            borderBottom: i < visible.length - 1 ? `1px solid ${KAP.hairline}` : 'none',
          }}>
            {/* Activity-type icon (run vs ride) — also colour-codes counted/not */}
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: r.counted ? (r.type === 'ride' ? 'rgba(245,233,78,0.15)' : 'rgba(0,200,150,0.15)') : 'rgba(255,255,255,0.04)',
              border: `1px solid ${r.counted ? (r.type === 'ride' ? 'rgba(245,233,78,0.4)' : 'rgba(0,200,150,0.4)') : KAP.hairline}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <KAActivityIcon
                type={r.type} size={16}
                color={r.counted ? (r.type === 'ride' ? KAColors.knowledge : KAColors.cardio) : KAP.fgMuted}
              />
              {!r.counted && (
                <span style={{
                  position: 'absolute', top: -3, right: -3,
                  width: 14, height: 14, borderRadius: '50%',
                  background: KAP.bg, color: KAColors.strength,
                  border: `1.5px solid ${KAP.bg}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, lineHeight: 1,
                }}>!</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 9,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: r.type === 'ride' ? KAColors.knowledge : KAColors.cardio,
                }}>{r.type === 'ride' ? 'Ride' : 'Run'}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KAP.fg, letterSpacing: '-0.005em', marginTop: 2 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: KAP.fgMuted, fontWeight: 600, marginTop: 2 }}>{r.date} {!r.counted && <span style={{ color: KAColors.strength }}>· {r.reason}</span>}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14, color: KAP.fg, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{r.dist}</div>
              <div style={{ fontSize: 10, color: KAP.fgMuted, fontWeight: 600, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{r.metric} {r.metricUnit} · {r.hr} bpm</div>
            </div>
          </div>
        ))}
      </KACard>

      <button style={{
        marginTop: 14, background: 'transparent', border: 'none', cursor: 'pointer',
        color: KAColors.cardio, fontSize: 13, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0,
      }}>How do we decide which activities count? <span style={{ fontWeight: 800 }}>→</span></button>
    </KaleFitnessShell>
  );
}

// Small run/ride glyph used in the activity log
function KAActivityIcon({ type, size = 16, color = 'currentColor' }) {
  if (type === 'ride') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5"/>
        <circle cx="18.5" cy="17.5" r="3.5"/>
        <path d="M5.5 17.5L9 8h5l4.5 9.5M9 8l3.5-3.5h3"/>
      </svg>
    );
  }
  // run
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="4.5" r="1.8"/>
      <path d="M5 13l3-3 3 1 2 4-2 3M10 21l3-4 2-3 5 2"/>
      <path d="M16 7.5l-2.5 3-3-1.5"/>
    </svg>
  );
}

// ============================================================
// FITNESS · CARDIO · VO2max PANEL
// ============================================================
function KaleFitnessVO2() {
  const rows = [
    { src: 'Garmin device',     val: '52.3', acc: 3, date: 'Jan 2026', live: false },
    { src: 'Kale pace + HR',    val: '50.8', acc: 4, date: 'Feb 2026', live: false },
    { src: 'Validated lab',     val: '54.1', acc: 5, date: 'Nov 2025', live: false },
    { src: 'HRR formula',       val: '51.6', acc: 3, date: 'Live',     live: true  },
  ];
  return (
    <KaleFitnessShell active="cardio" subactive="vo2max">
      {/* Best estimate */}
      <KACard accent={KAColors.cardio}>
        <div style={{ fontSize: 11, fontWeight: 700, color: KAColors.cardio, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Your best estimate</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 52, color: KAP.fg, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>52.6</span>
          <span style={{ fontSize: 13, color: KAP.fgMuted, fontWeight: 600 }}>ml/kg/min</span>
        </div>
        <p style={{ color: KAP.fg, fontSize: 13, lineHeight: 1.5, margin: '10px 0 0' }}>
          Average of validated sources. <span style={{ color: KAColors.cardio, fontWeight: 700 }}>Excellent</span> for your age group.
        </p>
      </KACard>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Running VO₂max — by source</div>
        <KACard padding={0}>
          <div style={{ display: 'flex', padding: '12px 16px', borderBottom: `1px solid ${KAP.hairline}`, fontSize: 10, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span style={{ flex: 1.4 }}>Source</span>
            <span style={{ flex: 0.9, textAlign: 'right' }}>Estimate</span>
            <span style={{ flex: 1.1, textAlign: 'right' }}>Accuracy</span>
            <span style={{ flex: 0.7, textAlign: 'right' }}>Date</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '12px 16px',
              borderBottom: i < rows.length - 1 ? `1px solid ${KAP.hairline}` : 'none',
              background: r.live ? 'rgba(0,200,150,0.05)' : 'transparent',
            }}>
              <span style={{ flex: 1.4, fontSize: 13, color: KAP.fg, fontWeight: 600 }}>{r.src}</span>
              <span style={{ flex: 0.9, textAlign: 'right', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14, color: KAP.fg, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{r.val}</span>
              <span style={{ flex: 1.1, textAlign: 'right' }}><KAStars n={r.acc}/></span>
              <span style={{ flex: 0.7, textAlign: 'right', fontSize: 11, color: r.live ? KAColors.cardio : KAP.fgMuted, fontWeight: 700 }}>{r.date}</span>
            </div>
          ))}
        </KACard>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Heart Rate Reserve — how it works</div>
        <KACard>
          <div style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18, color: KAP.fg,
            letterSpacing: '-0.01em', padding: '10px 14px', borderRadius: 10,
            background: 'rgba(0,200,150,0.10)', border: `1px solid rgba(0,200,150,0.25)`,
            fontVariantNumeric: 'tabular-nums', display: 'inline-block',
          }}>VO₂max ≈ 15 × (HR<sub style={{ fontSize: 12 }}>max</sub> / HR<sub style={{ fontSize: 12 }}>rest</sub>)</div>
          <p style={{ color: KAP.fgMuted, fontSize: 13, lineHeight: 1.55, margin: '12px 0 0' }}>
            The Uth–Sørensen–Overgaard–Pedersen formula. Two data points, no effort required, reliable for tracking trends.
          </p>
          <div style={{ display: 'flex', gap: 0, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${KAP.hairline}` }}>
            <KAMini label="HRmax"        value="182" unit="bpm"/>
            <div style={{ width: 1, background: KAP.hairline, margin: '0 14px' }}/>
            <KAMini label="HRrest"       value="52"  unit="bpm"/>
            <div style={{ width: 1, background: KAP.hairline, margin: '0 14px' }}/>
            <KAMini label="HRR VO₂max"  value="52.7" unit="ml/kg/min" highlight/>
          </div>
        </KACard>
      </div>

      <button style={{
        marginTop: 14, marginBottom: 14, background: 'transparent', border: `1px solid ${KAP.hairline}`,
        borderRadius: 12, padding: '12px 16px', color: KAP.fg,
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
      }}>Cycling VO₂max <span style={{ color: KAP.fgMuted }}>3 sources →</span></button>
    </KaleFitnessShell>
  );
}

function KAStars({ n }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
      {Array.from({length: 5}).map((_, i) => (
        <span key={i} style={{
          color: i < n ? KAColors.cardio : 'rgba(255,255,255,0.18)',
          fontSize: 11, lineHeight: 1,
        }}>★</span>
      ))}
    </span>
  );
}

function KAMini({ label, value, unit, highlight }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16,
        color: highlight ? KAColors.cardio : KAP.fg, letterSpacing: '-0.015em',
        marginTop: 4, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
      }}>{value}<span style={{ color: KAP.fgMuted, fontSize: 10, fontWeight: 600, marginLeft: 3 }}>{unit}</span></div>
    </div>
  );
}

// ============================================================
// FITNESS · CARDIO · TRAINING INTENSITY (80/20 zones)
// ============================================================
function KaleFitnessIntensity() {
  // Eight weeks of zone breakdowns (must sum to ~100). Order: z1,z2,z3,z4,z5
  const weeks = [
    [25, 50, 14,  8,  3],
    [22, 56, 12,  7,  3],
    [28, 55, 10,  5,  2],
    [20, 48, 18,  9,  5],
    [24, 58, 10,  6,  2],
    [26, 56, 12,  4,  2],
    [22, 52, 14,  8,  4],
    [28, 54, 11,  5,  2],
  ];
  const [windowSel, setWindowSel] = React.useState('8 weeks');
  return (
    <KaleFitnessShell active="cardio" subactive="intensity">
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['4 weeks', '8 weeks', '12 weeks', 'All time'].map(w => {
          const on = windowSel === w;
          return (
            <button key={w} onClick={() => setWindowSel(w)} style={{
              padding: '6px 12px', borderRadius: 999,
              background: on ? KAP.fg : 'transparent',
              color: on ? 'var(--kale-dark)' : KAP.fgMuted,
              border: `1px solid ${on ? KAP.fg : KAP.hairline}`,
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              flex: 1,
            }}>{w}</button>
          );
        })}
      </div>

      <KACard padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Training load — by zone</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: KAColors.cardio, letterSpacing: '0.08em' }}>80 / 20 rule</span>
        </div>
        <KAZoneBars weeks={weeks}/>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <KAZoneLegend color={KAColors.z1} label="Z1"/>
          <KAZoneLegend color={KAColors.z2} label="Z2"/>
          <KAZoneLegend color={KAColors.z3} label="Z3"/>
          <KAZoneLegend color={KAColors.z4} label="Z4"/>
          <KAZoneLegend color={KAColors.z5} label="Z5"/>
        </div>
      </KACard>

      <KACard accent={KAColors.cardio} style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: KAColors.cardio, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>This week</div>
        <p style={{ color: KAP.fg, fontSize: 15, lineHeight: 1.45, margin: 0, fontWeight: 700 }}>
          82% easy / 18% hard. <span style={{ color: KAColors.cardio }}>That's the sweet spot.</span>
        </p>
        <p style={{ color: KAP.fgMuted, fontSize: 13, lineHeight: 1.5, margin: '8px 0 0' }}>
          Endurance athletes do ~80% in Zone 1–2 and ~20% in Zone 4–5. One of the most robust longevity-linked training principles.
        </p>
      </KACard>

      {/* Additional longevity metrics — secondary cards */}
      <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>More longevity data</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <KAMicroCard label="Resting HR" value="52" unit="bpm" delta={-3}/>
        <KAMicroCard label="HRV (7d avg)" value="68" unit="ms" delta={+4}/>
        <KAMicroCard label="Fitness age" value="34" unit="yrs" delta={-2}/>
        <KAMicroCard label="Active min / wk" value="218" unit="of 225" delta={null}/>
      </div>
      <div style={{ height: 14 }}/>
    </KaleFitnessShell>
  );
}

function KAZoneBars({ weeks }) {
  const W = 300, H = 140, GAP = 6;
  const barW = (W - GAP * (weeks.length - 1)) / weeks.length;
  const colors = [KAColors.z1, KAColors.z2, KAColors.z3, KAColors.z4, KAColors.z5];
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {weeks.map((wk, i) => {
        const x = i * (barW + GAP);
        const total = wk.reduce((a, b) => a + b, 0);
        let y = 8;
        return (
          <g key={i}>
            {wk.map((v, j) => {
              const h = (v / total) * (H - 24);
              const rect = <rect key={j} x={x} y={y} width={barW} height={h} fill={colors[j]} rx={j === 0 ? 0 : j === wk.length - 1 ? 0 : 0}/>;
              y += h;
              return rect;
            })}
            <text x={x + barW/2} y={H - 4} fill={KAP.fgMuted} fontSize="9" fontWeight="600" textAnchor="middle">W{8 - i}</text>
          </g>
        );
      })}
      {/* 80/20 reference line at y = H * 0.20 from top of bars (above which is hard) */}
      <line x1={0} x2={W} y1={8 + (H - 24) * 0.80} y2={8 + (H - 24) * 0.80}
        stroke={KAP.fg} strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
    </svg>
  );
}

function KAZoneLegend({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: KAP.fgMuted, fontWeight: 600 }}>
      <span style={{ width: 12, height: 8, borderRadius: 2, background: color }}/>
      {label}
    </span>
  );
}

function KAMicroCard({ label, value, unit, delta }) {
  const positive = delta != null && delta > 0;
  const negative = delta != null && delta < 0;
  // For Resting HR + Fitness age, lower is better; for HRV, higher is better.
  // Pick color by sign and label semantic: simplest = green for "improvement" — we'll pass through.
  const good = (label === 'Resting HR' || label === 'Fitness age') ? negative : positive;
  return (
    <div style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: `1px solid ${KAP.hairline}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: KAP.fg, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        <span style={{ fontSize: 11, color: KAP.fgMuted, fontWeight: 600 }}>{unit}</span>
      </div>
      {delta != null && (
        <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: good ? KAColors.cardio : KAColors.strength, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          {delta > 0 ? '+' : ''}{delta} {good ? <IconUp w={10} h={10} sw={3}/> : <IconDown w={10} h={10} sw={3}/>}
        </div>
      )}
    </div>
  );
}

// ============================================================
// FITNESS SHELL — shared chrome (back, header, sub-tabs)
// ============================================================
function KaleFitnessShell({ active, subactive, children }) {
  const subItems = active === 'cardio'
    ? [{ id: 'log', label: 'Activity log' }, { id: 'vo2max', label: 'VO₂max' }, { id: 'intensity', label: 'Intensity' }]
    : [];
  const headerColor = active === 'cardio' ? KAColors.cardio : active === 'strength' ? KAColors.strength : KAColors.knowledge;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KAP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${KAP.hairline}` }}/>
        </div>

        <div style={{ padding: '16px 24px 0' }}>
          <KASubTabs active={active}/>
        </div>

        <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 32,
            color: KAP.fg, letterSpacing: '-0.03em', margin: 0, lineHeight: 1,
          }}>{active.charAt(0).toUpperCase() + active.slice(1)}</h1>
          <span style={{ fontSize: 12, fontWeight: 700, color: headerColor, letterSpacing: '0.08em' }}>LEVEL 6</span>
        </div>

        {subItems.length > 0 && (
          <div style={{ display: 'flex', gap: 4, padding: '14px 24px 0', borderBottom: `1px solid ${KAP.hairline}`, marginBottom: 4 }}>
            {subItems.map(s => {
              const on = s.id === subactive;
              return (
                <button key={s.id} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '10px 4px 12px', marginRight: 16,
                  color: on ? KAP.fg : KAP.fgMuted,
                  fontFamily: 'var(--font-sans)', fontWeight: on ? 700 : 600, fontSize: 13,
                  letterSpacing: '-0.005em',
                  borderBottom: on ? `2px solid ${headerColor}` : '2px solid transparent',
                }}>{s.label}</button>
              );
            })}
          </div>
        )}

        <div style={{ padding: '16px 24px 12px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>

        <KATabBar active="fitness"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// REWARDS · BALANCE + CYCLE TRACKER
// ============================================================
function KaleRewardsBalance() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KAP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${KAP.hairline}` }}/>
        </div>

        <div style={{ padding: '20px 24px 0', flex: 1, overflowY: 'auto' }}>
          <Eyebrow>Rewards</Eyebrow>

          {/* Warm yellow balance card */}
          <div style={{
            marginTop: 14, padding: 24, borderRadius: 18,
            background: `linear-gradient(135deg, ${KAColors.knowledge} 0%, #E8C72A 100%)`,
            color: 'var(--kale-dark)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Kalettes</span>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: 999, background: 'rgba(10,61,53,0.15)',
              }}>EARNED THIS CYCLE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14 }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 88,
                letterSpacing: '-0.055em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums',
              }}>486</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, opacity: 0.7 }}>≈ £4.86</span>
            </div>
            <button style={{
              marginTop: 22, width: '100%', height: 54, borderRadius: 9999,
              background: 'var(--kale-dark)', color: KAColors.knowledge,
              border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>Spend my points at kale.co <IconArrowRight w={16} h={16}/></button>
            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, fontWeight: 600, opacity: 0.7 }}>
              Browse the Longevity Marketplace and check out on our website.
            </div>
          </div>

          {/* Cycle earnings tracker */}
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>This quarterly cycle</span>
              <span style={{ fontSize: 12, color: KAP.fgMuted, fontWeight: 600 }}>9 weeks left</span>
            </div>
            <KACard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>To bank at next assessment</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: KAP.fg, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>486</span>
                    <span style={{ fontSize: 12, color: KAP.fgMuted, fontWeight: 600 }}>pts</span>
                  </div>
                </div>
                <div style={{ width: 64, height: 64 }}>
                  <KARingMini level={3} color={KAP.mint}/>
                  <KARingProgress pct={0.30}/>
                </div>
              </div>
              <div style={{ marginTop: 16, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '30%', background: KAP.mint, borderRadius: 3 }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: KAP.fgMuted }}>Cycle start</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: KAColors.strength }}>Assessment</span>
              </div>
            </KACard>

            <KACard accent={KAColors.strength} style={{ marginTop: 12 }}>
              <p style={{ color: KAP.fg, fontSize: 13, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                Complete your assessment to bank these. Miss it — they reset.
              </p>
            </KACard>

            <KACard style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(0,200,150,0.15)', color: KAP.mint,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14,
                }}>+81</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KAP.fg }}>Reach Level 7 — earn 567 pts.</div>
                  <div style={{ color: KAP.fgMuted, fontSize: 12, marginTop: 2 }}>See how →</div>
                </div>
              </div>
            </KACard>
          </div>

          {/* FAQ accordion */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: KAP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Common questions</span>
              <a href="#" style={{ fontSize: 12, fontWeight: 700, color: KAP.mint, textDecoration: 'none' }}>All FAQs →</a>
            </div>
            <KAFaq items={[
              { q: 'How do I earn Kalettes?',
                a: "Every quarterly assessment you complete pays out a points cycle, calculated from your Longevity Level. Level 6 earns 6% of your annual premium each quarter, paid as points." },
              { q: 'Why must I complete an assessment to bank?',
                a: "Banking only on assessment makes the link between training and reward concrete. Skip one and your accrued points reset — but your fitness doesn't, so the next cycle pays even more." },
              { q: 'When do points expire?',
                a: "Banked points last 24 months from the date they were awarded. We'll nudge you well before any expire." },
              { q: 'Can I gift my points?',
                a: "Not yet — but it's coming. For now, points can only be redeemed at kale.co/rewards by the policyholder." },
            ]}/>
          </div>

          {/* Closing footer link */}
          <div style={{
            marginTop: 22, padding: '16px 0', textAlign: 'center',
            borderTop: `1px solid ${KAP.hairline}`,
          }}>
            <a href="#" style={{ fontSize: 13, fontWeight: 700, color: KAP.mint, textDecoration: 'none' }}>Contact Kale support →</a>
            <div style={{ fontSize: 10, color: KAP.fgFaint, fontWeight: 600, marginTop: 8, letterSpacing: '0.04em' }}>
              Points programme T&amp;Cs apply.
            </div>
          </div>

          <div style={{ height: 14 }}/>
        </div>

        <KATabBar active="rewards"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function KARingProgress({ pct }) {
  const size = 64, sw = 4;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ marginTop: -64 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,200,150,0.15)" strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={KAP.mint} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${pct * c} ${c}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
    </svg>
  );
}

// FAQ accordion — chevron-toggle rows. First open by default.
function KAFaq({ items }) {
  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: `1px solid ${KAP.hairline}`,
      borderRadius: 16, overflow: 'hidden',
    }}>
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={i} style={{ borderBottom: i < items.length - 1 ? `1px solid ${KAP.hairline}` : 'none' }}>
            <button
              onClick={() => setOpenIdx(open ? -1 : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '16px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14,
                color: open ? KAP.fg : KAP.fg, letterSpacing: '-0.005em', flex: 1, lineHeight: 1.3,
              }}>{item.q}</span>
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: open ? KAP.mint : 'rgba(255,255,255,0.06)',
                color: open ? 'var(--kale-dark)' : KAP.fgMuted,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms ease', flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M1.5 1.5h8M1.5 5.5h8"/>
                  {!open && <path d="M5.5 1.5v8"/>}
                </svg>
              </span>
            </button>
            {open && (
              <div style={{ padding: '0 16px 16px', color: KAP.fgMuted, fontSize: 13, lineHeight: 1.55 }}>
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// REWARDS · MARKETPLACE PREVIEW
// ============================================================
function KaleRewardsMarketplace() {
  const cats = ['All', 'Gear', 'Partner offers', 'Health assessments', 'Coaching'];
  const [cat, setCat] = React.useState('All');
  const items = [
    { title: 'Running tights', brand: 'Tracksmith', pts: 400, topup: 8,  cat: 'Gear',                tag: 'GEAR',       image: 'gear' },
    { title: '25% off Garmin', brand: 'Garmin',     pts: 100, topup: null, cat: 'Partner offers',   tag: 'OFFER',      image: 'offer', discount: '25%' },
    { title: 'Full blood panel', brand: 'Forth',    pts: 800, topup: 30, cat: 'Health assessments', tag: 'ASSESSMENT', image: 'assess' },
    { title: 'Training plan',   brand: 'Coach Anna', pts: 400, topup: 15, cat: 'Coaching',          tag: 'COACHING',   image: 'coach' },
    { title: 'Training tee',    brand: 'Tracksmith', pts: 250, topup: null, cat: 'Gear',            tag: 'GEAR',       image: 'gear' },
    { title: 'VO₂max lab test', brand: 'PH Centre',  pts: 600, topup: 45, cat: 'Health assessments', tag: 'ASSESSMENT', image: 'assess' },
  ];
  const filtered = cat === 'All' ? items : items.filter(it => it.cat === cat);

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KAP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${KAP.hairline}` }}/>
        </div>

        <div style={{ padding: '18px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Eyebrow>Longevity Marketplace</Eyebrow>
          <span style={{ fontSize: 12, color: KAP.fgMuted, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>486 pts</span>
        </div>

        <p style={{ padding: '8px 24px 0', color: KAP.fgMuted, fontSize: 13, lineHeight: 1.5, margin: 0, maxWidth: 320 }}>
          A taste of what you can spend on. Browse and buy at kale.co/rewards.
        </p>

        {/* Category pills — horizontal scroll */}
        <div style={{
          display: 'flex', gap: 8, padding: '16px 24px 8px',
          overflowX: 'auto', flexShrink: 0,
        }}>
          {cats.map(c => {
            const on = c === cat;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '8px 14px', borderRadius: 999,
                background: on ? KAP.fg : 'transparent',
                color: on ? 'var(--kale-dark)' : KAP.fgMuted,
                border: `1px solid ${on ? KAP.fg : KAP.hairline}`,
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{c}</button>
            );
          })}
        </div>

        <div style={{ padding: '8px 24px 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {filtered.map((it, i) => <KAProductCard key={i} item={it}/>)}
          </div>
          <button style={{
            marginTop: 14, width: '100%', background: 'transparent', border: `1px solid ${KAP.hairline}`,
            borderRadius: 12, padding: '14px 16px', color: KAP.fg,
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>See everything at kale.co <IconArrowRight w={14} h={14}/></button>
        </div>

        <KATabBar active="rewards"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function KAProductCard({ item }) {
  const tagColors = {
    GEAR:       { bg: 'rgba(0,200,150,0.15)',  fg: KAColors.cardio },
    OFFER:      { bg: 'rgba(232,130,110,0.15)', fg: KAColors.strength },
    ASSESSMENT: { bg: 'rgba(245,233,78,0.15)',  fg: KAColors.knowledge },
    COACHING:   { bg: 'rgba(255,255,255,0.06)', fg: KAP.fg },
  };
  const tag = tagColors[item.tag];

  // Image placeholder by category
  const ImgPlaceholder = () => {
    if (item.image === 'offer') {
      return (
        <div style={{
          width: '100%', height: '100%', position: 'relative',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30,
            color: KAColors.strength, letterSpacing: '-0.04em',
          }}>{item.discount}</div>
        </div>
      );
    }
    if (item.image === 'gear') {
      return <div style={{ width: '100%', height: '100%', background: `url('assets/runner.jpg') center/cover no-repeat` }}/>;
    }
    if (item.image === 'assess') {
      return <div style={{ width: '100%', height: '100%', background: `linear-gradient(180deg, ${KAColors.knowledge}22 0%, ${KAP.bg} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20 L14 14 L20 22 L26 12 L32 24" stroke={KAColors.knowledge} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>;
    }
    return <div style={{ width: '100%', height: '100%', background: `linear-gradient(180deg, ${KAP.bgRaised} 0%, ${KAP.bg} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, color: KAP.fgMuted, letterSpacing: '-0.05em' }}>{item.brand[0]}</span>
    </div>;
  };

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: `1px solid ${KAP.hairline}`, background: 'rgba(255,255,255,0.03)',
    }}>
      <div style={{ aspectRatio: '1', position: 'relative' }}>
        <ImgPlaceholder/>
        <span style={{
          position: 'absolute', top: 8, left: 8,
          padding: '3px 8px', borderRadius: 999,
          background: tag.bg, color: tag.fg,
          fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 9, letterSpacing: '0.12em',
        }}>{item.tag}</span>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 10, color: KAP.fgMuted, fontWeight: 600, letterSpacing: '0.02em' }}>{item.brand}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: KAP.fg, marginTop: 2, lineHeight: 1.25, minHeight: 32 }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16, color: KAP.mint, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{item.pts}</span>
          <span style={{ fontSize: 11, color: KAP.fgMuted, fontWeight: 600 }}>pts</span>
        </div>
        {item.topup != null && (
          <div style={{ marginTop: 4, fontSize: 10, color: KAP.fgMuted, fontWeight: 600 }}>+ £{item.topup} top-up</div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Export
// ============================================================
Object.assign(window, {
  KaleHomeV2, KaleHomeAssessmentLive, KaleFitnessCardio, KaleFitnessVO2, KaleFitnessIntensity,
  KaleRewardsBalance, KaleRewardsMarketplace,
  // helpers reused by the Lumen reskin
  KATabBar, KASubTabs, KACard, KAHealthYearsChart, KALevelStepChart, KAQuickStat, KARingMini,
  KALegendDot, KAFaq, KAProductCard, KAActivityIcon, KAStars, KAMini, KAMicroCard,
  KAZoneBars, KAZoneLegend, KAAssessmentLiveCard, KARingProgress, KaleFitnessShell, KAColors,
});
