/* eslint-disable */
// "Lumen" onboarding — screens 08–11 (knowledge results, level reveal,
// health years, first-cycle rewards). Reuses the Lumen system + helpers from
// KaleLumen.jsx and KaleLumenOnboarding.jsx (all on window).

// ============================================================
// 08 · KNOWLEDGE RESULTS (Lumen)
// ============================================================
function KaleKnowledgeResultsLumen() {
  const topics = [
    { label: 'General longevity', score: 5, max: 5 },
    { label: 'Exercise science', score: 4, max: 5 },
    { label: 'Nutrition', score: 3, max: 5 },
    { label: 'Sleep & recovery', score: 2, max: 3 },
    { label: 'Mental health', score: 1, max: 2 },
  ];
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumBack/>
        <div style={{ flex: 1, padding: '12px 26px 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LumEyebrow pillar="knowledge" label="Knowledge" step="Result"/>
          </div>

          {/* Hero ring 16/20 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
            <LumRing value="16" suffix="/20" pct={80} size={206} stroke={11}/>
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', color: LumenPillars.knowledge }}>80% · Knowledge Level 7</span>
          </div>

          {/* By topic */}
          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: Lumen.muted, marginBottom: 6 }}>By topic</div>
            {topics.map((t, i) => (
              <div key={i} style={{ padding: '11px 0', borderBottom: i < topics.length - 1 ? `1px solid ${Lumen.hair}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: Lumen.cream, fontWeight: 600 }}>{t.label}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 13, color: Lumen.cream, fontVariantNumeric: 'tabular-nums' }}>{t.score}<span style={{ color: Lumen.muted, fontWeight: 600 }}> / {t.max}</span></span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(234,243,228,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(t.score/t.max)*100}%`, background: Lumen.lime, borderRadius: 2 }}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22 }}>
            <LumenRuleCaption align="left" color={Lumen.green} max={320} size={16}>
              You're strong on exercise science. Nutrition has the most room to grow — we'll focus there next cycle.
            </LumenRuleCaption>
          </div>

          <div style={{ marginTop: 'auto', padding: '24px 0' }}>
            <LumenButton>See your Longevity Level</LumenButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 09 · LONGEVITY LEVEL REVEAL (Lumen) — three rings merge into one lime ring
// ============================================================
function KaleLevelRevealLumen() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 8200);
    return () => clearInterval(id);
  }, []);
  return <KaleLevelRevealLumenInner key={tick}/>;
}

