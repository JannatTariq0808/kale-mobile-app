/* eslint-disable */
// "Forest" — a fresh design direction for the Kale app.
// Departs from the Athlete-app reskin: dark surfaces, editorial typography,
// hairline tables instead of cards, the Longevity Level as a single massive numeral.

// ---------- Local UI primitives for the Forest direction ----------
const ForestPalette = {
  bg: '#082B25', // a touch deeper than --kale-dark for full-screen surfaces
  bgRaised: '#0D4239', // raised surface / panel
  mint: 'var(--kale-mint)',
  fg: '#F2EFE5', // warm cream, not pure white
  fgMuted: 'rgba(242,239,229,0.55)',
  fgFaint: 'rgba(242,239,229,0.30)',
  hairline: 'rgba(242,239,229,0.10)',
  coral: 'var(--kale-coral)'
};

function ForestStatusBar({ time = '9:41' }) {
  return (
    <div className="statusbar" style={{ color: ForestPalette.fg, opacity: 0.85 }}>
      <span>{time}</span>
      <span className="statusbar-icons">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M1 4a11 11 0 0 1 14 0" /><path d="M3.5 6.5a7.5 7.5 0 0 1 9 0" /><path d="M6 9a4 4 0 0 1 4 0" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" opacity="0.6" /><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" /><rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.6" /></svg>
      </span>
    </div>);

}

function ForestHomeIndicator({ light = true }) {
  return (
    <div className="home-indicator" style={{
      background: light ? ForestPalette.fg : 'var(--kale-dark)',
      opacity: light ? 0.7 : 0.6
    }} />);

}

// Tiny eyebrow with mint accent bar
function Eyebrow({ children, color }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        display: 'inline-block', width: 24, height: 2,
        background: color || ForestPalette.mint
      }} />
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: ForestPalette.mint
      }}>{children}</span>
    </div>);

}

