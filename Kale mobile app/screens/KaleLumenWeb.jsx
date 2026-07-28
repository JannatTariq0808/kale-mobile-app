/* eslint-disable */
// "Lumen" reskin — web Longevity Marketplace (4 screens).
// The web is a light brand surface, so the Lumen signature lives in the dark
// TEAL hero bands: the curved glass divider + giant LIME numerals. On light
// areas we use deep teal + mint (lime is illegible on cream). Reuses KW helpers.

const LW = {
  bg: '#F4F3EE', surface: '#FFFFFF', ink: '#004C4C', inkSoft: '#3a4f49',
  inkMuted: '#73807a', hairline: '#E2E6E2', mint: '#00C896', mintDeep: '#08807F',
  lime: '#CCFA7D', teal: '#004C4C', tealLite: '#0A675D', yellow: '#F5E94E', coral: '#E8826E',
};

// Wide teal hero band with the curved glass divider (web scale)
function LWHeroBand({ children, h = 360 }) {
  const W = 1280;
  return (
    <div style={{ position: 'relative', background: LW.teal, overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="lwUpper" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stopColor="#0A6B61"/><stop offset="1" stopColor="#04413E"/></linearGradient>
          <radialGradient id="lwGloss" cx="0.15" cy="0.1" r="0.7"><stop offset="0" stopColor="#EAF3E4" stopOpacity="0.07"/><stop offset="0.6" stopColor="#EAF3E4" stopOpacity="0"/></radialGradient>
        </defs>
        <rect x="0" y="0" width={W} height={h} fill={LW.teal}/>
        <path d={`M0,0 H${W} V${h*0.46} C ${W*0.62},${h*0.66} ${W*0.34},${h*0.30} 0,${h*0.52} Z`} fill="url(#lwUpper)"/>
        <rect x="0" y="0" width={W} height={h} fill="url(#lwGloss)"/>
        <path d={`M0,${h*0.52} C ${W*0.34},${h*0.30} ${W*0.62},${h*0.66} ${W},${h*0.46}`} fill="none" stroke="#EAF3E4" strokeOpacity="0.13" strokeWidth="1.5"/>
      </svg>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

// ============================================================
// 30 · WEB · REWARDS LANDING (Lumen)
// ============================================================
function KaleWebRewardsLumen() {
  return (
    <div style={{ background: LW.bg, color: LW.ink, fontFamily: 'var(--font-sans)', minHeight: '100%' }}>
      <KWNav active="rewards"/>
      <LWHeroBand h={360}>
        <div style={{ padding: '54px 74px 70px', maxWidth: 1248, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 56 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: LW.lime, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Longevity Marketplace</div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 76, lineHeight: 0.95, letterSpacing: '-0.035em', color: '#fff', margin: '14px 0 18px' }}>Spend your <span style={{ color: LW.lime }}>Kalettes</span>.</h1>
            <p style={{ fontSize: 18, lineHeight: 1.5, color: 'rgba(234,243,228,0.7)', maxWidth: 540, margin: 0 }}>Cash off gear, partner discounts, blood panels and coaching. Curated for longevity.</p>
          </div>
          <div style={{ background: 'rgba(234,243,228,0.06)', backdropFilter: 'blur(6px)', border: '1px solid rgba(234,243,228,0.15)', padding: '28px 32px', borderRadius: 16, minWidth: 280 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(234,243,228,0.6)' }}>Your balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 64, color: LW.lime, letterSpacing: '-0.04em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>1,053</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(234,243,228,0.6)' }}>pts</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(234,243,228,0.6)', marginTop: 6 }}>≈ £10.53</div>
          </div>
        </div>
      </LWHeroBand>

      <div style={{ padding: '54px 74px 0', maxWidth: 1248, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', margin: 0, color: LW.ink }}>Browse by category</h2>
          <a href="#" style={{ fontSize: 14, fontWeight: 700, color: LW.mintDeep, textDecoration: 'none' }}>See all 240+ rewards →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 56 }}>
          <KWCategoryTile color={LW.mint} label="Gear" count={89} tag="GEAR"/>
          <KWCategoryTile color={LW.coral} label="Partner offers" count={42} tag="OFFER"/>
          <KWCategoryTile color={LW.yellow} label="Health assessments" count={28} tag="ASSESS"/>
          <KWCategoryTile color={LW.teal} label="Coaching & courses" count={61} tag="COACH"/>
        </div>
      </div>

      <div style={{ padding: '0 74px 80px', maxWidth: 1248, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: LW.mintDeep, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Curated this week</div>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', margin: '8px 0 0', color: LW.ink }}>For Level 6 athletes.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          <KWProductCard title="Running tights" brand="Tracksmith" pts="400" topup="£8" img="gear"/>
          <KWProductCard title="25% off Garmin 965" brand="Garmin" pts="100" topup={null} img="offer" tag="OFFER" discount="25%"/>
          <KWProductCard title="Full blood panel" brand="Forth" pts="800" topup="£30" img="lab"/>
          <KWProductCard title="3-month Z2 plan" brand="Coach Anna" pts="400" topup="£15" img="coach"/>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 31 · WEB · BROWSE (Lumen)
// ============================================================
function KaleWebBrowseLumen() {
  const products = [
    { title: 'Running tights', brand: 'Tracksmith', pts: '400', topup: '£8', img: 'gear' },
    { title: 'Bestway barefoots', brand: 'Vivo', pts: '650', topup: '£10', img: 'gear' },
    { title: 'Training tee', brand: 'Tracksmith', pts: '250', topup: null, img: 'gear' },
    { title: 'Running shorts', brand: 'Soar', pts: '500', topup: '£12', img: 'gear' },
    { title: 'Hydration vest', brand: 'Salomon', pts: '800', topup: '£20', img: 'gear' },
    { title: 'Marathon socks · 3pk', brand: 'Stance', pts: '180', topup: null, img: 'gear' },
    { title: 'Carbon plate spikes', brand: 'Nike', pts: '950', topup: '£60', img: 'gear' },
    { title: 'Heart rate strap', brand: 'Garmin', pts: '350', topup: '£5', img: 'offer', tag: 'OFFER', discount: '15%' },
  ];
  return (
    <div style={{ background: LW.bg, color: LW.ink, fontFamily: 'var(--font-sans)', minHeight: '100%' }}>
      <KWNav active="rewards"/>
      <LWHeroBand h={210}>
        <div style={{ padding: '36px 74px 44px', maxWidth: 1248, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'rgba(234,243,228,0.6)', fontWeight: 600, marginBottom: 12 }}>
            <a href="#" style={{ color: 'rgba(234,243,228,0.6)', textDecoration: 'none' }}>Rewards</a> · <span style={{ color: '#fff', fontWeight: 700 }}>Gear</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', margin: 0, color: '#fff' }}><span style={{ color: LW.lime }}>Gear</span> for longevity.</h1>
              <p style={{ fontSize: 15, color: 'rgba(234,243,228,0.65)', margin: '12px 0 0', maxWidth: 540 }}>89 items from brands we trust. Run faster, recover better, hold form longer.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 40, color: LW.lime, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>89</span><span style={{ fontSize: 13, color: 'rgba(234,243,228,0.6)', fontWeight: 600 }}>products</span></div>
          </div>
        </div>
      </LWHeroBand>

      <div style={{ display: 'flex', gap: 36, padding: '36px 74px 64px', maxWidth: 1248, margin: '0 auto' }}>
        <aside style={{ width: 220, flexShrink: 0 }}>
          <KWFilterBlock title="Activity" options={[['Running', true, 64], ['Cycling', false, 18], ['Strength', false, 7]]}/>
          <KWFilterBlock title="Brand" options={[['Tracksmith', false, 12], ['Vivo', false, 7], ['Salomon', false, 9], ['Soar', false, 5]]}/>
          <KWFilterBlock title="Points" options={[['Under 250', false, 22], ['250 – 500', true, 31], ['500 – 1,000', false, 26], ['1,000+', false, 10]]}/>
        </aside>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 8 }}><KWChip label="Running" removable/><KWChip label="250 – 500 pts" removable/></div>
            <select style={{ border: `1px solid ${LW.hairline}`, borderRadius: 9999, padding: '8px 14px', background: LW.surface, color: LW.ink, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              <option>Sort · Curated</option><option>Points · low to high</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {products.map((p, i) => <KWProductCard key={i} {...p}/>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, gap: 6 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} style={{ width: 38, height: 38, borderRadius: 10, background: n === 1 ? LW.teal : 'transparent', color: n === 1 ? '#fff' : LW.ink, border: `1px solid ${n === 1 ? LW.teal : LW.hairline}`, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 32 · WEB · PRODUCT DETAIL (Lumen)
// ============================================================
function KaleWebProductLumen() {
  return (
    <div style={{ background: LW.bg, color: LW.ink, fontFamily: 'var(--font-sans)', minHeight: '100%' }}>
      <KWNav active="rewards"/>
      <div style={{ padding: '32px 74px 0', maxWidth: 1248, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: LW.inkMuted, fontWeight: 600, marginBottom: 24 }}>
          <a href="#" style={{ color: LW.inkMuted, textDecoration: 'none' }}>Rewards</a> · <a href="#" style={{ color: LW.inkMuted, textDecoration: 'none' }}>Gear</a> · <span style={{ color: LW.ink, fontWeight: 700 }}>Tracksmith Running Tights</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, padding: '0 74px 64px', maxWidth: 1248, margin: '0 auto' }}>
        <div>
          <div style={{ aspectRatio: '1', borderRadius: 18, overflow: 'hidden', background: `url('assets/runner.jpg') center/cover no-repeat`, border: `1px solid ${LW.hairline}` }}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12 }}>
            {[0, 1, 2, 3].map(i => <div key={i} style={{ aspectRatio: '1', borderRadius: 10, background: i === 0 ? `url('assets/runner.jpg') center/cover no-repeat` : LW.surface, border: `${i === 0 ? '2px' : '1px'} solid ${i === 0 ? LW.teal : LW.hairline}` }}/>)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: LW.mintDeep, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Gear · Tracksmith</div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', margin: '14px 0 14px', color: LW.ink, lineHeight: 1.02 }}>Eliot Running Tights.</h1>
          <p style={{ fontSize: 16, color: LW.inkSoft, margin: '0 0 28px', lineHeight: 1.55, maxWidth: 480 }}>Tracksmith's signature compression tights for long runs and cold mornings. Italian fabric, four-way stretch, reflective trim.</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '18px 0', borderTop: `1px solid ${LW.hairline}`, borderBottom: `1px solid ${LW.hairline}` }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 56, color: LW.mintDeep, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>400</span>
            <span style={{ fontSize: 14, color: LW.inkMuted, fontWeight: 600 }}>Kalettes</span>
            <span style={{ marginLeft: 16, padding: '4px 10px', borderRadius: 999, background: LW.yellow, color: LW.ink, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em' }}>+ £8 TOP-UP</span>
          </div>
          <div style={{ fontSize: 13, color: LW.inkMuted, margin: '12px 0 24px' }}>Retail £125 · You save <strong style={{ color: LW.ink, fontWeight: 700 }}>£113</strong> by spending points.</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: LW.ink, marginBottom: 10, textTransform: 'uppercase' }}>Size</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {['XS', 'S', 'M', 'L', 'XL'].map((s, i) => <button key={s} style={{ width: 56, height: 48, borderRadius: 10, background: i === 2 ? LW.teal : LW.surface, color: i === 2 ? '#fff' : LW.ink, border: `1.5px solid ${i === 2 ? LW.teal : LW.hairline}`, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>{s}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ flex: 1, height: 56, borderRadius: 9999, background: LW.teal, color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>Redeem with points →</button>
            <button style={{ height: 56, borderRadius: 9999, padding: '0 22px', background: 'transparent', color: LW.ink, border: `1.5px solid ${LW.hairline}`, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>Save</button>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 28 }}>
            <KWMicro label="Ships in" value="2 days"/><KWMicro label="Returns" value="30 days"/><KWMicro label="Carbon" value="Offset"/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 33 · WEB · CHECKOUT (Lumen)
// ============================================================
function KaleWebCheckoutLumen() {
  return (
    <div style={{ background: LW.bg, color: LW.ink, fontFamily: 'var(--font-sans)', minHeight: '100%' }}>
      <KWNav active="rewards"/>
      <div style={{ padding: '36px 74px 64px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em', margin: '0 0 30px', color: LW.ink }}>Almost <span style={{ color: LW.mintDeep }}>yours</span>.</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 36 }}>
          <div>
            <div style={{ background: LW.surface, border: `1px solid ${LW.hairline}`, borderRadius: 14, padding: 22, display: 'flex', gap: 18, marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, borderRadius: 10, background: `url('assets/runner.jpg') center/cover no-repeat`, flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: LW.inkMuted, fontWeight: 600 }}>Tracksmith</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: LW.ink, marginTop: 4 }}>Eliot Running Tights · M</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18, color: LW.mintDeep, fontVariantNumeric: 'tabular-nums' }}>400</span><span style={{ fontSize: 12, color: LW.inkMuted, fontWeight: 600 }}>pts</span><span style={{ fontSize: 13, color: LW.inkMuted, fontWeight: 600, marginLeft: 6 }}>+ £8 top-up</span></div>
              </div>
            </div>
            <div style={{ background: LW.surface, border: `1px solid ${LW.hairline}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: LW.inkMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Apply your points</div>
                  <div style={{ fontSize: 13, color: LW.inkMuted, fontWeight: 600, marginTop: 4 }}>Balance: <strong style={{ color: LW.ink, fontWeight: 700 }}>1,053 pts</strong></div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: LW.mintDeep, fontSize: 11, fontWeight: 800 }}>USING 400</span>
              </div>
              <div style={{ position: 'relative', height: 22, marginTop: 14 }}>
                <div style={{ position: 'absolute', inset: 0, top: 9, height: 4, borderRadius: 2, background: LW.hairline }}/>
                <div style={{ position: 'absolute', top: 9, left: 0, width: '38%', height: 4, borderRadius: 2, background: LW.mint }}/>
                <div style={{ position: 'absolute', top: 0, left: '38%', width: 22, height: 22, borderRadius: '50%', background: LW.teal, transform: 'translateX(-50%)', border: `3px solid #fff`, boxShadow: `0 2px 8px rgba(0,76,76,0.25)` }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: LW.inkMuted, fontWeight: 600 }}><span>0 pts</span><span style={{ color: LW.ink, fontWeight: 700 }}>400 pts applied</span><span>1,053 pts</span></div>
            </div>
          </div>
          <aside style={{ background: LW.surface, border: `1px solid ${LW.hairline}`, borderRadius: 14, padding: 28, height: 'fit-content' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: LW.inkMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Order summary</div>
            <KWRow label="Eliot Running Tights" value="400 pts"/>
            <KWRow label="Top-up payment" value="£8.00"/>
            <KWRow label="Shipping" value="Free"/>
            <div style={{ borderTop: `1px solid ${LW.hairline}`, paddingTop: 16, marginTop: 8 }}>
              <KWRow label="Total points" value="400 pts" bold/>
              <KWRow label="Total payment" value="£8.00" bold/>
            </div>
            <button style={{ marginTop: 24, width: '100%', height: 56, borderRadius: 9999, background: LW.teal, color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>Pay £8.00 + 400 pts →</button>
            <div style={{ marginTop: 14, fontSize: 12, color: LW.inkMuted, lineHeight: 1.5, textAlign: 'center' }}>You'll have <strong style={{ color: LW.ink, fontWeight: 700 }}>653 pts</strong> left to spend.</div>
          </aside>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  KaleWebRewardsLumen, KaleWebBrowseLumen, KaleWebProductLumen, KaleWebCheckoutLumen,
});
