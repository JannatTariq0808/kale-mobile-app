/* eslint-disable */
// Kale mobile app — design canvas + tweaks shell.

const SCREEN_W = 390;
const SCREEN_H = 844;

// Default tweak values
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showAccent": true,
  "accentColor": "#00C896",
  "levelTone": "dark",
  "lumenBtn": "#00C896"
}/*EDITMODE-END*/;

function ScreenFrame({ children, label, viewport = 'mobile' }) {
  // Wrap each screen in our PhoneScreen frame
  return (
    <div style={{
      width: SCREEN_W, height: SCREEN_H, borderRadius: 36, overflow: 'hidden',
      background: '#fff', position: 'relative',
      boxShadow: '0 0 0 1px rgba(10,61,53,0.05), 0 30px 60px -20px rgba(10,61,53,0.25)',
    }}>
      <PhoneScreen label={label}>{children}</PhoneScreen>
    </div>
  );
}

const DESKTOP_W = 1280;
const DESKTOP_H = 820;

function WebFrame({ children, label, url }) {
  return (
    <ChromeWindow
      width={DESKTOP_W} height={DESKTOP_H}
      url={url || 'kale.co/rewards'}
      tabs={[{ title: label || 'Kale' }]}
      activeIndex={0}
    >
      <div data-screen-label={label} style={{ width: '100%', minHeight: '100%' }}>{children}</div>
    </ChromeWindow>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <>
      <DesignCanvas
        title="Kale mobile app"
        subtitle="Forest direction — pass 4: full onboarding (11) + main app (9) + second assessment (5) + empty/error states (4) + web marketplace (4)."
        initialScale={0.42}
      >
        <DCSection id="lumen" title="0 · Lumen — Onboarding (proposed reskin)" subtitle="The Lumen direction: glossy teal surface with an animated curved glass divider, the figure as a giant lime numeral in a ring gauge, the Kale glyph as the loading device, mint pill buttons, vertical-rule captions. Rolled across the whole product below; current designs unchanged in sections 1–5 for comparison.">
          <DCArtboard id="lum-01" label="01 · Welcome" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L01 Welcome"><KaleWelcomeLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-01b" label="01b · Sign in" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L01b Sign in"><KaleSignInLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-02a" label="02 · Cardio · analysing" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L02a Cardio analysing"><KaleCardioLoaderLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-02" label="03 · Cardio · result" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L02 Cardio result"><KaleCardioResultLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-03" label="04 · Strength intro" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L03 Strength intro"><KaleStrengthIntroLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-04" label="05 · Strength · analysing" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L04 Strength analysing"><KaleStrengthLoaderLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-05" label="06 · Strength · result" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L05 Strength result"><KaleStrengthResultLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-06" label="07 · Knowledge intro" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L06 Knowledge intro"><KaleKnowledgeIntroLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-07" label="08 · Quiz · correct" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L07 Quiz · correct"><KaleQuizQuestionLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-07b" label="08b · Quiz · wrong" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L07b Quiz · wrong"><KaleQuizQuestionLumenWrong /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-08a" label="10 · Knowledge · analysing" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L08a Knowledge analysing"><KaleKnowledgeLoaderLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-08" label="11 · Knowledge · result" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L08 Knowledge result"><KaleKnowledgeResultLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-09" label="12 · Level reveal" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L09 Level reveal"><KaleLevelRevealLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-10" label="13 · Health Years" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L10 Health Years"><KaleHealthYearsLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-11" label="14 · First cycle rewards" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L11 Earnings"><KaleEarningsPreviewLumen /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="lumen-app" title="0b · Lumen — Normal use" subtitle="The everyday app reskinned to Lumen: Home, Fitness (Cardio · Strength · Knowledge), Rewards and Settings. Lime hero numerals, curved divider behind the header, mint tab accents.">
          <DCArtboard id="lum-12" label="12 · Home" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L12 Home"><KaleHomeLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-12b" label="12b · Home · assessment live" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L12b Home live"><KaleHomeLumenLive /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-13" label="13 · Fitness · Activity log" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L13 Fitness log"><KaleFitnessCardioLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-14" label="14 · Fitness · VO₂max" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L14 VO2max"><KaleFitnessVO2Lumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-18" label="18 · Fitness · Strength" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L18 Strength"><KaleFitnessStrengthLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-19" label="19 · Fitness · Knowledge" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L19 Knowledge"><KaleFitnessKnowledgeLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-16" label="16 · Rewards · Balance" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L16 Rewards"><KaleRewardsBalanceLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-17" label="17 · Rewards · Marketplace" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L17 Marketplace"><KaleRewardsMarketplaceLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-20" label="20 · Settings" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L20 Settings"><KaleSettingsLumen /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="lumen-second" title="0c · Lumen — Second assessment" subtitle="A cycle later: the assessment reminder that brings members back. Results reuse the onboarding result screens, which now show whether each level went up, held, or dropped.">
          <DCArtboard id="lum-21" label="21 · Assessment reminder" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L21 Reminder"><KaleAssessReminderLumen /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="lumen-states" title="0d · Lumen — Empty & error states" subtitle="The moments when there's nothing to show or something's wrong, in the Lumen language.">
          <DCArtboard id="lum-26" label="26 · Rewards · empty" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L26 Rewards empty"><KaleRewardsEmptyLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-27" label="27 · Activity log · empty" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L27 Activity empty"><KaleActivityEmptyLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-28" label="28 · Sync error" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L28 Sync error"><KaleSyncErrorLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="lum-29" label="29 · Assessment missed" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="L29 Assessment missed"><KaleAssessMissedLumen /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="lumen-running-years" title="0f · Lumen — Your Running Years (new feature)" subtitle="A living longevity surface, entered through emotion: an intro on why we train (the people and moments still ahead) → set your goal (the moment + the age) → the main screen, where the goal is interactive: drag your target age and watch the trajectory marker and 'on track' status respond. The chart is the proof — bright keep-training vs muted do-nothing, the shaded gap is the years you keep. Placement TBD.">
          <DCArtboard id="ry-00" label="00 · Intro · why we train" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="RY00 Intro"><KaleRunningYearsIntroLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ry-goal" label="01 · Set your goal" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="RY Goal"><KaleRunningYearsGoalLumen /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ry-01" label="02 · Running Years · main" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="RY01 Main"><KaleRunningYearsLumen /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="lumen-web" title="0e · Lumen — Web · Longevity Marketplace" subtitle="kale.co/rewards in the Lumen language — the signature lives in the teal hero bands (curved divider + lime numerals), with deep-teal and mint on the light marketplace surface.">
          <DCArtboard id="lum-30" label="30 · Rewards landing" width={DESKTOP_W} height={DESKTOP_H}>
            <WebFrame label="Rewards · Kale" url="kale.co/rewards"><KaleWebRewardsLumen /></WebFrame>
          </DCArtboard>
          <DCArtboard id="lum-31" label="31 · Browse · Gear" width={DESKTOP_W} height={DESKTOP_H}>
            <WebFrame label="Gear · Kale Rewards" url="kale.co/rewards/gear"><KaleWebBrowseLumen /></WebFrame>
          </DCArtboard>
          <DCArtboard id="lum-32" label="32 · Product detail" width={DESKTOP_W} height={DESKTOP_H}>
            <WebFrame label="Eliot Running Tights · Kale" url="kale.co/rewards/gear/tracksmith-eliot-tights"><KaleWebProductLumen /></WebFrame>
          </DCArtboard>
          <DCArtboard id="lum-33" label="33 · Checkout" width={DESKTOP_W} height={DESKTOP_H}>
            <WebFrame label="Checkout · Kale" url="kale.co/rewards/checkout"><KaleWebCheckoutLumen /></WebFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="onboarding" title="1 · Onboarding" subtitle="Post-purchase. Three pillars assessed (Cardio · Strength · Knowledge) → official Longevity Level.">
          <DCArtboard id="ob-01" label="01 · Welcome" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="01 Welcome"><KaleWelcome /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-02" label="02 · Cardio review" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="02 Cardio review"><KaleCardioReview /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-03" label="03 · Strength intro" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="03 Strength intro"><KaleStrengthIntro /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-04" label="04 · Plank · analysing" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="04 Analysing"><KaleStrengthProcessing /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-05" label="05 · Strength results" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="05 Strength results"><KaleStrengthResults /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-06" label="06 · Knowledge intro" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="06 Knowledge intro"><KaleKnowledgeIntro /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-07" label="07 · Quiz question · correct" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="07 Quiz · correct"><KaleQuizQuestion /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-07b" label="07b · Quiz question · wrong" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="07b Quiz · wrong"><KaleQuizQuestionWrong /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-08" label="08 · Knowledge results" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="08 Knowledge results"><KaleKnowledgeResults /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-09" label="09 · Level reveal" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="09 Level reveal"><KaleLevelReveal /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-10" label="10 · Health Years" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="10 Health Years"><KaleHealthYears /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ob-11" label="11 · First cycle rewards" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="11 Earnings"><KaleEarningsPreview /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="normal-use" title="2 · Normal use" subtitle="Home, Fitness tab (Cardio sub-pages), Rewards tab. Strength + Knowledge sub-pages and Settings follow in the next pass.">
          <DCArtboard id="nu-1"  label="12 · Home" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="12 Home"><KaleHomeV2 /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-1-pillars" label="12 · Home · pillar breakdown (previous)" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="12 Home pillars"><ForestHome /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-1b" label="12b · Home · assessment live" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="12b Home · assessment live"><KaleHomeAssessmentLive /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-2"  label="13 · Fitness · Activity log" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="13 Fitness · Log"><KaleFitnessCardio /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-3"  label="14 · Fitness · VO₂max" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="14 Fitness · VO2max"><KaleFitnessVO2 /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-4"  label="15 · Fitness · Intensity" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="15 Fitness · Intensity"><KaleFitnessIntensity /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-5"  label="16 · Rewards · Balance" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="16 Rewards · Balance"><KaleRewardsBalance /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-6"  label="17 · Rewards · Marketplace" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="17 Rewards · Marketplace"><KaleRewardsMarketplace /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-7"  label="18 · Fitness · Strength" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="18 Fitness · Strength"><KaleFitnessStrength /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-8"  label="19 · Fitness · Knowledge" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="19 Fitness · Knowledge"><KaleFitnessKnowledge /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="nu-9"  label="20 · Settings" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="20 Settings"><KaleSettings /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="second-assessment" title="3 · Second assessment" subtitle="A cycle later — reminder, cardio v2 (with vs last), plank PB, then a new Longevity Level.">
          <DCArtboard id="sa-1"  label="21 · Assessment reminder" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="21 Reminder"><KaleAssessReminder /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="sa-2"  label="22 · Cardio review · v2" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="22 Cardio v2"><KaleCardioReviewV2 /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="sa-3"  label="23 · Plank vs last" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="23 Plank vs last"><KalePlankCompare /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="sa-4"  label="24 · Level up · 6 → 7" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="24 Level up"><KaleLevelUpFinale /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="sa-5"  label="25 · Level up · 3D variant" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="25 Level up 3D"><ForestLevelUp3D /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="empty-error" title="4 · Empty & error states" subtitle="Mobile · the moments when there's nothing to show or something has gone wrong.">
          <DCArtboard id="ee-1"  label="26 · Rewards · empty (pre-assessment)" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="26 Rewards empty"><KaleRewardsEmpty /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ee-2"  label="27 · Activity log · empty" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="27 Activity empty"><KaleActivityEmpty /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ee-3"  label="28 · Sync error" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="28 Sync error"><KaleSyncError /></ScreenFrame>
          </DCArtboard>
          <DCArtboard id="ee-4"  label="29 · Assessment missed" width={SCREEN_W} height={SCREEN_H}>
            <ScreenFrame label="29 Assessment missed"><KaleAssessMissed /></ScreenFrame>
          </DCArtboard>
        </DCSection>

        <DCSection id="web" title="5 · Web · Longevity Marketplace" subtitle="kale.co/rewards — full desktop experience for spending Kalettes.">
          <DCArtboard id="web-1"  label="30 · Rewards landing" width={DESKTOP_W} height={DESKTOP_H}>
            <WebFrame label="Rewards · Kale" url="kale.co/rewards"><KaleWebRewards /></WebFrame>
          </DCArtboard>
          <DCArtboard id="web-2"  label="31 · Browse · Gear" width={DESKTOP_W} height={DESKTOP_H}>
            <WebFrame label="Gear · Kale Rewards" url="kale.co/rewards/gear"><KaleWebBrowse /></WebFrame>
          </DCArtboard>
          <DCArtboard id="web-3"  label="32 · Product detail" width={DESKTOP_W} height={DESKTOP_H}>
            <WebFrame label="Eliot Running Tights · Kale" url="kale.co/rewards/gear/tracksmith-eliot-tights"><KaleWebProduct /></WebFrame>
          </DCArtboard>
          <DCArtboard id="web-4"  label="33 · Checkout" width={DESKTOP_W} height={DESKTOP_H}>
            <WebFrame label="Checkout · Kale" url="kale.co/rewards/checkout"><KaleWebCheckout /></WebFrame>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Lumen (proposed)">
          <TweakColor
            label="Button colour"
            value={t.lumenBtn}
            onChange={v => setTweak('lumenBtn', v)}
            options={['#CCFA7D', '#00C896', '#EAF3E4', '#E8826E']}
          />
        </TweakSection>
        <TweakSection label="Onboarding">
          <TweakToggle
            label="Diagonal accent stripe"
            value={t.showAccent}
            onChange={v => setTweak('showAccent', v)}
          />
          <TweakColor
            label="Accent colour"
            value={t.accentColor}
            onChange={v => setTweak('accentColor', v)}
            options={['#00C896', '#C8E898', '#00a284']}
          />
        </TweakSection>
        <TweakSection label="Brand">
          <TweakRadio
            label="Level card"
            value={t.levelTone}
            options={['dark', 'mint']}
            onChange={v => setTweak('levelTone', v)}
          />
        </TweakSection>
      </TweaksPanel>

      {/* Live CSS swap based on accent tweak */}
      <style>{`
        :root { --lumen-btn: ${t.lumenBtn}; --lumen-btn-fg: #004C4C; }
        ${t.accentColor === '#C8E898'
          ? `:root { --kale-mint: #C8E898; }`
          : t.accentColor === '#00a284'
          ? `:root { --kale-mint: #00a284; }`
          : ``
        }
        ${t.showAccent ? '' : `.diag-accent { display: none !important; }`}
      `}</style>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