// ---------- 1) Onboarding A — Welcome / Train for longevity ----------
// Editorial split: photo hero on top, dark content surface below. Generous
// type, no overlap, single clear CTA.
function ForestOnboard() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />

      {/* Hero photo — top 52% of the canvas */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '52%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `url('assets/runner.jpg') center/cover no-repeat` }}/>
        {/* fade into the dark surface below */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(8,43,37,0) 35%, rgba(8,43,37,0.7) 75%, rgba(8,43,37,1) 100%)',
        }}/>
        {/* watermark glyph in the corner */}
        <img src="assets/kale-watermark.svg" alt="" aria-hidden="true" style={{
          position: 'absolute', top: -40, right: -60,
          width: 220, height: 'auto', opacity: 0.35, mixBlendMode: 'overlay',
        }}/>
      </div>

      {/* Status bar + top chrome floats on the photo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3 }}>
        <ForestStatusBar />
        <div style={{ padding: '8px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Wordmark tone="white" size={22}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em' }}>01 / 04</span>
        </div>
      </div>

      {/* Content surface */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <div style={{ flex: 1 }}/>
        <div style={{ padding: '0 28px 0', display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>Welcome to Kale</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 52, lineHeight: 0.97,
            letterSpacing: '-0.035em', color: ForestPalette.fg,
            margin: '14px 0 0',
          }}>
            Train <em style={{ color: ForestPalette.mint, fontStyle: 'italic', fontWeight: 800 }}>for</em> longevity.
          </h1>

          <p style={{
            marginTop: 18, color: ForestPalette.fgMuted, fontSize: 16, lineHeight: 1.5,
            maxWidth: 320,
          }}>
            Life insurance that rewards the years you put into your health. Connect a wearable, earn your Longevity Level, save up to <strong style={{ color: ForestPalette.fg, fontWeight: 700 }}>20% on your premium</strong>.
          </p>

          <div style={{ marginTop: 28, paddingBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={{
              flex: 1, height: 56, borderRadius: 9999, background: ForestPalette.mint, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Get started <IconArrowRight w={18} h={18}/></button>
            <button style={{
              background: 'transparent', border: 'none', color: ForestPalette.fg,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
              textUnderlineOffset: 4,
            }}>Log in</button>
          </div>

          <ForestPageDots active={0} total={4}/>
        </div>
        <ForestHomeIndicator />
      </div>
    </>
  );
}

// ---------- 1b) Onboarding A2 — How it works (3 numbered steps) ----------
function ForestOnboard2() {
  const steps = [
    { n: '01', t: 'Connect a wearable',  d: 'Link Strava, Garmin, Apple Watch — we read fitness signals, never your messages.' },
    { n: '02', t: 'Earn your level',     d: 'A single Longevity Level from 1 to 10 that reflects your cardio, strength and recovery.' },
    { n: '03', t: 'Save on your premium', d: 'Move more, level up, pay less. Up to 20% off compared with standard life cover.' },
  ];
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <img src="assets/kale-watermark.svg" alt="" aria-hidden="true" style={{
        position: 'absolute', bottom: -80, left: -80,
        width: 360, height: 'auto', opacity: 0.07,
        pointerEvents: 'none', transform: 'rotate(6deg)',
      }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Wordmark tone="white" size={22}/>
          <button style={{ background: 'transparent', border: 'none', color: ForestPalette.fgMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Skip</button>
        </div>

        <div style={{ padding: '36px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>How Kale works</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, lineHeight: 1.02,
            letterSpacing: '-0.035em', color: ForestPalette.fg,
            margin: '14px 0 0', maxWidth: 320,
          }}>
            Three steps to <em style={{ color: ForestPalette.mint, fontStyle: 'italic', fontWeight: 800 }}>cheaper</em> cover.
          </h1>

          <div style={{ marginTop: 28 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 18, padding: '18px 0',
                borderTop: `1px solid ${ForestPalette.hairline}`,
                ...(i === steps.length - 1 ? { borderBottom: `1px solid ${ForestPalette.hairline}` } : {}),
              }}>
                <div style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28,
                  color: ForestPalette.mint, letterSpacing: '-0.04em',
                  width: 48, flexShrink: 0, lineHeight: 1,
                }}>{s.n}</div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18,
                    color: ForestPalette.fg, letterSpacing: '-0.015em', lineHeight: 1.25,
                  }}>{s.t}</div>
                  <p style={{ color: ForestPalette.fgMuted, fontSize: 14, lineHeight: 1.5, margin: '6px 0 0' }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 12 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999, background: ForestPalette.mint, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Continue <IconArrowRight w={18} h={18}/></button>
            <ForestPageDots active={1} total={4}/>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ---------- 1c) Onboarding A3 — Your Longevity Level (1 → 10 scale) ----------
function ForestOnboard3() {
  const userLevel = 7;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Wordmark tone="white" size={22}/>
          <button style={{ background: 'transparent', border: 'none', color: ForestPalette.fgMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Skip</button>
        </div>

        <div style={{ padding: '32px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>Your Longevity Level</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 40, lineHeight: 1.02,
            letterSpacing: '-0.035em', color: ForestPalette.fg,
            margin: '14px 0 0', maxWidth: 320,
          }}>
            One number, <em style={{ color: ForestPalette.mint, fontStyle: 'italic', fontWeight: 800 }}>1 to 10</em>.
          </h1>
          <p style={{ marginTop: 14, color: ForestPalette.fgMuted, fontSize: 15, lineHeight: 1.5, maxWidth: 320 }}>
            We blend cardio, strength and recovery into a single Longevity Level. Most members earn between 5 and 8.
          </p>

          {/* 1 → 10 scale */}
          <div style={{ marginTop: 36, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 96 }}>
              {Array.from({length: 10}).map((_, i) => {
                const n = i + 1;
                const h = 18 + (n / 10) * 78;
                const isUser = n === userLevel;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: '100%', height: h, borderRadius: 3,
                      background: isUser ? ForestPalette.mint : 'rgba(0,200,150,0.18)',
                      boxShadow: isUser ? '0 0 24px rgba(0,200,150,0.55)' : 'none',
                    }}/>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {Array.from({length: 10}).map((_, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: i + 1 === userLevel ? ForestPalette.fg : ForestPalette.fgFaint,
                  fontVariantNumeric: 'tabular-nums',
                }}>{i + 1}</div>
              ))}
            </div>
          </div>

          {/* Highlight callout */}
          <div style={{
            marginTop: 32, padding: '20px 22px',
            borderRadius: 14, background: 'rgba(0,200,150,0.10)',
            border: `1px solid rgba(0,200,150,0.25)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 56,
                color: ForestPalette.mint, letterSpacing: '-0.05em', lineHeight: 0.85,
              }}>07</span>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: ForestPalette.fg }}>Iris, fellow Kaler</div>
                <div style={{ color: ForestPalette.fgMuted, fontSize: 13, marginTop: 2 }}>Saves £240 / year</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 12 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999, background: ForestPalette.mint, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Continue <IconArrowRight w={18} h={18}/></button>
            <ForestPageDots active={2} total={4}/>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ---------- 1d) Onboarding A4 — Save up to 20% ----------
function ForestOnboard4() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      {/* mint glow behind the number */}
      <div style={{
        position: 'absolute', top: '32%', left: '50%',
        width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.28) 0%, rgba(0,200,150,0) 60%)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Wordmark tone="white" size={22}/>
          <button style={{ background: 'transparent', border: 'none', color: ForestPalette.fgMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Skip</button>
        </div>

        <div style={{ padding: '40px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>What you'll save</Eyebrow>

          <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-start' }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 200, lineHeight: 0.82,
              color: ForestPalette.fg, letterSpacing: '-0.06em',
              textShadow: '0 0 60px rgba(0,200,150,0.4)',
            }}>20</span>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 80, lineHeight: 1,
              color: ForestPalette.mint, letterSpacing: '-0.04em', marginTop: 18,
            }}>%</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 32, lineHeight: 1.05,
            letterSpacing: '-0.025em', color: ForestPalette.fg,
            margin: '6px 0 0', maxWidth: 320,
          }}>
            Off your premium when you train.
          </h1>
          <p style={{ marginTop: 12, color: ForestPalette.fgMuted, fontSize: 15, lineHeight: 1.55, maxWidth: 320 }}>
            Members at Level 7 save an average of <strong style={{ color: ForestPalette.fg, fontWeight: 700 }}>£240 per year</strong>. The fitter you are, the less you pay.
          </p>

          {/* Two compact stats */}
          <div style={{ display: 'flex', gap: 28, marginTop: 28, paddingTop: 22, borderTop: `1px solid ${ForestPalette.hairline}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Avg saving</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: ForestPalette.fg, letterSpacing: '-0.02em', marginTop: 4 }}>£240<span style={{ color: ForestPalette.fgMuted, fontSize: 14, fontWeight: 600 }}>/yr</span></div>
            </div>
            <div style={{ width: 1, background: ForestPalette.hairline }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Setup</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: ForestPalette.fg, letterSpacing: '-0.02em', marginTop: 4 }}>2 mins</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 12 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999, background: ForestPalette.mint, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Get my quote <IconArrowRight w={18} h={18}/></button>
            <ForestPageDots active={3} total={4}/>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function ForestPageDots({ active, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14, paddingBottom: 6 }}>
      {Array.from({length: total}).map((_, i) => (
        <span key={i} style={{
          height: 4, borderRadius: 2,
          width: i === active ? 24 : 6,
          background: i === active ? ForestPalette.mint : ForestPalette.hairline,
          transition: 'width 200ms',
        }}/>
      ))}
    </div>
  );
}

// ---------- 2) Home: "Level 07" — the number IS the design ----------
function ForestHome() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar />

        {/* Top bar — wordmark + avatar */}
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20} />
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${ForestPalette.hairline}` }} />
        </div>

        <div style={{ padding: '28px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>Your longevity level · cycle 04</Eyebrow>

          {/* Massive numeral */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 14, marginBottom: 6 }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 220, lineHeight: 0.82,
              color: ForestPalette.fg, letterSpacing: '-0.06em'
            }}>07</span>
            <div style={{
              marginLeft: 12, marginTop: 18,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(0,200,150,0.15)', color: ForestPalette.mint,
              fontSize: 13, fontWeight: 700
            }}>
              <IconUp w={14} h={14} sw={3} /> +2
            </div>
          </div>

          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, lineHeight: 1.3,
            color: ForestPalette.fg, margin: '4px 0 0', maxWidth: 280
          }}>
            You're outperforming <span style={{ color: ForestPalette.mint, fontStyle: 'italic' }}>89%</span> of athletes your age.
          </p>

          {/* Life/health span — minimal inline */}
          <div style={{ display: 'flex', gap: 28, marginTop: 24, paddingTop: 22, borderTop: `1px solid ${ForestPalette.hairline}` }}>
            <SpanStat label="Life span" value="+5–7" unit="years" />
            <div style={{ width: 1, background: ForestPalette.hairline }} />
            <SpanStat label="Health span" value="+2–3" unit="years" />
          </div>

          {/* Pillar rows — editorial, no cards, hairline divided */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <Eyebrow color={ForestPalette.fgMuted}>This cycle</Eyebrow>
              <span style={{ fontSize: 12, color: ForestPalette.fgMuted, fontWeight: 600 }}>89d to next</span>
            </div>

            <PillarRow label="Cardio" level={8} delta={+2} pct={0.82} />
            <PillarRow label="Strength" level={7} delta={+1} pct={0.66} />
            <PillarRow label="Knowledge" level={6} delta={-1} pct={0.58} />
          </div>

          {/* Policy footer — inline link, not a card */}
          <div style={{ marginTop: 'auto', paddingBottom: 26 }}>
            <div style={{ height: 1, background: ForestPalette.hairline, marginBottom: 18 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your policy</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: ForestPalette.fg, letterSpacing: '-0.02em', marginTop: 4 }}>
                  Saving £240<span style={{ color: ForestPalette.fgMuted, fontWeight: 600, fontSize: 16 }}>/year</span>
                </div>
              </div>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: ForestPalette.mint, fontWeight: 700, fontSize: 14, padding: 6
              }}>View <IconArrowRight w={16} h={16} /></button>
            </div>
          </div>
        </div>

        {/* Slim bottom nav — text labels, no icons */}
        <ForestBottomNav active="home" />
        <ForestHomeIndicator />
      </div>
    </>);

}

function SpanStat({ label, value, unit }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: ForestPalette.mint,
        letterSpacing: '-0.02em', marginTop: 4, lineHeight: 1
      }}>{value} <span style={{ color: ForestPalette.fg, fontSize: 14, fontWeight: 600 }}>{unit}</span></div>
    </div>);

}

function PillarRow({ label, level, delta, pct }) {
  return (
    <a href="#" onClick={(e) => e.preventDefault()} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0', borderBottom: `1px solid ${ForestPalette.hairline}`,
      textDecoration: 'none', cursor: 'pointer'
    }}>
      {/* Tally bars — replace progress bar with a 10-segment level indicator */}
      <div style={{ display: 'flex', gap: 3, flexShrink: 0, width: 110 }}>
        {Array.from({ length: 10 }).map((_, i) =>
        <span key={i} style={{
          display: 'block', width: 8, height: 28, borderRadius: 1.5,
          background: i < level ? ForestPalette.mint : ForestPalette.hairline
        }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16,
          color: ForestPalette.fg, letterSpacing: '-0.01em'
        }}>{label}</div>
        <div style={{ fontSize: 11, color: ForestPalette.fgMuted, fontWeight: 600, letterSpacing: '0.05em', marginTop: 2 }}>
          Level {level}
        </div>
      </div>
      <div style={{
        fontSize: 14, fontWeight: 700,
        color: delta >= 0 ? ForestPalette.mint : ForestPalette.coral,
        display: 'inline-flex', alignItems: 'center', gap: 3
      }}>
        {delta >= 0 ? '+' : ''}{delta}
        {delta >= 0 ? <IconUp w={12} h={12} sw={3} /> : <IconDown w={12} h={12} sw={3} />}
      </div>
      <IconArrowRight w={16} h={16} stroke={ForestPalette.fgFaint} />
    </a>);

}

function ForestBottomNav({ active = 'home' }) {
  const items = ['Today', 'Cardio', 'Strength', 'Mind'];
  const map = { Today: 'home', Cardio: 'cardio', Strength: 'strength', Mind: 'knowledge' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      height: 60, paddingBottom: 6, borderTop: `1px solid ${ForestPalette.hairline}`
    }}>
      {items.map((label) => {
        const on = map[label] === active;
        return (
          <button key={label} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: on ? 700 : 600, fontSize: 13,
            color: on ? ForestPalette.fg : ForestPalette.fgMuted,
            letterSpacing: '-0.01em', padding: '8px 12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5
          }}>
            <span>{label}</span>
            <span style={{
              width: on ? 18 : 0, height: 2, background: ForestPalette.mint,
              transition: 'width 200ms'
            }} />
          </button>);

      })}
    </div>);

}

// ---------- 3) Cardio detail — editorial data table ----------
function ForestCardio() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar />

        <div style={{ padding: '12px 24px 0' }}>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, marginLeft: -6,
            color: ForestPalette.fg
          }}><IconArrowLeft w={20} h={20} /></button>
        </div>

        <div style={{ padding: '8px 28px 0', flex: 1, overflowY: 'auto' }}>
          <Eyebrow>Pillar 1 of 3</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 48,
            color: ForestPalette.fg, letterSpacing: '-0.035em', lineHeight: 0.95,
            margin: '14px 0 0'
          }}>Cardio</h1>

          {/* Hero stat */}
          <div style={{ marginTop: 24, paddingBottom: 24, borderBottom: `1px solid ${ForestPalette.hairline}` }}>
            <div style={{ fontSize: 11, color: ForestPalette.fgMuted, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Overall · Level</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 6 }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 110, lineHeight: 0.85,
                color: ForestPalette.fg, letterSpacing: '-0.05em'
              }}>7</span>
              <span style={{ color: ForestPalette.fgMuted, fontSize: 18, fontWeight: 600, marginBottom: 12 }}>/ 10</span>
              <span style={{
                marginBottom: 16, marginLeft: 8,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 999,
                background: 'rgba(0,200,150,0.15)', color: ForestPalette.mint,
                fontSize: 12, fontWeight: 700
              }}><IconUp w={12} h={12} sw={3} /> +2</span>
            </div>
            <p style={{ color: ForestPalette.fgMuted, fontSize: 14, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 280 }}>
              You're at <em style={{ color: ForestPalette.mint, fontStyle: 'italic' }}>65%</em> of the world record for your age and sex.
            </p>
          </div>

          {/* Editorial table — Best times */}
          <Eyebrow color={ForestPalette.fgMuted}>Best times</Eyebrow>
          <div style={{ marginTop: 12 }}>
            {[
            { d: '5k', pct: 78, val: '23:32', delta: +2 },
            { d: '10k', pct: 71, val: '43:32', delta: +1 },
            { d: 'Half marathon', pct: 61, val: '1:32:21', delta: +1 },
            { d: 'Marathon', pct: 65, val: '3:13:45', delta: +1 }].
            map((r, i) =>
            <ForestDataRow key={i} {...r} />
            )}
          </div>

          {/* Sub-metrics */}
          <Eyebrow color={ForestPalette.fgMuted}>Underlying metrics</Eyebrow>
          <div style={{ marginTop: 12 }}>
            <ForestDataRow d="Relative performance" pct={65} val="65%" delta={+2} small />
            <ForestDataRow d="VO₂ max" pct={72} val="45 ml/kg" delta={+1} small />
          </div>

          {/* FAQs as inline list */}
          <Eyebrow color={ForestPalette.fgMuted}>Common questions</Eyebrow>
          <div style={{ marginTop: 12 }}>
            {[
            'What is relative performance?',
            'What is VO₂ max?',
            'Do I have to run all of the distances?'].
            map((q, i) =>
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 0', borderBottom: `1px solid ${ForestPalette.hairline}`
            }}>
                <span style={{ color: ForestPalette.fg, fontSize: 14, fontWeight: 600 }}>{q}</span>
                <span style={{ color: ForestPalette.fgFaint, fontSize: 22, lineHeight: 1, fontWeight: 300 }}>+</span>
              </div>
            )}
          </div>

          <div style={{ height: 24 }} />
        </div>

        <ForestBottomNav active="cardio" />
        <ForestHomeIndicator />
      </div>
    </>);

}

function ForestDataRow({ d, pct, val, delta, small = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: small ? '12px 0' : '16px 0',
      borderBottom: `1px solid ${ForestPalette.hairline}`
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 700,
          fontSize: small ? 14 : 16, color: ForestPalette.fg, letterSpacing: '-0.01em'
        }}>{d}</div>
        {/* horizontal pct bar */}
        <div style={{ position: 'relative', height: 3, marginTop: 8, background: ForestPalette.hairline, borderRadius: 2 }}>
          <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: ForestPalette.mint, borderRadius: 2 }} />
        </div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 78 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 800,
          fontSize: small ? 16 : 18, color: ForestPalette.fg, letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums'
        }}>{val}</div>
        <div style={{
          fontSize: 11, fontWeight: 700,
          color: delta >= 0 ? ForestPalette.mint : ForestPalette.coral,
          marginTop: 3,
          display: 'inline-flex', alignItems: 'center', gap: 2
        }}>
          {delta >= 0 ? '+' : ''}{delta} {delta >= 0 ? <IconUp w={10} h={10} sw={3} /> : <IconDown w={10} h={10} sw={3} />}
        </div>
      </div>
    </div>);

}

// ---------- 4) Level Up moment — celebratory full-bleed ----------
// Original static version.
function ForestLevelUp() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      {/* radial mint glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.35) 0%, rgba(0,200,150,0) 60%)',
        pointerEvents: 'none'
      }} />
      {/* mint rays */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} viewBox="0 0 390 844" preserveAspectRatio="none">
        {Array.from({ length: 12 }).map((_, i) =>
        <line key={i}
        x1="195" y1="200"
        x2={195 + Math.cos(i * Math.PI / 6) * 400}
        y2={200 + Math.sin(i * Math.PI / 6) * 400}
        stroke="var(--kale-mint)" strokeWidth="1" opacity={i % 2 ? 0.3 : 0.6} />
        )}
      </svg>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar />

        <div style={{ padding: '14px 24px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: ForestPalette.fgMuted, fontSize: 22, fontWeight: 300, padding: 6,
            lineHeight: 1
          }}>✕</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: ForestPalette.mint,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            marginBottom: 16
          }}>You levelled up</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 120, lineHeight: 0.9,
              color: ForestPalette.fgMuted, letterSpacing: '-0.05em'
            }}>06</span>
            <IconArrowRight w={32} h={32} stroke={ForestPalette.mint} sw={2.5} />
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 200, lineHeight: 0.85,
              color: ForestPalette.fg, letterSpacing: '-0.06em',
              textShadow: '0 0 60px rgba(0,200,150,0.4)'
            }}>07</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28,
            color: ForestPalette.fg, letterSpacing: '-0.02em', lineHeight: 1.1,
            margin: '32px 0 12px', maxWidth: 280
          }}>
            <em style={{ color: ForestPalette.mint, fontStyle: 'italic' }}>Two</em> extra years of healthspan.
          </h2>
          <p style={{ color: ForestPalette.fgMuted, fontSize: 15, lineHeight: 1.55, margin: 0, maxWidth: 280 }}>
            Your premium dropped by <strong style={{ color: ForestPalette.fg }}>£60</strong> this month. Keep moving — Level 8 is 89 days away.
          </p>
        </div>

        <div style={{ padding: '0 28px 28px' }}>
          <button style={{
            width: '100%', height: 56, borderRadius: 9999,
            background: ForestPalette.mint, color: 'var(--kale-dark)',
            border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}>See what changed <IconArrowRight w={18} h={18} /></button>
          <button style={{
            width: '100%', marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer',
            color: ForestPalette.fgMuted, fontWeight: 600, fontSize: 14, padding: 10
          }}>Share progress</button>
        </div>
        <ForestHomeIndicator />
      </div>
    </>);

}

// ---------- 4b) Level Up — 3D carousel variant ----------
// The 06 and 07 sit on an imagined circle in 3D space. The top of the
// circle is dropped back in depth. 06 starts at the middle-bottom (closest
// to camera, large), then rotates round to the right side and shrinks as it
// recedes. 07 sweeps in from the left-back along the same circle and lands
// at the prominent front-centre spot.
function ForestLevelUp3D() {
  const R = 220; // circle radius — bigger so the oval reaches across the screen
  const TILT = 72; // degrees — top dropped DEEP into distance for a flat oval
  const STRETCH_X = 1.35; // horizontal scale so the projected ellipse stretches sideways
  return (
    <>
      <style>{`
        @keyframes flu3-spin {
          0%, 10%  { transform: rotateX(${-TILT}deg) rotateY(0deg); }
          78%, 92% { transform: rotateX(${-TILT}deg) rotateY(90deg); }
          100%     { transform: rotateX(${-TILT}deg) rotateY(0deg); }
        }
        @keyframes flu3-fade {
          0%       { opacity: 0; }
          6%, 88%  { opacity: 1; }
          95%, 100%{ opacity: 0; }
        }
        @keyframes flu3-rays-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes flu3-rays-rev {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes flu3-pulse {
          0%, 100% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 1;    transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes flu3-eyebrow {
          0%, 70%  { color: var(--kale-mint); }
          78%, 92% { color: #fff; text-shadow: 0 0 24px rgba(0,200,150,0.7); }
          100%     { color: var(--kale-mint); }
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />

      {/* spinning background device */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%',
        width: 900, height: 900,
        animation: 'flu3-rays-spin 28s linear infinite',
        pointerEvents: 'none', transformOrigin: 'center'
      }}>
        <svg viewBox="-450 -450 900 900" width="900" height="900" style={{ overflow: 'visible' }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const a = i * Math.PI / 12;
            const len = i % 2 ? 430 : 360;
            return (
              <line key={'r' + i}
              x1={Math.cos(a) * 60} y1={Math.sin(a) * 60}
              x2={Math.cos(a) * len} y2={Math.sin(a) * len}
              stroke="var(--kale-mint)" strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
              opacity={i % 2 ? 0.18 : 0.42} />);

          })}
          <circle cx="0" cy="0" r="220" fill="none"
          stroke="var(--kale-mint)" strokeWidth="1" opacity="0.35"
          strokeDasharray="2 10" />
          <circle cx="0" cy="0" r="320" fill="none"
          stroke="var(--kale-mint)" strokeWidth="0.8" opacity="0.2"
          strokeDasharray="6 14" />
        </svg>
      </div>

      {/* counter-spinning inner tick ring */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%',
        width: 520, height: 520,
        animation: 'flu3-rays-rev 18s linear infinite',
        pointerEvents: 'none', transformOrigin: 'center'
      }}>
        <svg viewBox="-260 -260 520 520" width="520" height="520">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = i * Math.PI / 30;
            const r1 = i % 5 === 0 ? 230 : 240;
            return (
              <line key={'t' + i}
              x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
              x2={Math.cos(a) * 250} y2={Math.sin(a) * 250}
              stroke="var(--kale-mint)" strokeWidth={i % 5 === 0 ? 1.2 : 0.6}
              opacity={i % 5 === 0 ? 0.6 : 0.25} />);

          })}
        </svg>
      </div>

      {/* breathing radial mint glow centred on the 3D circle */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.45) 0%, rgba(0,200,150,0) 60%)',
        animation: 'flu3-pulse 5s ease-in-out infinite',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      {/* faint guide ellipse — the imagined circle, projected as a stretched oval */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%',
        width: R * 2.2 * STRETCH_X, height: R * 2.2,
        transform: `translate(-50%, -50%) perspective(900px) rotateX(${-TILT}deg)`,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '1px dashed rgba(0,200,150,0.35)'
        }} />
      </div>

      {/* === 3D carousel — stretched oval === */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%',
        width: 0, height: 0,
        perspective: '900px',
        perspectiveOrigin: '50% 35%',
        animation: 'flu3-fade 7s ease-in-out infinite',
        pointerEvents: 'none',
        transform: `scaleX(${STRETCH_X})`,
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0,
          transformStyle: 'preserve-3d',
          animation: 'flu3-spin 7s cubic-bezier(.65,.04,.3,1) infinite'
        }}>
          {/* 06 — local θ = 0° (front of circle, closest to camera at start) */}
          <div style={{
            position: 'absolute', left: 0, top: 0,
            transform: `rotateY(0deg) translateZ(${R}px)`,
            transformStyle: 'preserve-3d'
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0,
              width: 320, height: 240, marginLeft: -160, marginTop: -120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-sans)', fontWeight: 800,
              fontSize: 220, lineHeight: 0.85, letterSpacing: '-0.06em',
              color: ForestPalette.fg,
              textShadow: '0 0 60px rgba(0,200,150,0.6)'
            }}>06</div>
          </div>

          {/* 07 — local θ = -90° (left side at start). After +90° spin it lands at front-centre. */}
          <div style={{
            position: 'absolute', left: 0, top: 0,
            transform: `rotateY(-90deg) translateZ(${R}px)`,
            transformStyle: 'preserve-3d'
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0,
              width: 320, height: 240, marginLeft: -160, marginTop: -120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-sans)', fontWeight: 800,
              fontSize: 220, lineHeight: 0.85, letterSpacing: '-0.06em',
              color: ForestPalette.fg,
              textShadow: '0 0 60px rgba(0,200,150,0.6)'
            }}>07</div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 3 }}>
        <ForestStatusBar />

        <div style={{ padding: '14px 24px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: ForestPalette.fgMuted, fontSize: 22, fontWeight: 300, padding: 6,
            lineHeight: 1
          }}>✕</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            marginBottom: 16,
            animation: 'flu3-eyebrow 7s ease-in-out infinite'
          }}>You levelled up</div>

          {/* Spacer where the 3D numbers visually sit */}
          <div style={{ height: 240 }} />

          <h2 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28,
            color: ForestPalette.fg, letterSpacing: '-0.02em', lineHeight: 1.1,
            margin: '24px 0 12px', maxWidth: 280
          }}>
            <em style={{ color: ForestPalette.mint, fontStyle: 'italic' }}>Two</em> extra years of healthspan.
          </h2>
          <p style={{ color: ForestPalette.fgMuted, fontSize: 15, lineHeight: 1.55, margin: 0, maxWidth: 280 }}>
            Your premium dropped by <strong style={{ color: ForestPalette.fg }}>£60</strong> this month. Keep moving — Level 8 is 89 days away.
          </p>
        </div>

        <div style={{ padding: '0 28px 28px' }}>
          <button style={{
            width: '100%', height: 56, borderRadius: 9999,
            background: ForestPalette.mint, color: 'var(--kale-dark)',
            border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}>See what changed <IconArrowRight w={18} h={18} /></button>
          <button style={{
            width: '100%', marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer',
            color: ForestPalette.fgMuted, fontWeight: 600, fontSize: 14, padding: 10
          }}>Share progress</button>
        </div>
        <ForestHomeIndicator />
      </div>
    </>);

}

