/* eslint-disable */
// Kale dashboard, detail, and article screens.

// ---------- Shared bits ----------
function AppHeader({ name = "Sarah", showBell = true, greeting = true, avatar = "assets/iris.jpg" }) {
  return (
    <div style={{ padding: '8px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `url('${avatar}') center/cover no-repeat`, flexShrink: 0,
          border: '2px solid var(--kale-mint)',
        }} />
        {greeting ? (
          <div>
            <div style={{ fontSize: 12, color: 'var(--kale-fg-muted)', fontWeight: 600, lineHeight: 1.2 }}>
              Welcome back
            </div>
            <div className="h-section" style={{ marginTop: 2 }}>
              Hey {name}
            </div>
          </div>
        ) : null}
      </div>
      {showBell && (
        <button style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'var(--kale-offwhite)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--kale-dark)', position: 'relative',
        }}>
          <IconBell w={20} h={20} />
          <span style={{
            position: 'absolute', top: 10, right: 12, width: 8, height: 8,
            borderRadius: '50%', background: 'var(--kale-coral)',
            border: '2px solid var(--kale-offwhite)',
          }} />
        </button>
      )}
    </div>
  );
}

function DetailHeader({ title, avatar = "assets/iris.jpg" }) {
  return (
    <div style={{ padding: '8px 24px 14px' }}>
      <button style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: 6, marginLeft: -6, color: 'var(--kale-dark)', marginBottom: 8,
      }}>
        <IconArrowLeft w={22} h={22} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `url('${avatar}') center/cover no-repeat`, flexShrink: 0,
        }} />
        <h1 className="h-title" style={{ margin: 0 }}>{title}</h1>
      </div>
    </div>
  );
}

// ---------- The signature mini-chart (lime parallelograms → mint, Kale palette) ----------
function ProgressChart({ darkBg = false, withScale = true, levels = [7.5, 7.8, 8.2] }) {
  const color = 'var(--kale-mint)';
  const lineColor = darkBg ? 'rgba(255,255,255,0.5)' : 'rgba(10,61,53,0.15)';
  const textColor = darkBg ? '#fff' : 'var(--kale-fg-muted)';
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 360 200" width="100%" height="auto" preserveAspectRatio="none" style={{ display: 'block' }}>
        {/* y-axis labels */}
        {withScale && (
          <>
            <text x="6"  y="34"  fill={textColor} fontFamily="Sora,sans-serif" fontSize="12" fontWeight="600">9</text>
            <text x="6"  y="92"  fill={textColor} fontFamily="Sora,sans-serif" fontSize="12" fontWeight="600">8</text>
            <text x="6"  y="150" fill={textColor} fontFamily="Sora,sans-serif" fontSize="12" fontWeight="600">7</text>
          </>
        )}
        {/* horizontal lines */}
        <line x1="22" y1="30"  x2="360" y2="30"  stroke={lineColor} strokeWidth="1.2" />
        <line x1="22" y1="88"  x2="360" y2="88"  stroke={lineColor} strokeWidth="1.2" />
        <line x1="22" y1="146" x2="360" y2="146" stroke={lineColor} strokeWidth="1.2" />
        {/* three parallelograms */}
        {levels.map((lv, i) => {
          const baseY = 178;
          const topY  = 146 - (lv - 7) * 58;
          const x0 = 60 + i * 96;
          const w  = 64;
          const skew = 18;
          return (
            <polygon key={i}
              points={`${x0},${baseY} ${x0+w},${baseY} ${x0+w+skew},${topY} ${x0+skew},${topY}`}
              fill={color} />
          );
        })}
        {/* x-axis labels */}
        <text x="90"  y="196" fill={darkBg ? '#fff' : 'var(--kale-dark)'} fontFamily="Sora,sans-serif" fontSize="12" fontWeight="600" textAnchor="middle">Cardio</text>
        <text x="190" y="196" fill={darkBg ? '#fff' : 'var(--kale-dark)'} fontFamily="Sora,sans-serif" fontSize="12" fontWeight="600" textAnchor="middle">Strength</text>
        <text x="290" y="196" fill={darkBg ? '#fff' : 'var(--kale-dark)'} fontFamily="Sora,sans-serif" fontSize="12" fontWeight="600" textAnchor="middle">Knowledge</text>
      </svg>
    </div>
  );
}

