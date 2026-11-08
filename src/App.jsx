import React, { useEffect, useState } from 'react';
import D from './data.js';
import { downloadCV } from './cv.js';
import { useReveal, useScrollSpy, reduceMotion } from './hooks.js';
import Background from './components/Background.jsx';
import Labs from './components/Labs.jsx';

const SECTIONS = [
  ['home', 'Home'], ['about', 'About'], ['skills', 'Skills'], ['lab', 'AI Lab'],
  ['projects', 'Projects'], ['experience', 'Experience'], ['contact', 'Contact'],
];
const IDS = SECTIONS.map((s) => s[0]);

function CVButton({ className = 'btn', children }) {
  const [busy, setBusy] = useState(false);
  const go = async () => { setBusy(true); try { await downloadCV(); } catch { alert('Could not generate the CV. Please try again.'); } setBusy(false); };
  return <button className={className} onClick={go} disabled={busy}>{busy ? 'Preparing…' : children}</button>;
}

function Nav({ active }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24);
    f(); addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  return (
    <header className={`nav${solid ? ' solid' : ''}`}>
      <div className="nav-in">
        <a href="#home" className="brand" onClick={() => setOpen(false)}>
          <span className="logo">KA</span><span className="brand-name">Khawaja Anas <em>Javed</em></span>
        </a>
        <button className="menu" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={`links${open ? ' open' : ''}`}>
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <CVButton className="btn sm">Download CV</CVButton>
        </nav>
      </div>
    </header>
  );
}

function Typed({ words }) {
  const [text, setText] = useState(reduceMotion() ? words[0] : '');
  useEffect(() => {
    if (reduceMotion()) return undefined;
    let r = 0, c = 0, del = false, timer;
    const tick = () => {
      const w = words[r]; c += del ? -1 : 1; setText(w.slice(0, c));
      let d = del ? 32 : 65;
      if (!del && c === w.length) { del = true; d = 1500; } else if (del && c === 0) { del = false; r = (r + 1) % words.length; d = 350; }
      timer = setTimeout(tick, d);
    };
    tick(); return () => clearTimeout(timer);
  }, [words]);
  return <span className="typed">{text}<i className="caret" /></span>;
}

function Section({ id, eyebrow, title, intro, children }) {
  const [ref, shown] = useReveal();
  return (
    <section id={id} className="section" ref={ref}>
      <div className={`wrap reveal${shown ? ' in' : ''}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {intro && <p className="intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

function Hero() {
  const stats = [['3', 'Client websites shipped'], ['2025', 'Started BS Data Science'], ['6', 'Core tools: Python · C++ · Power BI · RAG · Ollama · Claude Code']];
  return (
    <section id="home" className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="pill"><i /> Open to internships &amp; collaborations</p>
          <h1>I turn data into insight and ideas into <span className="grad">working AI</span>.</h1>
          <p className="role">I'm {D.name} — <Typed words={D.roles} /></p>
          <p className="lead">{D.summary}</p>
          <div className="cta">
            <a href="#contact" className="btn">Get in touch</a>
            <CVButton className="btn ghost">Download CV</CVButton>
            <a href="#projects" className="link-arrow">View projects →</a>
          </div>
          <dl className="stats">
            {stats.map(([n, l]) => <div key={l}><dt>{n}</dt><dd>{l}</dd></div>)}
          </dl>
        </div>
        <div className="hero-art">
          <div className="photo">
            <div className="glow" />
            <img src="/profile.jpeg" alt={D.name} width="360" height="360" fetchPriority="high" />
            <span className="tag t1">Python</span><span className="tag t2">C++</span>
            <span className="tag t3">RAG</span><span className="tag t4">Power BI</span>
            <div className="card-mini"><b>{D.title}</b><span>Pak-Austria Fachhochschule</span></div>
          </div>
        </div>
      </div>
      <a href="#about" className="scroll" aria-label="Scroll to About"><span /></a>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="Education & background" intro={D.summary}>
      <div className="timeline">
        {D.education.map((e) => (
          <div key={e.title} className="t-item">
            <span className="date">{e.period}</span>
            <h3>{e.title} <em className="badge">{e.level}</em></h3>
            <div className="org">{e.place}</div>
            <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  const mono = (n) => n.split(/[\s/]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Section id="skills" eyebrow="Skills" title="Tools I work with" intro="A practical stack across programming, data, applied AI and the web.">
      <div className="skill-grid">
        {D.skills.map((s) => (
          <div key={s.name} className="skill">
            <div className="mono-ic">{mono(s.name)}</div>
            <div><h3>{s.name}</h3><p>{s.note}</p></div>
            <span className="grp">{s.group}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Lab() {
  return (
    <Section id="lab" eyebrow="AI & Data Lab" title="Ideas in motion" intro="Live visualisations of the concepts I study: neural networks, training, dashboards and retrieval-augmented generation.">
      <Labs />
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="Selected work" intro="Websites and software I've designed, built and deployed.">
      <div className="cards">
        {D.projects.map((p) => (
          <article key={p.name} className="card">
            <span className="tag-s">{p.tag}</span>
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <div className="card-links">
              {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">Live site ↗</a>}
              <a href={p.link} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Roles & leadership">
      <div className="timeline">
        {D.experience.map((x) => (
          <div key={x.org + x.period} className="t-item">
            <span className="date">{x.period}</span>
            <h3>{x.org}</h3>
            <div className="org">{x.role}</div>
            <p>{x.desc}</p>
          </div>
        ))}
      </div>
      <h3 className="sub">Goals</h3>
      <ul className="goals">{D.goals.map((g) => <li key={g}>{g}</li>)}</ul>
    </Section>
  );
}

function Contact() {
  const [state, setState] = useState({ s: 'idle', msg: '' });
  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ s: 'sending', msg: '' });
    try {
      const res = await fetch(D.formspree, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { form.reset(); setState({ s: 'ok', msg: 'Thanks! Your message has been sent.' }); return; }
      const j = await res.json().catch(() => ({}));
      throw new Error(j.errors ? j.errors.map((x) => x.message).join(', ') : 'There was a problem submitting the form.');
    } catch (err) { setState({ s: 'err', msg: err.message || 'There was a problem submitting the form.' }); }
  };
  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together" intro="Open to internships, collaborations and freelance projects. Send a message and I'll get back to you.">
      <div className="contact-grid">
        <form className="form" onSubmit={submit}>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" placeholder="Your name" required />
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" placeholder="How can I help you?" required />
          <button className="btn" type="submit" disabled={state.s === 'sending'}>{state.s === 'sending' ? 'Sending…' : 'Send message'}</button>
          <p className={`status ${state.s}`} role="status">{state.msg}</p>
        </form>
        <aside className="info">
          <h3>Direct contact</h3>
          <p><span>Email</span><a href={`mailto:${D.email}`}>{D.email}</a></p>
          <p><span>GitHub</span><a href={D.github} target="_blank" rel="noopener noreferrer">@hellofromanas</a></p>
          <p><span>LinkedIn</span><a href={D.linkedin} target="_blank" rel="noopener noreferrer">hellofromanas</a></p>
          <p><span>Location</span>{D.location}</p>
          <CVButton className="btn ghost">Download CV (PDF)</CVButton>
        </aside>
      </div>
    </Section>
  );
}

export default function App() {
  const active = useScrollSpy(IDS);
  return (
    <>
      <Background />
      <Nav active={active} />
      <main>
        <Hero /><About /><Skills /><Lab /><Projects /><Experience /><Contact />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} {D.name} · Built with React</p>
      </footer>
    </>
  );
}
