/* eslint-disable */
// Kale Main App — pass 3.
// Strength + Knowledge sub-pages, Settings tab, Second assessment flow.
// Reuses ForestPalette + KAColors via window scope (KaleApp.jsx must load first).

const KP3 = ForestPalette;
const KC3 = {
  cardio:    '#00C896',
  strength:  '#E8826E',
  knowledge: '#F5E94E',
};

// Local card primitive (mirrors KACard but self-contained)
function K3Card({ children, accent, padding = 20, style }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${KP3.hairline}`,
      borderRadius: 16, padding,
      ...(accent ? { borderLeftWidth: 0, boxShadow: `inset 4px 0 0 0 ${accent}` } : {}),
      ...style,
    }}>{children}</div>
  );
}

function K3Mini({ label, value, unit, highlight }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16,
        color: highlight ? KP3.mint : KP3.fg, letterSpacing: '-0.015em',
        marginTop: 4, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
      }}>{value}<span style={{ color: KP3.fgMuted, fontSize: 10, fontWeight: 600, marginLeft: 3 }}>{unit}</span></div>
    </div>
  );
}

// ============================================================
// 18. FITNESS · STRENGTH · OVERVIEW
// ============================================================
function KaleFitnessStrength() {
  // Strength assessment evolves: plank from cycle 1, wall sit from cycle 3,
  // press-ups cycle 6, pull-ups cycle 9. Customer is currently on cycle 3,
  // so wall sit is the latest test.
  const tests = [
    { id: 'wallsit', name: 'Wall sit', cur: '1:48', curSec: 108, prev: '1:22', prevSec: 82, prevLabel: 'cycle 2', rp: 78, status: 'current', whenCycle: 3, units: 'min:sec' },
    { id: 'plank',   name: 'Plank',    cur: '1:43', curSec: 103, prev: '1:32', prevSec: 92, prevLabel: 'cycle 2', rp: 71, status: 'tracked', whenCycle: 3, units: 'min:sec' },
  ];
  const upcoming = [
    { id: 'pressup', name: 'Press-ups', whenIn: '3 cycles away', detail: 'Max reps in 60 sec · unlocks cycle 6' },
    { id: 'pullup',  name: 'Pull-ups',  whenIn: '6 cycles away', detail: 'Max reps · unlocks cycle 9' },
  ];

  return (
    <KaleFitnessShell active="strength" subactive={null}>
      {/* Hero: Strength level + RP */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 20 }}>
        <K3StrengthRing level={6}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: KC3.strength, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Strength Level</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, color: KP3.fg, letterSpacing: '-0.04em', lineHeight: 0.95 }}>6</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: KP3.mint, fontSize: 11, fontWeight: 800 }}>
              <IconUp w={10} h={10} sw={3}/> +1
            </span>
          </div>
          <div style={{ fontSize: 12, color: KP3.fgMuted, marginTop: 6, fontWeight: 600 }}>
            Top <strong style={{ color: KP3.fg, fontWeight: 800 }}>22%</strong> of women aged 35–40.
          </div>
        </div>
      </div>

      {/* Strength level over time */}
      <K3Card padding={20} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Strength level over time</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: KC3.strength, letterSpacing: '0.08em' }}>4 · 5 · 5 · 6</span>
        </div>
        <K3LevelOverTime levels={[4, 5, 5, 6]} labels={['Onb', 'C2', 'C3', 'Now']} color={KC3.strength}/>
      </K3Card>

      {/* Current test card */}
      <K3Card accent={KC3.strength} padding={22} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: KC3.strength, letterSpacing: '0.12em', textTransform: 'uppercase' }}>This cycle's test</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 22, color: KP3.fg, letterSpacing: '-0.02em', marginTop: 6 }}>Wall sit · cycle 3</div>
          </div>
          <span style={{
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(232,130,110,0.18)', color: KC3.strength,
            fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>NEW</span>
        </div>

        {/* This vs last */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Today</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, color: KP3.fg, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>1:48</span>
              <span style={{ fontSize: 11, color: KP3.fgMuted, fontWeight: 600 }}>min</span>
            </div>
          </div>
          <div style={{ width: 1, background: KP3.hairline, alignSelf: 'stretch', margin: '0 16px' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Cycle 2</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: KP3.fgMuted, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>1:22</span>
              <span style={{ fontSize: 11, color: KP3.fgMuted, fontWeight: 600 }}>min</span>
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Diff</div>
            <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: KP3.mint, fontSize: 13, fontWeight: 800 }}>
              <IconUp w={11} h={11} sw={3}/> 26 sec
            </div>
          </div>
        </div>

        {/* RP gauge */}
        <K3RPGauge value={78} gender="women" age="35–40" pillar="strength"/>
      </K3Card>

      {/* Test history */}
      <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, marginTop: 6 }}>
        All strength tests
      </div>
      <K3Card padding={0} style={{ marginBottom: 14 }}>
        {tests.map((t, i) => (
          <div key={t.id} style={{
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
            borderBottom: i < tests.length - 1 ? `1px solid ${KP3.hairline}` : 'none',
          }}>
            <K3TestIcon kind={t.id} color={KC3.strength}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: KP3.fg, letterSpacing: '-0.005em' }}>{t.name}</span>
                {t.status === 'current' && (
                  <span style={{ padding: '2px 7px', borderRadius: 999, background: 'rgba(232,130,110,0.18)', color: KC3.strength, fontSize: 9, fontWeight: 800, letterSpacing: '0.1em' }}>NEW</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: KP3.fgMuted, fontWeight: 600, marginTop: 2 }}>
                Cycle {t.whenCycle} · was <span style={{ color: KP3.fgMuted, fontVariantNumeric: 'tabular-nums' }}>{t.prev}</span> at {t.prevLabel}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16, color: KP3.fg, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{t.cur}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.04em', marginTop: 2 }}>
                <span style={{ color: KC3.strength }}>RP {t.rp}%</span>
              </div>
            </div>
          </div>
        ))}
      </K3Card>

      {/* Upcoming tests timeline */}
      <K3Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: KC3.strength, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Coming up</div>
        {upcoming.map((u, i) => (
          <div key={u.id} style={{ display: 'flex', gap: 14, padding: '10px 0', borderTop: i > 0 ? `1px solid ${KP3.hairline}` : 'none', opacity: 0.7 }}>
            <K3TestIcon kind={u.id} color={KC3.strength} locked/>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KP3.fg }}>{u.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.04em' }}>{u.whenIn}</span>
              </div>
              <div style={{ fontSize: 11, color: KP3.fgMuted, marginTop: 2 }}>{u.detail}</div>
            </div>
          </div>
        ))}
      </K3Card>

      {/* FAQ */}
      <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, marginTop: 6 }}>
        Common questions
      </div>
      <KAFaq items={[
        { q: 'What is Relative Performance (RP)?',
          a: "RP is a percentile score graded for your age and gender. RP 78% means you're outperforming 78% of women aged 35–40 on this test. We use NHANES data and modern strength norms as our baseline." },
        { q: 'Why does the strength test change each cycle?',
          a: "Strength has many dimensions. Plank is a perfect starting point, but as you progress we add wall sit (lower-body endurance), press-ups (upper-body power) and pull-ups (compound strength) to give a fuller picture." },
        { q: 'Do older tests still count toward my level?',
          a: "Yes. We keep updating your plank score every cycle. Your Strength Level blends all your tests so far, weighted by recency." },
        { q: 'What if I can\u2019t do a test?',
          a: "Tell us in Settings → Strength assessment. We'll substitute an alternative and recalibrate your score." },
      ]}/>

      <div style={{ height: 14 }}/>
    </KaleFitnessShell>
  );
}

function K3StrengthRing({ level }) {
  const size = 96, sw = 6;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={KC3.strength} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${(level/10) * c} ${c}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 42,
        color: KP3.fg, letterSpacing: '-0.05em', lineHeight: 1,
      }}>{level}</div>
    </div>
  );
}

// Relative Performance gauge — horizontal percentile bar
function K3RPGauge({ value, gender, age, pillar }) {
  const color = pillar === 'strength' ? KC3.strength : pillar === 'cardio' ? KC3.cardio : KC3.knowledge;
  return (
    <div style={{ padding: '12px 0 0', borderTop: `1px solid ${KP3.hairline}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Relative performance
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16, color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
          RP {value}%
        </span>
      </div>
      <div style={{ position: 'relative', height: 18, marginBottom: 8 }}>
        <div style={{
          position: 'absolute', top: 7, left: 0, right: 0, height: 4, borderRadius: 999,
          background: `linear-gradient(90deg, rgba(255,255,255,0.10) 0%, ${color}50 50%, ${color} 100%)`,
        }}/>
        {/* tick marks at 25/50/75 */}
        {[25, 50, 75].map(p => (
          <div key={p} style={{
            position: 'absolute', left: `${p}%`, top: 4, width: 1, height: 10,
            background: 'rgba(255,255,255,0.12)', transform: 'translateX(-50%)',
          }}/>
        ))}
        <div style={{
          position: 'absolute', left: `${value}%`, top: 0,
          width: 18, height: 18, borderRadius: '50%',
          background: KP3.fg, border: `2.5px solid ${color}`,
          transform: 'translateX(-50%)', boxShadow: `0 0 18px ${color}80`,
        }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: KP3.fgFaint, fontWeight: 700, letterSpacing: '0.04em' }}>WEAKER</span>
        <span style={{ fontSize: 10, color: KP3.fgFaint, fontWeight: 700, letterSpacing: '0.04em' }}>AVERAGE</span>
        <span style={{ fontSize: 10, color: KP3.fgFaint, fontWeight: 700, letterSpacing: '0.04em' }}>ELITE</span>
      </div>
      <div style={{ fontSize: 12, color: KP3.fgMuted, fontWeight: 600, lineHeight: 1.45 }}>
        Graded for <strong style={{ color: KP3.fg, fontWeight: 700 }}>{gender} aged {age}</strong>.
      </div>
    </div>
  );
}

