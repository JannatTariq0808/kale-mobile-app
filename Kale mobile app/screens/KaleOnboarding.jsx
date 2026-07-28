/* eslint-disable */
// Kale Onboarding — the 11 assessment screens, per the design brief.
// Post-purchase flow: customer has bought a policy and connected Garmin/Strava
// on the web. The app's job is to complete the three-pillar assessment and
// reveal the official first Longevity Level.

// ============================================================
// Local primitives (reuse Fresh palette + icons from global scope)
// ============================================================

const KP = ForestPalette; // alias
const KOnbColors = {
  cardio: '#00C896',     // mint
  strength: '#E8826E',   // coral
  knowledge: '#F5E94E',  // yellow
  cardioRing: 'rgba(0,200,150,0.18)',
  strengthRing: 'rgba(232,130,110,0.18)',
  knowledgeRing: 'rgba(245,233,78,0.18)',
};

// Assessment progress pill: Cardio · Strength · Knowledge
function KAssessmentPill({ state = 'cardio-active' }) {
  // state: cardio-active / cardio-done / strength-active / strength-done / knowledge-active / knowledge-done / all-done
  const items = [
    { id: 'cardio',    label: 'Cardio',    color: KOnbColors.cardio },
    { id: 'strength',  label: 'Strength',  color: KOnbColors.strength },
    { id: 'knowledge', label: 'Knowledge', color: KOnbColors.knowledge },
  ];
  const stage = state.split('-')[0];
  const order = { cardio: 0, strength: 1, knowledge: 2 };
  const allDone = state === 'all-done';
  return (
    <div style={{
      display: 'flex', gap: 8, padding: '6px',
      background: 'rgba(255,255,255,0.04)', borderRadius: 999, border: `1px solid ${KP.hairline}`,
      width: 'fit-content',
    }}>
      {items.map(it => {
        const done = allDone || order[it.id] < order[stage];
        const active = !allDone && order[it.id] === order[stage];
        return (
          <div key={it.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: active ? it.color : done ? `${it.color}33` : 'transparent',
            color: active ? 'var(--kale-dark)' : done ? it.color : KP.fgMuted,
            fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.04em',
          }}>
            {done && !active && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9L10 3" stroke={it.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
            <span>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Reusable comparison spectrum: dot positioned along a gradient bar
function KSpectrum({ left, centre, right, positionPct, label, accent = KOnbColors.cardio }) {
  return (
    <div>
      <div style={{ position: 'relative', height: 14, marginBottom: 10 }}>
        <div style={{
          position: 'absolute', top: 4, left: 0, right: 0, height: 6, borderRadius: 999,
          background: `linear-gradient(90deg, rgba(255,255,255,0.12) 0%, ${accent}55 50%, ${accent} 100%)`,
        }}/>
        <div style={{
          position: 'absolute', top: 0, left: `${positionPct}%`,
          width: 14, height: 14, borderRadius: '50%',
          background: KP.fg, border: `2px solid ${accent}`, transform: 'translateX(-50%)',
          boxShadow: `0 0 16px ${accent}`,
        }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: KP.fgMuted, fontWeight: 600, marginBottom: 6 }}>
        <span>{left}</span>
        <span>{centre}</span>
        <span>{right}</span>
      </div>
      {label && (
        <div style={{ fontSize: 13, color: KP.fg, fontWeight: 600, marginTop: 8 }}>{label}</div>
      )}
    </div>
  );
}

// Number-in-ring component used for all the pillar levels.
function KLevelRing({ level, accent, label, size = 132, ringWidth = 6 }) {
  const r = (size - ringWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = (level / 10) * c;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={ringWidth}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={accent} strokeWidth={ringWidth} strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            transform={`rotate(-90 ${size/2} ${size/2})`}/>
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: size * 0.5,
          color: KP.fg, letterSpacing: '-0.05em', lineHeight: 1,
        }}>{level}</div>
      </div>
      {label && (
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
          color: KP.fg, marginTop: 14, letterSpacing: '0.02em',
        }}>{label}</div>
      )}
    </div>
  );
}

// Small section header for screens
function KSectionHeader({ pillar, label }) {
  const color = pillar === 'cardio' ? KOnbColors.cardio
              : pillar === 'strength' ? KOnbColors.strength
              : pillar === 'knowledge' ? KOnbColors.knowledge
              : KP.mint;
  // No emoji — use a small filled dot
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
        boxShadow: `0 0 12px ${color}`,
      }}/>
      <span style={{
        fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
        color: color, letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  );
}