function KaleLevelRevealLumenInner() {
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    const ts = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1900),
      setTimeout(() => setStage(3), 3100),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const pillars = [
    { left: 0,   level: 6, color: LumenPillars.cardio,    pct: '70%' },
    { left: 116, level: 5, color: LumenPillars.strength,  pct: '20%' },
    { left: 232, level: 7, color: LumenPillars.knowledge, pct: '10%' },
  ];

  return (
    <>
      <style>{`
        @keyframes lumlr-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes lumlr-glow { 0%,100% { filter: drop-shadow(0 0 28px rgba(204,250,125,0.45)); } 50% { filter: drop-shadow(0 0 54px rgba(204,250,125,0.75)); } }
        .lumlr-big { animation: lumlr-pulse 3.4s ease-in-out infinite, lumlr-glow 3.4s ease-in-out infinite; }
      `}</style>
      <LumenBackdrop gradientUpper={true}/>

      {/* glow */}
      <div style={{ position: 'absolute', top: '48%', left: '50%', width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(204,250,125,0.22) 0%, rgba(204,250,125,0) 60%)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        opacity: stage >= 2 ? 1 : 0, transition: 'opacity 700ms ease' }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 24px 0' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: Lumen.green, marginBottom: 30 }}>
            Your Longevity Level
          </div>

          {/* three small rings */}
          <div style={{ position: 'relative', width: 320, height: 120 }}>
            {pillars.map((p, i) => (
              <div key={i} style={{ position: 'absolute', left: p.left, top: 0,
                opacity: stage >= 2 ? 0 : 1,
                transform: stage >= 2 ? `translateX(${(1-i)*84}px) scale(0.5)` : 'translateX(0) scale(1)',
                transition: `all 900ms cubic-bezier(.5,.05,.3,1) ${i*100}ms` }}>
                <LumRing value={p.level} pct={p.level*10} size={86} stroke={5} accent={p.color} numColor={Lumen.cream}/>
                <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: p.color, letterSpacing: '0.16em', textAlign: 'center', opacity: stage >= 1 ? 1 : 0, transition: `opacity 500ms ${100+i*100}ms ease` }}>{p.pct}</div>
              </div>
            ))}
          </div>

          {/* big merged lime ring */}
          <div style={{ marginTop: 26, opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? 'scale(1)' : 'scale(0.6)', transition: 'all 620ms cubic-bezier(.2,.9,.3,1.2)' }}>
            <div className="lumlr-big">
              <LumRing value="6" pct={60} size={176} stroke={9}/>
            </div>
          </div>

          <h2 style={{ opacity: stage >= 3 ? 1 : 0, transition: 'opacity 600ms 200ms ease', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, lineHeight: 1.12, letterSpacing: '-0.025em', color: Lumen.cream, margin: '30px 0 10px', textAlign: 'center', maxWidth: 300 }}>
            <span style={{ color: Lumen.lime }}>Level 6.</span> You're in good shape.
          </h2>
          <div style={{ opacity: stage >= 3 ? 1 : 0, transition: 'opacity 600ms 260ms ease', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: '#3FD08B', fontSize: 12, fontWeight: 800 }}>
              <IconUp w={11} h={11} sw={3} stroke="#3FD08B"/> +1 from last cycle
            </span>
          </div>
          <p style={{ opacity: stage >= 3 ? 1 : 0, transition: 'opacity 600ms 320ms ease', color: Lumen.muted, fontSize: 14, lineHeight: 1.5, margin: 0, textAlign: 'center', maxWidth: 290 }}>
            And you've got a clear path to Level 7.
          </p>
        </div>

        <div style={{ padding: '0 26px 26px', opacity: stage >= 3 ? 1 : 0, transition: 'opacity 600ms 500ms ease' }}>
          <LumenButton>What this means for your health</LumenButton>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 10 · HEALTH YEARS (Lumen)
