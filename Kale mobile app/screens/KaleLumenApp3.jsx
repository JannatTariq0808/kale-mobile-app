/* eslint-disable */
// "Lumen" reskin — second assessment flow + empty/error states.
// Reuses LP / LPILLAR / LumAppBg / LumHeader / LumTabBar / LumHeroRing (KaleLumenApp.jsx),
// the Lumen backdrop + button (KaleLumen.jsx), and content helpers from KaleApp/KaleApp2.

// ============================================================
// 21 · ASSESSMENT REMINDER (Lumen)
// ============================================================
function KaleAssessReminderLumen() {
  return (
    <>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <button style={{ background: 'transparent', border: 'none', color: LP.fgMuted, fontSize: 22, fontWeight: 300, cursor: 'pointer', padding: 6 }}>✕</button>
        </div>
        <div style={{ padding: '20px 26px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(232,130,110,0.16)', color: LP.coral, fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', width: 'fit-content', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: LP.coral }}/> Assessment due
          </span>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 50, lineHeight: 0.98, letterSpacing: '-0.035em', color: LP.fg, margin: '24px 0 14px' }}>Cycle 5 <span style={{ color: LP.lime }}>assessment</span>.</h1>
          <p style={{ color: LP.fgMuted, fontSize: 16, lineHeight: 1.45, margin: 0, maxWidth: 340 }}>12 weeks since your last one. We're ready to look at your fitness and update your Longevity Level.</p>

          <div style={{ marginTop: 28, padding: 20, borderRadius: 16, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>You're in line for</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 64, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>567</span>
              <span style={{ fontSize: 14, color: LP.fgMuted, fontWeight: 600 }}>Kalettes</span>
            </div>
            <p style={{ color: LP.fgMuted, fontSize: 13, lineHeight: 1.5, margin: '10px 0 0' }}>You may also <strong style={{ color: LP.fg, fontWeight: 700 }}>level up</strong> to Level 7 — worth around £8.50/yr off your premium.</p>
          </div>

          <div style={{ marginTop: 12, padding: 18, borderRadius: 16, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}`, boxShadow: `inset 4px 0 0 0 ${LP.coral}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={LP.coral} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              <p style={{ color: LP.fg, fontSize: 13, lineHeight: 1.5, margin: 0, fontWeight: 600, flex: 1 }}>Skip this and you lose your 486 banked points.</p>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <LumenButton>Start assessment</LumenButton>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: LP.fgMuted, fontSize: 13, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 4, padding: 4 }}>Remind me later</button>
            </div>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 22 · CARDIO REVIEW v2 (Lumen)
// ============================================================
function KaleCardioReviewV2Lumen() {
  return (
    <>
      <LumAppBg peak={118}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader back page="2 / 4"/>
        <div style={{ padding: '18px 22px 0', flex: 1, overflowY: 'auto' }}>
          <LumDot pillar="cardio" label="Cardio"/>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, lineHeight: 1.02, letterSpacing: '-0.03em', color: LP.fg, margin: '12px 0 18px' }}>12 weeks of <span style={{ color: LP.lime }}>work</span>.</h1>

          <K3Card padding={20} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Last cycle</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 36, color: LP.fgMuted, letterSpacing: '-0.04em', lineHeight: 0.95, marginTop: 8 }}>5</div>
                <div style={{ fontSize: 11, color: LP.fgMuted, fontWeight: 600, marginTop: 4 }}>Cardio Level</div>
              </div>
              <div style={{ width: 1, background: LP.hairline, alignSelf: 'stretch' }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Now</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 56, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.95 }}>6</span>
                  <span style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(0,200,150,0.18)', color: LP.mint, fontSize: 10, fontWeight: 800 }}>+1</span>
                </div>
                <div style={{ fontSize: 11, color: LP.fgMuted, fontWeight: 600, marginTop: 4 }}>Cardio Level</div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 10, background: 'rgba(204,250,125,0.08)', border: `1px solid rgba(204,250,125,0.22)` }}>
              <p style={{ color: LP.fg, fontSize: 13, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>Your best <span style={{ color: LPILLAR.cardio, fontWeight: 800 }}>VO₂max estimate</span> climbed from 51.4 to <span style={{ color: LP.lime, fontWeight: 800 }}>54.2</span> ml/kg/min.</p>
            </div>
          </K3Card>

          <K3Card padding={20} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>What you did</div>
            <K3MetricRow label="Qualifying runs" v1="14" v2="22" diff="+8"/>
            <K3MetricRow label="Total distance" v1="84 km" v2="142 km" diff="+58 km"/>
            <K3MetricRow label="Avg pace" v1="5:04" v2="4:51" diff="13s faster"/>
            <K3MetricRow label="Z2 time / wk" v1="32%" v2="52%" diff="much better" last/>
          </K3Card>

          <div style={{ marginTop: 16, marginBottom: 14 }}>
            <LumenButton>Next — Strength</LumenButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 23 · PLANK COMPARE (Lumen)
// ============================================================
function KalePlankCompareLumen() {
  return (
    <>
      <LumAppBg peak={118}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader back page="3 / 4"/>
        <div style={{ padding: '18px 22px 0', flex: 1, overflowY: 'auto' }}>
          <LumDot pillar="strength" label="Strength"/>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, lineHeight: 1.02, letterSpacing: '-0.03em', color: LP.fg, margin: '12px 0 6px' }}>New <span style={{ color: LP.lime }}>personal best</span>.</h1>
          <p style={{ color: LP.fgMuted, fontSize: 14, lineHeight: 1.5, margin: '0 0 22px', maxWidth: 320 }}>You held the plank longer than ever before. A 25-second jump.</p>

          <K3Card padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <K3PlankBar label="Last cycle" time="1:18" pctOfMax={78/180} muted/>
              <K3PlankBar label="Today" time="1:43" pctOfMax={103/180} accent={LPILLAR.strength} badge="+25 sec"/>
            </div>
          </K3Card>

          <K3Card style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>How you compare now</div>
            <div style={{ position: 'relative', height: 14, marginBottom: 10 }}>
              <div style={{ position: 'absolute', top: 4, left: 0, right: 0, height: 6, borderRadius: 999, background: `linear-gradient(90deg, rgba(234,243,228,0.12) 0%, ${LPILLAR.strength}55 50%, ${LPILLAR.strength} 100%)` }}/>
              <div style={{ position: 'absolute', top: 0, left: '74%', width: 14, height: 14, borderRadius: '50%', background: LP.fg, border: `2px solid ${LPILLAR.strength}`, transform: 'translateX(-50%)', boxShadow: `0 0 16px ${LPILLAR.strength}` }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: LP.fgMuted, fontWeight: 600 }}>
              <span>Beginner</span><span>Average</span><span>Excellent</span>
            </div>
            <p style={{ color: LP.fg, fontSize: 13, lineHeight: 1.5, margin: '14px 0 0', fontWeight: 600 }}>You jumped from Good into top-tier territory for your age group.</p>
          </K3Card>

          <K3Card padding={22} style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <LumHeroRing value="6" pct={57} size={92} stroke={7} accent={LPILLAR.strength}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Strength Level</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 40, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 1 }}>6</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: LP.mint, fontSize: 11, fontWeight: 800 }}><IconUp w={10} h={10} sw={3}/> +1</span>
                </div>
                <p style={{ color: LP.fgMuted, fontSize: 12, lineHeight: 1.5, margin: '8px 0 0' }}>Up from Strength Level 5 last cycle.</p>
              </div>
            </div>
          </K3Card>

          <div style={{ marginTop: 16, marginBottom: 14 }}>
            <LumenButton>Next — Knowledge</LumenButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 24 · LEVEL UP FINALE (Lumen) — 06 → 07