function KCard({ children, accent, padding = 22, style }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${KP.hairline}`,
      borderRadius: 16,
      padding,
      ...(accent ? { borderLeftWidth: 0, boxShadow: `inset 4px 0 0 0 ${accent}` } : {}),
      ...style,
    }}>{children}</div>
  );
}

function KPrimaryButton({ children, accent = KP.mint, fullWidth = true, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: fullWidth ? '100%' : 'auto', height: 56, borderRadius: 9999,
      background: accent, color: 'var(--kale-dark)',
      border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      {children} <IconArrowRight w={18} h={18}/>
    </button>
  );
}

// ============================================================
// 1. WELCOME
// ============================================================
function KaleWelcome() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <img src="assets/kale-watermark.svg" alt="" aria-hidden="true" style={{
        position: 'absolute', right: -90, bottom: -80,
        width: 360, height: 'auto', opacity: 0.08, pointerEvents: 'none', transform: 'rotate(-10deg)',
      }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0' }}>
          <Wordmark tone="white" size={22}/>
        </div>

        <div style={{ flex: 1, padding: '40px 28px 0', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 56, lineHeight: 0.98,
            letterSpacing: '-0.035em', color: KP.fg, margin: '40px 0 0',
          }}>
            Welcome to <em style={{ color: KP.mint, fontStyle: 'italic', fontWeight: 800 }}>Kale</em>.
          </h1>

          <p style={{
            marginTop: 22, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, lineHeight: 1.35,
            color: KP.fg, maxWidth: 320,
          }}>
            Built for Kale policyholders who want to train for longevity — and get rewarded for it.
          </p>

          <p style={{
            marginTop: 14, color: KP.fgMuted, fontSize: 15, lineHeight: 1.55, maxWidth: 320,
          }}>
            You've already connected your device, so we have your cardio data. Now let's complete your first assessment and give you your official Longevity Level.
          </p>

          <div style={{ marginTop: 'auto', paddingBottom: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <KPrimaryButton>Let's go</KPrimaryButton>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <KAssessmentPill state="cardio-active"/>
            </div>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 2. CARDIO RESULTS REVIEW
// ============================================================
function KaleCardioReview() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: KP.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={18}/>
          <span style={{ width: 20 }}/>
        </div>

        <div style={{ padding: '20px 24px 0', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <KAssessmentPill state="strength-active"/>
          </div>
          <KSectionHeader pillar="cardio" label="Cardio"/>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, lineHeight: 1.02,
            letterSpacing: '-0.03em', color: KP.fg, margin: '10px 0 18px',
          }}>
            Your best <em style={{ color: KOnbColors.cardio, fontStyle: 'italic' }}>qualifying</em> run.
          </h1>

          {/* Best run card */}
          <KCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: KP.fg }}>Morning long run</div>
                <div style={{ fontSize: 12, color: KP.fgMuted, marginTop: 2 }}>14 Feb 2026 · 7:42 am</div>
              </div>
              {/* Mini map placeholder */}
              <div style={{
                width: 76, height: 56, borderRadius: 8,
                background: 'rgba(0,200,150,0.10)',
                border: `1px solid ${KP.hairline}`,
                position: 'relative', overflow: 'hidden',
              }}>
                <svg viewBox="0 0 76 56" width="76" height="56">
                  <path d="M6 42 Q 14 18, 28 24 T 52 16 T 70 32" stroke={KOnbColors.cardio} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                  <circle cx="6" cy="42" r="2.5" fill={KOnbColors.cardio}/>
                  <circle cx="70" cy="32" r="2.5" fill={KP.fg}/>
                </svg>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 0, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${KP.hairline}` }}>
              <KStat label="Distance" value="12.4" unit="km"/>
              <div style={{ width: 1, background: KP.hairline, alignSelf: 'stretch', margin: '0 14px' }}/>
              <KStat label="Pace" value="4:48" unit="/km"/>
              <div style={{ width: 1, background: KP.hairline, alignSelf: 'stretch', margin: '0 14px' }}/>
              <KStat label="Avg HR" value="148" unit="bpm"/>
              <div style={{ width: 1, background: KP.hairline, alignSelf: 'stretch', margin: '0 14px' }}/>
              <KStat label="Max HR" value="172" unit="bpm"/>
            </div>
          </KCard>

          {/* Spectrum */}
          <div style={{ marginTop: 16 }}>
            <KCard>
              <div style={{ fontSize: 12, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>How you compare</div>
              <KSpectrum
                left="Average"
                centre="Active"
                right="World class"
                positionPct={68}
                label="You're in the top 18% of active runners your age."
                accent={KOnbColors.cardio}
              />
            </KCard>
          </div>

          {/* Cardio Level */}
          <div style={{ marginTop: 16, marginBottom: 18 }}>
            <KCard padding={26}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <KLevelRing level={6} accent={KOnbColors.cardio} size={108}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 22, color: KP.fg, letterSpacing: '-0.02em' }}>Cardio Level 6</div>
                  <p style={{ color: KP.fgMuted, fontSize: 13, lineHeight: 1.5, margin: '6px 0 0' }}>
                    Based on your estimated VO₂max. The biggest factor in your Longevity Level.
                  </p>
                </div>
              </div>
            </KCard>
          </div>

          <div style={{ paddingBottom: 14 }}>
            <KPrimaryButton>Next — Strength</KPrimaryButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function KStat({ label, value, unit }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18, color: KP.fg,
        letterSpacing: '-0.015em', marginTop: 4, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
      }}>{value}<span style={{ color: KP.fgMuted, fontSize: 11, fontWeight: 600, marginLeft: 3 }}>{unit}</span></div>
    </div>
  );
}

