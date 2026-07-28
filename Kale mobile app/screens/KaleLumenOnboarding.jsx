/* eslint-disable */
// "Lumen" onboarding — screens 03–08 in the Lumen direction.
// Reuses the Lumen system exported from KaleLumen.jsx (palette, glyph, backdrop,
// rule-caption, button, stat). Keeps the airy, bold reference language: teal
// surface with the curved glass divider, giant lime hero numerals in ring
// gauges, pillar identity carried by a small coloured eyebrow.

// ---------- Shared Lumen onboarding helpers ----------
function LumEyebrow({ pillar = 'cardio', label, step }) {
  const color = LumenPillars[pillar] || Lumen.green;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 12px ${color}` }}/>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color }}>
        {label}{step ? <span style={{ color: Lumen.muted }}> · {step}</span> : null}
      </span>
    </div>
  );
}

function LumHeadline({ children, size = 40 }) {
  return (
    <h1 style={{
      fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: size, lineHeight: 1.0,
      letterSpacing: '-0.035em', color: Lumen.cream, margin: '14px 0 0',
    }}>{children}</h1>
  );
}

function LumBack() {
  return (
    <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
      <button style={{ background: 'transparent', border: 'none', color: Lumen.cream, cursor: 'pointer', padding: 6, marginLeft: -6, opacity: 0.85 }}>
        <IconArrowLeft w={20} h={20}/>
      </button>
    </div>
  );
}

// Number-in-ring, lime hero. accent controls the fill colour (defaults lime).
function LumRing({ value, suffix, pct = 100, size = 200, stroke = 10, accent, numColor }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const fill = accent || Lumen.lime;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={Lumen.track} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={fill}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${(pct/100)*c} ${c}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
        <span style={{ alignSelf: 'center', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.42, color: numColor || Lumen.lime, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {suffix ? <span style={{ alignSelf: 'center', marginBottom: size * 0.06, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.13, color: Lumen.muted }}>{suffix}</span> : null}
      </div>
    </div>
  );
}

// ============================================================
// 03 · STRENGTH INTRO (Lumen)
// ============================================================
function KaleStrengthIntroLumen() {
  const steps = [
    'Find a clear space and set your phone to record.',
    'Elbows under shoulders, body in one straight line.',
    'Hold as long as you can, then stop recording.',
    'Upload the video — we review it and log your time.',
  ];
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumBack/>
        <div style={{ flex: 1, padding: '14px 28px 0', display: 'flex', flexDirection: 'column' }}>
          <LumEyebrow pillar="strength" label="Strength" step="Test 2 of 3"/>
          <LumHeadline size={44}>Time for your <span style={{ color: Lumen.lime }}>plank</span>.</LumHeadline>
          <p style={{ marginTop: 14, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.5, color: Lumen.muted, maxWidth: 310 }}>
            The plank is our baseline strength test — simple, proven, and a reliable snapshot of core endurance.
          </p>

          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: LumenPillars.strength, marginBottom: 4 }}>How it works</div>
            {steps.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '15px 0', borderBottom: `1px solid ${Lumen.hair}` }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: LumenPillars.strength, width: 16, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{i+1}</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14.5, lineHeight: 1.4, color: Lumen.cream }}>{line}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 18, fontSize: 12.5, lineHeight: 1.55, color: Lumen.muted }}>
            Later assessments add a wall sit and — eventually — press-ups. Your strength test evolves as you progress.
          </p>

          <div style={{ marginTop: 'auto', paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <LumenButton>Upload plank video</LumenButton>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button style={{ background: 'transparent', border: 'none', color: Lumen.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4 }}>Learn correct plank form ↗</button>
            </div>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 04 · PLANK ANALYSING (Lumen) — glyph loader → % counts up
// ============================================================
function KaleStrengthProcessingLumen() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 6600);
    return () => clearInterval(id);
  }, []);
  return <KaleStrengthProcessingLumenInner key={tick}/>;
}

function KaleStrengthProcessingLumenInner() {
  const [pct, setPct] = React.useState(0);
  const [glyphColor, setGlyphColor] = React.useState(LUMEN_BRAND[0]);
  React.useEffect(() => {
    let ci = 0;
    const colorIv = setInterval(() => { ci = (ci + 1) % LUMEN_BRAND.length; setGlyphColor(LUMEN_BRAND[ci]); }, 280);
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / 4200);
      const e = 1 - Math.pow(1 - t, 2.2);
      setPct(Math.round(e * 100));
      if (t < 1) raf = requestAnimationFrame(step); else clearInterval(colorIv);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); clearInterval(colorIv); };
  }, []);

  const size = 248, stroke = 10, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const done = pct >= 100;
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
          <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={Lumen.track} strokeWidth={stroke}/>
              <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={Lumen.lime}
                strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${(pct/100)*c} ${c}`}
                transform={`rotate(-90 ${size/2} ${size/2})`}/>
            </svg>
            {/* folding glyph loader */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: done ? 0 : 1, transform: done ? 'scale(.7)' : 'scale(1)', transition: 'opacity .35s ease, transform .35s ease' }}>
              <LumenGlyph key={glyphColor} color={glyphColor} height={size * 0.28} animated={true}/>
            </div>
            {/* % */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
              <span style={{ alignSelf: 'center', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.3, color: Lumen.lime, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums', opacity: pct > 4 ? 1 : 0, transition: 'opacity .3s ease' }}>{pct}</span>
              <span style={{ alignSelf: 'center', marginBottom: size * 0.04, fontSize: size * 0.1, color: Lumen.muted, opacity: pct > 4 ? 1 : 0 }}>%</span>
            </div>
          </div>

          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: Lumen.cream, letterSpacing: '-0.025em', lineHeight: 1.15, margin: '40px 0 10px', textAlign: 'center' }}>
            Analysing your plank…
          </h1>
          <p style={{ color: Lumen.muted, fontSize: 14, lineHeight: 1.55, textAlign: 'center', margin: 0, maxWidth: 270 }}>
            Reviewing your video and logging your hold time. Usually under a minute.
          </p>
        </div>
        <div style={{ padding: '0 28px 26px', display: 'flex', justifyContent: 'center' }}>
          <LumEyebrow pillar="strength" label="Strength" step="Test 2 of 3"/>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 05 · STRENGTH RESULTS (Lumen)
// ============================================================
function KaleStrengthResultsLumen() {
  const benchmarks = [
    ['Beginner', '< 30s', false],
    ['Average', '60–90s', false],
    ['Good', '90–120s', true],
    ['Excellent', '2 min +', false],
  ];
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumBack/>
        <div style={{ flex: 1, padding: '12px 26px 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <LumEyebrow pillar="strength" label="Strength" step="Result"/>

          {/* Hero hold time */}
          <div style={{ textAlign: 'center', margin: '26px 0 6px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 104, color: Lumen.lime, lineHeight: 0.82, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>1:43</span>
            </div>
            <div style={{ marginTop: 12, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: Lumen.muted }}>Plank hold · video verified</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <LumenRuleCaption align="left" color={Lumen.green} max={300} size={20}>
              Stronger than 71% of women aged 35–40.
            </LumenRuleCaption>
          </div>

          {/* Benchmarks */}
          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: Lumen.muted, marginBottom: 2 }}>Benchmarks</div>
            {benchmarks.map(([cat, val, you], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i < benchmarks.length - 1 ? `1px solid ${Lumen.hair}` : 'none' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontWeight: you ? 700 : 600, fontSize: 15, color: you ? Lumen.cream : Lumen.muted }}>
                  {cat}
                  {you && <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: Lumen.bgDark, background: Lumen.lime, padding: '2px 7px', borderRadius: 999 }}>YOU</span>}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: you ? Lumen.cream : Lumen.muted, fontVariantNumeric: 'tabular-nums' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Strength level */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 26 }}>
            <LumRing value="5" suffix="/10" pct={50} size={104} stroke={8}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 21, color: Lumen.cream, letterSpacing: '-0.02em' }}>Strength Level 5</div>
              <p style={{ color: Lumen.muted, fontSize: 13, lineHeight: 1.5, margin: '6px 0 0' }}>A strong baseline. Wall sits in cycle 3 will sharpen this further.</p>
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '24px 0' }}>
            <LumenButton>Next — Knowledge</LumenButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 06 · KNOWLEDGE INTRO (Lumen)
