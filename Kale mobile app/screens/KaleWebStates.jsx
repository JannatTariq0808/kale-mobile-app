/* eslint-disable */
// Kale pass 4 — web marketplace + empty/error states.
// Web marketplace: light Kale brand styling (--kale-offwhite bg, --kale-dark ink, mint accents).
// App states: dark Forest styling (matches existing mobile screens).

const KW = {
  bg:        '#F7F6F2',
  surface:   '#FFFFFF',
  ink:       '#0A3D35',
  inkSoft:   '#3a4f49',
  inkMuted:  '#73807a',
  hairline:  '#E0E5E3',
  mint:      '#00C896',
  mintDeep:  '#00a77f',
  yellow:    '#F5E94E',
  coral:     '#E8826E',
};
const KEP = ForestPalette; // for app dark states

// ============================================================
// 26. WEB · REWARDS LANDING (kale.co/rewards · authed)
// ============================================================
function KaleWebRewards() {
  return (
    <div style={{ background: KW.bg, color: KW.ink, fontFamily: 'var(--font-sans)', minHeight: '100%' }}>
      <KWNav active="rewards"/>

      {/* Hero balance band */}
      <div style={{ background: KW.ink, color: '#fff', padding: '54px 74px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 56 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: KW.mint, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Longevity Marketplace</div>
            <h1 style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 76, lineHeight: 0.95,
              letterSpacing: '-0.035em', color: '#fff', margin: '14px 0 18px',
            }}>
              Spend your <em style={{ color: KW.mint, fontStyle: 'italic' }}>Kalettes</em>.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', maxWidth: 540, margin: 0 }}>
              Cash off gear, partner discounts, blood panels and coaching. Curated for longevity.
            </p>
          </div>
          <div style={{
            background: KW.yellow, color: KW.ink,
            padding: '28px 32px', borderRadius: 16, minWidth: 280,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Your balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 64, letterSpacing: '-0.05em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>1,053</span>
              <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.6 }}>pts</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7, marginTop: 6 }}>≈ £10.53</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '54px 74px 0', maxWidth: 1248, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', margin: 0, color: KW.ink }}>Browse by category</h2>
          <a href="#" style={{ fontSize: 14, fontWeight: 700, color: KW.mintDeep, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>See all 240+ rewards →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 56 }}>
          <KWCategoryTile color={KW.mint}   label="Gear"                count={89}  tag="GEAR"/>
          <KWCategoryTile color={KW.coral}  label="Partner offers"      count={42}  tag="OFFER"/>
          <KWCategoryTile color={KW.yellow} label="Health assessments"  count={28}  tag="ASSESS"/>
          <KWCategoryTile color={KW.ink}    label="Coaching & courses"  count={61}  tag="COACH"/>
        </div>
      </div>

      {/* Featured row */}
      <div style={{ padding: '0 74px 80px', maxWidth: 1248, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: KW.mintDeep, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Curated this week</div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', margin: '8px 0 0', color: KW.ink }}>For Level 6 athletes.</h2>
          </div>
          <a href="#" style={{ fontSize: 14, fontWeight: 700, color: KW.inkMuted, textDecoration: 'none' }}>← →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          <KWProductCard title="Running tights"    brand="Tracksmith" pts="400" topup="£8"   img="gear"/>
          <KWProductCard title="25% off Garmin 965" brand="Garmin"    pts="100" topup={null}  img="offer" tag="OFFER" discount="25%"/>
          <KWProductCard title="Full blood panel"  brand="Forth"      pts="800" topup="£30"  img="lab"/>
          <KWProductCard title="3-month Z2 plan"   brand="Coach Anna" pts="400" topup="£15"  img="coach"/>
        </div>
      </div>
    </div>
  );
}

