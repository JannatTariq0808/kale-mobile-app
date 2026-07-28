/* eslint-disable */
// "Lumen" reskin — Rewards (Balance + Marketplace), Strength, Knowledge, Settings.
// Reuses LP / LPILLAR / LumAppBg / LumHeader / LumTabBar / LumFitnessShell / LumHeroRing
// from KaleLumenApp.jsx, plus content helpers exported from KaleApp/KaleApp2.

// ============================================================
// 16 · REWARDS · BALANCE (Lumen)
// ============================================================
function KaleRewardsBalanceLumen() {
  return (
    <>
      <LumAppBg peak={150}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ padding: '18px 22px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: LP.fgMuted }}>Rewards</div>

          {/* Balance — lime hero on a dark glass card */}
          <div style={{ marginTop: 14, padding: 24, borderRadius: 18, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(204,250,125,0.16) 0%, rgba(204,250,125,0) 70%)' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', position: 'relative' }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.lime }}>Kalettes</span>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999, background: 'rgba(234,243,228,0.10)', color: LP.fgMuted }}>EARNED THIS CYCLE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14, position: 'relative' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 96, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums' }}>486</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: LP.fgMuted }}>≈ £4.86</span>
            </div>
            <button style={{ marginTop: 22, width: '100%', height: 54, borderRadius: 9999, background: LP.mint, color: '#003A38', border: 'none', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Spend my points at kale.co <IconArrowRight w={16} h={16}/></button>
          </div>

          {/* Cycle tracker */}
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>This quarterly cycle</span>
              <span style={{ fontSize: 12, color: LP.fgMuted, fontWeight: 600 }}>9 weeks left</span>
            </div>
            <KACard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>To bank at next assessment</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 30, color: LP.lime, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>486</span>
                    <span style={{ fontSize: 12, color: LP.fgMuted, fontWeight: 600 }}>pts</span>
                  </div>
                </div>
                <LumHeroRing value="" pct={30} size={60} stroke={5}/>
              </div>
              <div style={{ marginTop: 16, height: 6, borderRadius: 3, background: 'rgba(234,243,228,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '30%', background: LP.lime, borderRadius: 3 }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: LP.fgMuted }}>Cycle start</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: LP.coral }}>Assessment</span>
              </div>
            </KACard>
            <div style={{ marginTop: 12, padding: 18, borderRadius: 16, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}`, boxShadow: `inset 4px 0 0 0 ${LP.coral}` }}>
              <p style={{ color: LP.fg, fontSize: 13, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>Complete your assessment to bank these. Miss it — they reset.</p>
            </div>
          </div>

          {/* FAQ (reused) */}
          <div style={{ marginTop: 28, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Common questions</div>
            <KAFaq items={[
              { q: 'How do I earn Kalettes?', a: "Every quarterly assessment you complete pays out a points cycle, calculated from your Longevity Level. Level 6 earns 6% of your annual premium each quarter, paid as points." },
              { q: 'Why must I complete an assessment to bank?', a: "Banking only on assessment makes the link between training and reward concrete. Skip one and your accrued points reset — but your fitness doesn't, so the next cycle pays even more." },
              { q: 'When do points expire?', a: "Banked points last 24 months from the date they were awarded. We'll nudge you well before any expire." },
            ]}/>
          </div>
        </div>
        <LumTabBar active="rewards"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 17 · REWARDS · MARKETPLACE (Lumen)
// ============================================================
function KaleRewardsMarketplaceLumen() {
  const cats = ['All', 'Gear', 'Partner offers', 'Health assessments', 'Coaching'];
  const [cat, setCat] = React.useState('All');
  const items = [
    { title: 'Running tights', brand: 'Tracksmith', pts: 400, topup: 8, cat: 'Gear', tag: 'GEAR', image: 'gear' },
    { title: '25% off Garmin', brand: 'Garmin', pts: 100, topup: null, cat: 'Partner offers', tag: 'OFFER', image: 'offer', discount: '25%' },
    { title: 'Full blood panel', brand: 'Forth', pts: 800, topup: 30, cat: 'Health assessments', tag: 'ASSESSMENT', image: 'assess' },
    { title: 'Training plan', brand: 'Coach Anna', pts: 400, topup: 15, cat: 'Coaching', tag: 'COACHING', image: 'coach' },
    { title: 'Training tee', brand: 'Tracksmith', pts: 250, topup: null, cat: 'Gear', tag: 'GEAR', image: 'gear' },
    { title: 'VO₂max lab test', brand: 'PH Centre', pts: 600, topup: 45, cat: 'Health assessments', tag: 'ASSESSMENT', image: 'assess' },
  ];
  const filtered = cat === 'All' ? items : items.filter(it => it.cat === cat);
  return (
    <>
      <LumAppBg peak={130}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ padding: '18px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: LP.fgMuted }}>Marketplace</div>
          <span style={{ fontSize: 12, color: LP.lime, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>486 pts</span>
        </div>
        <p style={{ padding: '8px 22px 0', color: LP.fgMuted, fontSize: 13, lineHeight: 1.5, margin: 0, maxWidth: 320 }}>A taste of what you can spend on. Browse and buy at kale.co/rewards.</p>
        <div style={{ display: 'flex', gap: 8, padding: '16px 22px 8px', overflowX: 'auto', flexShrink: 0 }}>
          {cats.map(c => {
            const on = c === cat;
            return <button key={c} onClick={() => setCat(c)} style={{ padding: '8px 14px', borderRadius: 999, background: on ? LP.lime : 'transparent', color: on ? '#003A38' : LP.fgMuted, border: `1px solid ${on ? LP.lime : LP.hairline}`, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{c}</button>;
          })}
        </div>
        <div style={{ padding: '8px 22px 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {filtered.map((it, i) => <KAProductCard key={i} item={it}/>)}
          </div>
          <button style={{ marginTop: 14, width: '100%', background: 'transparent', border: `1px solid ${LP.hairline}`, borderRadius: 12, padding: '14px 16px', color: LP.fg, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>See everything at kale.co <IconArrowRight w={14} h={14}/></button>
        </div>
        <LumTabBar active="rewards"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

// ============================================================
// 18 · FITNESS · STRENGTH (Lumen)
// ============================================================
function KaleFitnessStrengthLumen() {
  return (
    <LumFitnessShell active="strength" subactive={null}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 20 }}>
        <LumHeroRing value="6" pct={60} size={96} stroke={7} accent={LPILLAR.strength}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: LPILLAR.strength, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Strength Level</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 44, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.95 }}>6</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: LP.mint, fontSize: 11, fontWeight: 800 }}><IconUp w={10} h={10} sw={3}/> +1</span>
          </div>
          <div style={{ fontSize: 12, color: LP.fgMuted, marginTop: 6, fontWeight: 600 }}>Top <strong style={{ color: LP.fg, fontWeight: 800 }}>22%</strong> of women aged 35–40.</div>
        </div>
      </div>

      <K3Card padding={20} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Strength level over time</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: LPILLAR.strength, letterSpacing: '0.08em' }}>4 · 5 · 5 · 6</span>
        </div>
        <K3LevelOverTime levels={[4, 5, 5, 6]} labels={['Onb', 'C2', 'C3', 'Now']} color={LPILLAR.strength}/>
      </K3Card>

      {/* This cycle's test */}
      <div style={{ padding: 22, borderRadius: 16, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}`, boxShadow: `inset 4px 0 0 0 ${LPILLAR.strength}`, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: LPILLAR.strength, letterSpacing: '0.12em', textTransform: 'uppercase' }}>This cycle's test</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 22, color: LP.fg, letterSpacing: '-0.02em', marginTop: 6 }}>Wall sit · cycle 3</div>
          </div>
          <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(232,130,110,0.18)', color: LPILLAR.strength, fontSize: 10, fontWeight: 800, letterSpacing: '0.12em' }}>NEW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Today</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 44, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>1:48</span></div>
          </div>
          <div style={{ width: 1, background: LP.hairline, alignSelf: 'stretch', margin: '0 16px' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Cycle 2</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 28, color: LP.fgMuted, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>1:22</span></div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: LP.mint, fontSize: 13, fontWeight: 800 }}><IconUp w={11} h={11} sw={3}/> 26s</div>
          </div>
        </div>
        <K3RPGauge value={78} gender="women" age="35–40" pillar="strength"/>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, marginTop: 6 }}>Common questions</div>
      <KAFaq items={[
        { q: 'What is Relative Performance (RP)?', a: "RP is a percentile score graded for your age and gender. RP 78% means you're outperforming 78% of women aged 35–40 on this test." },
        { q: 'Why does the strength test change each cycle?', a: "Strength has many dimensions. Plank is a perfect starting point, but as you progress we add wall sit, press-ups and pull-ups to give a fuller picture." },
        { q: 'Do older tests still count toward my level?', a: "Yes. Your Strength Level blends all your tests so far, weighted by recency." },
      ]}/>
      <div style={{ height: 14 }}/>
    </LumFitnessShell>
  );
}