// ============================================================
function KaleKnowledgeIntroLumen() {
  const future = ['Exercise science', 'Nutrition', 'Sleep & recovery', 'Mental health', 'Biology & genetics'];
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumBack/>
        <div style={{ flex: 1, padding: '14px 28px 0', display: 'flex', flexDirection: 'column' }}>
          <LumEyebrow pillar="knowledge" label="Knowledge" step="Test 3 of 3"/>
          <LumHeadline size={40}>Quick <span style={{ color: Lumen.lime }}>knowledge</span> check.</LumHeadline>
          <p style={{ marginTop: 14, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.5, color: Lumen.muted, maxWidth: 310 }}>
            One topic per quarter. Today we cover the basics — and build from there.
          </p>

          {/* Featured topic */}
          <div style={{ marginTop: 26, paddingTop: 22, paddingBottom: 22, borderTop: `1px solid ${Lumen.hair}`, borderBottom: `1px solid ${Lumen.hair}` }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: LumenPillars.knowledge }}>Onboarding</div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: Lumen.cream, letterSpacing: '-0.03em', margin: '10px 0 0', lineHeight: 1.05 }}>General longevity</h2>
            <p style={{ color: Lumen.muted, fontSize: 13.5, lineHeight: 1.5, margin: '10px 0 0', maxWidth: 300 }}>
              Lifespan vs healthspan, the science of VO₂max, and why training fights ageing.
            </p>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 18, fontSize: 12.5, color: Lumen.cream, fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: LumenPillars.knowledge }}/>20 questions</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: LumenPillars.knowledge }}/>~5 min</span>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: Lumen.muted, marginTop: 22, marginBottom: 12 }}>Coming in future quarters</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {future.map(t => (
              <span key={t} style={{ padding: '7px 13px', borderRadius: 999, border: `1px dashed ${Lumen.hair}`, color: Lumen.muted, fontSize: 12.5, fontWeight: 600 }}>{t}</span>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 24 }}>
            <LumenButton>Start quiz</LumenButton>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 07 · QUIZ QUESTION (Lumen) — correct / wrong variants
// ============================================================
function KaleQuizQuestionLumen({ answer = 'correct' }) {
  const correctIndex = 1, wrongPick = 3;
  const selected = answer === 'correct' ? correctIndex : wrongPick;
  const options = [
    { letter: 'A', text: 'Resting heart rate' },
    { letter: 'B', text: 'VO₂max' },
    { letter: 'C', text: 'Body weight' },
    { letter: 'D', text: 'Step count' },
  ];
  const RED = '#E8826E'; // coral, used as the "wrong" tone
  return (
    <>
      <style>{`@keyframes lumq-advance { from { width: 100%; } to { width: 0%; } }`}</style>
      <LumenBackdrop/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        {/* progress */}
        <div style={{ padding: '8px 26px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: Lumen.muted, letterSpacing: '0.16em' }}>QUESTION 12 / 20</span>
            <button style={{ background: 'transparent', border: 'none', color: Lumen.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>End quiz</button>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(234,243,228,0.10)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '60%', background: LumenPillars.knowledge, borderRadius: 2 }}/>
          </div>
        </div>

        <div style={{ flex: 1, padding: '28px 26px 0', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 27, lineHeight: 1.2, letterSpacing: '-0.02em', color: Lumen.cream, margin: 0 }}>
            Which single metric is the strongest predictor of long-term mortality risk?
          </h1>

          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map((o, i) => {
              const isPicked = selected === i;
              const isCorrect = i === correctIndex;
              let color = null;
              if (isPicked && isCorrect) color = Lumen.lime;
              else if (isPicked && !isCorrect) color = RED;
              else if (!isPicked && isCorrect && answer === 'wrong') color = Lumen.lime;
              const tileBg = color ? `${color}22` : 'rgba(234,243,228,0.05)';
              const tileBorder = color ? `1.5px solid ${color}` : `1px solid ${Lumen.hair}`;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: tileBg, border: tileBorder, borderRadius: 14, padding: '15px 16px' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: color || 'rgba(234,243,228,0.08)', color: color ? Lumen.bgDark : Lumen.muted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{o.letter}</div>
                  <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: Lumen.cream }}>{o.text}</div>
                  {color && (
                    <span style={{ flexShrink: 0 }}>
                      {isCorrect
                        ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill={Lumen.lime}/><path d="M5 10.5L8.5 14L15 7" stroke={Lumen.bgDark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill={RED}/><path d="M6 6l8 8M14 6l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* explanation */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{ width: 2, alignSelf: 'stretch', background: answer === 'correct' ? Lumen.green : RED, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: answer === 'correct' ? Lumen.green : RED }}>
                {answer === 'correct' ? 'Exactly right.' : 'Not quite.'}
              </div>
              <div style={{ color: Lumen.muted, fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>
                {answer === 'correct'
                  ? <>VO₂max is the single strongest predictor of all-cause mortality across decades of longitudinal studies.</>
                  : <>The correct answer is <strong style={{ color: Lumen.lime, fontWeight: 800 }}>VO₂max</strong> — the strongest predictor of all-cause mortality across decades of studies.</>}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: Lumen.muted, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
              Next question in 2s
            </div>
            <div style={{ height: 3, borderRadius: 999, background: 'rgba(234,243,228,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: answer === 'correct' ? Lumen.lime : RED, animation: 'lumq-advance 2s linear infinite', borderRadius: 999, transformOrigin: 'left' }}/>
            </div>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function KaleQuizQuestionLumenWrong() { return <KaleQuizQuestionLumen answer="wrong"/>; }

Object.assign(window, {
  LumEyebrow, LumHeadline, LumBack, LumRing,
  KaleStrengthIntroLumen, KaleStrengthProcessingLumen, KaleStrengthResultsLumen,
  KaleKnowledgeIntroLumen, KaleQuizQuestionLumen, KaleQuizQuestionLumenWrong,
});
