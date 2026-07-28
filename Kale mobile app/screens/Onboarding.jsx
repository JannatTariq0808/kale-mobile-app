/* eslint-disable */
// Kale onboarding screens — reskin of Athlete onboarding flow.
// 7 screens: splash, 5 value-prop photo screens, wearable connect.

// Kale's translation of Athlete's diagonal lime stripe:
// - A softened mint diagonal accent (thinner, more elegant)
// - Photo overlaid with Kale Dark gradient for legibility (matches marketing-site pattern)
// - "Kale" wordmark in top-left corner instead of "/\"
function DiagAccent({ tone = 'mint' }) {
  // SVG diagonal stripe roughly matching Athlete's angle, but as a softer accent ribbon.
  const fill = tone === 'mint' ? 'var(--kale-mint)' : 'var(--kale-lime)';
  return (
    <svg className="diag-accent" viewBox="0 0 390 844" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="diagGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={fill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* The stripe — anchored top-right going diagonally to bottom */}
      <polygon points="270,-20 410,-20 360,860 220,860" fill="url(#diagGrad)" />
    </svg>
  );
}

function OnboardingShell({ bg, statusBarTone = 'light', children, showWordmark = true, wordmarkTone = 'white', accent = true, accentTone = 'mint' }) {
  return (
    <>
      {/* Full-bleed photo */}
      <div style={{
        position: 'absolute', inset: 0,
        background: bg ? `url('${bg}') center/cover no-repeat` : 'var(--kale-dark)',
      }} />
      {/* Kale dark gradient for legibility */}
      <div className="photo-grad" />
      {/* Diagonal mint accent (Kale's softer take on Athlete's stripe) */}
      {accent && <DiagAccent tone={accentTone} />}

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone={statusBarTone} />
        {showWordmark && (
          <div style={{ padding: '8px 24px 0' }}>
            <Wordmark tone={wordmarkTone} size={26} />
          </div>
        )}
        {children}
      </div>
    </>
  );
}

// ---------- Screen 1: Splash ----------
function OnboardSplash() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Wordmark tone="dark" size={72} />
            <div style={{
              marginTop: 4, height: 6, width: 60, marginInline: 'auto',
              background: 'var(--kale-mint)', borderRadius: 3,
            }} />
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- Screen 2: "Your fitness today shapes your tomorrow" ----------
function OnboardFitness({ onNext }) {
  return (
    <OnboardingShell bg="assets/runner.jpg" accentTone="mint">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 24px 32px',
      }}>
        <h1 className="h-display-lg" style={{ color: '#fff', margin: 0, maxWidth: 320 }}>
          Your fitness today shapes your tomorrow
        </h1>
        <div style={{ marginTop: 28 }}>
          <CTA onClick={onNext}>Next</CTA>
        </div>
      </div>
    </OnboardingShell>
  );
}

// ---------- Screen 3: "Measure cardio, strength, knowledge" ----------
function OnboardMeasure({ onNext }) {
  return (
    <OnboardingShell bg="assets/treadmill.jpg" accentTone="mint">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 24px 32px',
      }}>
        <h1 className="h-display" style={{ color: '#fff', margin: 0, maxWidth: 340 }}>
          Measure cardio, strength, and knowledge to unlock your health-span potential
        </h1>
        <div style={{ marginTop: 28 }}>
          <CTA onClick={onNext}>Next</CTA>
        </div>
      </div>
    </OnboardingShell>
  );
}

// ---------- Screen 4: "Understand the science" ----------
function OnboardScience({ onNext }) {
  return (
    <OnboardingShell bg="assets/swimmer.jpg" accentTone="mint">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 24px 32px',
      }}>
        <h1 className="h-display-lg" style={{ color: '#fff', margin: 0, maxWidth: 340 }}>
          Understand the science behind your fitness and longevity
        </h1>
        <div style={{ marginTop: 28 }}>
          <CTA onClick={onNext}>Next</CTA>
        </div>
      </div>
    </OnboardingShell>
  );
}