// ---------- 2b) Home — animated on load ----------
// Replays its entry animations every ~6s so the canvas keeps it lively.
function ForestHomeAnimated() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, []);
  return <ForestHomeAnimatedInner key={tick} />;
}

function ForestHomeAnimatedInner() {
  // 1) Level counter 1 → 7
  const [level, setLevel] = React.useState(1);
  // 2) Pillar bar counts — overshoot up, dip, settle
  const [cardio, setCardio] = React.useState(0);
  const [strength, setStrength] = React.useState(0);
  const [knowledge, setKnow] = React.useState(0);
  // 3) Span "slot machine" text
  const [lifeSpan, setLifeSpan] = React.useState('+0–0');
  const [healthSpan, setHealthSpan] = React.useState('+0–0');
  // 4) Outperforming % counter
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    const start = performance.now();
    let raf;

    // Bar curve: 0 → 10 → 4 → target, with easing through phases.
    const barCurve = (t, target) => {
      if (t < 0.30) {
        const u = t / 0.30;
        return 10 * (1 - Math.pow(1 - u, 3)); // ease-out
      }
      if (t < 0.55) {
        const u = (t - 0.30) / 0.25;
        return 10 + (4 - 10) * (0.5 - 0.5 * Math.cos(u * Math.PI)); // ease-in-out
      }
      const u = (t - 0.55) / 0.45;
      // ease-out-back to overshoot the target slightly then settle
      const c1 = 1.4;
      const easedBack = 1 + c1 * Math.pow(u - 1, 3) + (c1 + 1) * Math.pow(u - 1, 2);
      return 4 + (target - 4) * easedBack;
    };

    const lifeSlots = ['+0–0', '+1–2', '+2–4', '+3–5', '+4–6', '+5–7'];
    const healthSlots = ['+0–0', '+0–1', '+1–2', '+2–3'];

    const tick = (now) => {
      const elapsed = now - start;

      // Level: 0 → 1400ms, count 1 → 7
      const lt = Math.min(1, elapsed / 1400);
      const le = 1 - Math.pow(1 - lt, 3);
      setLevel(Math.max(1, Math.round(1 + le * 6)));

      // Bars: cardio starts at 200, strength 380, knowledge 560; each 1800ms
      const bar = (delay, target) => {
        const bt = (elapsed - delay) / 1800;
        if (bt <= 0) return 0;
        if (bt >= 1) return target;
        return barCurve(bt, target);
      };
      setCardio(bar(200, 8));
      setStrength(bar(380, 7));
      setKnow(bar(560, 6));

      // Spans: slot-machine flicker. 600ms → 1400ms.
      const slot = (slots, delay) => {
        const st = (elapsed - delay) / 800;
        if (st <= 0) return slots[0];
        if (st >= 1) return slots[slots.length - 1];
        const idx = Math.min(slots.length - 1, Math.floor(st * slots.length));
        return slots[idx];
      };
      setLifeSpan(slot(lifeSlots, 600));
      setHealthSpan(slot(healthSlots, 800));

      // Outperforming % counter: 400 → 1600ms, 0 → 89
      const pt = Math.min(1, Math.max(0, (elapsed - 400) / 1200));
      const pe = 1 - Math.pow(1 - pt, 3);
      setPct(Math.round(pe * 89));

      if (elapsed < 2600) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const levelStr = String(level).padStart(2, '0');

  return (
    <>
      <style>{`
        @keyframes fha-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fha-underline {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes fha-glow {
          0%, 100% { text-shadow: 0 0 0 rgba(0,200,150,0); }
          50%      { text-shadow: 0 0 24px rgba(0,200,150,0.7); }
        }
        @keyframes fha-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(120%); }
        }
        .fha-fade-up   { animation: fha-fade-up 600ms cubic-bezier(.2,.7,.2,1) both; }
        .fha-underline { transform-origin: left center; animation: fha-underline 600ms cubic-bezier(.6,.05,.3,1) 1100ms both; }
        .fha-num       { animation: fha-glow 1600ms ease-in-out 1200ms 1 both; }
        .fha-num-wrap  { position: relative; display: inline-block; overflow: hidden; }
        .fha-shimmer   {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(0,200,150,0.18) 50%, transparent 100%);
          animation: fha-shimmer 900ms cubic-bezier(.4,.05,.3,1) 800ms 1 both;
          mix-blend-mode: screen;
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar />

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20} />
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${ForestPalette.hairline}` }} />
        </div>

        <div style={{ padding: '28px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="fha-fade-up" style={{ animationDelay: '0ms' }}>
            <Eyebrow>Your longevity level · cycle 04</Eyebrow>
          </div>

          {/* Massive numeral */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 14, marginBottom: 6 }}>
            <span className="fha-num-wrap">
              <span className="fha-num" style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 220, lineHeight: 0.82,
                color: ForestPalette.fg, letterSpacing: '-0.06em',
                fontVariantNumeric: 'tabular-nums',
                display: 'inline-block'
              }}>{levelStr}</span>
              <span className="fha-shimmer" />
            </span>
            <div className="fha-fade-up" style={{
              marginLeft: 12, marginTop: 18, animationDelay: '1200ms',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(0,200,150,0.15)', color: ForestPalette.mint,
              fontSize: 13, fontWeight: 700
            }}>
              <IconUp w={14} h={14} sw={3} /> +2
            </div>
          </div>

          <p className="fha-fade-up" style={{
            fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, lineHeight: 1.3,
            color: ForestPalette.fg, margin: '4px 0 0', maxWidth: 280,
            animationDelay: '1300ms'
          }}>
            You're outperforming <span style={{ color: ForestPalette.mint, fontStyle: 'italic', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span> of athletes your age.
          </p>

          {/* Life/health span — subtle slot-machine flicker + underline draw */}
          <div className="fha-fade-up" style={{
            display: 'flex', gap: 28, marginTop: 24, paddingTop: 22,
            borderTop: `1px solid ${ForestPalette.hairline}`,
            animationDelay: '500ms'
          }}>
            <SpanStatAnim label="Life span" value={lifeSpan} unit="years" />
            <div style={{ width: 1, background: ForestPalette.hairline }} />
            <SpanStatAnim label="Health span" value={healthSpan} unit="years" />
          </div>

          {/* Pillar rows with bar-count animation */}
          <div style={{ marginTop: 28 }}>
            <div className="fha-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, animationDelay: '300ms' }}>
              <Eyebrow color={ForestPalette.fgMuted}>This cycle</Eyebrow>
              <span style={{ fontSize: 12, color: ForestPalette.fgMuted, fontWeight: 600 }}>89d to next</span>
            </div>

            <PillarRowAnim label="Cardio" targetLevel={8} liveLevel={cardio} delta={+2} />
            <PillarRowAnim label="Strength" targetLevel={7} liveLevel={strength} delta={+1} />
            <PillarRowAnim label="Knowledge" targetLevel={6} liveLevel={knowledge} delta={-1} />
          </div>

          {/* Policy footer */}
          <div className="fha-fade-up" style={{ marginTop: 'auto', paddingBottom: 26, animationDelay: '1800ms' }}>
            <div style={{ height: 1, background: ForestPalette.hairline, marginBottom: 18 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your policy</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: ForestPalette.fg, letterSpacing: '-0.02em', marginTop: 4 }}>
                  Saving £240<span style={{ color: ForestPalette.fgMuted, fontWeight: 600, fontSize: 16 }}>/year</span>
                </div>
              </div>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: ForestPalette.mint, fontWeight: 700, fontSize: 14, padding: 6
              }}>View <IconArrowRight w={16} h={16} /></button>
            </div>
          </div>
        </div>

        <ForestBottomNav active="home" />
        <ForestHomeIndicator />
      </div>
    </>);

}