// ============================================================
function KaleHealthYearsLumen() {
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 26px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: Lumen.muted, letterSpacing: '0.16em' }}>LEVEL 6</span>
        </div>
        <div style={{ flex: 1, padding: '26px 28px 0', display: 'flex', flexDirection: 'column' }}>
          <LumEyebrow pillar="cardio" label="What this means"/>
          <LumHeadline size={38}>You've added <span style={{ color: Lumen.lime }}>healthy years</span>.</LumHeadline>
          <p style={{ marginTop: 12, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14.5, lineHeight: 1.5, color: Lumen.muted, maxWidth: 320 }}>
            At Level 6, here's your trajectory versus an inactive life.
          </p>

          {/* HERO — total healthy years */}
          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: Lumen.muted, marginBottom: 4 }}>Healthy years added</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 92, color: Lumen.lime, letterSpacing: '-0.045em', lineHeight: 0.82, fontVariantNumeric: 'tabular-nums' }}>+6.8</span>
              <span style={{ fontSize: 16, color: Lumen.muted, fontWeight: 600 }}>years</span>
            </div>
          </div>

          {/* breakdown — lifespan + healthspan underneath the total */}
          <div style={{ display: 'flex', marginTop: 22, borderTop: `1px solid ${Lumen.hair}`, borderBottom: `1px solid ${Lumen.hair}` }}>
            <div style={{ flex: 1, padding: '18px 0' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: Lumen.muted }}>Lifespan</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 34, color: Lumen.cream, letterSpacing: '-0.03em', lineHeight: 0.9 }}>+4.2</span>
                <span style={{ fontSize: 13, color: Lumen.muted, fontWeight: 600 }}>yrs</span>
              </div>
              <p style={{ fontSize: 12, color: Lumen.muted, lineHeight: 1.45, margin: '8px 0 0', maxWidth: 130 }}>Projected additional years of life.</p>
            </div>
            <div style={{ width: 1, background: Lumen.hair }}/>
            <div style={{ flex: 1, padding: '18px 0 18px 22px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: Lumen.muted }}>Healthspan</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 34, color: Lumen.cream, letterSpacing: '-0.03em', lineHeight: 0.9 }}>+6.8</span>
                <span style={{ fontSize: 13, color: Lumen.muted, fontWeight: 600 }}>yrs</span>
              </div>
              <p style={{ fontSize: 12, color: Lumen.muted, lineHeight: 1.45, margin: '8px 0 0', maxWidth: 130 }}>Projected healthy, active years.</p>
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <LumenRuleCaption align="left" color={Lumen.green} max={330} size={16}>
              Healthspan — the years you spend healthy and independent — is what really matters.
            </LumenRuleCaption>
          </div>

          {/* level 7 callout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${Lumen.hair}` }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 40, color: Lumen.lime, letterSpacing: '-0.04em', lineHeight: 0.9 }}>+0.9</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: Lumen.cream, fontWeight: 700, lineHeight: 1.35 }}>extra healthspan years at Level 7.</div>
              <div style={{ color: Lumen.muted, fontSize: 12, marginTop: 2 }}>That's a lot for one level.</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 24 }}>
            <LumenButton>See your first cycle rewards</LumenButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 11 · FIRST CYCLE REWARDS (Lumen)
// ============================================================
function KaleEarningsPreviewLumen() {
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ flex: 1, padding: '20px 28px 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <LumEyebrow pillar="knowledge" label="Your first cycle"/>
          <LumHeadline size={32}>Here's what you'll earn.</LumHeadline>

          {/* big points number */}
          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: LumenPillars.knowledge, marginBottom: 8 }}>Bank at your next assessment</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 92, color: Lumen.lime, letterSpacing: '-0.04em', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums' }}>486</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: Lumen.muted }}>Kalettes</span>
            </div>
          </div>

          {/* what Kalettes are for */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${Lumen.hair}` }}>
            <p style={{ color: Lumen.cream, fontSize: 15, lineHeight: 1.55, margin: 0, fontWeight: 600 }}>
              Spend Kalettes in the <span style={{ color: Lumen.lime, fontWeight: 800 }}>Kale Store</span> — on training gear, health screening and more.
            </p>
          </div>

          {/* higher levels earn more */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, background: 'rgba(204,250,125,0.08)', border: `1px solid rgba(204,250,125,0.22)` }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: 'rgba(204,250,125,0.16)', flexShrink: 0 }}>
              <IconUp w={16} h={16} sw={3} stroke={Lumen.lime}/>
            </span>
            <p style={{ color: Lumen.cream, fontSize: 14, lineHeight: 1.45, margin: 0, fontWeight: 600 }}>
              Reach higher levels to earn <span style={{ color: Lumen.lime, fontWeight: 800 }}>more back</span> each cycle.
            </p>
          </div>

          {/* timeline */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: Lumen.muted }}>Next assessment</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: Lumen.cream }}>11 weeks</span>
            </div>
            <div style={{ position: 'relative', height: 14 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 5, height: 5, borderRadius: 3, background: 'rgba(234,243,228,0.08)' }}/>
              <div style={{ position: 'absolute', left: 0, top: 5, height: 5, width: '6%', borderRadius: 3, background: Lumen.lime }}/>
              <div style={{ position: 'absolute', left: '4%', top: 0, width: 14, height: 14, borderRadius: '50%', background: Lumen.lime, transform: 'translateX(-50%)' }}/>
              <div style={{ position: 'absolute', right: 0, top: 1, width: 13, height: 13, borderRadius: 3, background: LumenPillars.strength }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: Lumen.muted }}>Today</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: LumenPillars.strength }}>Assessment</span>
            </div>
          </div>

          {/* important callout */}
          <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
            <span style={{ width: 2, alignSelf: 'stretch', background: LumenPillars.strength, flexShrink: 0 }}/>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: LumenPillars.strength, marginBottom: 5 }}>Important</div>
              <p style={{ color: Lumen.cream, fontSize: 13.5, lineHeight: 1.5, margin: 0, maxWidth: 300, fontWeight: 600 }}>
                Complete your next assessment to bank these points. Miss it and they reset — make it and you could level up.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '24px 0' }}>
            <LumenButton>Go to my home screen</LumenButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

Object.assign(window, {
  KaleKnowledgeResultsLumen, KaleLevelRevealLumen, KaleHealthYearsLumen, KaleEarningsPreviewLumen,
});