// ---------- Screen 5: "Your progress, tracked and graded every 3 months" ----------
// The dark screen with three lime diagonals — translate to Kale Dark + Mint chevrons.
// This screen evokes Kale's "Train for longevity" section perfectly.
function OnboardProgress({ onNext }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--kale-dark)' }} />
      {/* Faint watermark — official Kale glyph, à la Kale's "Train for longevity" section */}
      <img src="assets/kale-watermark.svg" alt="" aria-hidden="true" style={{
        position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 'auto', opacity: 0.6,
        pointerEvents: 'none',
      }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="light" />
        <div style={{ padding: '8px 24px 0' }}>
          <Wordmark tone="white" size={26} />
        </div>

        {/* Three mint diagonal bars representing cardio / strength / knowledge */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', padding: '40px 0 0' }}>
          <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 390 320" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              {/* horizontal reference lines */}
              <line x1="0" y1="80"  x2="390" y2="80"  stroke="#ffffff" strokeWidth="1" opacity="0.45" />
              <line x1="0" y1="160" x2="390" y2="160" stroke="#ffffff" strokeWidth="1" opacity="0.45" />
              {/* three rising parallelograms */}
              <polygon points="20,300  80,300  140,40  80,40"     fill="var(--kale-mint)" />
              <polygon points="150,300 210,300 270,0   210,0"      fill="var(--kale-mint)" />
              <polygon points="280,300 340,300 410,-30 350,-30"    fill="var(--kale-mint)" />
            </svg>
          </div>
          {/* Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '14px 24px 8px', color: '#fff', fontSize: 13, fontWeight: 400 }}>
            <span>Cardio</span><span>Strength</span><span>Knowledge</span>
          </div>

          <div style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <h1 className="h-display" style={{ color: '#fff', margin: 0, maxWidth: 340 }}>
              Your progress, tracked and graded every 3 months
            </h1>
            <div style={{ marginTop: 28 }}>
              <CTA onClick={onNext} variant="mint">Next</CTA>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- Screen 6: "Save money on your policy by being fitter" ----------
function OnboardSave({ onNext }) {
  return (
    <OnboardingShell bg="assets/fitness.jpg" accentTone="mint">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 24px 32px',
      }}>
        <h1 className="h-display-lg" style={{ color: '#fff', margin: 0, maxWidth: 340 }}>
          Save money on your policy by being fitter
        </h1>
        <div style={{ marginTop: 28 }}>
          <CTA onClick={onNext}>Next</CTA>
        </div>
      </div>
    </OnboardingShell>
  );
}

// ---------- Screen 7: "Connect your wearable" ----------
// Light bg, watch illustration above text. We draw a stylized watch in Kale palette.
function OnboardConnect({ onNext }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ padding: '8px 24px 0' }}>
          <Wordmark tone="dark" size={26} />
        </div>

        {/* Stylized wearable watch */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <SmartwatchSVG />
        </div>

        <div style={{ padding: '0 24px 32px' }}>
          <h1 className="h-display" style={{ color: 'var(--kale-dark)', margin: 0, maxWidth: 340 }}>
            Connect your wearable to start your journey today
          </h1>
          <div style={{ marginTop: 28 }}>
            <CTA onClick={onNext}>Get started</CTA>
          </div>
        </div>
      </div>
    </>
  );
}

function SmartwatchSVG() {
  return (
    <svg width="220" height="280" viewBox="0 0 220 280" fill="none">
      {/* strap top */}
      <path d="M70 0 H150 L160 50 H60 Z" fill="#dcd9cf" />
      {/* strap bottom */}
      <path d="M60 230 H160 L150 280 H70 Z" fill="#dcd9cf" />
      {/* body */}
      <rect x="40" y="50" width="140" height="180" rx="32" fill="#cdcac1" />
      <rect x="46" y="56" width="128" height="168" rx="28" fill="#0a0a0a" />
      {/* crown */}
      <rect x="182" y="100" width="8" height="28" rx="2" fill="#9b988f" />
      <rect x="182" y="138" width="6" height="18" rx="2" fill="#9b988f" />
      {/* face content */}
      {/* activity ring */}
      <circle cx="78" cy="92" r="14" stroke="var(--kale-mint)" strokeWidth="3" strokeDasharray="60 24" fill="none" transform="rotate(-90 78 92)"/>
      <circle cx="78" cy="92" r="14" stroke="rgba(0,200,150,0.18)" strokeWidth="3" fill="none"/>
      {/* time */}
      <text x="160" y="84" fill="#fff" fontFamily="Sora, sans-serif" fontSize="11" fontWeight="600" textAnchor="end">WED 7</text>
      <text x="160" y="106" fill="#fff" fontFamily="Sora, sans-serif" fontSize="22" fontWeight="800" textAnchor="end" letterSpacing="-0.5">10:09</text>
      {/* BPM */}
      <text x="58" y="128" fill="#fff" fontFamily="Sora, sans-serif" fontSize="9" fontWeight="600">68 BPM</text>
      <text x="86" y="128" fill="var(--kale-mint)" fontFamily="Sora, sans-serif" fontSize="9" fontWeight="700">NOW</text>
      {/* mini chart bars */}
      <g transform="translate(58, 134)">
        {[5,8,12,7,10,15,18,12,14,10,8,6,9,11,14,16,12,9,7,10,12,8,5,4].map((h,i)=>(
          <rect key={i} x={i*4} y={20-h} width="2.4" height={h} fill="var(--kale-mint)" opacity={i>10?0.95:0.6}/>
        ))}
      </g>
      <text x="56" y="172" fill="#7a7a7a" fontFamily="Sora, sans-serif" fontSize="7">12AM</text>
      <text x="88" y="172" fill="#7a7a7a" fontFamily="Sora, sans-serif" fontSize="7">6AM</text>
      <text x="120" y="172" fill="#7a7a7a" fontFamily="Sora, sans-serif" fontSize="7">12PM</text>
      <text x="148" y="172" fill="#7a7a7a" fontFamily="Sora, sans-serif" fontSize="7">6PM</text>
      {/* bottom three round complications */}
      <circle cx="74"  cy="200" r="14" stroke="var(--kale-mint)" strokeWidth="2.5" fill="none"/>
      <path d="M70 197 v6 m4-6 v6 m-2-9 a3 3 0 0 1 6 0 v3" stroke="var(--kale-mint)" strokeWidth="1.5" fill="none"/>
      <circle cx="110" cy="200" r="14" fill="rgba(0,200,150,0.25)"/>
      <g transform="translate(102, 192) scale(0.65)" stroke="var(--kale-mint)" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <circle cx="13" cy="4" r="2"/><path d="m4 22 4-9 4 2 1 7"/><path d="m8 13 3-5 3 2 4-1"/>
      </g>
      <circle cx="146" cy="200" r="14" stroke="#fff" strokeWidth="2" fill="none"/>
      <text x="146" y="203" fill="#fff" fontFamily="Sora, sans-serif" fontSize="10" fontWeight="800" textAnchor="middle">70</text>
      <text x="138" y="217" fill="#7a7a7a" fontFamily="Sora, sans-serif" fontSize="6">57</text>
      <text x="150" y="217" fill="#7a7a7a" fontFamily="Sora, sans-serif" fontSize="6">75</text>
    </svg>
  );
}

Object.assign(window, {
  OnboardSplash, OnboardFitness, OnboardMeasure, OnboardScience,
  OnboardProgress, OnboardSave, OnboardConnect,
});