function SpanStatAnim({ label, value, unit }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: ForestPalette.mint,
        letterSpacing: '-0.02em', marginTop: 4, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        position: 'relative', display: 'inline-block'
      }}>
        <span style={{ display: 'inline-block', minWidth: 64 }}>{value}</span>
        <span style={{ color: ForestPalette.fg, fontSize: 14, fontWeight: 600, marginLeft: 4 }}>{unit}</span>
        <span className="fha-underline" style={{
          position: 'absolute', left: 0, bottom: -4,
          width: 64, height: 1.5, background: ForestPalette.mint, opacity: 0.45
        }} />
      </div>
    </div>);

}

function PillarRowAnim({ label, targetLevel, liveLevel, delta }) {
  // Determine how each bar fills based on liveLevel (which may overshoot/dip).
  // For visual continuity we fade individual bars in/out based on fractional fill.
  return (
    <a href="#" onClick={(e) => e.preventDefault()} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0', borderBottom: `1px solid ${ForestPalette.hairline}`,
      textDecoration: 'none', cursor: 'pointer'
    }}>
      <div style={{ display: 'flex', gap: 3, flexShrink: 0, width: 110 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          // Each bar's alpha derived from how close liveLevel is to i+1
          const fill = Math.max(0, Math.min(1, liveLevel - i));
          return (
            <span key={i} style={{
              display: 'block', width: 8, height: 28, borderRadius: 1.5,
              background: ForestPalette.hairline,
              position: 'relative', overflow: 'hidden'
            }}>
              <span style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                height: `${fill * 100}%`,
                background: ForestPalette.mint,
                transition: 'height 60ms linear'
              }} />
            </span>);

        })}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16,
          color: ForestPalette.fg, letterSpacing: '-0.01em'
        }}>{label}</div>
        <div style={{ fontSize: 11, color: ForestPalette.fgMuted, fontWeight: 600, letterSpacing: '0.05em', marginTop: 2 }}>
          Level {targetLevel}
        </div>
      </div>
      <div style={{
        fontSize: 14, fontWeight: 700,
        color: delta >= 0 ? ForestPalette.mint : ForestPalette.coral,
        display: 'inline-flex', alignItems: 'center', gap: 3
      }}>
        {delta >= 0 ? '+' : ''}{delta}
        {delta >= 0 ? <IconUp w={12} h={12} sw={3} /> : <IconDown w={12} h={12} sw={3} />}
      </div>
      <IconArrowRight w={16} h={16} stroke={ForestPalette.fgFaint} />
    </a>);

}