// ============================================================
function KaleLevelUpFinaleLumen() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 7000);
    return () => clearInterval(id);
  }, []);
  return <KaleLevelUpFinaleLumenInner key={tick}/>;
}
function KaleLevelUpFinaleLumenInner() {
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    const ts = [setTimeout(() => setStage(1), 500), setTimeout(() => setStage(2), 2000)];
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <>
      <style>{`@keyframes lumlu-pulse { 0%,100% { transform: scale(1);} 50% { transform: scale(1.04);} }`}</style>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', top: '40%', left: '50%', width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, rgba(204,250,125,0.30) 0%, rgba(204,250,125,0) 60%)', transform: 'translate(-50%, -50%)', pointerEvents: 'none', opacity: stage >= 2 ? 1 : 0, transition: 'opacity 700ms ease' }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 3 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.1em' }}>4 / 4</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: LP.lime, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 14 }}>You levelled up</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 110, lineHeight: 0.85, color: LP.fgMuted, letterSpacing: '-0.04em', opacity: 0.5, transform: stage >= 1 ? 'translateX(0)' : 'translateX(40px)', transition: 'all 600ms cubic-bezier(.5,.05,.3,1)' }}>06</span>
            <span style={{ opacity: stage >= 1 ? 1 : 0, transition: 'all 500ms 200ms ease' }}><IconArrowRight w={30} h={30} stroke={LP.lime} sw={2.5}/></span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 200, lineHeight: 0.82, color: LP.lime, letterSpacing: '-0.04em', textShadow: stage >= 2 ? '0 0 60px rgba(204,250,125,0.5)' : 'none', animation: stage >= 2 ? 'lumlu-pulse 3s ease-in-out infinite' : 'none', opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? 'scale(1)' : 'scale(0.4)', filter: stage >= 2 ? 'blur(0)' : 'blur(8px)', transition: 'all 700ms cubic-bezier(.2,.9,.3,1.2)' }}>07</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: LP.fg, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '36px 0 12px', maxWidth: 320, opacity: stage >= 2 ? 1 : 0, transition: 'opacity 600ms 200ms ease' }}><span style={{ color: LP.lime }}>+0.9 years</span> of healthspan banked.</h2>
          <p style={{ color: LP.fgMuted, fontSize: 15, lineHeight: 1.55, margin: 0, maxWidth: 300, opacity: stage >= 2 ? 1 : 0, transition: 'opacity 600ms 360ms ease' }}>Your premium drops by <strong style={{ color: LP.fg, fontWeight: 700 }}>£8.50/yr</strong>. And you've banked <strong style={{ color: LP.fg, fontWeight: 700 }}>567 Kalettes</strong>.</p>
        </div>
        <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: 12, opacity: stage >= 2 ? 1 : 0, transition: 'opacity 600ms 500ms ease' }}>
          <LumenButton>See what changed</LumenButton>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: LP.fgMuted, fontSize: 14, fontWeight: 600, padding: 8 }}>Share progress</button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 26 · REWARDS EMPTY (Lumen)