// ============================================================
// 3. STRENGTH ASSESSMENT INTRO
// ============================================================
function KaleStrengthIntro() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: KP.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={18}/>
          <span style={{ width: 20 }}/>
        </div>

        <div style={{ padding: '20px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <KAssessmentPill state="strength-active"/>
          </div>
          <KSectionHeader pillar="strength" label="Strength"/>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, lineHeight: 1.02,
            letterSpacing: '-0.035em', color: KP.fg, margin: '10px 0 14px', maxWidth: 320,
          }}>
            Time for your <em style={{ color: KOnbColors.strength, fontStyle: 'italic' }}>plank</em>.
          </h1>
          <p style={{ color: KP.fgMuted, fontSize: 15, lineHeight: 1.5, maxWidth: 320, margin: 0 }}>
            We use the plank as our baseline strength test. Simple, proven, and a reliable snapshot of your core endurance.
          </p>

          <KCard accent={KOnbColors.strength} style={{ marginTop: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: KOnbColors.strength, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>How it works</div>
            {[
              'Find a clear space — set your phone to record',
              'Get into a plank, elbows under shoulders, body in a straight line',
              'Hold as long as you can, then stop the recording',
              'Upload the video — we\'ll review it and log your time',
            ].map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
                <div style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(232,130,110,0.18)', color: KOnbColors.strength,
                  fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 12,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{i+1}</div>
                <div style={{ flex: 1, fontSize: 14, color: KP.fg, lineHeight: 1.45 }}>{line}</div>
              </div>
            ))}
          </KCard>

          <p style={{ marginTop: 18, color: KP.fgMuted, fontSize: 13, lineHeight: 1.55 }}>
            In later assessments you'll also complete a wall sit and — eventually — press-ups. Your strength test evolves as you progress.
          </p>

          <div style={{ marginTop: 'auto', paddingBottom: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <KPrimaryButton accent={KOnbColors.strength}>Upload plank video</KPrimaryButton>
            <button style={{
              background: 'transparent', border: 'none', color: KP.fgMuted,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
              textUnderlineOffset: 4,
            }}>Learn correct plank form ↗</button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 4. STRENGTH VIDEO PROCESSING — animated 0 → 100%
// ============================================================
function KaleStrengthProcessing() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 6500);
    return () => clearInterval(id);
  }, []);
  return <KaleStrengthProcessingInner key={tick}/>;
}

function KaleStrengthProcessingInner() {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / 4200);
      const e = 1 - Math.pow(1 - t, 2.2);
      setPct(Math.round(e * 100));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <>
      <style>{`
        @keyframes ksp-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.5; }
          50%      { transform: translate(-50%, -50%) scale(1.5); opacity: 0;   }
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <Wordmark tone="white" size={22}/>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 220, height: 220, borderRadius: '50%',
              border: `2px solid ${KOnbColors.strength}`,
              transform: 'translate(-50%, -50%)',
              animation: 'ksp-pulse 1.8s ease-out infinite',
            }}/>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(232,130,110,0.15)" strokeWidth="4"/>
              <circle cx="110" cy="110" r="100" fill="none"
                stroke={KOnbColors.strength} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(pct/100) * 628} 628`}
                transform="rotate(-90 110 110)"/>
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 64,
                color: KP.fg, letterSpacing: '-0.04em', lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}>{pct}<span style={{ fontSize: 28, color: KOnbColors.strength, marginLeft: 2 }}>%</span></div>
            </div>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28,
            color: KP.fg, letterSpacing: '-0.02em', lineHeight: 1.15,
            margin: '36px 0 10px', textAlign: 'center',
          }}>
            Analysing your plank…
          </h1>
          <p style={{ color: KP.fgMuted, fontSize: 14, lineHeight: 1.55, textAlign: 'center', margin: 0, maxWidth: 280 }}>
            We're reviewing your video and logging your hold time. Usually under a minute.
          </p>
        </div>
        <div style={{ padding: '0 28px 22px', display: 'flex', justifyContent: 'center' }}>
          <KAssessmentPill state="strength-active"/>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 5. STRENGTH RESULTS
