/* eslint-disable */
// "Lumen" — consistent loader → result system for the three assessment pillars.
// Loader: the K-in-circle from screen 02 (brand-colour cycling glyph + spinning
// lime arc). Result: one shared template — Longevity Level on top, Relative
// Performance with a histogram, then the headline result, then what it takes to
// reach the next level. Reuses the Lumen system exported on window.

function lumOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ---------- Distribution histogram with the user's marker ----------
function LumenHistogram({ percentile = 90 }) {
  const N = 24;
  const bars = Array.from({ length: N }, (_, i) => {
    const x = (i + 0.5) / N;
    return Math.exp(-Math.pow((x - 0.5) / 0.2, 2) / 2);
  });
  const frac = Math.max(0.05, Math.min(0.96, percentile / 100));
  return (
    <div>
      <div style={{ position: 'relative', height: 88, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        {bars.map((h, i) => {
          const bf = (i + 0.5) / N;
          const on = bf <= frac;
          return <div key={i} style={{ flex: 1, height: `${16 + h * 84}%`, borderRadius: 2, background: on ? Lumen.lime : Lumen.track, opacity: on ? 1 : 0.5 }}/>;
        })}
        <div style={{ position: 'absolute', top: -7, bottom: 0, left: `${frac * 100}%`, width: 2, background: Lumen.cream, transform: 'translateX(-50%)' }}/>
        <div style={{ position: 'absolute', top: -22, left: `${frac * 100}%`, transform: 'translateX(-50%)', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 10, letterSpacing: '0.14em', color: Lumen.cream, whiteSpace: 'nowrap' }}>YOU</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10.5, color: Lumen.muted, fontWeight: 600, letterSpacing: '0.04em' }}>
        <span>Lower</span><span>Everyone your age</span><span>Higher</span>
      </div>
    </div>
  );
}

// ============================================================
// LOADER — K-in-circle, brand colours cycle, spinning lime arc
// ============================================================
function KaleResultLoaderLumen({ pillar = 'cardio', verb = 'run', sub }) {
  const [glyphColor, setGlyphColor] = React.useState(LUMEN_BRAND[0]);
  React.useEffect(() => {
    let ci = 0;
    const iv = setInterval(() => { ci = (ci + 1) % LUMEN_BRAND.length; setGlyphColor(LUMEN_BRAND[ci]); }, 260);
    return () => clearInterval(iv);
  }, []);
  const size = 248, stroke = 11, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const label = pillar.charAt(0).toUpperCase() + pillar.slice(1);
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
                strokeDasharray={`${c*0.16} ${c}`}
                style={{ transformOrigin: '50% 50%', animation: 'lumenSpin 1s linear infinite' }}/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LumenGlyph color={glyphColor} height={size * 0.3} animated={true}/>
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: Lumen.cream, letterSpacing: '-0.025em', lineHeight: 1.15, margin: '42px 0 10px', textAlign: 'center' }}>
            Analysing your {verb}…
          </h1>
          <p style={{ color: Lumen.muted, fontSize: 14, lineHeight: 1.55, textAlign: 'center', margin: 0, maxWidth: 280 }}>
            {sub || 'Crunching the numbers. This usually takes under a minute.'}
          </p>
        </div>
        <div style={{ padding: '0 28px 26px', display: 'flex', justifyContent: 'center' }}>
          <LumEyebrow pillar={pillar} label={label} step="Analysing"/>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}
function KaleCardioLoaderLumen()    { return <KaleResultLoaderLumen pillar="cardio"    verb="run"     sub="Reviewing your best qualifying run and estimating VO₂max."/>; }
function KaleStrengthLoaderLumen()  { return <KaleResultLoaderLumen pillar="strength"  verb="plank"   sub="Reviewing your video and logging your hold time."/>; }
function KaleKnowledgeLoaderLumen() { return <KaleResultLoaderLumen pillar="knowledge" verb="answers" sub="Scoring your quiz across all five topics."/>; }