// ---------- Countdown card ----------
function CountdownCard({ days = 89, hours = 6, mins = 11, secs = 33, disabled = true }) {
  const Unit = ({ n, u }) => (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
      <span className="t-mono-num" style={{ fontSize: 38, color: '#fff', fontWeight: 800 }}>{String(n).padStart(2,'0')}</span>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{u}</span>
    </div>
  );
  return (
    <div className="k-card-dark" style={{ borderRadius: 18, padding: 24, textAlign: 'center' }}>
      <div className="h-card" style={{ color: '#fff', margin: 0 }}>Are you ready to level up?</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 14, marginBottom: 18 }}>
        <Unit n={days} u="d" /><Unit n={hours} u="h" /><Unit n={mins} u="m" /><Unit n={secs} u="s" />
      </div>
      <button className="cta cta-dark" style={{
        background: 'rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.5)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }} disabled={disabled}>
        Start assessment <IconArrowRight w={18} h={18}/>
      </button>
    </div>
  );
}

// ---------- Metric row with progress bar ----------
function MetricRow({ label, value, delta, pct, showTicks = false }) {
  return (
    <div style={{ paddingTop: 10, paddingBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--kale-dark)' }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--kale-dark)', display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
          {value} {delta != null && <Delta value={delta} />}
        </div>
      </div>
      {showTicks ? <TickProgressBar pct={pct} /> : <ProgressBar pct={pct} />}
    </div>
  );
}

// ---------- HOME ----------
function HomeScreen({ onOpenCardio, onOpenStrength, onOpenKnowledge }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--kale-offwhite)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div className="screen-scroll" style={{ position: 'relative', flex: 1, top: 'auto' }}>
          <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 8 }}>
            <AppHeader name="Sarah" greeting={true} />

            {/* Headline level card */}
            <div style={{ padding: '0 20px 14px' }}>
              <div className="k-card">
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--kale-fg-muted)' }}>Your longevity level</span>
                  <span className="t-small" style={{ color: 'var(--kale-mint)', fontWeight: 700 }}>+2 this cycle</span>
                </div>
                <ProgressChart />
              </div>
            </div>

            {/* Level card — dark, mint CTA */}
            <div style={{ padding: '0 20px 14px' }}>
              <div className="k-card-dark" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginBottom: 4 }}>You're a</div>
                <div className="h-display" style={{ color: '#fff', margin: 0, fontSize: 44 }}>Level 7 athlete</div>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '22px 0 20px' }}>
                  <div>
                    <IconActivity w={28} h={28} stroke="#fff" sw={2}/>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: 600 }}>Life span</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--kale-mint)', marginTop: 2 }}>+5–7 years</div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
                  <div>
                    <IconRunner w={28} h={28} stroke="#fff" sw={2}/>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: 600 }}>Health span</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--kale-mint)', marginTop: 2 }}>+2–3 years</div>
                  </div>
                </div>
                <button className="cta">Learn more about Level 7 <IconArrowRight w={18} h={18}/></button>
              </div>
            </div>

            {/* Three category cards */}
            <CategoryCard title="Cardio" onOpen={onOpenCardio}
              rows={[
                { label: 'Relative performance', value: '65%', delta: 2,  pct: 0.65, info: true },
                { label: 'VO₂ max',                value: '45',  delta: -1, pct: 0.55 },
              ]}
              seeMore="See more cardio"
            />
            <CategoryCard title="Strength and stability" onOpen={onOpenStrength}
              rows={[
                { label: 'Wall sit', value: '2:23', delta: 2, pct: 0.75 },
                { label: 'Plank',    value: '1:33', delta: 1, pct: 0.55 },
              ]}
              seeMore="See more strength"
            />
            <CategoryCard title="Knowledge" onOpen={onOpenKnowledge}
              rows={[
                { label: 'Exercise',  value: '78', delta: 4, pct: 0.78 },
                { label: 'Nutrition', value: '71', delta: 2, pct: 0.71 },
              ]}
              seeMore="See more knowledge"
            />

            {/* Countdown */}
            <div style={{ padding: '0 20px 14px' }}>
              <CountdownCard />
            </div>

            {/* Policy savings — Kale-flavoured: "Save 12% on your premium" */}
            <div style={{ padding: '0 20px 24px' }}>
              <div className="k-card" style={{
                background: 'var(--kale-lime)', borderRadius: 18, padding: 22,
              }}>
                <div className="h-card" style={{ margin: 0, color: 'var(--kale-dark)' }}>
                  Your life insurance policy
                </div>
                <p className="t-body" style={{ margin: '6px 0 16px', color: 'var(--kale-dark)' }}>
                  At Level 7 you'll save <strong>£240/year</strong> on your premium.
                </p>
                <button className="cta cta-dark" style={{ width: 'auto', paddingInline: 22 }}>
                  Your policy <IconArrowRight w={18} h={18}/>
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomNav active="home" />
      </div>
    </>
  );
}