// ============================================================
function KaleStrengthResults() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: KP.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={18}/>
          <span style={{ width: 20 }}/>
        </div>

        <div style={{ padding: '20px 24px 0', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <KAssessmentPill state="knowledge-active"/>
          </div>
          <KSectionHeader pillar="strength" label="Strength"/>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, lineHeight: 1.02,
            letterSpacing: '-0.03em', color: KP.fg, margin: '10px 0 18px',
          }}>
            Your <em style={{ color: KOnbColors.strength, fontStyle: 'italic' }}>plank</em> hold.
          </h1>

          <KCard>
            <div style={{ fontSize: 12, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Hold time</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 64, color: KP.fg, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>1</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: KP.fgMuted, marginRight: 6 }}>min</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 64, color: KP.fg, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>43</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: KP.fgMuted }}>sec</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%', background: KOnbColors.strength,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="var(--kale-dark)" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
              <span style={{ fontSize: 12, color: KP.fgMuted, fontWeight: 600 }}>Video verified · 14 Feb 2026</span>
            </div>
          </KCard>

          <div style={{ marginTop: 14 }}>
            <KCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Relative performance</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18, color: KOnbColors.strength, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>RP 71%</span>
              </div>
              <div style={{ position: 'relative', height: 18, marginBottom: 8 }}>
                <div style={{
                  position: 'absolute', top: 7, left: 0, right: 0, height: 4, borderRadius: 999,
                  background: `linear-gradient(90deg, rgba(255,255,255,0.10) 0%, ${KOnbColors.strength}50 50%, ${KOnbColors.strength} 100%)`,
                }}/>
                {[25, 50, 75].map(p => (
                  <div key={p} style={{
                    position: 'absolute', left: `${p}%`, top: 4, width: 1, height: 10,
                    background: 'rgba(255,255,255,0.12)', transform: 'translateX(-50%)',
                  }}/>
                ))}
                <div style={{
                  position: 'absolute', left: '71%', top: 0,
                  width: 18, height: 18, borderRadius: '50%',
                  background: KP.fg, border: `2.5px solid ${KOnbColors.strength}`,
                  transform: 'translateX(-50%)', boxShadow: `0 0 18px ${KOnbColors.strength}80`,
                }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 10, color: KP.fgFaint, fontWeight: 700, letterSpacing: '0.04em' }}>WEAKER</span>
                <span style={{ fontSize: 10, color: KP.fgFaint, fontWeight: 700, letterSpacing: '0.04em' }}>AVERAGE</span>
                <span style={{ fontSize: 10, color: KP.fgFaint, fontWeight: 700, letterSpacing: '0.04em' }}>ELITE</span>
              </div>
              <p style={{ fontSize: 13, color: KP.fg, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                You're outperforming <span style={{ color: KOnbColors.strength, fontWeight: 800 }}>71%</span> of <strong style={{ color: KP.fg, fontWeight: 700 }}>women aged 35–40</strong>. That's a strong start.
              </p>
            </KCard>
          </div>

          <div style={{ marginTop: 14 }}>
            <KCard padding={18}>
              <div style={{ fontSize: 11, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Benchmarks</div>
              {[
                ['Beginner', '< 30 sec'],
                ['Average', '60 – 90 sec'],
                ['Good', '90 – 120 sec', true],
                ['Excellent', '2+ min'],
              ].map(([cat, val, current], i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: i < 3 ? `1px solid ${KP.hairline}` : 'none',
                }}>
                  <span style={{ fontSize: 13, color: current ? KP.fg : KP.fgMuted, fontWeight: current ? 700 : 600 }}>{cat}{current && <span style={{ marginLeft: 8, color: KOnbColors.strength, fontSize: 11, letterSpacing: '0.1em' }}>YOU</span>}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: current ? KP.fg : KP.fgMuted, fontVariantNumeric: 'tabular-nums' }}>{val}</span>
                </div>
              ))}
            </KCard>
          </div>

          <div style={{ marginTop: 14, marginBottom: 16 }}>
            <KCard padding={22}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <KLevelRing level={5} accent={KOnbColors.strength} size={108}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: KOnbColors.strength, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Plank · Strength Level</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 40, color: KP.fg, letterSpacing: '-0.04em', lineHeight: 0.95 }}>5</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KP.fgMuted }}>/ 10</span>
                  </div>
                  <p style={{ color: KP.fg, fontSize: 13, lineHeight: 1.5, margin: '10px 0 0', fontWeight: 600 }}>
                    <em style={{ color: KOnbColors.strength, fontStyle: 'italic' }}>Strong baseline.</em>
                  </p>
                  <p style={{ color: KP.fgMuted, fontSize: 12, lineHeight: 1.5, margin: '4px 0 0' }}>
                    Adding wall sits in cycle 3 will sharpen this further.
                  </p>
                </div>
              </div>
            </KCard>
          </div>

          <div style={{ paddingBottom: 14 }}>
            <KPrimaryButton accent={KOnbColors.strength}>Next — Knowledge</KPrimaryButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 6. KNOWLEDGE INTRO
