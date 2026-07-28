/* eslint-disable */
// "Lumen" — NEW FEATURE: Your Running Years.
// A living longevity surface. Hero = how many good years of your sport you have
// ahead (a band, not a point) — a number that GROWS when you train. Guardrails:
// project capability you can grow (never a countdown), show a band, sport-first
// with independence as a quiet floor, mute the do-nothing curve, motivating not
// morbid. Reuses LP / LumAppBg / LumHeader / LumTabBar from KaleLumenApp.jsx.

// ---------- Trajectory chart — the proof ----------
// Two curves from "you are here": bright keep-training, muted do-nothing. The
// shaded gap is "the years you're choosing to keep". Quiet threshold floors.
function RunYearsTrajectory({ ageNow = 44, vo2Now = 54, estimated = false, declining = false, goal }) {
  const W = 320, H = 208, padL = 8, padR = 10, padT = 12, padB = 26;
  const ageMin = ageNow, ageMax = 86, vMin = 12, vMax = 58;
  const X = a => padL + ((a - ageMin) / (ageMax - ageMin)) * (W - padL - padR);
  const Y = v => padT + (1 - (Math.max(vMin, Math.min(vMax, v)) - vMin) / (vMax - vMin)) * (H - padT - padB);
  // capability decline models (VO₂max ml/kg/min)
  const keepC = declining ? 0.62 : 0.45, keepC2 = 0.0035;
  const keep = a => { const t = a - ageNow; return vo2Now - keepC * t - keepC2 * t * t; };
  const none = a => { const t = a - ageNow; return vo2Now - 0.9 * t - 0.009 * t * t; };
  const ages = [];
  for (let a = ageMin; a <= ageMax; a += 1.5) ages.push(a);
  const toPath = fn => ages.map((a, i) => (i ? 'L' : 'M') + X(a).toFixed(1) + ' ' + Y(fn(a)).toFixed(1)).join(' ');
  const keepPath = toPath(keep), nonePath = toPath(none);
  const gap = `${ages.map(a => X(a).toFixed(1) + ' ' + Y(keep(a)).toFixed(1)).join(' L ')}` +
              ` L ${[...ages].reverse().map(a => X(a).toFixed(1) + ' ' + Y(none(a)).toFixed(1)).join(' L ')} Z`;
  // age where keep-curve crosses "still running" (27)
  let crossAge = ageMax;
  for (let a = ageNow; a <= ageMax; a += 0.5) { if (keep(a) <= 27) { crossAge = a; break; } }
  const gx = goal ? X(goal.age) : 0, gy = goal ? Y(keep(goal.age)) : 0;
  const thresholds = [
    { v: 27, label: 'Still running' },
    { v: 24, label: 'Active life' },
    { v: 18, label: 'Independence' },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="ryGap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LP.lime} stopOpacity="0.26"/>
          <stop offset="1" stopColor={LP.lime} stopOpacity="0.04"/>
        </linearGradient>
      </defs>
      {/* threshold floors — quiet */}
      {thresholds.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={Y(t.v)} y2={Y(t.v)} stroke="rgba(234,243,228,0.12)" strokeWidth="1" strokeDasharray="2 4"/>
          <text x={padL + 2} y={Y(t.v) - 4} fill={LP.fgMuted} fontSize="9.5" fontWeight="600" fontFamily="var(--font-sans)" letterSpacing="0.04em">{t.label}</text>
        </g>
      ))}
      {/* the gap you keep */}
      <path d={gap} fill="url(#ryGap)"/>
      {/* do-nothing — muted */}
      <path d={nonePath} fill="none" stroke={LP.track} strokeWidth="2" strokeDasharray="3 4" opacity="0.8"/>
      {/* keep training — bright */}
      <path d={keepPath} fill="none" stroke={LP.lime} strokeWidth={estimated ? 2.5 : 3} strokeLinecap="round" strokeDasharray={estimated ? '7 5' : 'none'}/>
      {/* mid-70s crossing marker */}
      <line x1={X(crossAge)} x2={X(crossAge)} y1={Y(58)} y2={Y(27)} stroke="rgba(234,243,228,0.18)" strokeWidth="1" strokeDasharray="2 3"/>
      <text x={X(crossAge)} y={Y(58) - 3} textAnchor="middle" fill={LP.lime} fontSize="10" fontWeight="800" fontFamily="var(--font-sans)">~mid-70s</text>
      {/* your goal, mapped onto the curve */}
      {goal && (
        <g>
          <line x1={gx} x2={gx} y1={gy} y2={Y(27)} stroke="rgba(204,250,125,0.45)" strokeWidth="1" strokeDasharray="2 3"/>
          <circle cx={gx} cy={gy} r="5" fill={LP.bgDark} stroke={LP.lime} strokeWidth="2.5"/>
          <path d={`M${gx} ${gy - 9} l 11 3.5 l -11 3.5 Z`} fill={LP.lime}/>
          <text x={gx + 3} y={gy + 20} textAnchor="middle" fill={LP.lime} fontSize="9" fontWeight="800" fontFamily="var(--font-sans)" letterSpacing="0.08em">GOAL</text>
        </g>
      )}
      {/* you are here */}
      <circle cx={X(ageNow)} cy={Y(vo2Now)} r="5.5" fill={LP.lime}/>
      <circle cx={X(ageNow)} cy={Y(vo2Now)} r="10" fill="none" stroke={LP.lime} strokeOpacity="0.4" strokeWidth="1.5"/>
      <text x={X(ageNow) + 12} y={Y(vo2Now) - 6} fill={LP.fg} fontSize="10.5" fontWeight="700" fontFamily="var(--font-sans)">You are here</text>
      {/* x axis ages */}
      {[ageNow, 55, 65, 75, 85].map((a, i) => (
        <text key={i} x={X(a)} y={H - 6} textAnchor="middle" fill={LP.fgMuted} fontSize="9.5" fontWeight="600" fontFamily="var(--font-sans)">{a}</text>
      ))}
    </svg>
  );
}