function KWNav({ active }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 74px', background: KW.bg, borderBottom: `1px solid ${KW.hairline}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <img src="assets/kale-wordmark-dark.svg" alt="Kale" style={{ height: 28 }}/>
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            ['rewards', 'Kalettes'],
            ['why',     'Why Kale'],
            ['science', 'Science'],
            ['help',    'Help'],
          ].map(([id, label]) => (
            <a key={id} href="#" style={{
              fontSize: 14, fontWeight: 600, color: id === active ? KW.ink : KW.inkMuted,
              textDecoration: 'none',
              borderBottom: id === active ? `2px solid ${KW.mint}` : '2px solid transparent',
              paddingBottom: 4,
            }}>{label}</a>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <a href="#" style={{ fontSize: 14, fontWeight: 600, color: KW.ink, textDecoration: 'none' }}>1,053 pts</a>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${KW.hairline}` }}/>
      </div>
    </nav>
  );
}

function KWCategoryTile({ color, label, count, tag }) {
  const dark = color === KW.ink;
  const isYellow = color === KW.yellow;
  const fg = dark ? '#fff' : KW.ink;
  return (
    <a href="#" style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      background: color, color: fg, textDecoration: 'none',
      borderRadius: 16, padding: 22, aspectRatio: '1.1',
    }}>
      <span style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
        padding: '4px 10px', borderRadius: 999,
        background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,61,53,0.10)',
        color: dark ? KW.mint : isYellow ? KW.ink : KW.ink,
        width: 'fit-content',
      }}>{tag}</span>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.1, color: fg }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, opacity: dark ? 0.6 : 0.55, marginTop: 8 }}>{count} items</div>
      </div>
    </a>
  );
}

function KWProductCard({ title, brand, pts, topup, img, tag, discount }) {
  const tagColors = {
    OFFER: { bg: 'rgba(232,130,110,0.16)', fg: '#C73E1D' },
  };
  const tc = tag ? tagColors[tag] : null;
  return (
    <a href="#" style={{
      display: 'flex', flexDirection: 'column',
      background: KW.surface, borderRadius: 14,
      border: `1px solid ${KW.hairline}`, overflow: 'hidden',
      textDecoration: 'none', color: 'inherit',
    }}>
      <div style={{ aspectRatio: '1', position: 'relative' }}>
        <KWProductImage type={img} discount={discount}/>
        {tc && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            padding: '4px 10px', borderRadius: 999,
            background: tc.bg, color: tc.fg,
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 10, letterSpacing: '0.14em',
          }}>{tag}</span>
        )}
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: KW.inkMuted, fontWeight: 600, letterSpacing: '0.02em' }}>{brand}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: KW.ink, marginTop: 4, lineHeight: 1.25, minHeight: 40 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18, color: KW.mintDeep, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{pts}</span>
          <span style={{ fontSize: 12, color: KW.inkMuted, fontWeight: 600 }}>pts</span>
          {topup && <span style={{ fontSize: 12, color: KW.inkMuted, fontWeight: 600, marginLeft: 6 }}>+ {topup}</span>}
        </div>
      </div>
    </a>
  );
}

function KWProductImage({ type, discount }) {
  if (type === 'offer') {
    return (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 64, color: KW.coral, letterSpacing: '-0.05em' }}>{discount || '25%'}</span>
      </div>
    );
  }
  if (type === 'gear')  return <div style={{ width: '100%', height: '100%', background: `url('assets/runner.jpg') center/cover no-repeat` }}/>;
  if (type === 'coach') return <div style={{ width: '100%', height: '100%', background: `url('assets/fitness.jpg') center/cover no-repeat` }}/>;
  if (type === 'lab')   return (
    <div style={{ width: '100%', height: '100%', background: `linear-gradient(180deg, ${KW.yellow}33 0%, ${KW.surface} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path d="M16 40 L28 28 L40 44 L52 24 L64 48" stroke={KW.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="60" x2="64" y2="60" stroke={KW.inkMuted} strokeWidth="1.5" strokeDasharray="3 3"/>
      </svg>
    </div>
  );
  return null;
}

// ============================================================
// 27. WEB · BROWSE VIEW (kale.co/rewards/gear)
// ============================================================
function KaleWebBrowse() {
  const products = [
    { title: 'Running tights',     brand: 'Tracksmith',  pts: '400', topup: '£8',   img: 'gear' },
    { title: 'Bestway barefoots',  brand: 'Vivo',        pts: '650', topup: '£10',  img: 'gear' },
    { title: 'Training tee',       brand: 'Tracksmith',  pts: '250', topup: null,   img: 'gear' },
    { title: 'Running shorts',     brand: 'Soar',        pts: '500', topup: '£12',  img: 'gear' },
    { title: 'Hydration vest',     brand: 'Salomon',     pts: '800', topup: '£20',  img: 'gear' },
    { title: 'Marathon socks · 3pk', brand: 'Stance',    pts: '180', topup: null,   img: 'gear' },
    { title: 'Carbon plate spikes',  brand: 'Nike',      pts: '950', topup: '£60',  img: 'gear' },
    { title: 'Heart rate strap',   brand: 'Garmin',      pts: '350', topup: '£5',   img: 'offer', tag: 'OFFER', discount: '15%' },
  ];
  return (
    <div style={{ background: KW.bg, color: KW.ink, fontFamily: 'var(--font-sans)', minHeight: '100%' }}>
      <KWNav active="rewards"/>

      {/* Breadcrumb + heading band */}
      <div style={{ borderBottom: `1px solid ${KW.hairline}`, padding: '32px 74px 36px', background: KW.surface }}>
        <div style={{ maxWidth: 1248, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: KW.inkMuted, fontWeight: 600, marginBottom: 12 }}>
            <a href="#" style={{ color: KW.inkMuted, textDecoration: 'none' }}>Rewards</a> · <span style={{ color: KW.ink, fontWeight: 700 }}>Gear</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', margin: 0, color: KW.ink }}>
                <em style={{ color: KW.mintDeep, fontStyle: 'italic' }}>Gear</em> for longevity.
              </h1>
              <p style={{ fontSize: 15, color: KW.inkMuted, margin: '12px 0 0', maxWidth: 540 }}>
                89 items from brands we trust. Run faster, recover better, hold form longer.
              </p>
            </div>
            <div style={{ fontSize: 13, color: KW.inkMuted, fontWeight: 600 }}>89 products</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 36, padding: '36px 74px 64px', maxWidth: 1248, margin: '0 auto' }}>
        {/* Filters sidebar */}
        <aside style={{ width: 220, flexShrink: 0 }}>
          <KWFilterBlock title="Activity" options={[['Running', true, 64], ['Cycling', false, 18], ['Strength', false, 7]]}/>
          <KWFilterBlock title="Brand"    options={[['Tracksmith', false, 12], ['Vivo', false, 7], ['Salomon', false, 9], ['Soar', false, 5]]}/>
          <KWFilterBlock title="Points"   options={[['Under 250', false, 22], ['250 – 500', true, 31], ['500 – 1,000', false, 26], ['1,000+', false, 10]]}/>
          <KWFilterBlock title="Top-up"   options={[['No top-up', false, 18], ['Top-up required', false, 71]]}/>
          <button style={{
            marginTop: 8, background: 'transparent', border: 'none', cursor: 'pointer',
            color: KW.inkMuted, fontSize: 13, fontWeight: 700, padding: 0,
          }}>Clear all filters</button>
        </aside>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <KWChip label="Running" removable/>
              <KWChip label="250 – 500 pts" removable/>
            </div>
            <select style={{
              border: `1px solid ${KW.hairline}`, borderRadius: 9999, padding: '8px 14px',
              background: KW.surface, color: KW.ink, fontFamily: 'var(--font-sans)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              <option>Sort · Curated</option>
              <option>Points · low to high</option>
              <option>Points · high to low</option>
              <option>Newest first</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {products.map((p, i) => <KWProductCard key={i} {...p}/>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, gap: 6 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} style={{
                width: 38, height: 38, borderRadius: 10,
                background: n === 1 ? KW.ink : 'transparent',
                color: n === 1 ? '#fff' : KW.ink,
                border: `1px solid ${n === 1 ? KW.ink : KW.hairline}`,
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KWFilterBlock({ title, options }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: KW.inkMuted, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>{title}</div>
      {options.map(([label, on, count]) => (
        <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer' }}>
          <span style={{
            width: 16, height: 16, borderRadius: 4,
            border: `1.5px solid ${on ? KW.mint : KW.hairline}`,
            background: on ? KW.mint : 'transparent',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {on && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
          </span>
          <span style={{ flex: 1, fontSize: 14, color: on ? KW.ink : KW.inkSoft, fontWeight: on ? 700 : 600 }}>{label}</span>
          <span style={{ fontSize: 12, color: KW.inkMuted, fontWeight: 600 }}>{count}</span>
        </label>
      ))}
    </div>
  );
}

function KWChip({ label, removable }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 12px', borderRadius: 999,
      background: KW.ink, color: '#fff', fontSize: 12, fontWeight: 700,
    }}>
      {label}
      {removable && <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 2l7 7M9 2l-7 7"/></svg>}
    </span>
  );
}

// ============================================================
// 28. WEB · PRODUCT DETAIL
// ============================================================
function KaleWebProduct() {
  return (
    <div style={{ background: KW.bg, color: KW.ink, fontFamily: 'var(--font-sans)', minHeight: '100%' }}>
      <KWNav active="rewards"/>

      <div style={{ padding: '32px 74px 0', maxWidth: 1248, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: KW.inkMuted, fontWeight: 600, marginBottom: 24 }}>
          <a href="#" style={{ color: KW.inkMuted, textDecoration: 'none' }}>Rewards</a> · <a href="#" style={{ color: KW.inkMuted, textDecoration: 'none' }}>Gear</a> · <span style={{ color: KW.ink, fontWeight: 700 }}>Tracksmith Running Tights</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, padding: '0 74px 64px', maxWidth: 1248, margin: '0 auto' }}>
        {/* Left: image gallery */}
        <div>
          <div style={{
            aspectRatio: '1', borderRadius: 18, overflow: 'hidden',
            background: `url('assets/runner.jpg') center/cover no-repeat`,
            border: `1px solid ${KW.hairline}`,
          }}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 10,
                background: i === 0 ? `url('assets/runner.jpg') center/cover no-repeat` : KW.surface,
                border: `${i === 0 ? '2px' : '1px'} solid ${i === 0 ? KW.ink : KW.hairline}`,
              }}/>
            ))}
          </div>
        </div>

        {/* Right: details */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: KW.mintDeep, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Gear · Tracksmith</div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', margin: '14px 0 14px', color: KW.ink, lineHeight: 1.02 }}>
            Eliot Running Tights.
          </h1>
          <p style={{ fontSize: 16, color: KW.inkSoft, margin: '0 0 28px', lineHeight: 1.55, maxWidth: 480 }}>
            Tracksmith's signature compression tights for long runs and cold mornings. Italian fabric, four-way stretch, reflective trim. The tights everyone you envy on Strava is wearing.
          </p>

          {/* Price block */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '18px 0', borderTop: `1px solid ${KW.hairline}`, borderBottom: `1px solid ${KW.hairline}` }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 56, color: KW.mintDeep, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>400</span>
            <span style={{ fontSize: 14, color: KW.inkMuted, fontWeight: 600 }}>Kalettes</span>
            <span style={{ marginLeft: 16, padding: '4px 10px', borderRadius: 999, background: KW.yellow, color: KW.ink, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em' }}>+ £8 TOP-UP</span>
          </div>
          <div style={{ fontSize: 13, color: KW.inkMuted, margin: '12px 0 24px' }}>
            Retail £125 · You save <strong style={{ color: KW.ink, fontWeight: 700 }}>£113</strong> by spending points.
          </div>

          {/* Size selector */}
          <div style={{ fontSize: 12, fontWeight: 800, color: KW.ink, letterSpacing: '0.02em', marginBottom: 10, textTransform: 'uppercase' }}>Size</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {['XS', 'S', 'M', 'L', 'XL'].map((s, i) => (
              <button key={s} style={{
                width: 56, height: 48, borderRadius: 10,
                background: i === 2 ? KW.ink : KW.surface,
                color: i === 2 ? '#fff' : KW.ink,
                border: `1.5px solid ${i === 2 ? KW.ink : KW.hairline}`,
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{
              flex: 1, height: 56, borderRadius: 9999,
              background: KW.ink, color: '#fff',
              border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Redeem with points →</button>
            <button style={{
              height: 56, borderRadius: 9999, padding: '0 22px',
              background: 'transparent', color: KW.ink,
              border: `1.5px solid ${KW.hairline}`,
              fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer',
            }}>Save</button>
          </div>

          {/* Trust info */}
          <div style={{ display: 'flex', gap: 28, marginTop: 28 }}>
            <KWMicro label="Ships in" value="2 days"/>
            <KWMicro label="Returns" value="30 days"/>
            <KWMicro label="Carbon" value="Offset"/>
          </div>
        </div>
      </div>
    </div>
  );
}

function KWMicro({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: KW.inkMuted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14, color: KW.ink, marginTop: 4, letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  );
}

// ============================================================
// 29. WEB · CHECKOUT (apply points + top-up)
// ============================================================
function KaleWebCheckout() {
  return (
    <div style={{ background: KW.bg, color: KW.ink, fontFamily: 'var(--font-sans)', minHeight: '100%' }}>
      <KWNav active="rewards"/>

      <div style={{ padding: '36px 74px 64px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em', margin: '0 0 30px', color: KW.ink }}>
          Almost <em style={{ color: KW.mintDeep, fontStyle: 'italic' }}>yours</em>.
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 36 }}>
          <div>
            {/* Item summary */}
            <div style={{ background: KW.surface, border: `1px solid ${KW.hairline}`, borderRadius: 14, padding: 22, display: 'flex', gap: 18, marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, borderRadius: 10, background: `url('assets/runner.jpg') center/cover no-repeat`, flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: KW.inkMuted, fontWeight: 600 }}>Tracksmith</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: KW.ink, marginTop: 4 }}>Eliot Running Tights · M</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18, color: KW.mintDeep, fontVariantNumeric: 'tabular-nums' }}>400</span>
                  <span style={{ fontSize: 12, color: KW.inkMuted, fontWeight: 600 }}>pts</span>
                  <span style={{ fontSize: 13, color: KW.inkMuted, fontWeight: 600, marginLeft: 6 }}>+ £8 top-up</span>
                </div>
              </div>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: KW.inkMuted, fontSize: 13, fontWeight: 600 }}>Remove</button>
            </div>

            {/* Points to apply */}
            <div style={{ background: KW.surface, border: `1px solid ${KW.hairline}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: KW.inkMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Apply your points</div>
                  <div style={{ fontSize: 13, color: KW.inkMuted, fontWeight: 600, marginTop: 4 }}>Balance: <strong style={{ color: KW.ink, fontWeight: 700 }}>1,053 pts</strong></div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: KW.mintDeep, fontSize: 11, fontWeight: 800 }}>USING 400</span>
              </div>
              {/* Points slider visual */}
              <div style={{ position: 'relative', height: 22, marginTop: 14 }}>
                <div style={{ position: 'absolute', inset: 0, top: 9, height: 4, borderRadius: 2, background: KW.hairline }}/>
                <div style={{ position: 'absolute', top: 9, left: 0, width: '38%', height: 4, borderRadius: 2, background: KW.mint }}/>
                <div style={{ position: 'absolute', top: 0, left: '38%', width: 22, height: 22, borderRadius: '50%', background: KW.ink, transform: 'translateX(-50%)', border: `3px solid #fff`, boxShadow: `0 2px 8px rgba(10,61,53,0.25)` }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: KW.inkMuted, fontWeight: 600 }}>
                <span>0 pts</span>
                <span style={{ color: KW.ink, fontWeight: 700 }}>400 pts applied</span>
                <span>1,053 pts</span>
              </div>
            </div>

            {/* Shipping */}
            <div style={{ background: KW.surface, border: `1px solid ${KW.hairline}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: KW.inkMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Ship to</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: `5px solid ${KW.mint}`, marginTop: 2, background: '#fff' }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: KW.ink }}>Alex Pendragon · Home</div>
                  <div style={{ fontSize: 13, color: KW.inkMuted, marginTop: 4, lineHeight: 1.45 }}>14 Cardigan Road, Bristol BS6 5DD, United Kingdom</div>
                </div>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: KW.mintDeep, fontSize: 13, fontWeight: 700 }}>Change</button>
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          <aside style={{
            background: KW.surface, border: `1px solid ${KW.hairline}`,
            borderRadius: 14, padding: 28, height: 'fit-content',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: KW.inkMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Order summary</div>
            <KWRow label="Eliot Running Tights" value="400 pts"/>
            <KWRow label="Top-up payment" value="£8.00"/>
            <KWRow label="Shipping" value="Free"/>
            <div style={{ borderTop: `1px solid ${KW.hairline}`, paddingTop: 16, marginTop: 8 }}>
              <KWRow label="Total points" value="400 pts" bold/>
              <KWRow label="Total payment" value="£8.00" bold/>
            </div>

            <button style={{
              marginTop: 24, width: '100%', height: 56, borderRadius: 9999,
              background: KW.ink, color: '#fff',
              border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Pay £8.00 + 400 pts →</button>
            <div style={{ marginTop: 14, fontSize: 12, color: KW.inkMuted, lineHeight: 1.5, textAlign: 'center' }}>
              You'll have <strong style={{ color: KW.ink, fontWeight: 700 }}>653 pts</strong> left to spend.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function KWRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0' }}>
      <span style={{ fontSize: 14, color: bold ? KW.ink : KW.inkSoft, fontWeight: bold ? 700 : 600 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: bold ? 800 : 700, fontSize: 14, color: KW.ink, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

// ============================================================
// APP EMPTY / ERROR STATES — mobile, dark
// ============================================================

// 30. Rewards · empty (pre-first assessment)
function KaleRewardsEmpty() {
  return (
    <KAppShell active="rewards" header headerOptions={{ wordmark: true, avatar: true }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <Eyebrow>Rewards</Eyebrow>

        {/* Locked yellow card */}
        <div style={{
          marginTop: 14, padding: 26, borderRadius: 18,
          background: `linear-gradient(135deg, rgba(245,233,78,0.10) 0%, rgba(245,233,78,0.04) 100%)`,
          border: `1px dashed ${KEP.hairline}`,
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(245,233,78,0.18)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5E94E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2"/>
              <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
            </svg>
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28,
            color: KEP.fg, letterSpacing: '-0.025em', marginTop: 16, lineHeight: 1.1,
          }}>Your points unlock at your first assessment.</div>
          <p style={{ color: KEP.fgMuted, fontSize: 14, lineHeight: 1.5, margin: '12px auto 0', maxWidth: 280 }}>
            Complete the three pillars and you'll start earning <strong style={{ color: KEP.fg, fontWeight: 700 }}>Kalettes</strong> every quarter.
          </p>
        </div>

        {/* Progress checklist */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: KEP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>To unlock</div>
          {[
            { t: 'Welcome screen', done: true },
            { t: 'Cardio review', done: true },
            { t: 'Plank video upload', done: false, accent: '#E8826E' },
            { t: 'Knowledge quiz', done: false, accent: '#F5E94E' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0', borderBottom: i < 3 ? `1px solid ${KEP.hairline}` : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: s.done ? '#00C896' : 'rgba(255,255,255,0.05)',
                border: s.done ? 'none' : `1.5px solid ${s.accent || KEP.hairline}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {s.done && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8L9 2.5" stroke="var(--kale-dark)" strokeWidth="2" strokeLinecap="round"/></svg>}
              </div>
              <span style={{ fontSize: 14, color: s.done ? KEP.fgMuted : KEP.fg, fontWeight: 600, textDecoration: s.done ? 'line-through' : 'none' }}>{s.t}</span>
            </div>
          ))}
        </div>

        <button style={{
          marginTop: 22, width: '100%', height: 56, borderRadius: 9999,
          background: '#00C896', color: 'var(--kale-dark)',
          border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>Resume assessment <IconArrowRight w={18} h={18}/></button>
      </div>
    </KAppShell>
  );
}

// 31. Activity log · empty (no qualifying runs yet)
function KaleActivityEmpty() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KEP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>

        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${KEP.hairline}` }}/>
        </div>

        <div style={{ padding: '16px 24px 0' }}>
          <KASubTabs active="cardio"/>
        </div>

        <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 32, color: KEP.fg, letterSpacing: '-0.03em', margin: 0 }}>Cardio</h1>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#00C896', letterSpacing: '0.08em' }}>LEVEL —</span>
        </div>

        <div style={{ display: 'flex', gap: 4, padding: '14px 24px 0', borderBottom: `1px solid ${KEP.hairline}` }}>
          {['Activity log', 'VO₂max', 'Intensity'].map((s, i) => (
            <span key={s} style={{
              padding: '10px 4px 12px', marginRight: 16,
              color: i === 0 ? KEP.fg : KEP.fgMuted,
              fontFamily: 'var(--font-sans)', fontWeight: i === 0 ? 700 : 600, fontSize: 13,
              borderBottom: i === 0 ? `2px solid #00C896` : '2px solid transparent',
            }}>{s}</span>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: 'rgba(0,200,150,0.10)',
            border: `1px dashed rgba(0,200,150,0.4)`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 22,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l2-6 4 12 2-6h6"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: KEP.fg, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0, maxWidth: 280 }}>
            No qualifying runs yet.
          </h2>
          <p style={{ color: KEP.fgMuted, fontSize: 14, lineHeight: 1.55, margin: '12px 0 0', maxWidth: 300 }}>
            Sync a run from Garmin or Strava — at least <strong style={{ color: KEP.fg, fontWeight: 700 }}>3 km with heart rate</strong> — and it'll show up here.
          </p>
          <button style={{
            marginTop: 22, padding: '12px 22px', borderRadius: 9999,
            background: 'transparent', color: KEP.fg,
            border: `1px solid ${KEP.hairline}`,
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>Check connections</button>
        </div>

        <KATabBar active="fitness"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// 32. Sync error
function KaleSyncError() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KEP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ background: 'transparent', border: 'none', color: KEP.fg, cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <IconArrowLeft w={20} h={20}/>
          </button>
          <Wordmark tone="white" size={18}/>
          <span style={{ width: 20 }}/>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'rgba(232,130,110,0.12)',
            border: `1.5px solid rgba(232,130,110,0.4)`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8826E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>

          <div style={{ fontSize: 11, fontWeight: 800, color: '#E8826E', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 22 }}>Sync paused</div>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: KEP.fg,
            letterSpacing: '-0.025em', lineHeight: 1.1, margin: '12px 0 12px', maxWidth: 300,
          }}>
            We've lost contact with <em style={{ color: '#E8826E', fontStyle: 'italic' }}>Garmin</em>.
          </h1>
          <p style={{ color: KEP.fgMuted, fontSize: 14, lineHeight: 1.55, margin: 0, maxWidth: 300 }}>
            Garmin signed you out about <strong style={{ color: KEP.fg, fontWeight: 700 }}>3 days ago</strong>. Your last reading was 11 May. Reconnect to keep your cycle on track.
          </p>

          {/* Last sync metadata */}
          <div style={{
            marginTop: 22, padding: '16px 18px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${KEP.hairline}`,
            display: 'flex', gap: 22, textAlign: 'left',
          }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: KEP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Last sync</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: KEP.fg, marginTop: 4 }}>11 May · 7:42 am</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: KEP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Missing days</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: '#E8826E', marginTop: 4 }}>3</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{
            width: '100%', height: 56, borderRadius: 9999,
            background: '#E8826E', color: 'var(--kale-dark)',
            border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>Reconnect Garmin <IconArrowRight w={18} h={18}/></button>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: KEP.fgMuted, fontSize: 14, fontWeight: 600, padding: 8,
          }}>I'll do it later</button>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// 33. Assessment missed