// ============================================================
function KaleKnowledgeIntro() {
  const futureTopics = ['Exercise science', 'Nutrition', 'Sleep & recovery', 'Mental health', 'Biology & genetics'];
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: KP.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={18}/>
          <span style={{ width: 20 }}/>
        </div>

        <div style={{ padding: '20px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <KAssessmentPill state="knowledge-active"/>
          </div>
          <KSectionHeader pillar="knowledge" label="Knowledge"/>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 40, lineHeight: 1.02,
            letterSpacing: '-0.03em', color: KP.fg, margin: '10px 0 14px', maxWidth: 320,
          }}>
            Quick <em style={{ color: KOnbColors.knowledge, fontStyle: 'italic' }}>knowledge</em> check.
          </h1>
          <p style={{ color: KP.fgMuted, fontSize: 15, lineHeight: 1.5, maxWidth: 320, margin: 0 }}>
            One topic per quarter. Today, we'll cover the basics — and build from there.
          </p>

          {/* Featured topic card */}
          <div style={{
            marginTop: 22, padding: '20px 22px', borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(245,233,78,0.14) 0%, rgba(245,233,78,0.04) 100%)',
            border: `1.5px solid rgba(245,233,78,0.45)`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: KOnbColors.knowledge, letterSpacing: '0.14em', textTransform: 'uppercase' }}>This quarter's topic</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <h2 style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28,
                color: KP.fg, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1,
              }}>General longevity</h2>
              <span style={{
                padding: '2px 8px', borderRadius: 999,
                background: 'rgba(245,233,78,0.20)', color: KOnbColors.knowledge,
                fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
              }}>ONBOARDING</span>
            </div>
            <p style={{ color: KP.fgMuted, fontSize: 13, lineHeight: 1.5, margin: '10px 0 0' }}>
              Lifespan vs healthspan, the science of VO₂max, why training fights ageing — your foundation.
            </p>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: KP.fgMuted, fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: KP.fgMuted }}/>
                20 questions
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: KP.fgMuted }}/>
                ~5 min
              </span>
            </div>
          </div>

          {/* Future topics preview */}
          <div style={{ fontSize: 11, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 24, marginBottom: 10 }}>Coming in future quarters</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {futureTopics.map(t => (
              <span key={t} style={{
                padding: '6px 12px', borderRadius: 999,
                background: 'transparent', border: `1px dashed ${KP.hairline}`,
                color: KP.fgMuted, fontSize: 12, fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 14 }}>
            <KPrimaryButton accent={KOnbColors.knowledge}>Start quiz</KPrimaryButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 7. KNOWLEDGE QUIZ — single question
// ============================================================
function KaleQuizQuestion({ answer = 'correct' }) {
  // answer === 'correct'  → user picked B (the correct answer) — green feedback
  // answer === 'wrong'    → user picked D (wrong) — red on D, green on B
  const correctIndex = 1; // B is correct
  const wrongPick = 3;    // D
  const selected = answer === 'correct' ? correctIndex : wrongPick;

  const options = [
    { letter: 'A', text: 'Resting heart rate' },
    { letter: 'B', text: 'VO₂max' },
    { letter: 'C', text: 'Body weight' },
    { letter: 'D', text: 'Step count' },
  ];

  const RED = '#D14B3B';
  return (
    <>
      <style>{`
        @keyframes kq-advance {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        {/* Top progress bar */}
        <div style={{ padding: '8px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em' }}>QUESTION 12 / 20</span>
            <button style={{ background: 'transparent', border: 'none', color: KP.fgMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>End quiz</button>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '60%', background: KOnbColors.knowledge, borderRadius: 2 }}/>
          </div>
        </div>

        <div style={{ padding: '32px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, lineHeight: 1.2,
            letterSpacing: '-0.02em', color: KP.fg, margin: 0,
          }}>
            Which single metric is the strongest predictor of long-term mortality risk?
          </h1>

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map((o, i) => {
              const isPicked  = selected === i;
              const isCorrect = i === correctIndex;
              // Tile state:
              //  - picked + correct → green tile
              //  - picked + wrong   → red tile
              //  - not picked + correct (only matters when user got it wrong) → green outline highlight
              //  - other            → idle
              let color = null;
              if (isPicked && isCorrect) color = KOnbColors.cardio;
              else if (isPicked && !isCorrect) color = RED;
              else if (!isPicked && isCorrect && answer === 'wrong') color = KOnbColors.cardio;

              const isFilled = isPicked;
              const isHighlight = !isPicked && color; // green outline on the correct one when user got it wrong
              const tileBg = isFilled
                ? (isCorrect ? 'rgba(0,200,150,0.18)' : 'rgba(209,75,59,0.18)')
                : isHighlight
                  ? 'rgba(0,200,150,0.10)'
                  : 'rgba(255,255,255,0.04)';
              const tileBorder = color
                ? `1.5px solid ${color}`
                : `1px solid ${KP.hairline}`;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: tileBg, border: tileBorder, borderRadius: 14, padding: '16px 16px',
                  textAlign: 'left',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: color || 'rgba(255,255,255,0.06)',
                    color: color ? 'var(--kale-dark)' : KP.fgMuted,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 12,
                    flexShrink: 0,
                  }}>{o.letter}</div>
                  <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: KP.fg }}>{o.text}</div>
                  {/* Status glyph */}
                  {color && (
                    <span style={{ flexShrink: 0 }}>
                      {(isCorrect)
                        ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="10" fill={KOnbColors.cardio}/>
                            <path d="M5 10.5L8.5 14L15 7" stroke="var(--kale-dark)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        : <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="10" fill={RED}/>
                            <path d="M6 6l8 8M14 6l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                          </svg>
                      }
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline explanation panel — colour follows the result */}
          <div style={{
            marginTop: 18, padding: '14px 16px',
            borderRadius: 12,
            background: answer === 'correct' ? 'rgba(0,200,150,0.10)' : 'rgba(209,75,59,0.10)',
            border: `1px solid ${answer === 'correct' ? 'rgba(0,200,150,0.30)' : 'rgba(209,75,59,0.30)'}`,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: answer === 'correct' ? KOnbColors.cardio : RED,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
            }}>
              {answer === 'correct'
                ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6.5L5 8.5L9 4" stroke="var(--kale-dark)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 4l4 4M8 4l-4 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KP.fg }}>
                {answer === 'correct' ? 'Exactly right.' : 'Not quite.'}
              </div>
              <div style={{ color: KP.fgMuted, fontSize: 13, lineHeight: 1.5, marginTop: 2 }}>
                {answer === 'correct'
                  ? <>VO₂max is the single strongest predictor of all-cause mortality across decades of longitudinal studies.</>
                  : <>The correct answer is <strong style={{ color: KOnbColors.cardio, fontWeight: 800 }}>VO₂max</strong> — the strongest predictor of all-cause mortality across decades of longitudinal studies.</>
                }
              </div>
            </div>
          </div>

          {/* Auto-advance indicator — no manual Next button */}
          <div style={{ marginTop: 'auto', paddingBottom: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, color: KP.fgMuted, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: KP.fgMuted }}/>
              Next question in 2s
            </div>
            <div style={{ height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: answer === 'correct' ? KOnbColors.cardio : RED,
                animation: 'kq-advance 2s linear infinite',
                borderRadius: 999,
                transformOrigin: 'left',
              }}/>
            </div>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function KaleQuizQuestionWrong() { return <KaleQuizQuestion answer="wrong"/>; }

// ============================================================
// 8. KNOWLEDGE RESULTS
// ============================================================
function KaleKnowledgeResults() {
  const topics = [
    { label: 'General longevity', score: 5, max: 5 },
    { label: 'Exercise science', score: 4, max: 5 },
    { label: 'Nutrition',         score: 3, max: 5 },
    { label: 'Sleep & recovery',  score: 2, max: 3 },
    { label: 'Mental health',     score: 1, max: 2 },
  ];
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: KP.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={18}/>
          <span style={{ width: 20 }}/>
        </div>

        <div style={{ padding: '20px 24px 0', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <KAssessmentPill state="all-done"/>
          </div>
          <KSectionHeader pillar="knowledge" label="Knowledge"/>

          <KCard padding={24} style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <KLevelRing level={7} accent={KOnbColors.knowledge} size={112}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, color: KP.fg, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>16</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 20, color: KP.fgMuted }}>/ 20</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: KOnbColors.knowledge, marginTop: 6, letterSpacing: '0.04em' }}>80% · Knowledge Level 7</div>
              </div>
            </div>
          </KCard>

          <div style={{ marginTop: 14 }}>
            <KCard padding={20}>
              <div style={{ fontSize: 12, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>By topic</div>
              {topics.map((t, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: i < topics.length - 1 ? `1px solid ${KP.hairline}` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: KP.fg, fontWeight: 600 }}>{t.label}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 13, color: KP.fg, fontVariantNumeric: 'tabular-nums' }}>{t.score}<span style={{ color: KP.fgMuted, fontWeight: 600 }}> / {t.max}</span></span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(t.score/t.max)*100}%`, background: KOnbColors.knowledge, borderRadius: 2 }}/>
                  </div>
                </div>
              ))}
            </KCard>
          </div>

          <KCard accent={KOnbColors.knowledge} style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: KOnbColors.knowledge, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Where to grow</div>
            <p style={{ color: KP.fg, fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              You're strong on exercise science. Nutrition is where you have the most room to grow — we'll focus there in your next cycle.
            </p>
          </KCard>

          <div style={{ marginTop: 18, marginBottom: 14 }}>
            <KPrimaryButton accent={KOnbColors.knowledge}>See your Longevity Level</KPrimaryButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 9. OVERALL LONGEVITY LEVEL REVEAL — animated
// ============================================================
function KaleLevelReveal() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 8000);
    return () => clearInterval(id);
  }, []);
  return <KaleLevelRevealInner key={tick}/>;
}