function RYChip({ label, value, accent }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, padding: '7px 12px', borderRadius: 999, background: 'rgba(234,243,228,0.06)', border: `1px solid ${LP.hairline}` }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 13, color: accent || LP.cream || LP.fg, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: LP.fgMuted, letterSpacing: '0.02em' }}>{label}</span>
    </div>
  );
}

// Mini sparkline for the live tiles
function RYSpark({ data, color, baseline }) {
  const W = 96, H = 34, min = Math.min(...data), max = Math.max(...data), rng = (max - min) || 1;
  const X = i => (i / (data.length - 1)) * W;
  const Y = v => 4 + (1 - (v - min) / rng) * (H - 8);
  const path = data.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
      {baseline != null && <line x1="0" x2={W} y1={Y(baseline)} y2={Y(baseline)} stroke="rgba(234,243,228,0.18)" strokeWidth="1" strokeDasharray="2 3"/>}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={X(data.length - 1)} cy={Y(data[data.length - 1])} r="2.6" fill={color}/>
    </svg>
  );
}

function RYLadderTile({ tier, title, value, unit, note, noteColor, spark, sparkColor, baseline }) {
  return (
    <div style={{ flex: 1, padding: 16, borderRadius: 16, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}` }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: LP.fgMuted }}>{tier}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: LP.fg, marginTop: 4 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 34, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
          <span style={{ fontSize: 11, color: LP.fgMuted, fontWeight: 600 }}>{unit}</span>
        </div>
        {spark && <RYSpark data={spark} color={sparkColor || LP.lime} baseline={baseline}/>}
      </div>
      {note && <div style={{ fontSize: 11.5, color: noteColor || LP.fgMuted, fontWeight: 600, marginTop: 10, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ============================================================
// RUNNING YEARS — main (Garmin-rich)
// ============================================================
function KaleRunningYearsLumen() {
  const [goalAge, setGoalAge] = React.useState(70);
  const ageNow = 44;
  // keep-curve crosses "still running" (~age 77 for this profile)
  const stillRunningTo = 77;
  const spare = stillRunningTo - goalAge;
  const status = spare >= 5
    ? { tone: 'good', label: 'On track — with years to spare', bg: 'rgba(0,200,150,0.16)', fg: '#3FD08B' }
    : spare >= 0
    ? { tone: 'good', label: 'On track — keep training', bg: 'rgba(0,200,150,0.16)', fg: '#3FD08B' }
    : { tone: 'warn', label: 'A stretch — keep pushing', bg: 'rgba(245,233,78,0.16)', fg: LP.yellow };
  const dynamicCopy = spare >= 0
    ? <>You're on track to still be running at <span style={{ color: LP.lime, fontWeight: 800 }}>{goalAge}</span> — about <span style={{ color: LP.lime, fontWeight: 800 }}>{spare} {spare === 1 ? 'year' : 'years'}</span> to spare.</>
    : <>Running at <span style={{ color: LP.lime, fontWeight: 800 }}>{goalAge}</span> is a stretch from here — keep training and it comes within reach.</>;
  return (
    <>
      <style>{`
        .ry-range { -webkit-appearance:none; appearance:none; height:5px; border-radius:999px; background:rgba(234,243,228,0.16); outline:none; }
        .ry-range::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:24px; height:24px; border-radius:50%; background:#CCFA7D; border:3px solid #04413E; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.3); }
        .ry-range::-moz-range-thumb { width:24px; height:24px; border-radius:50%; background:#CCFA7D; border:3px solid #04413E; cursor:pointer; }
      `}</style>
      <LumAppBg peak={120}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ padding: '16px 22px 8px', flex: 1, overflowY: 'auto' }}>
          {/* HERO — Future altitude */}
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: LP.fgMuted }}>Your Running Years</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.fgMuted, letterSpacing: '-0.02em' }}>~</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 94, color: LP.lime, letterSpacing: '-0.045em', lineHeight: 0.8, fontVariantNumeric: 'tabular-nums' }}>{stillRunningTo - ageNow}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: LP.fg, maxWidth: 130, lineHeight: 1.1 }}>strong running years ahead</span>
          </div>
          <p style={{ marginTop: 14, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.5, color: LP.fg, maxWidth: 330 }}>
            On track to still be lacing up in your <span style={{ color: LP.lime, fontWeight: 800 }}>mid-70s</span> — old enough to still do the things you love.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <RYChip label="VO₂max" value="54" accent={LP.lime}/>
            <RYChip label="percentile" value="90th"/>
          </div>

          {/* YOUR GOAL — interactive: drag the age, watch it move */}
          <div style={{ marginTop: 18, padding: 18, borderRadius: 16, background: 'rgba(204,250,125,0.08)', border: `1px solid rgba(204,250,125,0.22)` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: LP.lime, marginBottom: 6 }}>Your goal</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 19, color: LP.fg, letterSpacing: '-0.015em', lineHeight: 1.15 }}>Run a 10k with my grandkids</div>
                <div style={{ fontSize: 12.5, color: LP.fgMuted, fontWeight: 600, marginTop: 4 }}>at age {goalAge} · {goalAge - ageNow} years from now</div>
              </div>
              <button style={{ background: 'transparent', border: `1px solid ${LP.hairline}`, borderRadius: 999, color: LP.fg, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, padding: '6px 12px', cursor: 'pointer', flexShrink: 0 }}>Change</button>
            </div>

            {/* the slider — modify your goal */}
            <input className="ry-range" type="range" min={55} max={85} value={goalAge} onChange={e => setGoalAge(+e.target.value)}
              style={{ width: '100%', marginTop: 16, accentColor: LP.lime }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: LP.fgMuted, fontWeight: 600 }}>
              <span>at 55</span><span>at 70</span><span>at 85</span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '5px 11px', borderRadius: 999, background: status.bg, color: status.fg, fontSize: 12, fontWeight: 800 }}>
              {status.tone === 'good'
                ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3FD08B"/><path d="M4.5 8.2L7 10.5L11.5 5.5" stroke="#04413E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <span style={{ width: 13, height: 13, borderRadius: '50%', background: LP.yellow, display: 'inline-block' }}/>}
              {status.label}
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 13, lineHeight: 1.5, color: LP.fg, fontWeight: 600 }}>{dynamicCopy}</p>
          </div>

          {/* TRAJECTORY — the proof, goal marker driven by the slider */}
          <div style={{ marginTop: 20, padding: 18, borderRadius: 18, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: LP.fg }}>If you keep training</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: LP.fgMuted }}>fitness vs. age</span>
            </div>
            <RunYearsTrajectory ageNow={ageNow} vo2Now={54} goal={{ age: goalAge, label: 'Run a 10k with my grandkids' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 600, color: LP.fg }}><span style={{ width: 14, height: 3, borderRadius: 2, background: LP.lime }}/> Keep training</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 600, color: LP.fgMuted }}><span style={{ width: 14, height: 0, borderTop: `2px dashed ${LP.track}` }}/> Do nothing</span>
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 11.5, lineHeight: 1.5, color: LP.fgMuted, fontWeight: 600 }}>
              Everyone's VO₂max falls with age — training changes how <span style={{ color: LP.fg }}>fast</span>, not <span style={{ color: LP.fg }}>whether</span>. The gap is the years you keep.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: 'rgba(204,250,125,0.08)', border: `1px solid rgba(204,250,125,0.2)` }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 0.9 }}>+14</span>
              <span style={{ fontSize: 13, color: LP.fg, fontWeight: 600, lineHeight: 1.4 }}>extra years still running — <span style={{ color: LP.lime, fontWeight: 800 }}>the years you're choosing to keep</span>.</span>
            </div>
          </div>

          {/* LADDER — Now + Capacity */}
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <RYLadderTile tier="Now" title="Resting HR" value="52" unit="bpm"
              spark={[57, 56, 55, 56, 54, 53, 52]} sparkColor={LP.lime} baseline={56}
              note={<span><span style={{ color: '#3FD08B', fontWeight: 800 }}>3 below</span> your baseline</span>}/>
            <RYLadderTile tier="Capacity" title="Recovery & reserve" value="32" unit="bpm drop"
              spark={[24, 26, 27, 29, 30, 31, 32]} sparkColor={LP.lime}
              note={<span>Your engine's range is <span style={{ color: '#3FD08B', fontWeight: 800 }}>widening</span></span>}/>
          </div>

          {/* FAQ — explain the floors + the honest decline */}
          <div style={{ marginTop: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Good to know</div>
            <KAFaq items={[
              { q: 'Does VO₂max always fall with age?', a: "Yes — for everyone, VO₂max declines as we age. Training doesn't stop that, but it dramatically slows the rate. The gap between the two lines is the years you keep by staying active." },
              { q: 'What does “active life” mean?', a: "The fitness level where everyday things — hiking, playing with the kids, carrying shopping upstairs — stay comfortable. Above this line, life stays full." },
              { q: 'And “independence”?', a: "The floor where daily tasks get hard without help. We keep it quietly on the chart because staying well above it, for as long as possible, is the whole point." },
              { q: 'How do you project this?', a: "From your VO₂max, resting heart rate and recovery trend, mapped against large longevity datasets. It's a band, not a promise — your training moves it." },
            ]}/>
          </div>
        </div>
        <LumTabBar active="home"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// RUNNING YEARS — Strava-thin (estimated)
// ============================================================
function KaleRunningYearsEstimatedLumen() {
  return (
    <>
      <LumAppBg peak={120}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ padding: '16px 22px 8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: LP.fgMuted }}>Your Running Years</span>
            <span style={{ padding: '3px 9px', borderRadius: 999, background: 'rgba(245,233,78,0.16)', color: LP.yellow, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}>ESTIMATED</span>
          </div>
          {/* band hero */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 74, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.82, fontVariantNumeric: 'tabular-nums' }}>24–30</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: LP.fg, maxWidth: 120, lineHeight: 1.1 }}>running years ahead</span>
          </div>
          <p style={{ marginTop: 14, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14.5, lineHeight: 1.5, color: LP.fg, maxWidth: 330 }}>
            A rough projection from your Strava runs. We've widened the band because we're missing some data.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <RYChip label="VO₂max" value="~48" accent={LP.yellow}/>
            <RYChip label="fitness age" value="~38"/>
            <RYChip label="Level" value="5"/>
          </div>

          <div style={{ marginTop: 20, padding: 18, borderRadius: 18, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: LP.fg }}>If you keep training</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: LP.yellow }}>estimated range</span>
            </div>
            <RunYearsTrajectory ageNow={46} vo2Now={48} estimated={true}/>
          </div>

          {/* nudge toward richer data */}
          <div style={{ marginTop: 14, padding: 18, borderRadius: 16, background: 'rgba(0,200,150,0.08)', border: `1px solid rgba(0,200,150,0.22)` }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16, color: LP.fg, letterSpacing: '-0.015em' }}>Sharpen your projection</div>
            <p style={{ color: LP.fgMuted, fontSize: 13, lineHeight: 1.5, margin: '6px 0 14px' }}>Connect Garmin for native VO₂max, HRV and recovery — and we'll narrow the band to a single confident number.</p>
            <button style={{ width: '100%', height: 50, borderRadius: 9999, background: LP.mint, color: '#003A38', border: 'none', fontWeight: 700, fontSize: 14.5, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Connect Garmin <IconArrowRight w={16} h={16}/></button>
          </div>
          <div style={{ height: 14 }}/>
        </div>
        <LumTabBar active="home"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// RUNNING YEARS — emotional intro (why we train)
// ============================================================
function KaleRunningYearsIntroLumen() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: LP.bgDark }}/>
      {/* full-bleed photo, top two-thirds */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '64%', background: `url('assets/runner.jpg') center 28%/cover no-repeat` }}/>
      {/* teal wash + bottom fade so type stays legible */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,60,58,0.30) 0%, rgba(0,60,58,0.05) 26%, rgba(0,55,54,0.55) 52%, ${LP.bgDark} 74%)` }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,40,40,0.45) 0%, rgba(0,40,40,0) 22%)' }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 22, fontWeight: 300, cursor: 'pointer', padding: 6 }}>✕</button>
        </div>

        <div style={{ flex: 1 }}/>

        {/* emotional copy, lower third */}
        <div style={{ padding: '0 28px 26px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: LP.lime, marginBottom: 14 }}>Your Running Years</div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 38, lineHeight: 1.04, letterSpacing: '-0.035em', color: LP.fg, margin: 0 }}>
            We don't train for the <span style={{ color: LP.lime }}>numbers</span>.
          </h1>
          <p style={{ marginTop: 16, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.5, color: 'rgba(234,243,228,0.82)', maxWidth: 340 }}>
            We train for the people we want to keep showing up for. The 10k with the grandkids. The hike you've always promised. The moments still ahead — and the years to reach them.
          </p>
          <p style={{ marginTop: 18, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, lineHeight: 1.45, color: LP.fg }}>
            Let's make them real. <span style={{ color: LP.lime }}>Start with what you're running for.</span>
          </p>

          <div style={{ marginTop: 24 }}>
            <button style={{ width: '100%', height: 58, borderRadius: 9999, background: LP.lime, color: '#003A38', border: 'none', fontWeight: 700, fontSize: 16.5, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              Set your goal <IconArrowRight w={18} h={18}/>
            </button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// RUNNING YEARS — set your goal (the moment + the age)
// ============================================================
function KaleRunningYearsGoalLumen() {
  const goals = [
    { id: 'grandkids', label: 'Run a 10k with my grandkids', icon: 'run' },
    { id: 'kids', label: 'Keep up with my kids', icon: 'play' },
    { id: 'cycling', label: 'Still cycling the hills', icon: 'bike' },
    { id: 'altitude', label: 'Hike at altitude', icon: 'mtn' },
    { id: 'wedding', label: 'Dance at the wedding', icon: 'heart' },
    { id: 'surf', label: 'Still surfing', icon: 'wave' },
  ];
  const [sel, setSel] = React.useState('grandkids');
  const [age, setAge] = React.useState(70);
  const yrs = age - 44;

  const Icon = ({ id, on }) => {
    const c = on ? '#003A38' : LP.fg, sw = 1.9;
    const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (id === 'run')  return <svg {...common}><circle cx="13" cy="4.5" r="1.6"/><path d="M5 21l3.5-5 2-4 3 2 1 5M10.5 12l-2-3 4-2 2.5 2.5 2.5.5"/></svg>;
    if (id === 'play') return <svg {...common}><circle cx="9" cy="5" r="2"/><path d="M5 21l2-7-2-2 3-3 3 2 2 2M16 21v-6l3-2"/></svg>;
    if (id === 'mtn')  return <svg {...common}><path d="M3 20h18L14 6l-3 5-2-2-6 11Z"/></svg>;
    if (id === 'bike') return <svg {...common}><circle cx="6" cy="17" r="3.2"/><circle cx="18" cy="17" r="3.2"/><path d="M6 17l4-7h5l-3 7M9.5 7h3"/></svg>;
    if (id === 'heart')return <svg {...common}><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20Z"/></svg>;
    return <svg {...common}><path d="M3 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2M4 12c4-7 12-7 16 0"/></svg>;
  };

  return (
    <>
      <LumenStyles/>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: LP.fg, cursor: 'pointer', padding: 6, marginLeft: -6, opacity: 0.85 }}><IconArrowLeft w={20} h={20}/></button>
          <span style={{ fontSize: 12, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.1em' }}>Step 1 of 2</span>
        </div>

        <div style={{ padding: '14px 26px 0', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: LP.lime }}>Your Running Years</div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 34, lineHeight: 1.02, letterSpacing: '-0.03em', color: LP.fg, margin: '12px 0 0' }}>
            Picture the <span style={{ color: LP.lime }}>moment</span>.
          </h1>
          <p style={{ marginTop: 12, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14.5, lineHeight: 1.5, color: LP.fgMuted, maxWidth: 320 }}>
            Choose what you're training to still be doing — and when. We'll map it onto your years.
          </p>

          {/* goal chips */}
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goals.map(g => {
              const on = g.id === sel;
              return (
                <button key={g.id} onClick={() => setSel(g.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                  padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                  background: on ? LP.lime : 'rgba(234,243,228,0.05)',
                  border: `1.5px solid ${on ? LP.lime : LP.hairline}`,
                }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: on ? 'rgba(0,58,56,0.12)' : 'rgba(234,243,228,0.06)' }}>
                    <Icon id={g.icon} on={on}/>
                  </span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15.5, color: on ? '#003A38' : LP.fg }}>{g.label}</span>
                  {on && <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#003A38"/><path d="M5.5 10.2L8.5 13L14.5 6.5" stroke={LP.lime} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
              );
            })}
          </div>

          {/* age */}
          <div style={{ marginTop: 22, padding: 18, borderRadius: 16, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: LP.fgMuted }}>I want to do this at</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 54, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{age}</span>
              <span style={{ fontSize: 14, color: LP.fg, fontWeight: 700 }}>years old</span>
              <span style={{ marginLeft: 'auto', fontSize: 12.5, color: LP.fgMuted, fontWeight: 600 }}>{yrs} years from now</span>
            </div>
            <input className="ry-range" type="range" min={55} max={85} value={age} onChange={e => setAge(+e.target.value)}
              style={{ width: '100%', marginTop: 14, accentColor: LP.lime }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: LP.fgMuted, fontWeight: 600 }}>
              <span>55</span><span>70</span><span>85</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '22px 0 26px' }}>
            <button style={{ width: '100%', height: 58, borderRadius: 9999, background: LP.lime, color: '#003A38', border: 'none', fontWeight: 700, fontSize: 16.5, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              See my Running Years <IconArrowRight w={18} h={18}/>
            </button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// RUNNING YEARS — pre-sync empty state
// ============================================================
function KaleRunningYearsEmptyLumen() {
  return (
    <>
      <LumenStyles/>
      <LumenBackdrop gradientUpper={true}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 132, height: 132, marginBottom: 8 }}>
            <svg width="132" height="132" style={{ position: 'absolute', inset: 0 }}>
              <circle cx="66" cy="66" r="61" fill="none" stroke={LP.track} strokeWidth="6" strokeDasharray="3 7" strokeLinecap="round"/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LumenGlyph color={LP.lime} height={54}/>
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: LP.fg, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '22px 0 0', maxWidth: 300 }}>
            See your <span style={{ color: LP.lime }}>running years</span>.
          </h1>
          <p style={{ marginTop: 14, color: LP.fgMuted, fontSize: 15, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 300 }}>
            Connect a device and we'll turn your runs into a living projection of the years you've got ahead — and how to keep them.
          </p>
        </div>
        <div style={{ padding: '0 26px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{ width: '100%', height: 56, borderRadius: 9999, background: LP.lime, color: '#003A38', border: 'none', fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>Connect Garmin or Strava <IconArrowRight w={18} h={18}/></button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', color: LP.fgMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 8, textDecoration: 'underline', textUnderlineOffset: 4 }}>Enter resting HR manually</button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// RUNNING YEARS — declining trend (framed as the dial, never an alarm)
// ============================================================
function KaleRunningYearsDecliningLumen() {
  return (
    <>
      <LumAppBg peak={120}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ padding: '16px 22px 8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: LP.fgMuted }}>Your Running Years</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.fgMuted }}>~</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 94, color: LP.lime, letterSpacing: '-0.045em', lineHeight: 0.8, fontVariantNumeric: 'tabular-nums' }}>22</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: LP.fg, maxWidth: 130, lineHeight: 1.1 }}>running years ahead</span>
          </div>
          <p style={{ marginTop: 14, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.5, color: LP.fg, maxWidth: 330 }}>
            This dipped a little this quarter — and it's a dial you control. A few easy runs a week moves it straight back up.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <RYChip label="VO₂max" value="46" accent={LP.lime}/>
            <RYChip label="fitness age" value="41"/>
            <RYChip label="Level" value="5"/>
          </div>

          <div style={{ marginTop: 20, padding: 18, borderRadius: 18, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: LP.fg }}>Your dial right now</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: LP.fgMuted }}>fitness vs. age</span>
            </div>
            <RunYearsTrajectory ageNow={48} vo2Now={46} declining={true}/>
            <div style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: 'rgba(0,200,150,0.08)', border: `1px solid rgba(0,200,150,0.2)` }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.lime, letterSpacing: '-0.03em', lineHeight: 0.9 }}>+6</span>
              <span style={{ fontSize: 13, color: LP.fg, fontWeight: 600, lineHeight: 1.4 }}>years back within reach — <span style={{ color: LP.lime, fontWeight: 800 }}>two easy runs a week</span> does it.</span>
            </div>
          </div>

          <div style={{ marginTop: 14, marginBottom: 14 }}>
            <button style={{ width: '100%', height: 54, borderRadius: 9999, background: LP.mint, color: '#003A38', border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Build my easy-run week <IconArrowRight w={16} h={16}/></button>
          </div>
        </div>
        <LumTabBar active="home"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

Object.assign(window, {
  RunYearsTrajectory, RYChip, RYSpark, RYLadderTile,
  KaleRunningYearsIntroLumen, KaleRunningYearsGoalLumen,
  KaleRunningYearsLumen, KaleRunningYearsEstimatedLumen,
  KaleRunningYearsEmptyLumen, KaleRunningYearsDecliningLumen,
});