function CategoryCard({ title, rows, seeMore, onOpen }) {
  return (
    <div style={{ padding: '0 20px 14px' }}>
      <div className="k-card">
        <div className="h-card" style={{ marginBottom: 4 }}>{title}</div>
        {rows.map((r, i) => (
          <MetricRow key={i} label={r.label} value={r.value} delta={r.delta} pct={r.pct} />
        ))}
        <button onClick={onOpen} style={{
          background: 'transparent', border: 'none', padding: '8px 0 0',
          color: 'var(--kale-dark)', textDecoration: 'underline',
          fontWeight: 600, fontSize: 14, cursor: 'pointer', textUnderlineOffset: 3,
        }}>{seeMore}</button>
      </div>
    </div>
  );
}

// ---------- DETAIL screens (Cardio / Strength / Knowledge) ----------
function DetailScreen({ title, headline, rows, sections = [], extras = null }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--kale-offwhite)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <DetailHeader title={title} />

          <div style={{ padding: '0 20px 14px' }}>
            <div className="k-card">
              <div className="h-section" style={{ textAlign: 'center', marginBottom: 22 }}>{headline}</div>

              {/* tick scale labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '40%', fontSize: 12, fontWeight: 600, color: 'var(--kale-fg-muted)', marginBottom: 12 }}>
                <span>7</span><span>8</span><span>9</span>
              </div>

              {rows.map((r, i) => (
                <React.Fragment key={i}>
                  {r.section && (
                    <div className="h-card" style={{ marginTop: i ? 18 : 0, marginBottom: 4, fontSize: 15 }}>{r.section}</div>
                  )}
                  {r.label && <MetricRow {...r} showTicks />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {extras}

          <FAQs />
          <TrendingArticles />
          <div style={{ height: 12 }} />
        </div>
        <BottomNav active={title.toLowerCase().includes('cardio') ? 'cardio' : title.toLowerCase().includes('strength') ? 'strength' : 'knowledge'} />
      </div>
    </>
  );
}

function FAQs() {
  const items = [
    { q: 'What is relative performance?', a: 'This score represents the ratio of your performance to the world record for your age and sex, expressed as a percentage. For instance, if you achieve a result twice as long as the world record for your demographic, your percentage score would be 50%.\n\nThis scoring system enables fair comparisons of individual performance across different ages and sexes.', open: true },
    { q: 'What is VO₂ max?',                 a: '', open: false },
    { q: 'Do I have to run all of the distances?', a: '', open: false },
  ];
  return (
    <div style={{ padding: '8px 20px 14px' }}>
      <h2 className="h-section" style={{ textAlign: 'center', margin: '20px 0 14px' }}>FAQs</h2>
      <div className="k-card" style={{ padding: 4 }}>
        {items.map((it, i) => (
          <details key={i} open={it.open} style={{
            borderBottom: i < items.length - 1 ? '1px solid var(--kale-hairline)' : 'none',
            padding: '16px 18px',
          }}>
            <summary style={{
              cursor: 'pointer', listStyle: 'none', display: 'flex',
              alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
              fontWeight: 700, fontSize: 15, color: 'var(--kale-dark)',
            }}>
              <span>{it.q}</span>
              <span style={{ fontSize: 22, lineHeight: 1, color: 'var(--kale-dark)', fontWeight: 400, transform: it.open ? 'rotate(45deg)' : 'none', transition: 'transform 200ms' }}>+</span>
            </summary>
            {it.a && (
              <p className="t-body" style={{ margin: '12px 0 0', color: 'var(--kale-fg-muted)', whiteSpace: 'pre-line' }}>
                {it.a}
              </p>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}

function TrendingArticles() {
  const arts = [
    { title: 'Benefits of life and health span predictions', img: 'assets/tennis.jpg' },
    { title: 'Balancing simplicity and scientific rigor',     img: 'assets/swimmer.jpg' },
  ];
  return (
    <div style={{ padding: '0 20px 24px' }}>
      <h3 style={{ margin: '12px 0 12px', fontSize: 15, fontWeight: 700 }}>Trending articles</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {arts.map((a, i) => (
          <button key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: 10,
            background: '#fff', borderRadius: 14, border: 'none', cursor: 'pointer',
            textAlign: 'left',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 10,
              background: `url('${a.img}') center/cover no-repeat`,
              flexShrink: 0,
            }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--kale-dark)', flex: 1, lineHeight: 1.3 }}>
              {a.title}
            </div>
            <IconChevRight w={20} h={20} stroke="var(--kale-dark)"/>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Specific detail screens ----------
function CardioScreen() {
  return (
    <DetailScreen
      title="Cardio"
      headline="Overall fitness: Level 7"
      rows={[
        { label: 'Relative performance', value: '65%',     delta: 2,  pct: 0.78 },
        { label: 'VO₂ max',              value: '45',      delta: 1,  pct: 0.72 },
        { section: 'Best times' },
        { label: '5k',            value: '23:32',   delta: 2,  pct: 0.78 },
        { label: '10k',           value: '43:32',   delta: 1,  pct: 0.85 },
        { label: 'Half marathon', value: '1:32:21', delta: 1,  pct: 0.62 },
        { label: 'Marathon',      value: '3:13:45', delta: 1,  pct: 0.74 },
      ]}
    />
  );
}

function StrengthScreen() {
  return (
    <DetailScreen
      title="Strength & stability"
      headline="Overall strength: Level 7"
      rows={[
        { label: 'Relative performance', value: '65%',  delta: 2,  pct: 0.78 },
        { section: 'Assessment times' },
        { label: 'Plank',             value: '2:21', delta: 2,  pct: 0.78 },
        { label: 'Wall sit',          value: '1:32', delta: -2, pct: 0.72 },
        { label: 'Single leg balance', value: '2:21', delta: 1,  pct: 0.62 },
        { label: 'Press up',           value: '34',   delta: -3, pct: 0.74 },
      ]}
      extras={
        <div style={{ padding: '0 20px 14px' }}>
          <CountdownCard />
        </div>
      }
    />
  );
}

function KnowledgeScreen() {
  return (
    <DetailScreen
      title="Knowledge"
      headline="Overall knowledge: Level 8"
      rows={[
        { label: 'Relative performance', value: '65%', delta: 2, pct: 0.78 },
        { section: 'Knowledge score' },
        { label: 'Exercise',      value: '92', delta: 4,  pct: 0.92 },
        { label: 'Nutrition',     value: '64', delta: -3, pct: 0.64 },
        { label: 'Sleep',         value: '81', delta: 2,  pct: 0.81 },
        { label: 'Mental health', value: '58', delta: -5, pct: 0.58 },
      ]}
      extras={
        <div style={{ padding: '0 20px 14px' }}>
          <div className="k-card" style={{ textAlign: 'center', padding: '22px 20px' }}>
            <div className="h-card" style={{ marginBottom: 14, maxWidth: 260, marginInline: 'auto' }}>
              Looking to re-take a previous assessment?
            </div>
            <button className="cta" style={{ width: 'auto', paddingInline: 22 }}>
              See previous <IconArrowRight w={18} h={18}/>
            </button>
          </div>
        </div>
      }
    />
  );
}

// ---------- ARTICLE screen ----------
function ArticleScreen() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '14px 24px 0' }}>
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 6, marginLeft: -6, color: 'var(--kale-dark)', marginBottom: 12,
            }}>
              <IconArrowLeft w={22} h={22} />
            </button>
            <span className="t-small" style={{ color: 'var(--kale-mint)', fontWeight: 700, letterSpacing: 0.4 }}>The science</span>
            <h1 className="h-title" style={{ margin: '6px 0 18px', fontSize: 26, textAlign: 'left' }}>
              The science behind longevity predictions
            </h1>
          </div>

          <div style={{ padding: '0 20px' }}>
            <div style={{
              height: 220, borderRadius: 16,
              background: `url('assets/look-after.jpg') center/cover no-repeat`,
            }} />
          </div>

          <div style={{ padding: '20px 24px 8px' }}>
            <p className="t-body" style={{ fontWeight: 700, color: 'var(--kale-dark)', fontSize: 16 }}>
              Our predictions are based on studies linking key fitness metrics like VO₂ max, strength, and physical activity to longevity and healthspan.
            </p>
          </div>

          <div style={{ padding: '0 24px 16px' }}>
            <ol style={{ paddingLeft: 18, margin: 0, color: 'var(--kale-fg-muted)' }}>
              <li className="t-body" style={{ marginBottom: 14 }}>
                Blair SN et al. "Physical fitness and all-cause mortality: A prospective study of healthy men and women." <em>JAMA</em>, 1989.
              </li>
              <li className="t-body" style={{ marginBottom: 14 }}>
                Kodama S et al. "Cardiorespiratory fitness as a quantitative predictor of all-cause mortality and cardiovascular events." <em>JAMA</em>, 2009.
              </li>
              <li className="t-body" style={{ marginBottom: 14 }}>
                Liu CJ et al. "Resistance exercise and fall prevention in older adults: A meta-analysis." <em>Journal of the American Medical Directors Association</em>, 2019.
              </li>
              <li className="t-body" style={{ marginBottom: 14 }}>
                Berkman ND et al. "Low health literacy and health outcomes: An updated systematic review." <em>Annals of Internal Medicine</em>, 2011.
              </li>
            </ol>
          </div>

          <div style={{ padding: '0 24px 24px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Health literacy', 'Healthspan', 'Longevity', 'Strength', 'VO₂ max'].map(t => (
              <span key={t} style={{
                padding: '6px 12px', borderRadius: 999,
                background: 'var(--kale-offwhite)', border: '1px solid var(--kale-hairline)',
                fontSize: 12, fontWeight: 600, color: 'var(--kale-dark)',
              }}>{t}</span>
            ))}
          </div>

          <div style={{ padding: '8px 20px 24px', background: 'var(--kale-offwhite)' }}>
            <h3 style={{ margin: '12px 4px 12px', fontSize: 15, fontWeight: 700 }}>Read more</h3>
            <TrendingArticles />
          </div>
        </div>
        <BottomNav active="cardio" />
      </div>
    </>
  );
}

Object.assign(window, {
  HomeScreen, CardioScreen, StrengthScreen, KnowledgeScreen, ArticleScreen,
});
