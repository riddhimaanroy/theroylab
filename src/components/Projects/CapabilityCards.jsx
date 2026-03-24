import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CapabilityCards.module.css';

gsap.registerPlugin(ScrollTrigger);

const TOP_ROW = [
  { label: 'Python & R', card: 'agents' },
  { label: 'NLP & Transformers', card: 'nlp' },
  { label: 'Predictive Modeling', card: 'predictive' },
  { label: 'Computer Vision', card: 'vision' },
  { label: 'Real-time Systems', card: 'realtime' },
];

const BOTTOM_ROW = [
  { label: 'Dashboards & Viz', card: 'dashboards' },
  { label: 'Deep Learning', card: 'recommend' },
  { label: 'Cloud & MLOps', card: 'mlops' },
  { label: 'SQL & Data Eng', card: 'strategy' },
  { label: 'Rapid Prototyping', card: 'prototype' },
];

/* ---- Individual card animation components ---- */

function AgentsCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.agentsFlow}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.agentsNode}>
            <div className={styles.agentsDot} />
            {i < 2 && <div className={styles.agentsLine} style={{ animationDelay: `${i * 0.6}s` }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function NlpCard() {
  const lines = ['analyzing...', 'tokenizing...', 'classifying...', 'extracting...', 'tagging...'];
  return (
    <div className={styles.cardAnim}>
      <div className={styles.nlpLog}>
        {lines.map((line, i) => (
          <span key={i} className={styles.nlpLine} style={{ animationDelay: `${i * 0.7}s` }}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function PredictiveCard() {
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

function VisionCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.visionGrid}>
        {Array.from({ length: 48 }, (_, i) => (
          <div
            key={i}
            className={styles.visionPixel}
            style={{ animationDelay: `${(Math.random() * 4).toFixed(2)}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function RealtimeCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.realtimeWrap}>
        <span className={styles.realtimeCounter} />
        <span className={styles.realtimeLabel}>req/s</span>
        <div className={styles.realtimeBar}>
          <div className={styles.realtimeBarFill} />
        </div>
      </div>
    </div>
  );
}

function DashboardsCard() {
  const bars = [
    { label: 'Q1', width: '60%', delay: '0s' },
    { label: 'Q2', width: '85%', delay: '0.3s' },
    { label: 'Q3', width: '45%', delay: '0.6s' },
  ];
  return (
    <div className={styles.cardAnim}>
      <div className={styles.dashBars}>
        {bars.map((b) => (
          <div key={b.label} className={styles.dashRow}>
            <span className={styles.dashLabel}>{b.label}</span>
            <div className={styles.dashTrack}>
              <div className={styles.dashFill} style={{ '--bar-w': b.width, animationDelay: b.delay }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendCard() {
  return (
    <div className={styles.cardAnim}>
      <svg viewBox="0 0 260 140" className={styles.graphSvg}>
        {/* Dots */}
        <circle cx="50" cy="40" r="4" className={styles.graphDot} />
        <circle cx="130" cy="30" r="4" className={styles.graphDot} style={{ animationDelay: '0.5s' }} />
        <circle cx="90" cy="90" r="4" className={styles.graphDot} style={{ animationDelay: '1s' }} />
        <circle cx="200" cy="60" r="4" className={styles.graphDot} style={{ animationDelay: '0.3s' }} />
        <circle cx="170" cy="110" r="4" className={styles.graphDot} style={{ animationDelay: '0.8s' }} />
        <circle cx="230" cy="100" r="4" className={styles.graphDot} style={{ animationDelay: '1.2s' }} />
        {/* Lines */}
        <line x1="50" y1="40" x2="130" y2="30" className={styles.graphLine} />
        <line x1="50" y1="40" x2="90" y2="90" className={styles.graphLine} style={{ animationDelay: '0.8s' }} />
        <line x1="130" y1="30" x2="200" y2="60" className={styles.graphLine} style={{ animationDelay: '1.2s' }} />
        <line x1="200" y1="60" x2="170" y2="110" className={styles.graphLine} style={{ animationDelay: '1.6s' }} />
        <line x1="170" y1="110" x2="230" y2="100" className={styles.graphLine} style={{ animationDelay: '2s' }} />
        <line x1="90" y1="90" x2="170" y2="110" className={styles.graphLine} style={{ animationDelay: '2.4s' }} />
      </svg>
    </div>
  );
}

function MlopsCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.mlopsWrap}>
        <svg viewBox="0 0 80 80" className={styles.mlopsSvg}>
          <circle cx="40" cy="40" r="34" className={styles.mlopsTrack} />
          <circle cx="40" cy="40" r="34" className={styles.mlopsRing} />
        </svg>
        <span className={styles.mlopsPercent} />
      </div>
    </div>
  );
}

function StrategyCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.strategyBars}>
        <div className={styles.strategyBar} style={{ '--bar-w': '70%', animationDelay: '0s' }} />
        <div className={`${styles.strategyBar} ${styles.strategyBarAlt}`} style={{ '--bar-w': '50%', animationDelay: '0.4s' }} />
        <div className={styles.strategyBar} style={{ '--bar-w': '90%', animationDelay: '0.8s' }} />
      </div>
    </div>
  );
}

function PrototypeCard() {
  return (
    <div className={styles.cardAnim}>
      <div className={styles.protoWrap}>
        <span className={styles.protoText} />
        <span className={styles.protoCursor}>|</span>
      </div>
    </div>
  );
}

const CARD_COMPONENTS = {
  agents: AgentsCard,
  nlp: NlpCard,
  predictive: PredictiveCard,
  vision: VisionCard,
  realtime: RealtimeCard,
  dashboards: DashboardsCard,
  recommend: RecommendCard,
  mlops: MlopsCard,
  strategy: StrategyCard,
  prototype: PrototypeCard,
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
      // Label fade in
      gsap.fromTo(
        labelRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 90%' },
        },
      );

      // Top row drifts left
      if (topRowRef.current) {
        gsap.fromTo(
          topRowRef.current,
          { x: 100 },
          {
            x: -400,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      // Bottom row drifts right
      if (bottomRowRef.current) {
        gsap.fromTo(
          bottomRowRef.current,
          { x: -400 },
          {
            x: 100,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className={styles.capabilities}>
      <p ref={labelRef} className={styles.capLabel} style={{ opacity: 0 }}>
        The Toolkit
      </p>
      <p className={styles.capSubheadline}>
        The technologies, frameworks, and methods behind every project.
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
