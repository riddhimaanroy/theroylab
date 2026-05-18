import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CapabilityCards.module.css';

gsap.registerPlugin(ScrollTrigger);

const TOP_ROW = [
  { label: 'Frontend & UI', card: 'frontend' },
  { label: 'AI & LLMs', card: 'ai' },
  { label: 'Backend & APIs', card: 'backend' },
  { label: 'WhatsApp Integration', card: 'whatsapp' },
  { label: 'Payments', card: 'payments' },
];

const BOTTOM_ROW = [
  { label: 'Data Science & ML', card: 'datascience' },
  { label: 'Databases', card: 'databases' },
  { label: 'Cloud & Deploy', card: 'cloud' },
  { label: 'NLP & Text', card: 'nlp' },
  { label: 'Design & UX', card: 'design' },
];

/* ---- Individual card animation components ---- */

function FrontendCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.frontendLayout}>
        <div className={styles.frontendNav} />
        <div className={styles.frontendBody}>
          <div className={styles.frontendSidebar} />
          <div className={styles.frontendContent}>
            <div className={styles.frontendBlock} style={{ width: '80%', animationDelay: '0s' }} />
            <div className={styles.frontendBlock} style={{ width: '60%', animationDelay: '0.3s' }} />
            <div className={styles.frontendBlock} style={{ width: '90%', animationDelay: '0.6s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AiCard() {
  const lines = ['anthropic.messages', '.create(model=', '"claude-haiku"', '→ streaming...', '✓ response'];
  return (
    <div className={styles.cardAnim}>
      <div className={styles.aiLog}>
        {lines.map((line, i) => (
          <span key={i} className={styles.aiLine} style={{ animationDelay: `${i * 0.7}s` }}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function BackendCard() {
  const endpoints = ['POST /webhook', 'GET  /dashboard', 'PUT  /user', 'GET  /meal/:id'];
  return (
    <div className={styles.cardAnim}>
      <div className={styles.backendLog}>
        {endpoints.map((ep, i) => (
          <div key={i} className={styles.backendLine} style={{ animationDelay: `${i * 0.5}s` }}>
            <span className={styles.backendMethod}>{ep.split(' ')[0]}</span>
            <span className={styles.backendPath}>{ep.split(' ').slice(1).join(' ')}</span>
            <span className={styles.backendStatus}>200</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatsappCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.waChat}>
        <div className={`${styles.waBubble} ${styles.waBubbleUser}`} style={{ animationDelay: '0s' }}>
          Had paneer tikka
        </div>
        <div className={`${styles.waBubble} ${styles.waBubbleBot}`} style={{ animationDelay: '1.2s' }}>
          Got it! Score: 8.2/10 🎯
        </div>
        <div className={`${styles.waBubble} ${styles.waBubbleBot}`} style={{ animationDelay: '2.4s' }}>
          Great protein choice! 💪
        </div>
      </div>
    </div>
  );
}

function PaymentsCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.payWrap}>
        <span className={styles.payAmount} />
        <span className={styles.payLabel}>₹ processing</span>
        <div className={styles.payBar}>
          <div className={styles.payBarFill} />
        </div>
        <span className={styles.payCheck}>✓</span>
      </div>
    </div>
  );
}

function DatascienceCard() {
  return (
    <div className={styles.cardAnim}>
      <svg viewBox="0 0 260 140" className={styles.chartSvg}>
        <line x1="0" y1="35" x2="260" y2="35" className={styles.chartGrid} />
        <line x1="0" y1="70" x2="260" y2="70" className={styles.chartGrid} />
        <line x1="0" y1="105" x2="260" y2="105" className={styles.chartGrid} />
        <path
          d="M0,100 Q30,80 60,60 T120,40 T180,70 T240,30 L260,45"
          className={styles.chartLine}
        />
      </svg>
    </div>
  );
}

function DatabasesCard() {
  const lines = ['SELECT * FROM meals', 'WHERE user_id = 42', 'ORDER BY created_at', '→ 3 rows'];
  return (
    <div className={styles.cardAnim}>
      <div className={styles.dbLog}>
        {lines.map((line, i) => (
          <span key={i} className={styles.dbLine} style={{ animationDelay: `${i * 0.6}s` }}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function CloudCard() {
  const cmds = ['scp app.py → server', 'ssh lightsail', 'systemctl restart', '● active (running)'];
  return (
    <div className={styles.cardAnim}>
      <div className={styles.termLog}>
        {cmds.map((cmd, i) => (
          <span
            key={i}
            className={`${styles.termLine} ${i === 3 ? styles.termSuccess : ''}`}
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            {i < 3 ? '$ ' : ''}{cmd}
          </span>
        ))}
      </div>
    </div>
  );
}

function NlpCard() {
  const words = [
    { text: 'paneer', tag: 'FOOD', color: '#5DFFA2' },
    { text: 'tikka', tag: 'FOOD', color: '#5DFFA2' },
    { text: '200g', tag: 'QTY', color: '#F0B86A' },
    { text: 'dinner', tag: 'MEAL', color: '#7B9EF0' },
  ];
  return (
    <div className={styles.cardAnim}>
      <div className={styles.nerWrap}>
        {words.map((w, i) => (
          <div key={i} className={styles.nerWord} style={{ animationDelay: `${i * 0.5}s` }}>
            <span className={styles.nerText}>{w.text}</span>
            <span className={styles.nerTag} style={{ background: w.color }}>{w.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.designWrap}>
        <div className={styles.designWire}>
          <div className={styles.designWireHeader} />
          <div className={styles.designWireBody}>
            <div className={styles.designWireBlock} />
            <div className={styles.designWireBlock} />
          </div>
        </div>
        <div className={styles.designArrow}>→</div>
        <div className={styles.designPolished}>
          <div className={styles.designPolishedHeader} />
          <div className={styles.designPolishedBody}>
            <div className={styles.designPolishedBlock} />
            <div className={styles.designPolishedBlock} />
          </div>
        </div>
      </div>
    </div>
  );
}

const CARD_COMPONENTS = {
  frontend: FrontendCard,
  ai: AiCard,
  backend: BackendCard,
  whatsapp: WhatsappCard,
  payments: PaymentsCard,
  datascience: DatascienceCard,
  databases: DatabasesCard,
  cloud: CloudCard,
  nlp: NlpCard,
  design: DesignCard,
};

function Card({ label, card }) {
  const Anim = CARD_COMPONENTS[card];
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{label}</span>
      {Anim && <Anim />}
    </div>
  );
}

export default function CapabilityCards() {
  const sectionRef = useRef(null);
  const topRowRef = useRef(null);
  const bottomRowRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        labelRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 90%' },
        },
      );

      if (topRowRef.current) {
        gsap.fromTo(topRowRef.current, { x: 50 },
          { x: -150, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
      }

      if (bottomRowRef.current) {
        gsap.fromTo(bottomRowRef.current, { x: -150 },
          { x: 50, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className={styles.capabilities}>
      <p ref={labelRef} className={styles.capLabel} style={{ opacity: 0 }}>
        04 / The Stack
      </p>
      <p className={styles.capSubheadline}>
        The technologies, frameworks, and tools behind every product.
      </p>

      <div className={styles.rowsWrap}>
        <div ref={topRowRef} className={styles.cardRow}>
          {TOP_ROW.map((item) => (
            <Card key={item.card} {...item} />
          ))}
        </div>
        <div ref={bottomRowRef} className={styles.cardRow}>
          {BOTTOM_ROW.map((item) => (
            <Card key={item.card} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
