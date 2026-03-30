"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

/*
  Red & Black Palette
  ─────────────────────
  #0a0a0a  → deepest black background
  #111111  → surface / cards
  #1a1a1a  → elevated cards
  #cc0000  → primary red accent
  #ff1a1a  → bright red highlight
  #ffffff  → primary text
*/

const NAV_LINKS = ["Home", "About", "Projects", "Skills", "Contact"] as const;

interface Skill { name: string; level: number; icon: string; }
const SKILLS: Skill[] = [
  { name: "Python", level: 70,  icon: "🐍" },
  { name: "Java",   level: 90,  icon: "☕" },
  { name: "HTML",   level: 80,  icon: "🌐" },
  { name: "CSS",    level: 80,  icon: "🎨" },
  { name: "C",      level: 85,  icon: "⚙️" },
];

const INFO_CARDS: [string, string][] = [
  ["Location", "India"],
  ["Focus", "Full-Stack"],
  ["Status", "Open to Work"],
  ["Education", "CS undergraduate(2027)"],
];

const STATS: [string, string][] = [
  ["0", "Years Learning"],
  ["5+", "Technologies"],
  ["1",  "Project Live"],
];

const AVATAR_BADGES: { label: string; pos: React.CSSProperties }[] = [
  { label: "Python", pos: { bottom: 100, left: 20 } },
  { label: "Java",   pos: { top: 80,    left: 30 } },
  { label: "CSS",    pos: { bottom: 60, right: 10 } },
];

function useInView(threshold = 0.15): [(node: HTMLDivElement | null) => void, boolean] {
  const [inView, setInView] = useState(false);
  const obsRef = useRef<IntersectionObserver | null>(null);
  const ref = (node: HTMLDivElement | null) => {
    if (obsRef.current) obsRef.current.disconnect();
    if (!node) return;
    obsRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obsRef.current.observe(node);
  };
  return [ref, inView];
}

