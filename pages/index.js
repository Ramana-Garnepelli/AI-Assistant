import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const moods = [
  { emoji: '😰', label: 'Overwhelmed', value: 1, color: '#ff6b6b' },
  { emoji: '😟', label: 'Stressed', value: 2, color: '#ffa94d' },
  { emoji: '😐', label: 'Neutral', value: 3, color: '#74c0fc' },
  { emoji: '🙂', label: 'Okay', value: 4, color: '#63e6be' },
  { emoji: '😊', label: 'Good', value: 5, color: '#4ecdc4' },
];

const affirmations = [
  "You've handled hard days before. You'll handle this one too.",
  "It's okay to not have everything figured out right now.",
  "Your worth isn't measured by your productivity.",
  "Small steps forward still count as progress.",
  "Rest is not a reward — it's a requirement.",
  "One task at a time. That's enough.",
  "Being busy and being productive are not the same thing.",
];

const breathLabels = ['Inhale', 'Hold', 'Exhale', 'Hold'];

export default function Home() {
  const [screen, setScreen] = useState('home');
  const [mood, setMood] = useState(null);
  const [activeEx, setActiveEx] = useState(null);

  // Breathing
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathCount, setBreathCount] = useState(4);
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathCycles, setBreathCycles] = useState(0);
  const breathRef = useRef(null);

  // Grounding
  const [groundStep, setGroundStep] = useState(0);

  // Journal
  const [journal, setJournal] = useState('');

  // Chat
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [affirmIdx, setAffirmIdx] = useState(0);
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    setAffirmIdx(Math.floor(Math.random() * affirmations.length));
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  // Breathing timer
  useEffect(() => {
    if (!breathRunning) { clearInterval(breathRef.current); return; }
    breathRef.current = setInterval(() => {
      setBreathCount(c => {
        if (c <= 1) {
          setBreathPhase(p => {
            const next = (p + 1) % 4;
            if (next === 0) setBreathCycles(cy => cy + 1);
            return next;
          });
          return 4;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(breathRef.current);
  }, [breathRunning]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const startExercise = (ex) => {
    setActiveEx(ex);
    setBreathPhase(0); setBreathCount(4); setBreathRunning(false); setBreathCycles(0);
    setGroundStep(0);
    setScreen('exercise');
  };

  const openChat = (prefill = '') => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: "Hey — I'm here. What's weighing on you today? Work stress, burnout, anything. No judgment." }]);
    }
    if (prefill) setChatInput(prefill);
    setScreen('chat');
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: 'user', content: chatInput };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...updated, { role: 'assistant', content: "Something went wrong. I'm still here — try again." }]);
    }
    setChatLoading(false);
  };

  const breathScale = breathPhase === 0 ? 1.35 : breathPhase === 2 ? 0.8 : 1.0;

  return (
    <>
      <Head>
        <title>MindPause — Mental Wellness for Working Adults</title>
        <meta name="description" content="A calm space to check in, breathe, and talk through work stress." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧘</text></svg>" />
      </Head>

      <div style={s.app}>

        {/* ── HEADER ── */}
        <header style={s.header}>
          <div>
            <div style={s.logo}>MindPause</div>
            <div style={s.logoSub}>{greeting} — take a breath</div>
          </div>
          <nav style={s.nav}>
            {[
              { id: 'home', label: '🏠' },
              { id: 'chat', label: '💬' },
            ].map(n => (
              <button key={n.id} style={{ ...s.navBtn, ...(screen === n.id ? s.navBtnActive : {}) }}
                onClick={() => n.id === 'chat' ? openChat() : setScreen(n.id)}>
                {n.label}
              </button>
            ))}
          </nav>
        </header>

        <main style={s.main}>

          {/* ══════════════ HOME ══════════════ */}
          {screen === 'home' && (
            <div className="fade-up">

              {/* Affirmation card */}
              <div style={s.affirmCard}>
                <div style={s.affirmLabel}>TODAY'S REMINDER</div>
                <div style={s.affirmText}>"{affirmations[affirmIdx]}"</div>
              </div>

              {/* Mood check-in */}
              <div style={s.card}>
                <div style={s.cardTitle}>How are you feeling right now?</div>
                <div style={s.cardSub}>Be honest — this is just for you</div>
                <div style={s.moodRow}>
                  {moods.map(m => (
                    <button key={m.value} onClick={() => setMood(m.value)} style={{
                      ...s.moodBtn,
                      borderColor: mood === m.value ? m.color : 'var(--border)',
                      background: mood === m.value ? `${m.color}18` : 'var(--bg)',
                    }}>
                      <span style={{ fontSize: 26 }}>{m.emoji}</span>
                      <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>{m.label}</span>
                    </button>
                  ))}
                </div>
                {mood !== null && mood <= 2 && (
                  <div className="fade-up" style={s.moodAlert}>
                    That sounds really tough. Try a quick exercise below, or{' '}
                    <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => openChat()}>
                      talk it out →
                    </span>
                  </div>
                )}
                {mood !== null && mood >= 4 && (
                  <div className="fade-up" style={{ ...s.moodAlert, borderColor: '#4ecdc455', color: 'var(--accent)' }}>
                    Great! Keep that energy going. 🌱
                  </div>
                )}
              </div>

              {/* Exercises */}
              <div style={s.sectionLabel}>QUICK RELIEF</div>

              {[
                { id: 'breathing', icon: '🌬️', title: 'Box Breathing', desc: 'Calm your nervous system in 4 minutes', tag: '4 min' },
                { id: 'grounding', icon: '⚓', title: '5-4-3-2-1 Grounding', desc: 'Anchor yourself to the present moment', tag: '2 min' },
                { id: 'journal', icon: '📝', title: 'Brain Dump', desc: 'Empty your mind onto the page', tag: '3 min' },
              ].map(ex => (
                <button key={ex.id} style={s.exCard} onClick={() => startExercise(ex.id)}>
                  <span style={{ fontSize: 30 }}>{ex.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={s.exTitle}>{ex.title}</div>
                    <div style={s.exDesc}>{ex.desc}</div>
                  </div>
                  <div style={s.exTag}>{ex.tag}</div>
                </button>
              ))}

              {/* Talk CTA */}
              <button style={s.ctaBtn} onClick={() => openChat()}>
                💬 &nbsp; Just need to talk? I'm listening
              </button>

              {/* Doctor section teaser */}
              <div style={s.doctorTeaser}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>🏥</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Need professional help?</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  Doctor & therapist booking coming soon
                </div>
                <div style={s.comingSoonBadge}>COMING SOON</div>
              </div>

              {/* Crisis line */}
              <div style={s.crisisBar}>
                🆘 &nbsp;In crisis? Call iCall: <strong>9152987821</strong> &nbsp;·&nbsp; Vandrevala: <strong>1860-2662-345</strong>
              </div>
            </div>
          )}

          {/* ══════════════ EXERCISE ══════════════ */}
          {screen === 'exercise' && activeEx && (
            <div className="fade-up">
              <button style={s.backBtn} onClick={() => setScreen('home')}>← Back</button>

              {/* ── BREATHING ── */}
              {activeEx === 'breathing' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={s.exHeader}>
                    <div style={{ fontSize: 44 }}>🌬️</div>
                    <div style={s.exPageTitle}>Box Breathing</div>
                    <div style={s.exPageSub}>Used by Navy SEALs to calm under pressure</div>
                  </div>

                  <div style={s.breathWrapper}>
                    <div style={{
                      ...s.breathCircle,
                      transform: `scale(${breathScale})`,
                      boxShadow: breathRunning ? `0 0 60px #4ecdc433` : 'none',
                    }}>
                      <div style={s.breathCount}>{breathRunning ? breathCount : '▶'}</div>
                      <div style={s.breathLabel}>{breathRunning ? breathLabels[breathPhase] : 'Ready'}</div>
                    </div>
                  </div>

                  {breathCycles > 0 && (
                    <div style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 16 }}>
                      ✓ {breathCycles} cycle{breathCycles > 1 ? 's' : ''} complete
                    </div>
                  )}

                  <button style={{ ...s.primaryBtn, width: 180 }}
                    onClick={() => setBreathRunning(r => !r)}>
                    {breathRunning ? '⏸ Pause' : '▶ Start'}
                  </button>

                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {breathLabels.map((l, i) => (
                      <div key={i} style={{
                        ...s.breathStep,
                        background: breathPhase === i && breathRunning ? 'var(--accent)' : 'var(--card2)',
                        color: breathPhase === i && breathRunning ? 'var(--bg)' : 'var(--muted)',
                      }}>
                        {l} 4s
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── GROUNDING ── */}
              {activeEx === 'grounding' && (
                <div>
                  <div style={s.exHeader}>
                    <div style={{ fontSize: 44 }}>⚓</div>
                    <div style={s.exPageTitle}>5-4-3-2-1 Grounding</div>
                    <div style={s.exPageSub}>Bring your mind back to the present</div>
                  </div>

                  {[
                    { n: 5, sense: '👁️', prompt: 'Name 5 things you can SEE right now' },
                    { n: 4, sense: '🖐️', prompt: 'Name 4 things you can TOUCH or feel' },
                    { n: 3, sense: '👂', prompt: 'Name 3 things you can HEAR' },
                    { n: 2, sense: '👃', prompt: 'Name 2 things you can SMELL' },
                    { n: 1, sense: '👅', prompt: 'Name 1 thing you can TASTE' },
                  ].map((step, i) => (
                    <div key={i} onClick={() => setGroundStep(i)} style={{
                      ...s.groundCard,
                      borderColor: groundStep === i ? 'var(--accent)' : 'var(--border)',
                      opacity: i > groundStep ? 0.35 : 1,
                    }}>
                      <div style={{ ...s.groundNum, background: i <= groundStep ? 'var(--accent)' : 'var(--card2)', color: i <= groundStep ? 'var(--bg)' : 'var(--muted)' }}>
                        {i < groundStep ? '✓' : step.n}
                      </div>
                      <div>
                        <div style={{ fontSize: 15 }}>{step.sense} {step.prompt}</div>
                      </div>
                    </div>
                  ))}

                  {groundStep < 4 ? (
                    <button style={{ ...s.primaryBtn, width: '100%', marginTop: 8 }}
                      onClick={() => setGroundStep(s => Math.min(s + 1, 4))}>
                      Next →
                    </button>
                  ) : (
                    <div className="fade-up" style={s.doneCard}>
                      <div style={{ fontSize: 32 }}>✅</div>
                      <div style={{ fontWeight: 600, fontSize: 16, marginTop: 8 }}>Well done.</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                        You're here. You're grounded. That matters.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── JOURNAL ── */}
              {activeEx === 'journal' && (
                <div>
                  <div style={s.exHeader}>
                    <div style={{ fontSize: 44 }}>📝</div>
                    <div style={s.exPageTitle}>Brain Dump</div>
                    <div style={s.exPageSub}>Write whatever's on your mind. No structure. Just let it out.</div>
                  </div>

                  <textarea value={journal} onChange={e => setJournal(e.target.value)}
                    placeholder="What's actually going on right now? What's bothering you? What do you wish you could say out loud?..."
                    style={s.journalArea} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{journal.length} chars · private to you</div>
                    {journal.length > 30 && (
                      <button style={s.secondaryBtn}
                        onClick={() => openChat(`I just did a brain dump and wrote this: "${journal.slice(0, 200)}..." — can you help me process this?`)}>
                        Talk about this →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ CHAT ══════════════ */}
          {screen === 'chat' && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
              <div style={s.crisisBar}>
                Not a substitute for therapy · Crisis: <strong>9152987821</strong>
              </div>

              <div style={s.chatArea}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', marginTop: 80, color: 'var(--muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                    <div>Start by sharing what's on your mind</div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className="fade-up" style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                    {m.role === 'assistant' && (
                      <div style={s.avatarDot}>M</div>
                    )}
                    <div style={{
                      ...s.bubble,
                      background: m.role === 'user' ? 'var(--accent)' : 'var(--card2)',
                      color: m.role === 'user' ? 'var(--bg)' : 'var(--text)',
                      borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      marginLeft: m.role === 'user' ? 0 : 8,
                    }}>
                      {m.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div style={{ display: 'flex', gap: 6, padding: '8px 12px', alignItems: 'center' }}>
                    <div style={s.avatarDot}>M</div>
                    <div style={{ display: 'flex', gap: 5, marginLeft: 8 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div style={s.chatInputRow}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type how you're feeling..."
                  style={s.chatInput} />
                <button style={{ ...s.sendBtn, opacity: chatLoading || !chatInput.trim() ? 0.4 : 1 }}
                  onClick={sendMessage} disabled={chatLoading || !chatInput.trim()}>
                  →
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

// ── Styles ──
const s = {
  app: { minHeight: '100vh', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 0' },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'var(--accent)', letterSpacing: 1 },
  logoSub: { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  nav: { display: 'flex', gap: 6 },
  navBtn: { background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 14px', fontSize: 16, color: 'var(--muted)', transition: 'all 0.2s' },
  navBtnActive: { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--bg)' },
  main: { padding: '16px 20px 40px', flex: 1 },

  affirmCard: { background: 'var(--card)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 },
  affirmLabel: { fontSize: 10, color: 'var(--accent)', letterSpacing: 1.8, fontWeight: 600, marginBottom: 8 },
  affirmText: { fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', lineHeight: 1.6 },

  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 },
  cardTitle: { fontWeight: 600, fontSize: 15, marginBottom: 4 },
  cardSub: { fontSize: 12, color: 'var(--muted)', marginBottom: 16 },
  moodRow: { display: 'flex', gap: 6 },
  moodBtn: { flex: 1, background: 'var(--bg)', border: '2px solid var(--border)', borderRadius: 12, padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  moodAlert: { marginTop: 14, padding: '10px 14px', background: 'var(--card2)', borderRadius: 10, fontSize: 13, color: 'var(--muted)', border: '1px solid #ff6b6b33' },

  sectionLabel: { fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.8, marginBottom: 10 },
  exCard: { width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '15px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, textAlign: 'left', transition: 'all 0.2s', color: 'var(--text)' },
  exTitle: { fontWeight: 600, fontSize: 14 },
  exDesc: { fontSize: 12, color: 'var(--muted)', marginTop: 2 },
  exTag: { fontSize: 10, background: 'var(--card2)', color: 'var(--accent)', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', border: '1px solid var(--border)' },

  ctaBtn: { width: '100%', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 14, padding: '16px', fontWeight: 600, fontSize: 15, marginTop: 4, marginBottom: 16, transition: 'all 0.2s' },

  doctorTeaser: { background: 'var(--card)', border: '1px dashed var(--border)', borderRadius: 14, padding: '18px 20px', marginBottom: 16, textAlign: 'center' },
  comingSoonBadge: { display: 'inline-block', marginTop: 10, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'var(--accent2)', border: '1px solid var(--accent2)', borderRadius: 6, padding: '3px 8px' },

  crisisBar: { fontSize: 11, color: 'var(--muted)', background: 'var(--card2)', borderRadius: 10, padding: '8px 12px', marginBottom: 12, textAlign: 'center' },

  // Exercise page
  backBtn: { background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 13, marginBottom: 16, padding: 0 },
  exHeader: { textAlign: 'center', marginBottom: 28 },
  exPageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginTop: 8 },
  exPageSub: { fontSize: 13, color: 'var(--muted)', marginTop: 4 },

  breathWrapper: { width: 200, height: 200, margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  breathCircle: { width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, #4ecdc422, #4ecdc408)', border: '2px solid #4ecdc444', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 1s ease-in-out, box-shadow 1s ease' },
  breathCount: { fontSize: 36, fontWeight: 300, color: 'var(--accent)' },
  breathLabel: { fontSize: 13, color: 'var(--accent)', marginTop: 2 },
  breathStep: { padding: '6px 12px', borderRadius: 8, fontSize: 12, transition: 'all 0.3s' },

  primaryBtn: { background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 12, padding: '13px 24px', fontWeight: 600, fontSize: 15, transition: 'all 0.2s' },
  secondaryBtn: { background: 'var(--card2)', color: 'var(--accent)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 600 },

  groundCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text)' },
  groundNum: { width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, transition: 'all 0.3s' },

  journalArea: { width: '100%', height: 220, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', color: 'var(--text)', fontSize: 14, lineHeight: 1.7 },

  doneCard: { background: 'var(--card)', border: '1px solid var(--accent)', borderRadius: 14, padding: '24px', textAlign: 'center', marginTop: 12 },

  // Chat
  chatArea: { flex: 1, overflowY: 'auto', paddingBottom: 8 },
  avatarDot: { width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  bubble: { maxWidth: '78%', padding: '11px 15px', fontSize: 14, lineHeight: 1.6 },
  chatInputRow: { display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)' },
  chatInput: { flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 14 },
  sendBtn: { background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 12, padding: '12px 18px', fontWeight: 700, fontSize: 18, transition: 'opacity 0.2s' },
};
