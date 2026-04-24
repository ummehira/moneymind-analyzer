import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = ['Features', 'How It Works', 'Pricing', 'About']

const FEATURES = [
  { icon: '◈', title: 'AI Behavior Intelligence', desc: 'Advanced algorithms analyze your spending patterns to classify your financial personality — Saver, Balanced, Impulsive, or Risk Taker — with a 0–100 behavioral score.' },
  { icon: '◉', title: 'Real-Time Predictions', desc: 'Our prediction engine forecasts your end-of-month savings, overspending risk, and category-level budget pressure using your live transaction data.' },
  { icon: '◎', title: 'Smart Alert System', desc: 'Instant notifications for unusual transactions, budget overruns, and anomalous spending spikes — so you stay in control before problems escalate.' },
  { icon: '▣', title: 'PKR-First Finance', desc: 'Built natively for Pakistani users. All analytics, reports, and insights are calibrated for PKR amounts, local spending patterns, and Pakistani financial context.' },
  { icon: '▤', title: 'PDF Report Downloads', desc: 'Generate professional monthly reports, transaction statements, and AI behavior analysis PDFs — perfect for personal review, tax filing, or financial planning.' },
  { icon: '▥', title: 'Category Breakdown', desc: 'Visual pie and bar charts break down spending by Housing, Food, Transport, Shopping, Healthcare and more — revealing exactly where your money goes.' },
]

const STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Register in seconds. Choose PKR as your currency. Your dashboard is ready immediately.' },
  { num: '02', title: 'Log Your Transactions', desc: 'Add income and expenses manually. Categorize them. The AI starts learning your patterns from day one.' },
  { num: '03', title: 'Get AI Insights', desc: 'MoneyMind analyzes your behavior, computes your financial personality score, and surfaces personalized recommendations.' },
  { num: '04', title: 'Download Your Reports', desc: 'Export professional PDF reports and CSV statements whenever you need them.' },
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
  { value: '98%', label: 'Accuracy Rate' },
  { value: '4.9★', label: 'User Rating' },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeCurrency, setActiveCurrency] = useState('PKR')

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

  const sym = CURRENCIES.find(c => c.code === activeCurrency)?.symbol || 'Rs.'
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
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.png" alt="MoneyMind" style={{ height: 44, width: 44, objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>
                <span style={{ color: 'var(--navy-800)' }}>Money</span>
                <span style={{ color: 'var(--teal-600)' }}>Mind</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Analyzer</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--teal-600)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{l}</a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>Log In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 70,
        background: 'linear-gradient(150deg, #ffffff 0%, #f0fdfa 45%, #e0f2fe 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', right: '0%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

            {/* Left */}
            <div style={{ animation: 'fadeUp 0.7s ease both' }}>
              <div className="badge badge-teal" style={{ marginBottom: 20, fontSize: 12 }}>
                AI-Powered Financial Intelligence
              </div>
              <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: -1.5, color: 'var(--navy-900)' }}>
                Understand Your<br />
                <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Spending.</span>{' '}
                Shape<br />Your Future.
              </h1>
              <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32, maxWidth: 480 }}>
                MoneyMind Analyzer uses behavioral AI to classify your financial personality,
                predict spending risks, and deliver personalized insights — all in{' '}
                <strong style={{ color: 'var(--teal-600)' }}>Pakistani Rupees</strong>.
              </p>

              {/* Currency picker */}
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 16px', marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CURRENCY</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {CURRENCIES.slice(0, 4).map(c => (
                    <button key={c.code} onClick={() => setActiveCurrency(c.code)} style={{
                      padding: '4px 10px', borderRadius: 6,
                      border: activeCurrency === c.code ? '1.5px solid var(--teal-500)' : '1px solid var(--border-color)',
                      background: activeCurrency === c.code ? 'rgba(20,184,166,0.1)' : 'var(--bg-secondary)',
                      color: activeCurrency === c.code ? 'var(--teal-600)' : 'var(--text-muted)',
                      fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', transition: 'all 0.15s', cursor: 'pointer',
                    }}>{c.code}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>Start Free Analysis</Link>
                <a href="#how-it-works" className="btn btn-ghost" style={{ fontSize: 15, padding: '12px 24px' }}>See How It Works</a>
              </div>
              <p style={{ marginTop: 14, fontSize: 12, color: 'var(--text-light)' }}>
                Free forever • No credit card required • PKR built-in
              </p>
            </div>

            {/* Right — Demo card */}
            <div style={{ animation: 'fadeUp 0.7s ease 0.15s both' }}>
              <div style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 20px 60px rgba(15,41,66,0.1), 0 0 0 1px rgba(20,184,166,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>BEHAVIOR SCORE</div>
                    <div style={{ fontSize: 30, fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>72 / 100</div>
                  </div>
                  <div className="badge badge-teal" style={{ fontSize: 12, padding: '6px 14px' }}>Balanced Spender</div>
                </div>

                <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 20, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <div style={{ height: '100%', width: '72%', background: 'var(--gradient-brand)', borderRadius: 4 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Monthly Income',  val: `${sym} ${vals.income}`,  color: 'var(--teal-600)' },
                    { label: 'Total Expenses',  val: `${sym} ${vals.expense}`, color: 'var(--red-500)' },
                    { label: 'Net Savings',     val: `${sym} ${vals.savings}`, color: 'var(--navy-800)' },
                    { label: 'Savings Rate',    val: '30.1%',                  color: 'var(--teal-600)' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>{s.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'linear-gradient(135deg, #f0fdfa, #e0f9f5)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--teal-600)', display: 'flex', gap: 8 }}>
                  <span>◉</span>
                  <span><strong>AI Insight:</strong> Your dining spend rose 24% this week. Reducing weekend dining by {sym} {activeCurrency === 'PKR' ? '3,000' : '30'} could improve your score by 4 points.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'var(--navy-800)', padding: '36px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge badge-teal" style={{ marginBottom: 16 }}>Core Features</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, color: 'var(--navy-800)', marginBottom: 14 }}>
              Everything you need to <span style={{ color: 'var(--teal-600)' }}>master your money</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
              From transaction tracking to AI-powered behavioral analysis — all in one platform.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card"
                style={{ animation: `fadeUp 0.5s ease ${i * 0.07}s both`, transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--teal-400)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(20,184,166,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#f0fdfa,#e0f9f5)', border: '1px solid rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14, color: 'var(--teal-600)' }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--navy-800)' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRENCY ── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="badge badge-teal" style={{ marginBottom: 16 }}>Multi-Currency Support</div>
              <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 16, color: 'var(--navy-800)' }}>
                Built for Pakistan,<br />ready for the world
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 28 }}>
                MoneyMind is calibrated specifically for Pakistani financial context — PKR amounts, local spending benchmarks, and culturally relevant AI advice.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CURRENCIES.map(c => (
                  <div key={c.code} style={{
                    padding: '8px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                    background: c.code === 'PKR' ? 'rgba(20,184,166,0.1)' : 'white',
                    border: c.code === 'PKR' ? '1.5px solid var(--teal-500)' : '1px solid var(--border-color)',
                    color: c.code === 'PKR' ? 'var(--teal-600)' : 'var(--text-secondary)',
                    fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)',
                  }}>
                    <span>{c.symbol}</span><span>{c.code}</span>
                    {c.code === 'PKR' && <span className="badge badge-teal" style={{ fontSize: 9, padding: '1px 5px' }}>DEFAULT</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>Monthly Report Preview — PKR</div>
              {[
                { cat: 'Housing / Rent', amt: 'Rs. 35,000', pct: 40 },
                { cat: 'Food & Dining',  amt: 'Rs. 18,500', pct: 21 },
                { cat: 'Transport',      amt: 'Rs. 9,200',  pct: 11 },
                { cat: 'Shopping',       amt: 'Rs. 14,700', pct: 17 },
                { cat: 'Utilities',      amt: 'Rs. 9,500',  pct: 11 },
              ].map(r => (
                <div key={r.cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{r.cat}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal-600)', fontWeight: 600 }}>{r.amt}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.pct}%`, background: 'var(--gradient-brand)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Net Savings</span>
                <span style={{ fontWeight: 700, color: 'var(--teal-600)', fontFamily: 'var(--font-mono)' }}>Rs. 37,600</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '100px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge badge-teal" style={{ marginBottom: 16 }}>How It Works</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, color: 'var(--navy-800)' }}>
              Up and running in <span style={{ color: 'var(--teal-600)' }}>under 5 minutes</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 35, left: '12.5%', right: '12.5%', height: 1, background: 'linear-gradient(to right, transparent, var(--teal-300), var(--teal-300), transparent)' }} />
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ position: 'relative', zIndex: 1, textAlign: 'center', animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', margin: '0 auto 20px', background: 'white', border: '2px solid var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'var(--teal-600)', fontFamily: 'var(--font-mono)', boxShadow: '0 4px 16px rgba(20,184,166,0.15)' }}>{s.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--navy-800)' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '100px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="badge badge-teal" style={{ marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, color: 'var(--navy-800)' }}>Simple, transparent pricing</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {[
              { name: 'Free',       price: 'Rs. 0',    period: '/month', highlight: false, features: ['Up to 100 transactions','Basic analytics','Category tracking','Monthly PDF report','PKR support'],                                                        cta: 'Get Started Free' },
              { name: 'Premium',    price: 'Rs. 999',  period: '/month', highlight: true,  features: ['Unlimited transactions','Full AI behavior analysis','Prediction engine','All report types','Smart alerts','All currencies','Priority support'],             cta: 'Start Premium' },
              { name: 'Enterprise', price: 'Custom',   period: '',       highlight: false, features: ['Team accounts','Advanced analytics','API access','Custom integrations','Dedicated support','SLA guarantee'],                                               cta: 'Contact Us' },
            ].map(p => (
              <div key={p.name} style={{ background: 'white', border: p.highlight ? '2px solid var(--teal-500)' : '1px solid var(--border-color)', borderRadius: 20, padding: 28, position: 'relative', boxShadow: p.highlight ? '0 8px 32px rgba(20,184,166,0.12)' : 'var(--shadow-sm)' }}>
                {p.highlight && <div className="badge badge-teal" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontSize: 11 }}>Most Popular</div>}
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: 'var(--navy-800)' }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: p.highlight ? 'var(--teal-600)' : 'var(--navy-800)' }}>{p.price}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.period}</span>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, alignItems: 'center' }}>
                      <span style={{ color: 'var(--teal-500)', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`btn ${p.highlight ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ background: 'var(--gradient-navy)', borderRadius: 24, padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(20,184,166,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, color: 'white', position: 'relative' }}>Start understanding your money today</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32, position: 'relative' }}>Join thousands of Pakistanis taking control of their financial future with AI.</p>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px', position: 'relative' }}>Create Free Account</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--navy-900)', padding: '60px 0 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <img src="/logo.png" alt="MoneyMind" style={{ height: 42, width: 42, objectFit: 'contain' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>Money<span style={{ color: 'var(--teal-400)' }}>Mind</span></div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Analyzer</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 260 }}>
                AI-based personal spending behavior intelligence. Understand your spending. Shape your future.
              </p>
              <p style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>Default: PKR — Pakistani Rupee</p>
            </div>
            {[
              { h: 'Product', links: ['Dashboard','Analytics','AI Behavior','Predictions','Reports','Alerts'] },
              { h: 'Company', links: ['About','Blog','Careers','Press','Contact'] },
              { h: 'Legal',   links: ['Privacy Policy','Terms of Service','Cookie Policy','Security'] },
            ].map(col => (
              <div key={col.h}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>{col.h}</div>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 9, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--teal-400)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                  >{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} MoneyMind Analyzer. All rights reserved.</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>Built with AI for Pakistan's financial future</p>
          </div>
        </div>
      </footer>
    </div>
  )
}