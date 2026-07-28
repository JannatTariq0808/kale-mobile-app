/* eslint-disable */
// Kale auth screens — reskin of Athlete sign-up / log-in flow.
// 5 screens: Name, Sign Up, Log In, Tell Us About Yourself, Create Password.

// Progress dots/segments at top, like Athlete's step indicator
function StepProgress({ step, total, withBack }) {
  return (
    <div style={{ padding: '0 24px' }}>
      {withBack && (
        <div style={{ marginBottom: 18 }}>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, marginLeft: -6, color: 'var(--kale-dark)',
          }}>
            <IconArrowLeft w={22} h={22} sw={2} />
          </button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginBottom: 26 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: i < step ? 'var(--kale-mint)' : 'var(--kale-progress-track)',
          }} />
        ))}
      </div>
    </div>
  );
}

// ---------- Auth: Name ----------
function AuthName() {
  const [val, setVal] = React.useState('');
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ marginTop: 6 }}>
          <StepProgress step={1} total={5} />
        </div>
        <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 className="h-title" style={{ margin: 0 }}>What's your name?</h1>
          <p className="t-body" style={{ color: 'var(--kale-fg-muted)', margin: '8px 0 28px' }}>Please enter below</p>
          <input className="kale-input" placeholder="First name" value={val} onChange={e=>setVal(e.target.value)} />

          <div style={{ marginTop: 'auto', paddingBottom: 28 }}>
            <CTA>Next</CTA>
            <div style={{ textAlign: 'center' }}>
              <a className="skip-link" href="#" onClick={(e)=>e.preventDefault()}>Skip for now</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- Auth: Sign Up ----------
function AuthSignUp() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ marginTop: 6 }}>
          <StepProgress step={1} total={3} withBack />
        </div>
        <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h1 className="h-title" style={{ margin: 0 }}>Sign up</h1>
          <p className="t-body" style={{ color: 'var(--kale-fg-muted)', margin: '8px 0 24px' }}>
            Sign up and sync your data to find out your Longevity Level.
          </p>

          <label className="kale-label">Email</label>
          <input className="kale-input" placeholder="johnsmith@gmail.com" />

          <label className="kale-label" style={{ marginTop: 16 }}>Name</label>
          <input className="kale-input" placeholder="Enter your name" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div className="divider" style={{ flex: 1 }} />
            <span className="t-small" style={{ color: 'var(--kale-fg-muted)' }}>Or register with</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button style={oauthBtn}><IconGoogle /></button>
            <button style={oauthBtn}><IconApple /></button>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 32, paddingBottom: 28 }}>
            <CTA>Next</CTA>
          </div>
        </div>
      </div>
    </>
  );
}

const oauthBtn = {
  flex: 1, height: 54, borderRadius: 12,
  background: '#fff', border: '1.5px solid var(--kale-hairline)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'border-color 200ms, background 200ms',
};