function KaleAssessMissed() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KEP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <button style={{ background: 'transparent', border: 'none', color: KEP.fgMuted, fontSize: 22, fontWeight: 300, cursor: 'pointer', padding: 6 }}>✕</button>
        </div>

        <div style={{ padding: '24px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(232,130,110,0.18)', color: '#E8826E',
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em',
            width: 'fit-content', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8826E' }}/>
            Cycle 5 · Missed
          </span>

          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, lineHeight: 1.02,
            letterSpacing: '-0.035em', color: KEP.fg,
            margin: '20px 0 14px',
          }}>
            You missed this <em style={{ color: '#E8826E', fontStyle: 'italic' }}>assessment</em>.
          </h1>
          <p style={{ color: KEP.fgMuted, fontSize: 15, lineHeight: 1.5, margin: 0, maxWidth: 340 }}>
            Your 567 banked points have reset and your Longevity Level is paused at Level 6 until your next cycle.
          </p>

          {/* Stat — points lost */}
          <div style={{
            marginTop: 24, padding: 22, borderRadius: 14,
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${KEP.hairline}`,
            display: 'flex', gap: 0,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: KEP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Lost</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: '#E8826E', letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>567</span>
                <span style={{ fontSize: 12, color: KEP.fgMuted, fontWeight: 600 }}>pts</span>
              </div>
            </div>
            <div style={{ width: 1, background: KEP.hairline, alignSelf: 'stretch', margin: '0 14px' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: KEP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Level</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: KEP.fg, letterSpacing: '-0.03em', lineHeight: 1 }}>6</span>
                <span style={{ fontSize: 11, color: KEP.fgMuted, fontWeight: 600 }}>paused</span>
              </div>
            </div>
            <div style={{ width: 1, background: KEP.hairline, alignSelf: 'stretch', margin: '0 14px' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: KEP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Next</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 30, color: KEP.fg, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>12</span>
                <span style={{ fontSize: 11, color: KEP.fgMuted, fontWeight: 600 }}>weeks</span>
              </div>
            </div>
          </div>

          {/* Reassurance card */}
          <div style={{
            marginTop: 16, padding: '18px 20px', borderRadius: 14,
            background: 'rgba(0,200,150,0.10)', border: `1px solid rgba(0,200,150,0.25)`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#00C896', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>The good news</div>
            <p style={{ color: KEP.fg, fontSize: 14, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
              Your fitness doesn't reset. Keep training and you'll bank an even bigger payout next cycle.
            </p>
          </div>

          <div style={{ marginTop: 'auto', paddingBottom: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button style={{
              width: '100%', height: 56, borderRadius: 9999,
              background: '#00C896', color: 'var(--kale-dark)',
              border: 'none', fontWeight: 600, fontSize: 16, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>Go to my home <IconArrowRight w={18} h={18}/></button>
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: KEP.fgMuted, fontSize: 13, fontWeight: 600, padding: 8,
              textDecoration: 'underline', textUnderlineOffset: 4,
            }}>How does this work?</button>
          </div>
        </div>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// Minimal app shell wrapper used by KaleRewardsEmpty
function KAppShell({ active, children }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: KEP.bg }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark tone="white" size={20}/>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${KEP.hairline}` }}/>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
        <KATabBar active={active}/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// Export
// ============================================================
Object.assign(window, {
  KaleWebRewards, KaleWebBrowse, KaleWebProduct, KaleWebCheckout,
  KaleRewardsEmpty, KaleActivityEmpty, KaleSyncError, KaleAssessMissed,
  // helpers reused by the Lumen reskin
  KWNav, KWProductCard, KWCategoryTile, KWFilterBlock, KWChip, KWMicro, KWRow, KWProductImage, KW,
});