// ============================================================
// RESULT — shared template for all three pillars
// ============================================================
function LumenResultPage({ pillar, level, levelUp, trend, trendDelta, levelNote, percentile, rpText,
                           resultHero, resultUnit, resultLabel, tiles = [],
                           nextLevel, nextActions = [], nextBtn }) {
  const accent = LumenPillars[pillar] || Lumen.green;
  const label = pillar.charAt(0).toUpperCase() + pillar.slice(1);
  const rs = 100, rstroke = 9, rr = (rs - rstroke) / 2, rc = 2 * Math.PI * rr;
  // up / same / down chip vs. last cycle
  const chipBase = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 800 };
  const trendChip = trend === 'up'
    ? <span style={{ ...chipBase, background: 'rgba(0,200,150,0.15)', color: '#3FD08B' }}><IconUp w={10} h={10} sw={3} stroke="#3FD08B"/> +{trendDelta || 1}</span>
    : trend === 'down'
    ? <span style={{ ...chipBase, background: 'rgba(232,130,110,0.16)', color: '#E8826E' }}><IconDown w={10} h={10} sw={3} stroke="#E8826E"/> {trendDelta || -1}</span>
    : trend === 'same'
    ? <span style={{ ...chipBase, background: 'rgba(234,243,228,0.08)', color: Lumen.muted }}>→ No change</span>
    : null;
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        {/* header */}
        <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: Lumen.cream, cursor: 'pointer', padding: 6, marginLeft: -6, opacity: 0.85 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <LumEyebrow pillar={pillar} label={label} step="Result"/>
          <div style={{ width: 32 }}/>
        </div>

        <div style={{ flex: 1, padding: '12px 26px 0', overflowY: 'auto' }}>
          {/* 1 · LONGEVITY LEVEL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, paddingBottom: 22, borderBottom: `1px solid ${Lumen.hair}` }}>
            <div style={{ position: 'relative', width: rs, height: rs, flexShrink: 0 }}>
              <svg width={rs} height={rs} style={{ position: 'absolute', inset: 0 }}>
                <circle cx={rs/2} cy={rs/2} r={rr} fill="none" stroke={Lumen.track} strokeWidth={rstroke}/>
                <circle cx={rs/2} cy={rs/2} r={rr} fill="none" stroke={Lumen.lime} strokeWidth={rstroke} strokeLinecap="round"
                  strokeDasharray={`${(level/10)*rc} ${rc}`} transform={`rotate(-90 ${rs/2} ${rs/2})`}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rs * 0.42, color: Lumen.lime, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{level}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: Lumen.muted }}>Longevity Level · {label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 40, color: Lumen.cream, letterSpacing: '-0.03em', lineHeight: 0.95 }}>Level {level}</span>
                {trendChip}
              </div>
              {levelNote && <div style={{ color: Lumen.muted, fontSize: 12.5, lineHeight: 1.4, marginTop: 6 }}>{levelNote}</div>}
            </div>
          </div>

          {/* 2 · RELATIVE PERFORMANCE */}
          <div style={{ paddingTop: 22, paddingBottom: 22, borderBottom: `1px solid ${Lumen.hair}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: Lumen.muted }}>Relative performance</span>
              <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: Lumen.lime, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{percentile}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: Lumen.muted, marginLeft: 1 }}>{lumOrdinal(percentile)}</span>
              </span>
            </div>
            <LumenHistogram percentile={percentile}/>
            <div style={{ marginTop: 16 }}>
              <LumenRuleCaption align="left" color={Lumen.green} max={330} size={16}>{rpText}</LumenRuleCaption>
            </div>
          </div>

          {/* 3 · YOUR RESULT */}
          <div style={{ paddingTop: 22 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: Lumen.muted, marginBottom: 10 }}>Your result</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 64, color: Lumen.lime, letterSpacing: '-0.04em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{resultHero}</span>
              {resultUnit && <span style={{ fontSize: 14, color: Lumen.muted, fontWeight: 600 }}>{resultUnit}</span>}
            </div>
            {resultLabel && <div style={{ color: Lumen.muted, fontSize: 13, lineHeight: 1.45, marginTop: 8 }}>{resultLabel}</div>}
            {tiles.length > 0 && (
              <div style={{ display: 'flex', marginTop: 18, borderTop: `1px solid ${Lumen.hair}`, borderBottom: `1px solid ${Lumen.hair}` }}>
                {tiles.map((t, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div style={{ width: 1, background: Lumen.hair }}/>}
                    <LumenStat label={t.label} value={t.value} unit={t.unit}/>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* 4 · NEXT LEVEL */}
          <div style={{ paddingTop: 24, paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, whiteSpace: 'nowrap' }}>Reach Level {nextLevel}</span>
              <span style={{ flex: 1, height: 1, background: Lumen.hair }}/>
            </div>
            {nextActions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: i < nextActions.length - 1 ? `1px solid ${Lumen.hair}` : 'none' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${accent}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconArrowRight w={11} h={11} stroke={accent} sw={2.6}/>
                </span>
                <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14.5, lineHeight: 1.4, color: Lumen.cream }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '18px 26px 26px' }}>
          <LumenButton>{nextBtn}</LumenButton>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function KaleCardioResultLumen() {
  return (
    <LumenResultPage
      pillar="cardio" level={6}
      trend="up" trendDelta={1}
      levelNote="Up from Level 5 last cycle."
      percentile={90} rpText="Fitter than 90% of men aged 35–40."
      resultHero="54" resultUnit="ml/kg·min" resultLabel="Estimated VO₂max — your strongest longevity signal."
      tiles={[
        { label: 'Best pace', value: '4:48', unit: '/km' },
        { label: 'Best run', value: '12.4km', unit: '14 Feb' },
        { label: 'Resting HR', value: '52', unit: 'bpm' },
      ]}
      nextLevel={7}
      nextActions={[
        'Add one Zone-2 long run each week',
        'Nudge your VO₂max past 56',
        'Keep the 80/20 easy-to-hard split',
      ]}
      nextBtn="Next — Strength"
    />
  );
}

function KaleStrengthResultLumen() {
  return (
    <LumenResultPage
      pillar="strength" level={5}
      trend="same"
      levelNote="Held at Level 5 — wall sits next cycle will push it."
      percentile={71} rpText="Stronger than 71% of women aged 35–40."
      resultHero="1:43" resultUnit="" resultLabel="Plank hold — video verified."
      tiles={[
        { label: 'Category', value: 'Good', unit: '' },
        { label: 'Level 6 at', value: '2:00', unit: 'hold' },
        { label: 'Best ever', value: '1:43', unit: '' },
      ]}
      nextLevel={6}
      nextActions={[
        'Hold the plank past 2:00',
        'Add the wall sit next cycle',
        'Train your core twice a week',
      ]}
      nextBtn="Next — Knowledge"
    />
  );
}

function KaleKnowledgeResultLumen() {
  return (
    <LumenResultPage
      pillar="knowledge" level={7}
      trend="up" trendDelta={1}
      levelNote="Up from Level 6 last cycle."
      percentile={68} rpText="Ahead of 68% of Kale members."
      resultHero="16/20" resultUnit="" resultLabel="Quiz score — General longevity."
      tiles={[
        { label: 'Accuracy', value: '80', unit: '%' },
        { label: 'Strongest', value: 'Exercise', unit: 'science' },
        { label: 'Focus', value: 'Nutrition', unit: '' },
      ]}
      nextLevel={8}
      nextActions={[
        'Score 18/20 next quarter',
        'Brush up on nutrition basics',
        'Read the weekly longevity briefs',
      ]}
      nextBtn="See your Longevity Level"
    />
  );
}

Object.assign(window, {
  LumenHistogram, KaleResultLoaderLumen,
  KaleCardioLoaderLumen, KaleStrengthLoaderLumen, KaleKnowledgeLoaderLumen,
  LumenResultPage, KaleCardioResultLumen, KaleStrengthResultLumen, KaleKnowledgeResultLumen,
});
