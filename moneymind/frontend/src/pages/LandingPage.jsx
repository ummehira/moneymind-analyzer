import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = ['Features', 'How It Works', 'About']

const FEATURES = [
  { icon: '◈', title: 'AI Behavior Intelligence', desc: 'Advanced algorithms analyze your spending patterns to classify your financial personality — Saver, Balanced, Impulsive, or Risk Taker — with a 0–100 behavioral score.' },
  { icon: '◉', title: 'Real-Time Predictions', desc: 'Our prediction engine forecasts your end-of-month savings, overspending risk, and category-level budget pressure using your live transaction data.' },
  { icon: '◎', title: 'Smart Alert System', desc: 'Instant notifications for unusual transactions, budget overruns, and anomalous spending spikes — so you stay in control before problems escalate.' },
  { icon: '▣', title: 'PKR-First Finance', desc: 'Built natively for Pakistani users. All analytics, reports, and insights are calibrated for PKR amounts, local spending patterns, and Pakistani financial context.' },
  { icon: '▤', title: 'PDF Report Downloads', desc: 'Generate professional monthly reports, transaction statements, and AI behavior analysis PDFs — perfect for personal review, tax filing, or financial planning.' },
  { icon: '▥', title: 'Category Breakdown', desc: 'Visual pie and bar charts break down spending by Housing, Food, Transport, Shopping, Healthcare and more — revealing exactly where your money goes.' },
]

const STEPS = [
  { num: '01', title: 'Create Your Account',    desc: 'Register in seconds. Choose PKR as your currency. Your dashboard is ready immediately.' },
  { num: '02', title: 'Log Your Transactions',  desc: 'Add income and expenses manually. Categorize them. The AI starts learning your patterns from day one.' },
  { num: '03', title: 'Get AI Insights',        desc: 'MoneyMind analyzes your behavior, computes your financial personality score, and surfaces personalized recommendations.' },
  { num: '04', title: 'Download Your Reports',  desc: 'Export professional PDF reports and CSV statements whenever you need them.' },
]

const CURRENCIES = [
  { code: 'PKR', symbol: 'Rs.' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'AED', symbol: 'AED' },
  { code: 'SAR', symbol: 'SAR' },
  { code: 'INR', symbol: '₹' },
]

const STATS = [
  { value: '10,000+', label: 'Active Users' },
  { value: 'Rs. 2B+', label: 'Tracked Monthly' },
  { value: '98%',     label: 'Accuracy Rate' },
  { value: '4.9★',   label: 'User Rating' },
]