// Small filled icon used for each test
function K3TestIcon({ kind, color, locked }) {
  const bg = locked ? 'rgba(255,255,255,0.04)' : `${color}22`;
  const fg = locked ? KP3.fgMuted : color;
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: bg,
      border: `1px solid ${locked ? KP3.hairline : color + '55'}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, color: fg,
    }}>
      {kind === 'plank' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="2.2"/>
          <path d="M3 17h16M8 17l-1-9 4 1 4-2 4 2v3"/>
        </svg>
      )}
      {kind === 'wallsit' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4v16"/>
          <path d="M4 14h7l4-4v-3a2 2 0 1 1 4 0 8 8 0 0 1-1 4l-2 3"/>
          <path d="M11 14v6"/>
        </svg>
      )}
      {kind === 'pressup' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="17" cy="6" r="2.2"/>
          <path d="M3 17h17M9 14l-2-4 4-1 3 3 4 1"/>
        </svg>
      )}
      {kind === 'pullup' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4h18"/>
          <path d="M9 4v4M15 4v4"/>
          <circle cx="12" cy="11" r="2"/>
          <path d="M12 13v5M9 16l3 2 3-2"/>
        </svg>
      )}
    </div>
  );
}

function K3PlankRing({ seconds }) {
  const max = 180;
  const size = 96, sw = 6;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={KC3.strength} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${Math.min(seconds, max)/max * c} ${c}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: KP3.fg, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>5</div>
        <div style={{ fontSize: 9, color: KP3.fgMuted, fontWeight: 700, letterSpacing: '0.16em', marginTop: 3 }}>LEVEL</div>
      </div>
    </div>
  );
}

function K3PlankChart({ planks, labels }) {
  const W = 300, H = 140, padT = 18, padB = 22, padL = 22, padR = 8;
  const maxV = 180;
  const xAt = (i) => padL + (i / (planks.length - 1)) * (W - padL - padR);
  const yAt = (v) => (H - padB) - (v / maxV) * (H - padT - padB);
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* benchmarks as faint horizontal lines */}
      {[30, 60, 90, 120].map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={yAt(v)} y2={yAt(v)} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4"/>
          <text x={4} y={yAt(v) + 3} fill={KP3.fgMuted} fontSize="9" fontWeight="600">{v/60}m</text>
        </g>
      ))}
      {/* bars */}
      {planks.map((v, i) => {
        const x = xAt(i);
        const y = yAt(v);
        const h = (H - padB) - y;
        const isLast = i === planks.length - 1;
        return (
          <g key={i}>
            <rect x={x - 18} y={y} width={36} height={h} rx={6}
              fill={isLast ? KC3.strength : 'rgba(232,130,110,0.55)'}/>
            <text x={x} y={y - 6}
              fill={isLast ? KP3.fg : KP3.fgMuted}
              fontSize="11" fontWeight="800" textAnchor="middle">
              {Math.floor(v/60)}:{String(v%60).padStart(2, '0')}
            </text>
            <text x={x} y={H - 6}
              fill={isLast ? KP3.fg : KP3.fgMuted}
              fontSize="9" fontWeight="700" textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// 19. FITNESS · KNOWLEDGE · OVERVIEW
// ============================================================
function KaleFitnessKnowledge() {
  const topics = [
    { label: 'General longevity', sc: 5, mx: 5 },
    { label: 'Exercise science',  sc: 4, mx: 5 },
    { label: 'Nutrition',         sc: 3, mx: 5 },
    { label: 'Sleep & recovery',  sc: 2, mx: 3 },
    { label: 'Mental health',     sc: 1, mx: 2 },
  ];
  const history = [12, 14, 15, 16]; // quiz scores out of 20 over 4 cycles
  return (
    <KaleFitnessShell active="knowledge" subactive={null}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18 }}>
        <K3KnowledgeRing score={16} max={20}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: KC3.knowledge, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Latest quiz</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 42, color: KP3.fg, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>16</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: KP3.fgMuted }}>/ 20</span>
            <span style={{ marginLeft: 8, fontSize: 13, color: KC3.knowledge, fontWeight: 800 }}>80%</span>
          </div>
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: KP3.mint, fontSize: 12, fontWeight: 700 }}>
            <IconUp w={11} h={11} sw={3}/> 1 question vs. cycle 3
          </div>
        </div>
      </div>

      {/* Score history */}
      <K3Card padding={20} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Score history</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: KC3.knowledge, letterSpacing: '0.08em' }}>4 CYCLES</span>
        </div>
        <K3KnowledgeChart scores={history}/>
      </K3Card>

      {/* By topic */}
      <K3Card padding={20}>
        <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>By topic</div>
        {topics.map((t, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: i < topics.length - 1 ? `1px solid ${KP3.hairline}` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: KP3.fg, fontWeight: 600 }}>{t.label}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 13, color: KP3.fg, fontVariantNumeric: 'tabular-nums' }}>
                {t.sc}<span style={{ color: KP3.fgMuted, fontWeight: 600 }}> / {t.mx}</span>
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(t.sc/t.mx)*100}%`, background: KC3.knowledge, borderRadius: 2 }}/>
            </div>
          </div>
        ))}
      </K3Card>

      <K3Card accent={KC3.knowledge} style={{ marginTop: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: KC3.knowledge, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Up next</div>
        <p style={{ color: KP3.fg, fontSize: 14, lineHeight: 1.5, margin: 0 }}>
          We'll focus your next quiz on <strong style={{ color: KC3.knowledge, fontWeight: 800 }}>nutrition</strong> — your weakest topic.
        </p>
      </K3Card>

      {/* FAQ */}
      <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, marginTop: 6 }}>
        Common questions
      </div>
      <KAFaq items={[
        { q: 'How is the Knowledge Level calculated?',
          a: "Your level (1\u201310) is calculated from your latest quiz score, weighted by topic difficulty. The 20-question quiz refreshes each cycle so the level reflects current knowledge, not your best ever." },
        { q: 'Why focus on a different topic next time?',
          a: "We weight your next quiz toward your weakest area. Improving where you're weakest moves your Knowledge Level fastest \u2014 and gives the biggest healthspan return." },
        { q: 'Where do the questions come from?',
          a: "Every question is written or vetted by our science team and reviewed against peer-reviewed sources. No marketing claims, no folklore." },
        { q: 'What happens to my level if I skip a quiz?',
          a: "Knowledge Level pauses at its last value until you take the next quiz. Your overall Longevity Level still ticks, but Knowledge stops contributing until you re-engage." },
      ]}/>
      <div style={{ height: 14 }}/>
    </KaleFitnessShell>
  );
}