// ============================================================
// SIGNUP SECTION
// ============================================================

// ---------- S1 · Sign up — email + password creation ----------
function ForestSignup() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: ForestPalette.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={20}/>
          <span style={{ width: 20 }}/>
        </div>

        <div style={{ padding: '36px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>Create account</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, lineHeight: 1.02,
            letterSpacing: '-0.035em', color: ForestPalette.fg,
            margin: '14px 0 6px', maxWidth: 320,
          }}>
            Welcome to <em style={{ color: ForestPalette.mint, fontStyle: 'italic', fontWeight: 800 }}>Kale</em>.
          </h1>
          <p style={{ color: ForestPalette.fgMuted, fontSize: 15, lineHeight: 1.5, maxWidth: 320, margin: '0 0 28px' }}>
            Two minutes now. A cheaper premium for every year you train.
          </p>

          <FormFieldDark label="Email" placeholder="johnsmith@gmail.com" type="email" />
          <div style={{ height: 14 }}/>
          <FormFieldDark label="Password" placeholder="At least 8 characters" type="password" hint="One uppercase, one number"/>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 22, fontSize: 13, color: ForestPalette.fgMuted, lineHeight: 1.5, cursor: 'pointer' }}>
            <span style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${ForestPalette.mint}`, background: ForestPalette.mint, flexShrink: 0, marginTop: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8L9 2.5" stroke="var(--kale-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            I agree to Kale's <span style={{ color: ForestPalette.fg, textDecoration: 'underline', textUnderlineOffset: 3 }}>Terms</span> and <span style={{ color: ForestPalette.fg, textDecoration: 'underline', textUnderlineOffset: 3 }}>Privacy</span>.
          </label>

          <div style={{ marginTop: 'auto', paddingBottom: 12 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999, background: ForestPalette.mint, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Create account <IconArrowRight w={18} h={18}/></button>
            <p style={{ textAlign: 'center', color: ForestPalette.fgMuted, fontSize: 13, marginTop: 14 }}>
              Already a member? <span style={{ color: ForestPalette.fg, textDecoration: 'underline', textUnderlineOffset: 3, fontWeight: 600 }}>Log in</span>
            </p>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ---------- S2 · About you — quick health profile ----------
function ForestAboutYou() {
  const [sex, setSex] = React.useState('Female');
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: ForestPalette.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={20}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em' }}>2 / 3</span>
        </div>

        <div style={{ padding: '32px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>About you</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 38, lineHeight: 1.02,
            letterSpacing: '-0.035em', color: ForestPalette.fg,
            margin: '14px 0 22px', maxWidth: 320,
          }}>
            Just <em style={{ color: ForestPalette.mint, fontStyle: 'italic', fontWeight: 800 }}>three</em> things.
          </h1>

          <FormFieldDark label="Date of birth" placeholder="DD / MM / YYYY"/>

          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            <div style={{ flex: 1 }}><FormFieldDark label="Height" placeholder="175 cm"/></div>
            <div style={{ flex: 1 }}><FormFieldDark label="Weight" placeholder="68 kg"/></div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: ForestPalette.fg, marginBottom: 10 }}>Sex at birth</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Female', 'Male', 'Other'].map(o => {
                const on = sex === o;
                return (
                  <button key={o} onClick={() => setSex(o)} style={{
                    flex: 1, height: 48, borderRadius: 12,
                    background: on ? ForestPalette.mint : 'transparent',
                    color: on ? 'var(--kale-dark)' : ForestPalette.fg,
                    border: `1.5px solid ${on ? ForestPalette.mint : ForestPalette.hairline}`,
                    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  }}>{o}</button>
                );
              })}
            </div>
          </div>

          <p style={{ marginTop: 20, color: ForestPalette.fgMuted, fontSize: 13, lineHeight: 1.55 }}>
            Used only to calibrate your Longevity Level. We never share your data without permission.
          </p>

          <div style={{ marginTop: 'auto', paddingBottom: 12 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999, background: ForestPalette.mint, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Continue <IconArrowRight w={18} h={18}/></button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ---------- S3 · Quote ready — the starter premium ----------
function ForestQuoteReady() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <img src="assets/kale-watermark.svg" alt="" aria-hidden="true" style={{
        position: 'absolute', bottom: -90, right: -100,
        width: 360, height: 'auto', opacity: 0.08,
        pointerEvents: 'none', transform: 'rotate(-12deg)',
      }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: ForestPalette.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={20}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em' }}>3 / 3</span>
        </div>

        <div style={{ padding: '40px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>Your starter quote</Eyebrow>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-start' }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, lineHeight: 1,
              color: ForestPalette.fgMuted, marginTop: 12,
            }}>£</span>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 180, lineHeight: 0.85,
              color: ForestPalette.fg, letterSpacing: '-0.06em',
            }}>28</span>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16,
              color: ForestPalette.fgMuted, marginTop: 14, marginLeft: 4,
            }}>/month</span>
          </div>
          <p style={{ marginTop: 8, color: ForestPalette.fgMuted, fontSize: 15, lineHeight: 1.55, maxWidth: 320 }}>
            We've built a starter premium from your profile. We'll <em style={{ color: ForestPalette.fg, fontStyle: 'normal', fontWeight: 700 }}>drop it</em> as we see how you train.
          </p>

          <div style={{ display: 'flex', gap: 28, marginTop: 28, paddingTop: 22, borderTop: `1px solid ${ForestPalette.hairline}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Cover</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: ForestPalette.fg, letterSpacing: '-0.02em', marginTop: 4 }}>£250k</div>
            </div>
            <div style={{ width: 1, background: ForestPalette.hairline }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Term</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: ForestPalette.fg, letterSpacing: '-0.02em', marginTop: 4 }}>25 yrs</div>
            </div>
            <div style={{ width: 1, background: ForestPalette.hairline }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Type</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: ForestPalette.fg, letterSpacing: '-0.02em', marginTop: 4 }}>Level</div>
            </div>
          </div>

          <button style={{
            marginTop: 22, background: 'transparent', border: `1px solid ${ForestPalette.hairline}`,
            borderRadius: 12, padding: '14px 18px', color: ForestPalette.fg,
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>Customise cover <IconArrowRight w={16} h={16}/></button>

          <div style={{ marginTop: 'auto', paddingBottom: 12 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999, background: ForestPalette.mint, color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Looks good — continue <IconArrowRight w={18} h={18}/></button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

function FormFieldDark({ label, placeholder, type = 'text', hint }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: ForestPalette.fg, marginBottom: 8 }}>{label}</label>
      <input type={type} placeholder={placeholder} style={{
        width: '100%', height: 54, padding: '0 18px',
        background: 'rgba(255,255,255,0.06)',
        border: `1.5px solid ${ForestPalette.hairline}`,
        borderRadius: 12,
        fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500,
        color: ForestPalette.fg, outline: 'none',
      }}/>
      {hint && <div style={{ fontSize: 12, color: ForestPalette.fgMuted, marginTop: 8 }}>{hint}</div>}
    </div>
  );
}

// ============================================================
// FIRST ASSESSMENT SECTION
// ============================================================

// ---------- F1 · Connect a tracker ----------
function ForestConnect() {
  const trackers = [
    { name: 'Strava',       sub: 'Most popular',     letter: 'S', color: '#FC4C02' },
    { name: 'Garmin',       sub: 'Best for accuracy', letter: 'G', color: '#007CC3' },
    { name: 'Apple Health', sub: 'Watch + iPhone',   letter: '', color: '#A2AAAD' },
  ];
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em' }}>1 / 3</span>
        </div>

        <div style={{ padding: '36px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>First assessment</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 42, lineHeight: 1.02,
            letterSpacing: '-0.035em', color: ForestPalette.fg,
            margin: '14px 0 12px', maxWidth: 320,
          }}>
            Connect a <em style={{ color: ForestPalette.mint, fontStyle: 'italic', fontWeight: 800 }}>tracker</em>.
          </h1>
          <p style={{ color: ForestPalette.fgMuted, fontSize: 15, lineHeight: 1.5, maxWidth: 320 }}>
            We read fitness signals from the last 12 weeks. We never read your private data.
          </p>

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trackers.map(t => (
              <button key={t.name} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${ForestPalette.hairline}`,
                borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                textAlign: 'left',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: t.color, color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 20,
                  flexShrink: 0,
                }}>{t.letter || '◐'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: ForestPalette.fg }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: ForestPalette.fgMuted, marginTop: 2 }}>{t.sub}</div>
                </div>
                <IconArrowRight w={18} h={18} stroke={ForestPalette.fgMuted}/>
              </button>
            ))}
          </div>

          <button style={{
            marginTop: 18, background: 'transparent', border: 'none', cursor: 'pointer',
            color: ForestPalette.fgMuted, fontSize: 14, fontWeight: 600,
            textDecoration: 'underline', textUnderlineOffset: 4, textAlign: 'left', padding: 0,
          }}>Use phone sensors only</button>

          <div style={{ marginTop: 'auto', paddingBottom: 18 }}/>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ---------- F2 · Syncing — animated read of last 12 weeks ----------
function ForestSyncing() {
  const [pct, setPct] = React.useState(0);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / 4000);
      const e = 1 - Math.pow(1 - t, 2.5);
      setPct(Math.round(e * 100));
      setTick(now);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const lines = [
    { t: 0,    label: 'Cardio sessions',  v: Math.min(89, Math.round(pct * 0.89)),  suf: '' },
    { t: 0.2,  label: 'Strength sessions',v: Math.min(31, Math.round(pct * 0.31)),  suf: '' },
    { t: 0.4,  label: 'Avg heart rate',   v: Math.min(142, Math.round(pct * 1.42)), suf: 'bpm' },
    { t: 0.6,  label: 'VO₂ max estimate', v: (Math.min(48, pct * 0.48)).toFixed(1), suf: '' },
    { t: 0.8,  label: 'Recovery score',   v: Math.min(78, Math.round(pct * 0.78)),  suf: '' },
  ];

  return (
    <>
      <style>{`
        @keyframes sync-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
          50%      { transform: translate(-50%, -50%) scale(1.4); opacity: 0;   }
        }
        @keyframes sync-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em' }}>2 / 3</span>
        </div>

        <div style={{ padding: '24px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>Reading your last 12 weeks</Eyebrow>

          {/* Big pulsing ring with % */}
          <div style={{ position: 'relative', height: 220, marginTop: 18 }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 200, height: 200, borderRadius: '50%',
              border: `1.5px solid rgba(0,200,150,0.2)`,
              transform: 'translate(-50%, -50%)',
            }}/>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 200, height: 200, borderRadius: '50%',
              border: `2px solid var(--kale-mint)`,
              transform: 'translate(-50%, -50%)',
              animation: 'sync-pulse 1.8s ease-out infinite',
            }}/>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(0,200,150,0.15)" strokeWidth="3"/>
              <circle cx="100" cy="100" r="92" fill="none"
                stroke="var(--kale-mint)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(pct/100) * 578} 578`}
                transform="rotate(-90 100 100)"/>
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 56,
                color: ForestPalette.fg, letterSpacing: '-0.04em', lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}>{pct}<span style={{ fontSize: 24, color: ForestPalette.mint, marginLeft: 2 }}>%</span></div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.18em', marginTop: 6 }}>SYNCING</div>
            </div>
          </div>

          {/* Live readout list */}
          <div style={{ marginTop: 14 }}>
            {lines.map((row, i) => {
              const reveal = pct / 100 > row.t;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0', borderBottom: `1px solid ${ForestPalette.hairline}`,
                  opacity: reveal ? 1 : 0.35,
                  transition: 'opacity 300ms ease',
                }}>
                  <span style={{ color: ForestPalette.fgMuted, fontSize: 14, fontWeight: 600 }}>{row.label}</span>
                  <span style={{
                    fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18,
                    color: reveal ? ForestPalette.fg : ForestPalette.fgFaint,
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
                  }}>{row.v}{row.suf && ' '}<span style={{ color: ForestPalette.fgMuted, fontSize: 12, fontWeight: 600 }}>{row.suf}</span></span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 18 }}/>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ---------- F3 · First level reveal ----------