export default function LandingPage() {
  const [scrolled, setScrolled]           = useState(false)
  const [activeCurrency, setActiveCurrency] = useState('PKR')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const demoValues = {
    PKR: { income: '125,000', expense: '87,400', savings: '37,600' },
    USD: { income: '1,200',   expense: '840',    savings: '360' },
    EUR: { income: '1,100',   expense: '770',    savings: '330' },
    GBP: { income: '950',     expense: '665',    savings: '285' },
    AED: { income: '4,400',   expense: '3,080',  savings: '1,320' },
    SAR: { income: '4,500',   expense: '3,150',  savings: '1,350' },
    INR: { income: '99,000',  expense: '69,300', savings: '29,700' },
  }

  const sym  = CURRENCIES.find(c => c.code === activeCurrency)?.symbol || 'Rs.'
  const vals = demoValues[activeCurrency] || demoValues.PKR

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: 'var(--text-primary)' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo.png" alt="MoneyMind" style={{ height: 40, width: 40, objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.1 }}>
                <span style={{ color: 'var(--navy-800)' }}>Money</span>
                <span style={{ color: 'var(--teal-600)' }}>Mind</span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Analyzer</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="landing-desktop-nav">
            {NAV_LINKS.map(l => (
              <a key={l}
                href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--teal-600)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{l}</a>
            ))}
          </nav>

          {/* Desktop CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="landing-desktop-nav">
            <Link to="/login"    className="btn btn-ghost"   style={{ padding: '7px 16px', fontSize: 13 }}>Log In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>Get Started Free</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="landing-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none', border: '1px solid var(--border-color)',
              borderRadius: 8, width: 38, height: 38,
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 18, color: 'var(--navy-800)',
              flexShrink: 0,
            }}
          >
            {mobileMenuOpen ? 'x' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div style={{
            background: 'white',
            borderTop: '1px solid var(--border-color)',
            padding: '16px 20px 20px',
            boxShadow: 'var(--shadow-md)',
          }}
            className="landing-mobile-menu"
          >
            {NAV_LINKS.map(l => (
              <a key={l}
                href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block', padding: '11px 0',
                  fontSize: 15, fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >{l}</a>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Link to="/login"    className="btn btn-ghost"   style={{ flex: 1, justifyContent: 'center', fontSize: 14 }} onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 14 }} onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 68,
        background: 'linear-gradient(150deg, #ffffff 0%, #f0fdfa 45%, #e0f2fe 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', right: '0%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px', width: '100%', position: 'relative' }}>
          <div className="hero-grid">

            {/* Left */}
            <div style={{ animation: 'fadeUp 0.7s ease both' }}>
              <div className="badge badge-teal" style={{ marginBottom: 18, fontSize: 12 }}>
                AI-Powered Financial Intelligence
              </div>
              <h1 className="hero-title" style={{ fontWeight: 800, lineHeight: 1.1, marginBottom: 18, letterSpacing: -1.5, color: 'var(--navy-900)' }}>
                Understand Your<br />
                <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Spending.</span>{' '}
                Shape<br />Your Future.
              </h1>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28, maxWidth: 480 }}>
                MoneyMind Analyzer uses behavioral AI to classify your financial personality,
                predict spending risks, and deliver personalized insights — all in{' '}
                <strong style={{ color: 'var(--teal-600)' }}>Pakistani Rupees</strong>.
              </p>

              {/* Currency picker */}
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 12, padding: '10px 14px', marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CURRENCY</span>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {CURRENCIES.slice(0, 4).map(c => (
                    <button key={c.code} onClick={() => setActiveCurrency(c.code)} style={{
                      padding: '4px 9px', borderRadius: 6,
                      border: activeCurrency === c.code ? '1.5px solid var(--teal-500)' : '1px solid var(--border-color)',
                      background: activeCurrency === c.code ? 'rgba(20,184,166,0.1)' : 'var(--bg-secondary)',
                      color: activeCurrency === c.code ? 'var(--teal-600)' : 'var(--text-muted)',
                      fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', transition: 'all 0.15s', cursor: 'pointer',
                    }}>{c.code}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: 15, padding: '12px 26px' }}>Start Free Analysis</Link>
                <a href="#how-it-works" className="btn btn-ghost" style={{ fontSize: 15, padding: '12px 22px' }}>How It Works</a>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-light)' }}>
                Free forever • No credit card required • PKR built-in
              </p>
            </div>

            {/* Right — Demo card */}
            <div style={{ animation: 'fadeUp 0.7s ease 0.15s both' }}>
              <div style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 20,
                padding: 24,
                boxShadow: '0 20px 60px rgba(15,41,66,0.1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>BEHAVIOR SCORE</div>
                    <div style={{ fontSize: 26, fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>72 / 100</div>
                  </div>
                  <div className="badge badge-teal" style={{ fontSize: 11, padding: '5px 12px' }}>Balanced Spender</div>
                </div>

                <div style={{ height: 7, background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 16, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <div style={{ height: '100%', width: '72%', background: 'var(--gradient-brand)', borderRadius: 4 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[
                    { label: 'Monthly Income',  val: `${sym} ${vals.income}`,  color: 'var(--teal-600)' },
                    { label: 'Total Expenses',  val: `${sym} ${vals.expense}`, color: 'var(--red-500)' },
                    { label: 'Net Savings',     val: `${sym} ${vals.savings}`, color: 'var(--navy-800)' },
                    { label: 'Savings Rate',    val: '30.1%',                  color: 'var(--teal-600)' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg-secondary)', borderRadius: 9, padding: '9px 12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 3, textTransform: 'uppercase' }}>{s.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'linear-gradient(135deg, #f0fdfa, #e0f9f5)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 9, padding: '10px 12px', fontSize: 12, color: 'var(--teal-600)', display: 'flex', gap: 7 }}>
                  <span>◉</span>
                  <span><strong>AI Insight:</strong> Your dining spend rose 24% this week. Reducing weekend dining by {sym} {activeCurrency === 'PKR' ? '3,000' : '30'} could improve your score by 4 points.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'var(--navy-800)', padding: '32px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 26, fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge badge-teal" style={{ marginBottom: 14 }}>Core Features</div>
            <h2 className="section-title" style={{ fontWeight: 800, letterSpacing: -1, color: 'var(--navy-800)', marginBottom: 12 }}>
              Everything you need to <span style={{ color: 'var(--teal-600)' }}>master your money</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
              From transaction tracking to AI-powered behavioral analysis — all in one platform.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card"
                style={{ animation: `fadeUp 0.5s ease ${i * 0.07}s both`, transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--teal-400)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(20,184,166,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'linear-gradient(135deg,#f0fdfa,#e0f9f5)', border: '1px solid rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12, color: 'var(--teal-600)' }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 7, color: 'var(--navy-800)' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRENCY ── */}
      <section style={{ padding: '72px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div className="currency-grid">
            <div>
              <div className="badge badge-teal" style={{ marginBottom: 14 }}>Multi-Currency Support</div>
              <h2 className="section-title" style={{ fontWeight: 800, letterSpacing: -1, marginBottom: 14, color: 'var(--navy-800)' }}>
                Built for Pakistan,<br />ready for the world
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
                MoneyMind is calibrated specifically for Pakistani financial context — PKR amounts, local spending benchmarks, and culturally relevant AI advice.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {CURRENCIES.map(c => (
                  <div key={c.code} style={{
                    padding: '7px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6,
                    background: c.code === 'PKR' ? 'rgba(20,184,166,0.1)' : 'white',
                    border: c.code === 'PKR' ? '1.5px solid var(--teal-500)' : '1px solid var(--border-color)',
                    color: c.code === 'PKR' ? 'var(--teal-600)' : 'var(--text-secondary)',
                    fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)',
                  }}>
                    <span>{c.symbol}</span><span>{c.code}</span>
                    {c.code === 'PKR' && <span className="badge badge-teal" style={{ fontSize: 9, padding: '1px 5px' }}>DEFAULT</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Monthly Report Preview — PKR</div>
              {[
                { cat: 'Housing / Rent', amt: 'Rs. 35,000', pct: 40 },
                { cat: 'Food & Dining',  amt: 'Rs. 18,500', pct: 21 },
                { cat: 'Transport',      amt: 'Rs. 9,200',  pct: 11 },
                { cat: 'Shopping',       amt: 'Rs. 14,700', pct: 17 },
                { cat: 'Utilities',      amt: 'Rs. 9,500',  pct: 11 },
              ].map(r => (
                <div key={r.cat} style={{ marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{r.cat}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal-600)', fontWeight: 600 }}>{r.amt}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.pct}%`, background: 'var(--gradient-brand)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>Net Savings</span>
                <span style={{ fontWeight: 700, color: 'var(--teal-600)', fontFamily: 'var(--font-mono)' }}>Rs. 37,600</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '80px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="badge badge-teal" style={{ marginBottom: 14 }}>How It Works</div>
            <h2 className="section-title" style={{ fontWeight: 800, letterSpacing: -1, color: 'var(--navy-800)' }}>
              Up and running in <span style={{ color: 'var(--teal-600)' }}>under 5 minutes</span>
            </h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ textAlign: 'center', animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px', background: 'white', border: '2px solid var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'var(--teal-600)', fontFamily: 'var(--font-mono)', boxShadow: '0 4px 16px rgba(20,184,166,0.15)' }}>{s.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 7, color: 'var(--navy-800)' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '72px 0', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ background: 'var(--gradient-navy)', borderRadius: 20, padding: '52px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(20,184,166,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <h2 className="section-title" style={{ fontWeight: 800, marginBottom: 14, color: 'white', position: 'relative' }}>
              Start understanding your money today
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 28, position: 'relative' }}>
              Join thousands of Pakistanis taking control of their financial future with AI.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 15, padding: '13px 32px', position: 'relative' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--navy-900)', padding: '52px 0 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div className="footer-grid" style={{ marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <img src="/logo.png" alt="MoneyMind" style={{ height: 38, width: 38, objectFit: 'contain' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'white' }}>Money<span style={{ color: 'var(--teal-400)' }}>Mind</span></div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Analyzer</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 240 }}>
                AI-based personal spending behavior intelligence. Understand your spending. Shape your future.
              </p>
              <p style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>Default: PKR — Pakistani Rupee</p>
            </div>
            {[
              { h: 'Product', links: ['Dashboard','Analytics','AI Behavior','Predictions','Reports','Alerts'] },
              { h: 'Company', links: ['About','Blog','Careers','Press','Contact'] },
              { h: 'Legal',   links: ['Privacy Policy','Terms of Service','Cookie Policy','Security'] },
            ].map(col => (
              <div key={col.h}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>{col.h}</div>
                {col.links.map(l => (
                  <a key={l} href="#"
                    style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--teal-400)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                  >{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} MoneyMind Analyzer. All rights reserved.</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>Built with AI for Pakistan's financial future</p>
          </div>
        </div>
      </footer>

      {/* ── ALL RESPONSIVE STYLES ── */}
      <style>{`

        /* Desktop nav visible, mobile hidden by default */
        .landing-desktop-nav   { display: flex !important; }
        .landing-mobile-menu-btn { display: none !important; }
        .landing-mobile-menu   { display: block; }

        /* Hero */
        .hero-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .hero-title   { font-size: 52px; }
        .section-title { font-size: 38px; }

        /* Grids */
        .stats-grid    { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .currency-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .steps-grid    { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
        .footer-grid   { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }

        /* Tablet */
        @media (max-width: 900px) {
          .hero-grid      { grid-template-columns: 1fr; gap: 36px; }
          .hero-title     { font-size: 40px; }
          .section-title  { font-size: 30px; }
          .stats-grid     { grid-template-columns: repeat(2,1fr); gap: 16px; }
          .features-grid  { grid-template-columns: repeat(2,1fr); }
          .currency-grid  { grid-template-columns: 1fr; gap: 32px; }
          .steps-grid     { grid-template-columns: repeat(2,1fr); gap: 20px; }
          .footer-grid    { grid-template-columns: 1fr 1fr; gap: 28px; }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .landing-desktop-nav    { display: none !important; }
          .landing-mobile-menu-btn { display: flex !important; }

          .hero-title    { font-size: 32px; }
          .section-title { font-size: 26px; }

          .stats-grid    { grid-template-columns: repeat(2,1fr); gap: 12px; }
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid    { grid-template-columns: 1fr 1fr; gap: 16px; }
          .footer-grid   { grid-template-columns: 1fr 1fr; gap: 24px; }

          .hero-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 400px) {
          .steps-grid  { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
          .stats-grid  { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>
    </div>
  )
}