interface AnimatedSectionProps { children: ReactNode; className?: string; delay?: number; }
function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState<string>("Home");
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [skillsInView, setSkillsInView] = useState(false);
  const skillsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSkillsInView(true); },
      { threshold: 0.2 }
    );
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#0a0a0a", color: "#ffffff", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #cc0000; border-radius: 2px; }

        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-red { 0%,100%{box-shadow:0 0 0 0 rgba(204,0,0,0.4)} 50%{box-shadow:0 0 30px 8px rgba(204,0,0,0.15)} }
        @keyframes particleFloat {
          0%   { transform:translateY(100vh) scale(0); opacity:0; }
          10%  { opacity:0.5; }
          90%  { opacity:0.15; }
          100% { transform:translateY(-10vh) scale(1); opacity:0; }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #ffffff, #cc0000, #ff4444, #cc0000, #ffffff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .nav-link { position:relative; cursor:pointer; transition:color 0.3s; }
        .nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:1px; background:#cc0000; transition:width 0.35s; }
        .nav-link:hover::after, .nav-link.active::after { width:100%; }
        .nav-link:hover { color:#ff4444 !important; }

        .card-glow { position:relative; overflow:hidden; }
        .card-glow::before {
          content:''; position:absolute; inset:-1px;
          background: linear-gradient(135deg, rgba(204,0,0,0.4), transparent, rgba(204,0,0,0.2));
          border-radius:inherit; z-index:0; opacity:0; transition:opacity 0.4s;
        }
        .card-glow:hover::before { opacity:1; }

        .btn-primary {
          background: #cc0000;
          border: 1px solid #cc0000;
          cursor:pointer; position:relative; overflow:hidden;
          transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
          color: #ffffff;
        }
        .btn-primary::after {
          content:''; position:absolute; inset:0;
          background: #ff1a1a;
          opacity:0; transition:opacity 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(204,0,0,0.5);
        }
        .btn-primary:hover::after { opacity:1; }
        .btn-primary span { position:relative; z-index:1; }

        .btn-outline {
          background: transparent;
          border: 1px solid rgba(204,0,0,0.5);
          cursor:pointer; transition: all 0.3s;
          color: #ffffff;
        }
        .btn-outline:hover {
          background: rgba(204,0,0,0.1);
          border-color: #cc0000;
          box-shadow: 0 0 20px rgba(204,0,0,0.2);
        }

        .orbit-ring {
          position:absolute; border-radius:50%;
          border: 1px solid rgba(204,0,0,0.15);
          animation: spinSlow linear infinite;
        }
        .particle {
          position:fixed; width:1px; height:2px; background:#cc0000; border-radius:50%;
          pointer-events:none; z-index:0;
          animation: particleFloat 16s ease-in infinite;
        }
        .section-label {
          font-family:'Outfit',sans-serif; font-size:10px;
          letter-spacing:5px; text-transform:uppercase;
          color:#cc0000; font-weight:400;
        }
        .skill-card { transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; }
        .skill-card:hover {
          border-color: rgba(204,0,0,0.5) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(204,0,0,0.15);
        }
        .project-card { transition: transform 0.3s, box-shadow 0.3s; }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(204,0,0,0.2);
        }
        .social-link { transition: color 0.2s; color: #444 !important; }
        .social-link:hover { color: #cc0000 !important; }
        .info-card { transition: border-color 0.3s, box-shadow 0.3s; }
        .info-card:hover {
          border-color: rgba(204,0,0,0.3) !important;
          box-shadow: 0 4px 16px rgba(204,0,0,0.1);
        }
        .red-line {
          display:inline-block; width:40px; height:2px;
          background: #cc0000; vertical-align:middle; margin-right:12px;
        }
      `}</style>

      {/* Red cursor glow */}
      <div style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(204,0,0,0.06) 0%, transparent 70%)",
        transform: "translate(-50%,-50%)",
        left: mousePos.x, top: mousePos.y,
        transition: "left 0.12s, top 0.12s",
      }} />

      {/* Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${(i * 9) % 100}%`,
          animationDelay: `${i * 1.2}s`,
          animationDuration: `${12 + i * 1.6}s`,
        }} />
      ))}

      {/* Grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(204,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(204,0,0,0.03) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Ambient red blobs */}
      <div style={{ position: "fixed", top: "-5%", right: "0%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,0,0,0.08),transparent)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", left: "0%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,0,0,0.06),transparent)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5%", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(204,0,0,0.2)" : "none",
        transition: "all 0.4s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#cc0000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#ffffff", fontFamily: "'Outfit',sans-serif", boxShadow: "0 0 16px rgba(204,0,0,0.5)" }}>BG</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 400, letterSpacing: 4, fontSize: 12, color: "#ffffff" }}>BRINDA G</span>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <span key={l} className={`nav-link${active === l ? " active" : ""}`} onClick={() => setActive(l)}
              style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 1.5, fontWeight: 400, color: active === l ? "#cc0000" : "#666" }}>
              {l}
            </span>
          ))}
          <button className="btn-primary" style={{ padding: "9px 24px", borderRadius: 4, fontSize: 11, fontFamily: "'Outfit',sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>
            <span>Hire Me</span>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 7% 80px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", width: "100%", maxWidth: 1200, margin: "0 auto" }}>

          <div>
            <div style={{ marginBottom: 24, opacity: 0, animation: "fadeInUp 0.7s 0.1s forwards" }}>
              <span className="section-label">Portfolio · Developer · Designer</span>
            </div>
            <h1 style={{ fontSize: "clamp(3rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05, marginBottom: 24, letterSpacing: -1, opacity: 0, animation: "fadeInUp 0.8s 0.2s forwards" }}>
              <em style={{ fontStyle: "italic", color: "#444", display: "block", fontSize: "0.5em", fontWeight: 300, letterSpacing: 3, marginBottom: 10, fontFamily: "'Outfit',sans-serif", textTransform: "uppercase" }}>Hello, I'm</em>
              <span className="shimmer-text" style={{ display: "block" }}>Brinda G</span>
            </h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 1.9, color: "#aaaaaa", maxWidth: 460, marginBottom: 40, fontWeight: 300, opacity: 0, animation: "fadeInUp 0.8s 0.35s forwards" }}>
              Python · Java · Web Developer crafting modern, responsive applications with precision and purpose.
            </p>
            <div style={{ display: "flex", gap: 14, opacity: 0, animation: "fadeInUp 0.8s 0.5s forwards" }}>
              
             
            </div>
            <div style={{ display: "flex", gap: 48, marginTop: 56, paddingTop: 36, borderTop: "1px solid rgba(204,0,0,0.15)", opacity: 0, animation: "fadeInUp 0.8s 0.65s forwards" }}>
              {STATS.map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: "2.2rem", fontWeight: 300, color: "#cc0000", letterSpacing: -1 }}>{n}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#555", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right avatar */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", height: 420 }}>
            <div className="orbit-ring" style={{ width: 320, height: 320, animationDuration: "25s" }} />
            <div className="orbit-ring" style={{ width: 255, height: 255, animationDuration: "18s", animationDirection: "reverse", borderColor: "rgba(204,0,0,0.08)" }} />

            <div style={{ position: "absolute", top: 55, right: 25, background: "#111", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 10, padding: "10px 18px", animation: "float 3.5s ease-in-out infinite", boxShadow: "0 4px 20px rgba(204,0,0,0.15)" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, color: "#cc0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Available For</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#ffffff", fontWeight: 500 }}>Opportunities</div>
            </div>

            <div style={{
              width: 175, height: 175, borderRadius: "50%",
              background: "linear-gradient(135deg, #1a0000, #cc0000)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.6rem", fontWeight: 600, color: "#ffffff",
              boxShadow: "0 0 0 1px rgba(204,0,0,0.3), 0 0 60px rgba(204,0,0,0.3)",
              animation: "float 4.5s ease-in-out infinite",
              letterSpacing: 3, position: "relative", zIndex: 2,
              fontFamily: "'Outfit',sans-serif",
            }}>
              BG
            </div>

            {AVATAR_BADGES.map(({ label, pos }) => (
              <div key={label} style={{
                position: "absolute", ...pos,
                background: "#111",
                border: "1px solid rgba(204,0,0,0.3)", borderRadius: 20,
                padding: "5px 14px", fontFamily: "'Outfit',sans-serif",
                fontSize: 10, color: "#cc0000", letterSpacing: 2,
                textTransform: "uppercase", zIndex: 3,
              }}>{label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ padding: "100px 7%", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <AnimatedSection>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "#111", borderRadius: 20, transform: "rotate(-1.5deg)", border: "1px solid rgba(204,0,0,0.1)" }} />
              <div style={{ position: "relative", background: "#111", border: "1px solid rgba(204,0,0,0.15)", borderRadius: 20, padding: 44 }}>
                <div style={{ fontSize: "6rem", fontWeight: 300, lineHeight: 0.8, fontStyle: "italic", color: "rgba(204,0,0,0.2)", fontFamily: "Georgia,serif", marginBottom: 20 }}>"</div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 2, color: "#aaaaaa", fontWeight: 300 }}>
                  I believe great software is invisible — it just works, beautifully. My approach blends technical precision with creative thinking.
                </p>
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(204,0,0,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#cc0000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "'Outfit',sans-serif", letterSpacing: 1 }}>BG</div>
                  <div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#ffffff", fontWeight: 500 }}>Brinda G</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, color: "#555", letterSpacing: 3, textTransform: "uppercase" }}>Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <span className="section-label">About Me</span>
            <h2 style={{ fontSize: "2.8rem", fontWeight: 300, lineHeight: 1.15, margin: "18px 0 20px", letterSpacing: -0.5, color: "#ffffff" }}>
              Passionate about <em style={{ fontStyle: "italic", color: "#cc0000" }}>craft</em> &amp; code
            </h2>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 1.9, color: "#aaaaaa", fontWeight: 300, marginBottom: 20 }}>
              I'm a developer who loves building things that are both functional and beautiful. Skilled in Python, Java, and modern web technologies, I focus on writing clean, maintainable code.
            </p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 1.9, color: "#aaaaaa", fontWeight: 300 }}>
              I enjoy solving real problems through technology, from data management systems to interactive web experiences.
            </p>
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {INFO_CARDS.map(([k, v]) => (
                <div key={k} className="info-card" style={{ padding: "14px 18px", background: "#111", borderRadius: 8, border: "1px solid rgba(204,0,0,0.1)" }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, color: "#555", letterSpacing: 3, marginBottom: 6, textTransform: "uppercase" }}>{k}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#ffffff", fontWeight: 400 }}>{v}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section style={{ padding: "100px 7%", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <span className="section-label">Portfolio</span>
              <h2 style={{ fontSize: "3rem", fontWeight: 300, letterSpacing: -0.5, marginTop: 14, color: "#ffffff" }}>Featured <em style={{ fontStyle: "italic", color: "#cc0000" }}>Projects</em></h2>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <div className="card-glow project-card" style={{ background: "#111", border: "1px solid rgba(204,0,0,0.15)", borderRadius: 20, padding: 52, position: "relative", overflow: "hidden" }}>
              {/* Red corner accent */}
              <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: "linear-gradient(180deg, #cc0000, transparent)", borderRadius: "20px 0 0 20px" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                      {["Python", "Data Management", "Healthcare"].map(t => (
                        <span key={t} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, padding: "4px 14px", borderRadius: 20, background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", color: "#cc0000", letterSpacing: 1.5, textTransform: "uppercase" }}>{t}</span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: 14, lineHeight: 1.2, color: "#ffffff" }}>
                      Clinical Trial Data<br /><em style={{ fontStyle: "italic", color: "#cc0000" }}>Management System</em>
                    </h3>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 1.8, color: "#aaaaaa", fontWeight: 300, maxWidth: 520, marginBottom: 28 }}>
                      A robust system for organizing, managing, and analyzing clinical trial data with efficiency and accuracy. Built for real-world healthcare workflows.
                    </p>
                    
                  </div>
                  <div style={{ width: 190, height: 175, borderRadius: 14, background: "linear-gradient(135deg,#1a0000,#2a0000)", border: "1px solid rgba(204,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", flexShrink: 0 }}>
                    🏥
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section style={{ padding: "100px 7%", position: "relative", zIndex: 1 }} ref={skillsRef}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="section-label">Expertise</span>
              <h2 style={{ fontSize: "3rem", fontWeight: 300, letterSpacing: -0.5, marginTop: 14, color: "#ffffff" }}>Technical <em style={{ fontStyle: "italic", color: "#cc0000" }}>Skills</em></h2>
            </div>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
            {SKILLS.map((skill, i) => (
              <AnimatedSection key={skill.name} delay={i * 0.1}>
                <div className="skill-card" style={{ background: "#111", border: "1px solid rgba(204,0,0,0.1)", borderRadius: 14, padding: "24px 28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: "1.3rem" }}>{skill.icon}</span>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 400, color: "#ffffff", letterSpacing: 0.5 }}>{skill.name}</span>
                    </div>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#cc0000", fontWeight: 500 }}>{skill.level}%</span>
                  </div>
                  <div style={{ height: 2, borderRadius: 2, background: "#1a1a1a", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      background: "linear-gradient(90deg, #660000, #cc0000, #ff4444)",
                      width: skillsInView ? `${skill.level}%` : "0%",
                      transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.12}s`,
                      boxShadow: "0 0 8px rgba(204,0,0,0.5)",
                    }} />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section style={{ padding: "100px 7% 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
          <AnimatedSection>
            <span className="section-label">Get In Touch</span>
            <h2 style={{ fontSize: "3.2rem", fontWeight: 300, letterSpacing: -0.5, margin: "18px 0 20px", lineHeight: 1.1, color: "#ffffff" }}>
              Let's build something <em style={{ fontStyle: "italic", color: "#cc0000" }}>remarkable</em>
            </h2>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 1.9, color: "#aaaaaa", fontWeight: 300, marginBottom: 44 }}>
              Whether you have a project in mind, want to collaborate, or just want to say hello — my inbox is always open.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ padding: "15px 40px", borderRadius: 4, fontSize: 12, fontFamily: "'Outfit',sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>
                <span>✉ Send Email</span>
              </button>
              <button className="btn-outline" style={{ padding: "15px 40px", borderRadius: 4, fontSize: 12, fontFamily: "'Outfit',sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>
                LinkedIn
              </button>
            </div>
            <div style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid rgba(204,0,0,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#333", letterSpacing: 2 }}>© 2026 BRINDA G</span>
              <div style={{ display: "flex", gap: 28 }}>
                {["GitHub", "LinkedIn", "Twitter"].map(s => (
                  <span key={s} className="social-link" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 2, cursor: "pointer", textTransform: "uppercase" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}