function K3KnowledgeRing({ score, max }) {
  const size = 96, sw = 6;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={KC3.knowledge} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${(score/max) * c} ${c}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: KP3.fg, letterSpacing: '-0.04em', lineHeight: 1 }}>7</div>
        <div style={{ fontSize: 9, color: KP3.fgMuted, fontWeight: 700, letterSpacing: '0.16em', marginTop: 3 }}>LEVEL</div>
      </div>
    </div>
  );
}

function K3KnowledgeChart({ scores }) {
  // scores is raw quiz score out of 20. We plot the corresponding Level
  // (1–10) on the Y axis — derived as round(score / 20 * 10), clamped 1–10.
  const toLevel = (s) => Math.max(1, Math.min(10, Math.round((s / 20) * 10)));
  const levels = scores.map(toLevel);
  const W = 300, H = 140, padT = 14, padB = 22, padL = 30, padR = 8;
  const xAt = (i) => padL + (i / (levels.length - 1)) * (W - padL - padR);
  const yAt = (v) => (H - padB) - ((v - 1) / 9) * (H - padT - padB);
  const linePath = levels.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(v)}`).join(' ');
  const areaPath = linePath + ` L ${xAt(levels.length - 1)} ${H - padB} L ${xAt(0)} ${H - padB} Z`;
  const labels = ['Onb', 'C2', 'C3', 'Now'];
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      {[2, 4, 6, 8, 10].map(v => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={yAt(v)} y2={yAt(v)} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4"/>
          <text x={4} y={yAt(v) + 3} fill={KP3.fgMuted} fontSize="9" fontWeight="700">L{v}</text>
        </g>
      ))}
      <path d={areaPath} fill={KC3.knowledge} opacity="0.10"/>
      <path d={linePath} stroke={KC3.knowledge} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {levels.map((v, i) => {
        const isLast = i === levels.length - 1;
        const raw = scores[i];
        return (
          <g key={i}>
            <circle cx={xAt(i)} cy={yAt(v)} r={isLast ? 5 : 3.5} fill={KC3.knowledge}/>
            <text x={xAt(i)} y={yAt(v) - 10}
              fill={isLast ? KP3.fg : KP3.fgMuted}
              fontSize="10" fontWeight="800" textAnchor="middle">L{v}</text>
            <text x={xAt(i)} y={H - 6}
              fill={isLast ? KP3.fg : KP3.fgMuted}
              fontSize="9" fontWeight="700" textAnchor="middle">{labels[i]} · {raw}/20</text>
          </g>
        );
      })}
    </svg>
  );
}

// Generic level-over-time chart used by Strength + (re-usable) other pillars.
function K3LevelOverTime({ levels, labels, color }) {
  const W = 300, H = 140, padT = 14, padB = 22, padL = 30, padR = 8;
  const xAt = (i) => padL + (i / (levels.length - 1)) * (W - padL - padR);
  const yAt = (v) => (H - padB) - ((v - 1) / 9) * (H - padT - padB);
  const linePath = levels.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(v)}`).join(' ');
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      {[2, 4, 6, 8, 10].map(v => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={yAt(v)} y2={yAt(v)} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4"/>
          <text x={4} y={yAt(v) + 3} fill={KP3.fgMuted} fontSize="9" fontWeight="700">L{v}</text>
        </g>
      ))}
      <path d={linePath} stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {levels.map((v, i) => {
        const isLast = i === levels.length - 1;
        return (
          <g key={i}>
            <circle cx={xAt(i)} cy={yAt(v)} r={isLast ? 5 : 3.5} fill={color}/>
            <text x={xAt(i)} y={yAt(v) - 10}
              fill={isLast ? KP3.fg : KP3.fgMuted}
              fontSize="10" fontWeight="800" textAnchor="middle">L{v}</text>
            <text x={xAt(i)} y={H - 6}
              fill={isLast ? KP3.fg : KP3.fgMuted}
              fontSize="9" fontWeight="700" textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// 20. SETTINGS
// ============================================================
function KaleSettings() {
  const policy = {
    cover: '£250k',
    type: 'Level term',
    term: '25 years',
    monthly: '£27.00',
    renewal: '8 Aug 2027',
  };
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP3.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <button style={{ background: 'transparent', border: 'none', color: KP3.fg, cursor: 'pointer', padding: 6 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 17h.01"/></svg>
          </button>
        </div>

        <div style={{ padding: '20px 24px 0', flex: 1, overflowY: 'auto' }}>
          <Eyebrow>Settings</Eyebrow>

          {/* Profile card */}
          <K3Card padding={20} style={{ marginTop: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${KP3.hairline}`, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18, color: KP3.fg, letterSpacing: '-0.015em' }}>Alex Pendragon</div>
                <div style={{ fontSize: 12, color: KP3.fgMuted, marginTop: 2 }}>alex@pendragon.io · Member since Nov 2025</div>
              </div>
              <IconArrowRight w={16} h={16} stroke={KP3.fgMuted}/>
            </div>
          </K3Card>

          {/* Policy summary card */}
          <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Your policy</div>
          <K3Card padding={0} style={{ marginBottom: 16 }}>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 22, color: KP3.fg, letterSpacing: '-0.02em' }}>{policy.cover}</div>
                  <div style={{ fontSize: 12, color: KP3.fgMuted, marginTop: 2 }}>{policy.type} · {policy.term}</div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: 'rgba(0,200,150,0.15)', color: KP3.mint,
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>Active</span>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${KP3.hairline}` }}>
              <K3SettingsRow label="Monthly premium" value={policy.monthly} chevron last/>
            </div>
          </K3Card>

          {/* Connections */}
          <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Connections</div>
          <K3Card padding={0} style={{ marginBottom: 16 }}>
            <K3SettingsRow icon="strava" label="Strava" value="Connected" valueColor={KP3.mint} chevron/>
            <K3SettingsRow icon="garmin" label="Garmin" value="Connected" valueColor={KP3.mint} chevron/>
            <K3SettingsRow icon="apple"  label="Apple Health" value="Add" valueColor={KC3.cardio} chevron last/>
          </K3Card>

          {/* Notifications + preferences */}
          <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Preferences</div>
          <K3Card padding={0} style={{ marginBottom: 16 }}>
            <K3SettingsToggle label="Assessment reminders" sub="3, 1 week and 1 day before" defaultOn={true}/>
            <K3SettingsToggle label="Cycle updates" sub="Weekly progress emails" defaultOn={true}/>
            <K3SettingsToggle label="Marketing" sub="Occasional offers from Kale" defaultOn={false} last/>
          </K3Card>

          {/* Misc rows */}
          <K3Card padding={0} style={{ marginBottom: 16 }}>
            <K3SettingsRow label="Privacy & data" chevron/>
            <K3SettingsRow label="Help & support" chevron/>
            <K3SettingsRow label="Terms & policies" chevron/>
            <K3SettingsRow label="Log out" valueColor={KC3.strength} chevron={false} last/>
          </K3Card>

          <div style={{ textAlign: 'center', color: KP3.fgMuted, fontSize: 11, padding: '6px 0 14px' }}>
            Kale Insurance · v2.4.1
          </div>
        </div>

        <KATabBar active="settings"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function K3SettingsRow({ icon, label, value, valueColor, chevron = true, last = false }) {
  const ConnIcon = () => {
    if (!icon) return null;
    if (icon === 'strava') return <div style={{ width: 28, height: 28, borderRadius: 8, background: '#FC4C02', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 13 }}>S</div>;
    if (icon === 'garmin') return <div style={{ width: 28, height: 28, borderRadius: 8, background: '#007CC3', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 13 }}>G</div>;
    if (icon === 'apple')  return <div style={{ width: 28, height: 28, borderRadius: 8, background: '#A2AAAD', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16 }}></div>;
    return null;
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 18px',
      borderBottom: last ? 'none' : `1px solid ${KP3.hairline}`,
      cursor: 'pointer',
    }}>
      {icon && <ConnIcon/>}
      <div style={{ flex: 1, fontSize: 14, color: KP3.fg, fontWeight: 600 }}>{label}</div>
      {value && <span style={{ fontSize: 13, color: valueColor || KP3.fgMuted, fontWeight: 600 }}>{value}</span>}
      {chevron && <IconArrowRight w={14} h={14} stroke={KP3.fgMuted}/>}
    </div>
  );
}

function K3SettingsToggle({ label, sub, defaultOn, last }) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 18px',
      borderBottom: last ? 'none' : `1px solid ${KP3.hairline}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: KP3.fg, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: KP3.fgMuted, marginTop: 2 }}>{sub}</div>}
      </div>
      <button onClick={() => setOn(!on)} style={{
        width: 44, height: 26, borderRadius: 999,
        background: on ? KP3.mint : 'rgba(255,255,255,0.10)',
        border: 'none', position: 'relative', cursor: 'pointer',
        transition: 'background 200ms ease',
      }}>
        <span style={{
          position: 'absolute', top: 3, left: on ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: on ? 'var(--kale-dark)' : '#fff',
          transition: 'left 200ms ease',
        }}/>
      </button>
    </div>
  );
}

// ============================================================
// SECOND ASSESSMENT FLOW
// ============================================================

// 21. Reminder push / opening screen
function KaleAssessReminder() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP3.bg }}/>
      <img src="assets/kale-watermark.svg" alt="" aria-hidden="true" style={{
        position: 'absolute', right: -90, top: 200,
        width: 380, height: 'auto', opacity: 0.08, pointerEvents: 'none', transform: 'rotate(-8deg)',
      }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <button style={{ background: 'transparent', border: 'none', color: KP3.fgMuted, fontSize: 22, fontWeight: 300, cursor: 'pointer', padding: 6 }}>✕</button>
        </div>

        <div style={{ padding: '20px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(232,130,110,0.15)', color: KC3.strength,
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em',
            width: 'fit-content', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: KC3.strength }}/>
            Assessment due
          </span>

          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 52, lineHeight: 0.98,
            letterSpacing: '-0.035em', color: KP3.fg,
            margin: '24px 0 14px',
          }}>
            Cycle 5 <em style={{ color: KP3.mint, fontStyle: 'italic' }}>assessment</em>.
          </h1>
          <p style={{ color: KP3.fgMuted, fontSize: 16, lineHeight: 1.45, margin: 0, maxWidth: 340 }}>
            12 weeks since your last one. We're ready to look at your fitness and update your Longevity Level.
          </p>

          <K3Card padding={20} style={{ marginTop: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>You're in line for</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, color: KP3.fg, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>567</span>
              <span style={{ fontSize: 14, color: KP3.fgMuted, fontWeight: 600 }}>Kalettes</span>
            </div>
            <p style={{ color: KP3.fgMuted, fontSize: 13, lineHeight: 1.5, margin: '10px 0 0' }}>
              You may also <strong style={{ color: KP3.fg, fontWeight: 700 }}>level up</strong> to Level 7 — worth around £8.50/yr off your premium.
            </p>
          </K3Card>

          <K3Card accent={KC3.strength} style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={KC3.strength} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              <p style={{ color: KP3.fg, fontSize: 13, lineHeight: 1.5, margin: 0, fontWeight: 600, flex: 1 }}>
                Skip this and you lose your 486 banked points.
              </p>
            </div>
          </K3Card>

          <div style={{ marginTop: 'auto', paddingBottom: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999,
              background: KP3.mint, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Start assessment <IconArrowRight w={18} h={18}/></button>
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: KP3.fgMuted, fontSize: 13, fontWeight: 600,
              textDecoration: 'underline', textUnderlineOffset: 4, padding: 4,
            }}>Remind me later</button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// 22. Cardio review v2 — with vs last cycle
function KaleCardioReviewV2() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP3.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: KP3.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={18}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.1em' }}>2 / 4</span>
        </div>

        <div style={{ padding: '20px 24px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: KC3.cardio, boxShadow: `0 0 12px ${KC3.cardio}` }}/>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: KC3.cardio, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Cardio</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, lineHeight: 1.02,
            letterSpacing: '-0.03em', color: KP3.fg, margin: '0 0 18px',
          }}>
            12 weeks of <em style={{ color: KC3.cardio, fontStyle: 'italic' }}>work</em>.
          </h1>

          {/* Then vs now comparison */}
          <K3Card padding={20} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <K3CompareColumn label="Last cycle" lvl="5" sub="Cardio Level" muted/>
              <div style={{ width: 1, background: KP3.hairline, alignSelf: 'stretch' }}/>
              <K3CompareColumn label="Now" lvl="6" sub="Cardio Level" accent={KC3.cardio} arrow/>
            </div>
            <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 10, background: 'rgba(0,200,150,0.10)', border: `1px solid rgba(0,200,150,0.25)` }}>
              <p style={{ color: KP3.fg, fontSize: 13, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                Your best <span style={{ color: KC3.cardio, fontWeight: 800 }}>VO₂max estimate</span> climbed from 51.4 to <span style={{ color: KC3.cardio, fontWeight: 800 }}>54.2</span> ml/kg/min.
              </p>
            </div>
          </K3Card>

          {/* Activity breakdown */}
          <K3Card padding={20} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>What you did</div>
            <K3MetricRow label="Qualifying runs" v1="14" v2="22" diff="+8" />
            <K3MetricRow label="Total distance"  v1="84 km" v2="142 km" diff="+58 km" />
            <K3MetricRow label="Avg pace" v1="5:04" v2="4:51" diff="13 sec faster" />
            <K3MetricRow label="Z2 time / wk"   v1="32%" v2="52%" diff="much better" last/>
          </K3Card>

          {/* Best run highlight */}
          <K3Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Standout run</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: KP3.fg }}>Sunday long run · 18 km</div>
            <div style={{ fontSize: 12, color: KP3.fgMuted, marginTop: 2 }}>11 May 2026 · 4:42/km · HR 148</div>
            <div style={{ height: 60, marginTop: 14, background: 'rgba(0,200,150,0.08)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 300 60" width="100%" height="60" preserveAspectRatio="none">
                <path d="M0 50 Q 40 18, 70 28 T 140 22 T 220 14 T 300 32" stroke={KC3.cardio} strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </K3Card>

          <div style={{ marginTop: 16, marginBottom: 14 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999,
              background: KC3.strength, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Next — Strength <IconArrowRight w={18} h={18}/></button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function K3CompareColumn({ label, lvl, sub, muted, accent, arrow }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: muted ? 36 : 56,
          color: muted ? KP3.fgMuted : (accent || KP3.fg), letterSpacing: '-0.04em', lineHeight: 0.95,
          fontVariantNumeric: 'tabular-nums',
        }}>{lvl}</span>
        {arrow && <span style={{
          marginLeft: -4, padding: '3px 8px', borderRadius: 999,
          background: 'rgba(0,200,150,0.18)', color: KP3.mint,
          fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
        }}>+1</span>}
      </div>
      <div style={{ fontSize: 11, color: KP3.fgMuted, fontWeight: 600, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function K3MetricRow({ label, v1, v2, diff, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: last ? 'none' : `1px solid ${KP3.hairline}`,
    }}>
      <span style={{ fontSize: 13, color: KP3.fgMuted, fontWeight: 600 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, color: KP3.fgMuted, fontVariantNumeric: 'tabular-nums' }}>{v1}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={KP3.fgMuted} strokeWidth="1.5"><path d="M2 5h6M5 2l3 3-3 3"/></svg>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14, color: KP3.fg, fontVariantNumeric: 'tabular-nums' }}>{v2}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: KC3.cardio, letterSpacing: '0.04em', marginLeft: 4 }}>{diff}</span>
      </div>
    </div>
  );
}

// 23. Plank vs last cycle
function KalePlankCompare() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP3.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: KP3.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={18}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.1em' }}>3 / 4</span>
        </div>

        <div style={{ padding: '20px 24px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: KC3.strength, boxShadow: `0 0 12px ${KC3.strength}` }}/>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: KC3.strength, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Strength</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, lineHeight: 1.02,
            letterSpacing: '-0.03em', color: KP3.fg, margin: '0 0 6px',
          }}>
            New <em style={{ color: KC3.strength, fontStyle: 'italic' }}>personal best</em>.
          </h1>
          <p style={{ color: KP3.fgMuted, fontSize: 14, lineHeight: 1.5, margin: '0 0 22px', maxWidth: 320 }}>
            You held the plank longer than ever before. A 25-second jump.
          </p>

          {/* PB visual: two stacked bars */}
          <K3Card padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <K3PlankBar label="Last cycle" time="1:18" pctOfMax={78/180} muted/>
              <K3PlankBar label="Today" time="1:43" pctOfMax={103/180} accent={KC3.strength} badge="+25 sec"/>
            </div>
          </K3Card>

          {/* Spectrum */}
          <K3Card style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>How you compare now</div>
            <div style={{ position: 'relative', height: 14, marginBottom: 10 }}>
              <div style={{ position: 'absolute', top: 4, left: 0, right: 0, height: 6, borderRadius: 999,
                background: `linear-gradient(90deg, rgba(255,255,255,0.12) 0%, ${KC3.strength}55 50%, ${KC3.strength} 100%)` }}/>
              <div style={{ position: 'absolute', top: 0, left: '74%', width: 14, height: 14, borderRadius: '50%',
                background: KP3.fg, border: `2px solid ${KC3.strength}`, transform: 'translateX(-50%)', boxShadow: `0 0 16px ${KC3.strength}` }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: KP3.fgMuted, fontWeight: 600 }}>
              <span>Beginner</span>
              <span>Average</span>
              <span>Excellent</span>
            </div>
            <p style={{ color: KP3.fg, fontSize: 13, lineHeight: 1.5, margin: '14px 0 0', fontWeight: 600 }}>
              You jumped from Good into top-tier territory for your age group.
            </p>
          </K3Card>

          {/* Strength Level result */}
          <K3Card padding={22} style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <K3PlankRing seconds={103}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Strength Level</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 40, color: KP3.fg, letterSpacing: '-0.04em', lineHeight: 1 }}>6</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: KP3.mint, fontSize: 11, fontWeight: 800 }}>
                    <IconUp w={10} h={10} sw={3}/> +1
                  </span>
                </div>
                <p style={{ color: KP3.fgMuted, fontSize: 12, lineHeight: 1.5, margin: '8px 0 0' }}>
                  Up from Strength Level 5 last cycle.
                </p>
              </div>
            </div>
          </K3Card>

          <div style={{ marginTop: 16, marginBottom: 14 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999,
              background: KC3.knowledge, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Next — Knowledge <IconArrowRight w={18} h={18}/></button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function K3PlankBar({ label, time, pctOfMax, muted, accent, badge }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: muted ? KP3.fgMuted : KP3.fg, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16, color: muted ? KP3.fgMuted : KP3.fg, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{time}</span>
          {badge && <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: KP3.mint, fontSize: 10, fontWeight: 800 }}>{badge}</span>}
        </div>
      </div>
      <div style={{ height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pctOfMax * 100}%`,
          background: muted ? 'rgba(232,130,110,0.4)' : (accent || KC3.strength),
          borderRadius: 8,
          ...(accent ? { boxShadow: `0 0 18px ${accent}66` } : {}),
        }}/>
      </div>
    </div>
  );
}

// 24. New Longevity Level reveal (cycle 5 ⇒ Level 7)
function KaleLevelUpFinale() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 7000);
    return () => clearInterval(id);
  }, []);
  return <KaleLevelUpFinaleInner key={tick}/>;
}