// ============================================================
function KaleRewardsEmptyLumen() {
  const steps = [{ t: 'Welcome screen', done: true }, { t: 'Cardio review', done: true }, { t: 'Plank video upload', done: false, accent: LP.coral }, { t: 'Knowledge quiz', done: false, accent: LP.yellow }];
  return (
    <>
      <LumAppBg peak={150}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ padding: '18px 22px 16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: LP.fgMuted }}>Rewards</div>
          <div style={{ marginTop: 14, padding: 26, borderRadius: 18, background: 'rgba(234,243,228,0.04)', border: `1px dashed ${LP.hairline}`, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(204,250,125,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={LP.lime} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 27, color: LP.fg, letterSpacing: '-0.025em', marginTop: 16, lineHeight: 1.1 }}>Your points unlock at your first assessment.</div>
            <p style={{ color: LP.fgMuted, fontSize: 14, lineHeight: 1.5, margin: '12px auto 0', maxWidth: 280 }}>Complete the three pillars and you'll start earning <strong style={{ color: LP.fg, fontWeight: 700 }}>Kalettes</strong> every quarter.</p>
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>To unlock</div>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 3 ? `1px solid ${LP.hairline}` : 'none' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: s.done ? LP.mint : 'rgba(234,243,228,0.05)', border: s.done ? 'none' : `1.5px solid ${s.accent || LP.hairline}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.done && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8L9 2.5" stroke="#003A38" strokeWidth="2" strokeLinecap="round"/></svg>}
                </div>
                <span style={{ fontSize: 14, color: s.done ? LP.fgMuted : LP.fg, fontWeight: 600, textDecoration: s.done ? 'line-through' : 'none' }}>{s.t}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22 }}><LumenButton>Resume assessment</LumenButton></div>
        </div>
        <LumTabBar active="rewards"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 27 · ACTIVITY LOG EMPTY (Lumen)
// ============================================================
function KaleActivityEmptyLumen() {
  return (
    <LumFitnessShell active="cardio" subactive="log">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 10px', textAlign: 'center', minHeight: 380 }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'rgba(204,250,125,0.10)', border: `1px dashed rgba(204,250,125,0.4)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={LP.lime} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: LP.fg, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0, maxWidth: 280 }}>No qualifying activities yet.</h2>
        <p style={{ color: LP.fgMuted, fontSize: 14, lineHeight: 1.55, margin: '12px 0 0', maxWidth: 300 }}>Sync a run or ride from Garmin or Strava — <strong style={{ color: LP.fg, fontWeight: 700 }}>runs from 3 km</strong>, or <strong style={{ color: LP.fg, fontWeight: 700 }}>rides from 10 min with power &amp; heart rate</strong> — and it'll show up here.</p>
        <button style={{ marginTop: 22, padding: '12px 22px', borderRadius: 9999, background: 'transparent', color: LP.fg, border: `1px solid ${LP.hairline}`, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Check connections</button>
      </div>
    </LumFitnessShell>
  );
}

// ============================================================
// 28 · SYNC ERROR (Lumen)
// ============================================================
function KaleSyncErrorLumen() {
  return (
    <>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader back/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(232,130,110,0.12)', border: `1.5px solid rgba(232,130,110,0.4)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={LP.coral} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: LP.coral, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 22 }}>Sync paused</div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: LP.fg, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '12px 0 12px', maxWidth: 300 }}>We've lost contact with <span style={{ color: LP.coral }}>Garmin</span>.</h1>
          <p style={{ color: LP.fgMuted, fontSize: 14, lineHeight: 1.55, margin: 0, maxWidth: 300 }}>Garmin signed you out about <strong style={{ color: LP.fg, fontWeight: 700 }}>3 days ago</strong>. Your last reading was 11 May. Reconnect to keep your cycle on track.</p>
          <div style={{ marginTop: 22, padding: '16px 18px', borderRadius: 12, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}`, display: 'flex', gap: 22, textAlign: 'left' }}>
            <div><div style={{ fontSize: 10, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Last sync</div><div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: LP.fg, marginTop: 4 }}>11 May · 7:42 am</div></div>
            <div><div style={{ fontSize: 10, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Missing days</div><div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: LP.coral, marginTop: 4 }}>3</div></div>
          </div>
        </div>
        <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{ width: '100%', height: 56, borderRadius: 9999, background: LP.coral, color: '#3a1410', border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>Reconnect Garmin <IconArrowRight w={18} h={18}/></button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: LP.fgMuted, fontSize: 14, fontWeight: 600, padding: 8 }}>I'll do it later</button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 29 · ASSESSMENT MISSED (Lumen)
// ============================================================
function KaleAssessMissedLumen() {
  return (
    <>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <button style={{ background: 'transparent', border: 'none', color: LP.fgMuted, fontSize: 22, fontWeight: 300, cursor: 'pointer', padding: 6 }}>✕</button>
        </div>
        <div style={{ padding: '24px 26px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(232,130,110,0.18)', color: LP.coral, fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', width: 'fit-content', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: LP.coral }}/> Cycle 5 · Missed
          </span>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, lineHeight: 1.02, letterSpacing: '-0.035em', color: LP.fg, margin: '20px 0 14px' }}>You missed this <span style={{ color: LP.coral }}>assessment</span>.</h1>
          <p style={{ color: LP.fgMuted, fontSize: 15, lineHeight: 1.5, margin: 0, maxWidth: 340 }}>Your 567 banked points have reset and your Longevity Level is paused at Level 6 until your next cycle.</p>

          <div style={{ marginTop: 24, padding: 22, borderRadius: 14, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}`, display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Lost</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.coral, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>567</span><span style={{ fontSize: 12, color: LP.fgMuted, fontWeight: 600 }}>pts</span></div>
            </div>
            <div style={{ width: 1, background: LP.hairline, alignSelf: 'stretch', margin: '0 14px' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Level</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 1 }}>6</span><span style={{ fontSize: 11, color: LP.fgMuted, fontWeight: 600 }}>paused</span></div>
            </div>
            <div style={{ width: 1, background: LP.hairline, alignSelf: 'stretch', margin: '0 14px' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Next</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.fg, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>12</span><span style={{ fontSize: 11, color: LP.fgMuted, fontWeight: 600 }}>weeks</span></div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: '18px 20px', borderRadius: 14, background: 'rgba(204,250,125,0.08)', border: `1px solid rgba(204,250,125,0.22)` }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: LP.lime, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>The good news</div>
            <p style={{ color: LP.fg, fontSize: 14, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>Your fitness doesn't reset. Keep training and you'll bank an even bigger payout next cycle.</p>
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <LumenButton>Go to my home</LumenButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

Object.assign(window, {
  KaleAssessReminderLumen, KaleCardioReviewV2Lumen, KalePlankCompareLumen, KaleLevelUpFinaleLumen,
  KaleRewardsEmptyLumen, KaleActivityEmptyLumen, KaleSyncErrorLumen, KaleAssessMissedLumen,
});