// ============================================================
// 19 · FITNESS · KNOWLEDGE (Lumen)
// ============================================================
function KaleFitnessKnowledgeLumen() {
  const topics = [
    { label: 'General longevity', sc: 5, mx: 5 },
    { label: 'Exercise science', sc: 4, mx: 5 },
    { label: 'Nutrition', sc: 3, mx: 5 },
    { label: 'Sleep & recovery', sc: 2, mx: 3 },
    { label: 'Mental health', sc: 1, mx: 2 },
  ];
  return (
    <LumFitnessShell active="knowledge" subactive={null}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18 }}>
        <LumHeroRing value="16" suffix="/20" pct={80} size={96} stroke={7} accent={LPILLAR.knowledge}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: LPILLAR.knowledge, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Latest quiz</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 42, color: LP.lime, letterSpacing: '-0.04em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>16</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: LP.fgMuted }}>/ 20</span>
            <span style={{ marginLeft: 8, fontSize: 13, color: LPILLAR.knowledge, fontWeight: 800 }}>80%</span>
          </div>
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: LP.mint, fontSize: 12, fontWeight: 700 }}><IconUp w={11} h={11} sw={3}/> 1 vs. cycle 3</div>
        </div>
      </div>

      <K3Card padding={20} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Score history</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: LPILLAR.knowledge, letterSpacing: '0.08em' }}>4 CYCLES</span>
        </div>
        <K3KnowledgeChart scores={[12, 14, 15, 16]}/>
      </K3Card>

      <K3Card padding={20}>
        <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>By topic</div>
        {topics.map((t, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: i < topics.length - 1 ? `1px solid ${LP.hairline}` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: LP.fg, fontWeight: 600 }}>{t.label}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 13, color: LP.fg, fontVariantNumeric: 'tabular-nums' }}>{t.sc}<span style={{ color: LP.fgMuted, fontWeight: 600 }}> / {t.mx}</span></span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(234,243,228,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(t.sc/t.mx)*100}%`, background: LP.lime, borderRadius: 2 }}/>
            </div>
          </div>
        ))}
      </K3Card>

      <div style={{ marginTop: 14, padding: 18, borderRadius: 16, background: 'rgba(234,243,228,0.05)', border: `1px solid ${LP.hairline}`, boxShadow: `inset 4px 0 0 0 ${LPILLAR.knowledge}`, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: LPILLAR.knowledge, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Up next</div>
        <p style={{ color: LP.fg, fontSize: 14, lineHeight: 1.5, margin: 0 }}>We'll focus your next quiz on <strong style={{ color: LPILLAR.knowledge, fontWeight: 800 }}>nutrition</strong> — your weakest topic.</p>
      </div>
      <div style={{ height: 14 }}/>
    </LumFitnessShell>
  );
}

// ============================================================
// 20 · SETTINGS (Lumen)
// ============================================================
function KaleSettingsLumen() {
  return (
    <>
      <LumAppBg peak={130}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <ForestStatusBar/>
        <LumHeader/>
        <div style={{ padding: '18px 22px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: LP.fgMuted }}>Settings</div>

          <K3Card padding={20} style={{ marginTop: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `url('assets/iris.jpg') center/cover no-repeat`, border: `1.5px solid ${LP.hairline}`, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 18, color: LP.fg, letterSpacing: '-0.015em' }}>Alex Pendragon</div>
                <div style={{ fontSize: 12, color: LP.fgMuted, marginTop: 2 }}>alex@pendragon.io · Member since Nov 2025</div>
              </div>
              <IconArrowRight w={16} h={16} stroke={LP.fgMuted}/>
            </div>
          </K3Card>

          <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Your policy</div>
          <K3Card padding={0} style={{ marginBottom: 16 }}>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 22, color: LP.fg, letterSpacing: '-0.02em' }}>£250k</div>
                  <div style={{ fontSize: 12, color: LP.fgMuted, marginTop: 2 }}>Level term · 25 years</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(0,200,150,0.15)', color: LP.mint, fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Active</span>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${LP.hairline}` }}>
              <K3SettingsRow label="Monthly premium" value="£27.00" chevron last/>
            </div>
          </K3Card>

          <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Connections</div>
          <K3Card padding={0} style={{ marginBottom: 16 }}>
            <K3SettingsRow icon="strava" label="Strava" value="Connected" valueColor={LP.mint} chevron/>
            <K3SettingsRow icon="garmin" label="Garmin" value="Connected" valueColor={LP.mint} chevron/>
            <K3SettingsRow icon="apple" label="Apple Health" value="Add" valueColor={LPILLAR.cardio} chevron last/>
          </K3Card>

          <div style={{ fontSize: 11, fontWeight: 700, color: LP.fgMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Preferences</div>
          <K3Card padding={0} style={{ marginBottom: 16 }}>
            <K3SettingsToggle label="Assessment reminders" sub="3, 1 week and 1 day before" defaultOn={true}/>
            <K3SettingsToggle label="Cycle updates" sub="Weekly progress emails" defaultOn={true}/>
            <K3SettingsToggle label="Marketing" sub="Occasional offers from Kale" defaultOn={false} last/>
          </K3Card>

          <K3Card padding={0} style={{ marginBottom: 16 }}>
            <K3SettingsRow label="Privacy & data" chevron/>
            <K3SettingsRow label="Help & support" chevron/>
            <K3SettingsRow label="Log out" valueColor={LP.coral} chevron={false} last/>
          </K3Card>

          <div style={{ textAlign: 'center', color: LP.fgMuted, fontSize: 11, padding: '6px 0 14px' }}>Kale Insurance · v2.4.1</div>
        </div>
        <LumTabBar active="settings"/>
        <ForestHomeIndicator/>
      </div>
    </>
  );
}

Object.assign(window, {
  KaleRewardsBalanceLumen, KaleRewardsMarketplaceLumen,
  KaleFitnessStrengthLumen, KaleFitnessKnowledgeLumen, KaleSettingsLumen,
});