// ---------- Auth: Log In ----------
function AuthLogIn() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ padding: '14px 24px 0' }}>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, marginLeft: -6, color: 'var(--kale-dark)',
          }}>
            <IconArrowLeft w={22} h={22} />
          </button>
        </div>
        <div style={{ padding: '24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 className="h-title" style={{ margin: 0 }}>Log in</h1>
          <p className="t-body" style={{ color: 'var(--kale-fg-muted)', margin: '8px 0 28px' }}>
            Log in to access your Longevity Level.
          </p>

          <label className="kale-label">Email</label>
          <input className="kale-input" placeholder="johnsmith@gmail.com" />

          <label className="kale-label" style={{ marginTop: 16 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input className="kale-input has-icon" type="password" placeholder="••••••••" />
            <button style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--kale-fg-muted)',
              padding: 4,
            }}>
              <IconEye w={20} h={20} />
            </button>
          </div>
          <div style={{ marginTop: 10, textAlign: 'right' }}>
            <a href="#" onClick={e=>e.preventDefault()} style={{
              fontSize: 13, fontWeight: 600, color: 'var(--kale-dark)', textDecoration: 'underline',
            }}>Forgot password?</a>
          </div>

          <div style={{ marginTop: 36 }}>
            <CTA>Log in</CTA>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- Auth: Tell Us About Yourself ----------
function AuthAboutYou() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ marginTop: 6 }}>
          <StepProgress step={2} total={3} withBack />
        </div>
        <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h1 className="h-title" style={{ margin: 0 }}>Tell us about yourself</h1>
          <p className="t-body" style={{ color: 'var(--kale-fg-muted)', margin: '8px 0 24px' }}>
            We use this to personalise your experience and your Longevity Level.
          </p>

          <label className="kale-label">Gender</label>
          <div style={{ position: 'relative' }}>
            <select className="kale-input" style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: 44, color: '#9aa39e' }} defaultValue="">
              <option value="" disabled>Select here</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
            <IconChevDown w={18} h={18} style={{
              position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--kale-fg-muted)', pointerEvents: 'none',
            }}/>
          </div>

          <label className="kale-label" style={{ marginTop: 18 }}>Date of birth</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['DD','MM','YYYY'].map((ph, i) => (
              <div key={ph} style={{ position: 'relative', flex: i === 2 ? 1.2 : 1 }}>
                <select className="kale-input" style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: 32, color: '#9aa39e' }} defaultValue="">
                  <option value="" disabled>{ph}</option>
                  {i===0 && Array.from({length:31}).map((_,d)=><option key={d}>{d+1}</option>)}
                  {i===1 && ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m=><option key={m}>{m}</option>)}
                  {i===2 && Array.from({length:80}).map((_,y)=><option key={y}>{2010-y}</option>)}
                </select>
                <IconChevDown w={14} h={14} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--kale-fg-muted)', pointerEvents: 'none',
                }}/>
              </div>
            ))}
          </div>

          <label className="kale-label" style={{ marginTop: 18 }}>Weight</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="kale-input" placeholder="Enter weight" style={{ flex: 2 }} />
            <div style={{ position: 'relative', flex: 1 }}>
              <select className="kale-input" style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: 32 }} defaultValue="kgs">
                <option>kgs</option>
                <option>lbs</option>
              </select>
              <IconChevDown w={14} h={14} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--kale-fg-muted)', pointerEvents: 'none',
              }}/>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 32, paddingBottom: 28 }}>
            <CTA>Next</CTA>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- Auth: Create Password ----------
function AuthPassword() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <StatusBar tone="dark" />
        <div style={{ marginTop: 6 }}>
          <StepProgress step={3} total={3} withBack />
        </div>
        <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 className="h-title" style={{ margin: 0 }}>Create password</h1>
          <p className="t-body" style={{ color: 'var(--kale-fg-muted)', margin: '8px 0 28px' }}>
            Create a secure password to protect your account and keep your data safe.
          </p>

          <label className="kale-label">Create a password</label>
          <div style={{ position: 'relative' }}>
            <input className="kale-input has-icon" type="password" placeholder="Must be 8 characters" />
            <button style={eyeBtn}><IconEye w={20} h={20} /></button>
          </div>

          <label className="kale-label" style={{ marginTop: 18 }}>Confirm password</label>
          <div style={{ position: 'relative' }}>
            <input className="kale-input has-icon" type="password" placeholder="Repeat password" />
            <button style={eyeBtn}><IconEye w={20} h={20} /></button>
          </div>

          <div style={{ marginTop: 36 }}>
            <CTA icon={null}>Done</CTA>
          </div>
        </div>
      </div>
    </>
  );
}

const eyeBtn = {
  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: 'var(--kale-fg-muted)', padding: 4,
};

Object.assign(window, { AuthName, AuthSignUp, AuthLogIn, AuthAboutYou, AuthPassword });
