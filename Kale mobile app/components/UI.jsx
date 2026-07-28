/* eslint-disable */
// Shared UI primitives for the Kale mobile app reskin.

// ---------- Icons (Lucide-style, stroke 2 on 24 grid) ----------
const Icon = ({ d, w = 24, h = 24, stroke = 'currentColor', fill = 'none', sw = 2, children, style }) => (
  <svg width={w} height={h} viewBox={`0 0 24 24`} fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d ? <path d={d} /> : children}
  </svg>
);

const IconArrowRight = (p) => <Icon {...p} d="M5 12h14M13 5l7 7-7 7" />;
const IconArrowLeft  = (p) => <Icon {...p} d="M19 12H5M12 19l-7-7 7-7" />;
const IconChevDown   = (p) => <Icon {...p} d="M6 9l6 6 6-6" />;
const IconChevRight  = (p) => <Icon {...p} d="M9 6l6 6-6 6" />;
const IconBell       = (p) => <Icon {...p} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />;
const IconEye        = (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Icon>;
const IconInfo       = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></Icon>;
const IconUp         = (p) => <Icon {...p} sw={2.4} d="M12 19V5M5 12l7-7 7 7" />;
const IconDown       = (p) => <Icon {...p} sw={2.4} d="M12 5v14M5 12l7 7 7-7" />;
const IconHome       = (p) => <Icon {...p} d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-4v-7h-8v7H4a1 1 0 0 1-1-1Z" />;
const IconHeart      = (p) => <Icon {...p}><path d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 1 0-7.78 7.78l1.06 1.07L12 21.23l7.78-7.78 1.06-1.07a5.5 5.5 0 0 0 0-7.78Z"/><path d="m8 12 2-2 2 4 3-6 1.5 3H21"/></Icon>;
const IconDumbbell   = (p) => <Icon {...p}><path d="M14.4 14.4 9.6 9.6"/><path d="M18.66 14.66 21 12.32a2 2 0 0 0 0-2.83l-2.59-2.58a2 2 0 0 0-2.82 0L13.24 9.24"/><path d="M5.34 9.34 3 11.68a2 2 0 0 0 0 2.83l2.59 2.58a2 2 0 0 0 2.82 0l2.35-2.35"/><path d="m21 21-1.42-1.42"/><path d="m3 3 1.42 1.42"/></Icon>;
const IconBulb       = (p) => <Icon {...p}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14a5 5 0 1 0-6.18 0 4 4 0 0 1 1.59 3v1h3v-1a4 4 0 0 1 1.6-3Z"/></Icon>;
const IconActivity   = (p) => <Icon {...p} d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const IconRunner     = (p) => <Icon {...p}><circle cx="13" cy="4" r="2"/><path d="m4 22 4-9 4 2 1 7"/><path d="m8 13 3-5 3 2 4-1"/><path d="m14 8 3 4-2 3"/></Icon>;
const IconPulse      = (p) => <Icon {...p} d="M3 12h3l2-5 4 10 2-5h7" />;
const IconGoogle     = ({ w = 22, h = 22 }) => (
  <svg width={w} height={h} viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 1 1-3.3-13l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"/>
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"/>
    <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A12 12 0 0 1 12.7 28.5l-6.5 5A20 20 0 0 0 24 44Z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12.1 12.1 0 0 1-4.1 5.5l6.2 5.3C42 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5Z"/>
  </svg>
);
const IconApple = ({ w = 22, h = 22 }) => (
  <svg width={w} height={h} viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 1.6c0 1.1-.45 2.13-1.2 2.86-.78.76-2 1.32-3.05 1.24-.13-1.07.4-2.18 1.13-2.91.79-.79 2.13-1.36 3.12-1.19ZM20.1 17.1c-.55 1.25-.81 1.8-1.51 2.92-.99 1.55-2.38 3.48-4.1 3.5-1.54.01-1.93-1-4-1-2.07.01-2.5 1.02-4.04 1-1.72-.02-3.04-1.77-4.02-3.32C-.31 16-.6 8.9 3.45 5.92c1.36-1 2.84-1.55 4.23-1.55 1.96 0 3.2 1.07 4.82 1.07 1.57 0 2.53-1.07 4.79-1.07 1.34 0 2.77.73 3.79 1.99-3.33 1.83-2.79 6.59.02 7.74-.55 1.25-.81 1.8-1.51 2.92Z"/></svg>
);

// ---------- Phone screen frame ----------
// Edge-to-edge mobile screen. Status bar + (optional) home indicator are drawn in.
function PhoneScreen({ children, statusBarColor = 'dark', homeIndicator = true, label, screenStyle, screenId }) {
  return (
    <div className="screen" style={screenStyle} data-screen-label={label} data-screen-id={screenId}>
      {children}
      <div className={`home-indicator ${statusBarColor === 'light' ? 'home-indicator-light' : ''}`} style={ homeIndicator ? null : { display: 'none' } } />
    </div>
  );
}

function StatusBar({ tone = 'dark', time = '9:41' }) {
  const cls = tone === 'light' ? 'statusbar statusbar-light' : 'statusbar statusbar-dark';
  return (
    <div className={cls}>
      <span>{time}</span>
      <span className="statusbar-icons">
        {/* signal */}
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2.5" width="3" height="8.5" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/></svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M1 4a11 11 0 0 1 14 0"/><path d="M3.5 6.5a7.5 7.5 0 0 1 9 0"/><path d="M6 9a4 4 0 0 1 4 0"/></svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" opacity="0.6"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/><rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.6"/></svg>
      </span>
    </div>
  );
}

// ---------- Kale wordmark (official SVG from the design system) ----------
function Wordmark({ tone = 'dark', size = 26 }) {
  const src = tone === 'mint'  ? 'assets/kale-wordmark-mint.svg'
            : tone === 'white' ? 'assets/kale-wordmark-white.svg'
            :                    'assets/kale-wordmark-dark.svg';
  // Kale.svg native viewBox is 91×49 — preserve that aspect ratio.
  return <img src={src} alt="Kale" className="wordmark" style={{ height: size, width: 'auto', display: 'inline-block' }} />;
}

// ---------- Buttons ----------
function CTA({ children, onClick, variant = 'mint', icon = 'right', disabled = false, style }) {
  const cls = `cta ${variant === 'dark' ? 'cta-dark' : variant === 'secondary' ? 'cta-secondary' : ''}`;
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      <span>{children}</span>
      {icon === 'right' && <IconArrowRight w={20} h={20} />}
    </button>
  );
}