function ForestFirstLevel() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: ForestPalette.bg }} />
      <div style={{
        position: 'absolute', top: '32%', left: '50%',
        width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.35) 0%, rgba(0,200,150,0) 60%)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }}/>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }} viewBox="0 0 390 844" preserveAspectRatio="none">
        {Array.from({length: 16}).map((_, i) => (
          <line key={i}
            x1="195" y1="270"
            x2={195 + Math.cos(i * Math.PI / 8) * 380}
            y2={270 + Math.sin(i * Math.PI / 8) * 380}
            stroke="var(--kale-mint)" strokeWidth="1" opacity={i % 2 ? 0.3 : 0.55}/>
        ))}
      </svg>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <span style={{ fontSize: 12, fontWeight: 700, color: ForestPalette.fgMuted, letterSpacing: '0.12em' }}>3 / 3</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ForestPalette.mint, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 14 }}>
            Your first Longevity Level
          </div>
          <span style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 220, lineHeight: 0.85,
            color: ForestPalette.fg, letterSpacing: '-0.06em',
            textShadow: '0 0 60px rgba(0,200,150,0.5)',
          }}>06</span>

          <h2 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28,
            color: ForestPalette.fg, letterSpacing: '-0.02em', lineHeight: 1.15,
            margin: '20px 0 10px', maxWidth: 300,
          }}>
            Better than <em style={{ color: ForestPalette.mint, fontStyle: 'italic' }}>78%</em> of athletes your age.
          </h2>
          <p style={{ color: ForestPalette.fgMuted, fontSize: 15, lineHeight: 1.55, margin: 0, maxWidth: 280 }}>
            Your premium just dropped by <strong style={{ color: ForestPalette.fg }}>£72/yr</strong>. Train more to keep going.
          </p>
        </div>

        <div style={{ padding: '0 28px 18px' }}>
          <button style={{
            width: '100%', height: 56, borderRadius: 9999, background: ForestPalette.mint, color: 'var(--kale-dark)',
            border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>Continue to your home <IconArrowRight w={18} h={18}/></button>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

Object.assign(window, { ForestPalette, ForestStatusBar, ForestHomeIndicator, ForestPageDots, Eyebrow, ForestOnboard, ForestOnboard2, ForestOnboard3, ForestOnboard4, ForestHome, ForestHomeAnimated, ForestCardio, ForestLevelUp, ForestLevelUp3D, ForestSignup, ForestAboutYou, ForestQuoteReady, ForestConnect, ForestSyncing, ForestFirstLevel });