function KaleLevelUpFinaleInner() {
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    const ts = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 2000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <>
      <style>{`
        @keyframes klf-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, background: KP3.bg }}/>

      {/* spinning rays behind */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        width: 800, height: 800,
        animation: 'klf-rays 28s linear infinite',
        transformOrigin: 'center',
        opacity: stage >= 2 ? 1 : 0,
        transition: 'opacity 800ms ease',
        pointerEvents: 'none',
      }}>
        <svg viewBox="-400 -400 800 800" width="800" height="800" style={{ overflow: 'visible' }}>
          {Array.from({length: 24}).map((_, i) => {
            const a = (i * Math.PI) / 12;
            const len = i % 2 ? 380 : 320;
            return <line key={i}
              x1={Math.cos(a)*60} y1={Math.sin(a)*60}
              x2={Math.cos(a)*len} y2={Math.sin(a)*len}
              stroke={KP3.mint} strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
              opacity={i % 2 ? 0.18 : 0.42}/>;
          })}
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        width: 540, height: 540, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.35) 0%, rgba(0,200,150,0) 60%)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        opacity: stage >= 2 ? 1 : 0, transition: 'opacity 700ms ease',
      }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 3 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: KP3.fgMuted, letterSpacing: '0.1em' }}>4 / 4</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: KP3.mint, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 14 }}>
            You levelled up
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28, position: 'relative' }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 120, lineHeight: 0.85,
              color: KP3.fgMuted, letterSpacing: '-0.06em', opacity: 0.55,
              transform: stage >= 1 ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 600ms cubic-bezier(.5,.05,.3,1)',
            }}>06</span>
            <span style={{
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? 'translateX(0)' : 'translateX(-12px)',
              transition: 'all 500ms 200ms cubic-bezier(.5,.05,.3,1)',
            }}>
              <IconArrowRight w={32} h={32} stroke={KP3.mint} sw={2.5}/>
            </span>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 220, lineHeight: 0.82,
              color: KP3.fg, letterSpacing: '-0.06em',
              textShadow: stage >= 2 ? '0 0 60px rgba(0,200,150,0.5)' : 'none',
              animation: stage >= 2 ? 'klf-pulse 3s ease-in-out infinite' : 'none',
              opacity: stage >= 2 ? 1 : 0,
              transform: stage >= 2 ? 'scale(1)' : 'scale(0.4)',
              filter: stage >= 2 ? 'blur(0)' : 'blur(8px)',
              transition: 'all 700ms cubic-bezier(.2,.9,.3,1.2)',
            }}>07</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28,
            color: KP3.fg, letterSpacing: '-0.02em', lineHeight: 1.15,
            margin: '36px 0 12px', maxWidth: 320,
            opacity: stage >= 2 ? 1 : 0, transition: 'opacity 600ms 200ms ease',
          }}>
            <em style={{ color: KP3.mint, fontStyle: 'italic' }}>+0.9 years</em> of healthspan banked.
          </h2>
          <p style={{
            color: KP3.fgMuted, fontSize: 15, lineHeight: 1.55, margin: 0, maxWidth: 300,
            opacity: stage >= 2 ? 1 : 0, transition: 'opacity 600ms 360ms ease',
          }}>
            Your premium drops by <strong style={{ color: KP3.fg, fontWeight: 700 }}>£8.50/yr</strong>. And you've banked <strong style={{ color: KP3.fg, fontWeight: 700 }}>567 Kalettes</strong>.
          </p>
        </div>

        <div style={{ padding: '0 24px 14px', display: 'flex', flexDirection: 'column', gap: 12, opacity: stage >= 2 ? 1 : 0, transition: 'opacity 600ms 500ms ease' }}>
          <button style={{
            width: '100%', height: 56, borderRadius: 9999,
            background: KP3.mint, color: 'var(--kale-dark)',
            border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>See what changed <IconArrowRight w={18} h={18}/></button>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: KP3.fgMuted, fontSize: 14, fontWeight: 600, padding: 8,
          }}>Share progress</button>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// Export
// ============================================================
Object.assign(window, {
  KaleFitnessStrength, KaleFitnessKnowledge, KaleSettings,
  KaleAssessReminder, KaleCardioReviewV2, KalePlankCompare, KaleLevelUpFinale,
  // helpers reused by the Lumen reskin
  K3Card, K3Mini, K3LevelOverTime, K3KnowledgeChart, K3RPGauge, K3TestIcon,
  K3PlankBar, K3CompareColumn, K3MetricRow, K3SettingsRow, K3SettingsToggle,
});