// ---------- Progress bar ----------
function ProgressBar({ pct = 0.65, height = 8 }) {
  return (
    <div className="pbar" style={{ height }}>
      <div className="pbar-fill" style={{ width: `${Math.max(0, Math.min(1, pct)) * 100}%` }} />
    </div>
  );
}

// Tick-marked progress bar (used on Cardio/Strength/Knowledge detail screens — 7/8/9 ticks)
function TickProgressBar({ pct = 0.65 }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ProgressBar pct={pct} height={8} />
      {/* level tick guides */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
        <div style={{ flex: 1.5 }} />
        <div style={{ width: 1, background: 'rgba(255,255,255,0.7)' }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 1, background: 'rgba(255,255,255,0.7)' }} />
        <div style={{ flex: 0.5 }} />
      </div>
    </div>
  );
}

// ---------- Delta indicator (+2↑ or -1↓) ----------
function Delta({ value }) {
  const positive = value >= 0;
  return (
    <span className={positive ? 'delta-up' : 'delta-down'} style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 700 }}>
      {positive ? '+' : ''}{value}
      {positive ? <IconUp w={12} h={12} sw={3} /> : <IconDown w={12} h={12} sw={3} />}
    </span>
  );
}

// ---------- Bottom navigation ----------
function BottomNav({ active = 'home' }) {
  const items = [
    { id: 'home',      icon: IconHome     },
    { id: 'cardio',    icon: IconHeart    },
    { id: 'strength',  icon: IconDumbbell },
    { id: 'knowledge', icon: IconBulb     },
  ];
  return (
    <div className="botnav">
      {items.map(it => {
        const I = it.icon;
        return (
          <button key={it.id} className={`botnav-item ${active === it.id ? 'active' : ''}`}>
            <I w={26} h={26} sw={active === it.id ? 2.2 : 1.8} />
          </button>
        );
      })}
    </div>
  );
}

// Export to global scope
Object.assign(window, {
  PhoneScreen, StatusBar, Wordmark, CTA, ProgressBar, TickProgressBar, Delta, BottomNav,
  IconArrowRight, IconArrowLeft, IconChevDown, IconChevRight, IconBell, IconEye, IconInfo,
  IconUp, IconDown, IconHome, IconHeart, IconDumbbell, IconBulb, IconActivity, IconRunner, IconPulse,
  IconGoogle, IconApple, Icon,
});