function KaleLevelRevealInner() {
  // Stages: 0 small rings → 1 weights → 2 merge → 3 final ring + text
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    const ts = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1800),
      setTimeout(() => setStage(3), 3000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <>
      <style>{`
        @keyframes klr-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.05); }
        }
        @keyframes klr-glow {
          0%, 100% { box-shadow: 0 0 60px rgba(0,200,150,0.35); }
          50%      { box-shadow: 0 0 90px rgba(0,200,150,0.6); }
        }
        .klr-bigring { animation: klr-pulse 3s ease-in-out infinite, klr-glow 3s ease-in-out infinite; }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>

      {/* radial glow centered on big ring */}
      <div style={{
        position: 'absolute', top: '46%', left: '50%',
        width: 540, height: 540, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.30) 0%, rgba(0,200,150,0) 60%)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        opacity: stage >= 2 ? 1 : 0, transition: 'opacity 700ms ease',
      }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <Wordmark tone="white" size={22}/>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '20px 24px 0' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: KP.mint, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 28 }}>
            Your Longevity Level
          </div>

          {/* Three small rings → merge zone */}
          <div style={{ position: 'relative', width: 320, height: 130 }}>
            {/* Cardio ring */}
            <div style={{
              position: 'absolute', left: 0, top: 0,
              opacity: stage >= 0 ? (stage >= 2 ? 0 : 1) : 0,
              transform: stage >= 2 ? 'translateX(80px) scale(0.6)' : 'translateX(0) scale(1)',
              transition: 'all 900ms cubic-bezier(.5,.05,.3,1)',
            }}>
              <KLevelRing level={6} accent={KOnbColors.cardio} size={88} ringWidth={5}/>
              <div style={{
                marginTop: 8, fontSize: 10, fontWeight: 700,
                color: KOnbColors.cardio, letterSpacing: '0.16em', textAlign: 'center',
                opacity: stage >= 1 ? 1 : 0, transition: 'opacity 500ms 100ms ease',
              }}>70%</div>
            </div>
            {/* Strength ring */}
            <div style={{
              position: 'absolute', left: 116, top: 0,
              opacity: stage >= 0 ? (stage >= 2 ? 0 : 1) : 0,
              transform: stage >= 2 ? 'translateX(0) scale(0.6)' : 'translateX(0) scale(1)',
              transition: 'all 900ms cubic-bezier(.5,.05,.3,1) 100ms',
            }}>
              <KLevelRing level={5} accent={KOnbColors.strength} size={88} ringWidth={5}/>
              <div style={{
                marginTop: 8, fontSize: 10, fontWeight: 700,
                color: KOnbColors.strength, letterSpacing: '0.16em', textAlign: 'center',
                opacity: stage >= 1 ? 1 : 0, transition: 'opacity 500ms 200ms ease',
              }}>20%</div>
            </div>
            {/* Knowledge ring */}
            <div style={{
              position: 'absolute', left: 232, top: 0,
              opacity: stage >= 0 ? (stage >= 2 ? 0 : 1) : 0,
              transform: stage >= 2 ? 'translateX(-80px) scale(0.6)' : 'translateX(0) scale(1)',
              transition: 'all 900ms cubic-bezier(.5,.05,.3,1) 200ms',
            }}>
              <KLevelRing level={7} accent={KOnbColors.knowledge} size={88} ringWidth={5}/>
              <div style={{
                marginTop: 8, fontSize: 10, fontWeight: 700,
                color: KOnbColors.knowledge, letterSpacing: '0.16em', textAlign: 'center',
                opacity: stage >= 1 ? 1 : 0, transition: 'opacity 500ms 300ms ease',
              }}>10%</div>
            </div>
          </div>

          {/* Big merged ring */}
          <div style={{
            marginTop: 32,
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? 'scale(1)' : 'scale(0.6)',
            transition: 'all 600ms cubic-bezier(.2,.9,.3,1.2)',
          }}>
            <div className="klr-bigring" style={{ borderRadius: '50%' }}>
              <KLevelRing level={6} accent={KP.mint} size={172} ringWidth={8}/>
            </div>
          </div>

          <h2 style={{
            opacity: stage >= 3 ? 1 : 0, transition: 'opacity 600ms 200ms ease',
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 24, lineHeight: 1.15,
            letterSpacing: '-0.02em', color: KP.fg, margin: '28px 0 8px', textAlign: 'center', maxWidth: 300,
          }}>
            <em style={{ color: KP.mint, fontStyle: 'italic' }}>Level 6.</em> You're in good shape.
          </h2>
          <p style={{
            opacity: stage >= 3 ? 1 : 0, transition: 'opacity 600ms 320ms ease',
            color: KP.fgMuted, fontSize: 14, lineHeight: 1.5, margin: 0, textAlign: 'center', maxWidth: 300,
          }}>
            And you've got a clear path to Level 7.
          </p>
        </div>

        <div style={{ padding: '0 24px 14px', opacity: stage >= 3 ? 1 : 0, transition: 'opacity 600ms 500ms ease' }}>
          <KPrimaryButton>See what this means for your health</KPrimaryButton>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 10. HEALTH YEARS IMPACT
// ============================================================
function KaleHealthYears() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg, rgba(0,200,150,0.20) 0%, rgba(0,200,150,0) 100%)',
        pointerEvents: 'none',
      }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Wordmark tone="white" size={20}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em' }}>LEVEL 6</span>
        </div>

        <div style={{ padding: '32px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>What this means</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 40, lineHeight: 1.02,
            letterSpacing: '-0.035em', color: KP.fg, margin: '14px 0 8px', maxWidth: 340,
          }}>
            Your fitness is worth <em style={{ color: KP.mint, fontStyle: 'italic' }}>years</em>.
          </h1>
          <p style={{ color: KP.fgMuted, fontSize: 14, lineHeight: 1.5, maxWidth: 320, margin: 0 }}>
            At Level 6, here's what the science says about your trajectory vs. an inactive population.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
            <KMetricCard accent={KOnbColors.cardio} eyebrow="Lifespan" value="+4.2" unit="years" sub="Projected additional years of life."/>
            <KMetricCard accent={KOnbColors.knowledge} eyebrow="Healthspan" value="+6.8" unit="years" sub="Projected healthy, active years."/>
          </div>

          <p style={{ marginTop: 22, color: KP.fgMuted, fontSize: 13, lineHeight: 1.55, maxWidth: 340 }}>
            Healthspan — the years you spend healthy and independent — is what really matters. Fitness extends both how long you live and how well you live.
          </p>

          <KCard accent={KP.mint} style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 38,
                color: KP.mint, letterSpacing: '-0.04em', lineHeight: 1,
              }}>+0.9</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: KP.fg, fontWeight: 700, lineHeight: 1.35 }}>extra healthspan years at Level 7.</div>
                <div style={{ color: KP.fgMuted, fontSize: 12, marginTop: 2 }}>That's a lot for one level.</div>
              </div>
            </div>
          </KCard>

          <div style={{ marginTop: 'auto', paddingBottom: 14 }}>
            <KPrimaryButton>See your first cycle rewards</KPrimaryButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function KMetricCard({ accent, eyebrow, value, unit, sub }) {
  return (
    <div style={{
      flex: 1, padding: 18, borderRadius: 16,
      background: `linear-gradient(180deg, ${accent}1A 0%, rgba(255,255,255,0.02) 100%)`,
      border: `1px solid ${accent}33`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{eyebrow}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 10 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 46, color: KP.fg, letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KP.fgMuted }}>{unit}</span>
      </div>
      <p style={{ fontSize: 12, color: KP.fgMuted, lineHeight: 1.45, margin: '10px 0 0' }}>{sub}</p>
    </div>
  );
}

// ============================================================
// 11. FIRST CYCLE EARNINGS PREVIEW
// ============================================================
function KaleEarningsPreview() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KP.bg }}/>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '38%',
        background: `linear-gradient(180deg, rgba(245,233,78,0.16) 0%, rgba(245,233,78,0) 100%)`,
        pointerEvents: 'none',
      }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <Wordmark tone="white" size={20}/>
        </div>

        <div style={{ padding: '24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Eyebrow>Your first cycle</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 32, lineHeight: 1.05,
            letterSpacing: '-0.03em', color: KP.fg, margin: '10px 0 18px', maxWidth: 320,
          }}>
            Here's what you'll earn.
          </h1>

          {/* Big points number */}
          <KCard padding={26}>
            <div style={{ fontSize: 11, fontWeight: 700, color: KOnbColors.knowledge, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Kalettes</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 76, color: KP.fg,
                letterSpacing: '-0.05em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums',
              }}>486</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: KP.fgMuted }}>≈ £4.86</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', marginTop: 16, borderTop: `1px solid ${KP.hairline}` }}>
              <span style={{ fontSize: 13, color: KP.fgMuted }}>Monthly premium</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KP.fg, fontVariantNumeric: 'tabular-nums' }}>£27.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${KP.hairline}` }}>
              <span style={{ fontSize: 13, color: KP.fgMuted }}>Annual premium</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KP.fg, fontVariantNumeric: 'tabular-nums' }}>£324</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${KP.hairline}` }}>
              <span style={{ fontSize: 13, color: KP.fgMuted }}>Points rate (Level 6)</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KP.mint, fontVariantNumeric: 'tabular-nums' }}>6%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${KP.hairline}` }}>
              <span style={{ fontSize: 13, color: KP.fgMuted }}>Quarterly cycle value</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KP.fg, fontVariantNumeric: 'tabular-nums' }}>£4.86</span>
            </div>
          </KCard>

          {/* Cycle timeline */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: KP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Next assessment</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: KP.fg }}>11 weeks</span>
            </div>
            <div style={{ position: 'relative', height: 10 }}>
              <div style={{ position: 'absolute', inset: 0, height: 6, top: 2, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}/>
              <div style={{ position: 'absolute', left: 0, top: 2, height: 6, width: '4%', borderRadius: 3, background: KP.mint }}/>
              <div style={{ position: 'absolute', right: 0, top: -3, width: 16, height: 16, borderRadius: 4, background: KOnbColors.strength, border: '2px solid var(--kale-dark)' }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: KP.fgMuted }}>Today</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: KOnbColors.strength }}>Assessment</span>
            </div>
          </div>

          {/* Callout — must complete to bank */}
          <KCard accent={KOnbColors.strength} style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: KOnbColors.strength, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Important</div>
            <p style={{ color: KP.fg, fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              Complete your next assessment to bank these points. Miss it and they reset. Make it and you could level up.
            </p>
          </KCard>

          <div style={{ marginTop: 16, marginBottom: 14 }}>
            <KPrimaryButton>Go to my home screen</KPrimaryButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// Export to window
// ============================================================
Object.assign(window, {
  KaleWelcome, KaleCardioReview, KaleStrengthIntro, KaleStrengthProcessing,
  KaleStrengthResults, KaleKnowledgeIntro, KaleQuizQuestion, KaleQuizQuestionWrong, KaleKnowledgeResults,
  KaleLevelReveal, KaleHealthYears, KaleEarningsPreview,
});
