import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Constellation from './Constellation';
import MagneticBubble from './MagneticBubble';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_WORDS =
  'I hunt for the signal everyone else missed.'.split(' ');
const BIO_1_WORDS =
  '8 years deep in data science. Currently helping Mastercard rethink their approach to NLP. Before that, nearly 4 years at Accenture building the models that actually shipped.'.split(
    ' ',
  );
const BIO_2_WORDS =
  'I move fast — curiosity is the engine, execution is the output. I help companies see in their data what they would have completely missed.'.split(
    ' ',
  );
const DANCE_WORDS = new Set(['8', 'Mastercard', '4', 'Accenture']);

const WORD_ICONS = {
  Mastercard: (
    <svg className={styles.danceIcon} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="12" r="7" fill="#EB001B" opacity="0.9" />
      <circle cx="15" cy="12" r="7" fill="#F79E1B" opacity="0.9" />
      <path d="M12 6.5a7 7 0 0 1 0 11 7 7 0 0 1 0-11z" fill="#FF5F00" opacity="0.9" />
    </svg>
  ),
  Accenture: (
    <svg className={styles.danceIcon} viewBox="0 0 100 100" fill="none">
      <path d="M15 10 L75 50 L15 90 L30 90 L90 50 L30 10 Z" fill="#A100FF" />
    </svg>
  ),
};

const HOW_I_WORK = [
  { num: '01', title: '48h first signal', desc: 'First insights delivered within 48 hours — no waiting for kickoff meetings.' },
  { num: '02', title: 'Direct line', desc: 'Slack, WhatsApp, calls. No middlemen, no ticket queues.' },
  { num: '03', title: 'Flex scope', desc: 'One-off analysis or end-to-end pipeline builds. You pick the depth.' },
  { num: '04', title: 'No black boxes', desc: 'Async updates with full visibility. You always know what\'s happening.' },
];

function WordSpan({ words, dataAttr }) {
  return words.map((word, i) => {
    const isDance = DANCE_WORDS.has(word);
    const icon = WORD_ICONS[word];
    return (
      <span
        key={i}
        className={`${styles.spotWord} ${isDance ? styles.danceWord : ''}`}
        style={isDance ? { animationDelay: `${i * 0.15}s` } : undefined}
        {...{ [dataAttr]: '' }}
      >
        {icon}{word}{i < words.length - 1 ? ' ' : ''}
      </span>
    );
  });
}

export default function About() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const lineRef = useRef(null);
  const bio1Ref = useRef(null);
  const bio2Ref = useRef(null);
  const howLabelRef = useRef(null);
  const howLinesRef = useRef(null);
  const bubbleRef = useRef(null);
  const [bubbleGlow, setBubbleGlow] = useState(0);

  const handleBubbleGlow = useCallback((v) => setBubbleGlow(v), []);

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
          scrollTrigger: { trigger: section, start: 'top 80%' },
        },
      );

      // Headline word spotlight — scrub from #555 → #E8E8E8
      const hw = headlineRef.current?.querySelectorAll('[data-hw]');
      if (hw?.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
            onEnter: () => console.log('[About] headline ScrollTrigger entered'),
            onUpdate: (self) => console.log('[About] headline progress:', self.progress.toFixed(2)),
          },
        });
        hw.forEach((el, i) => {
          tl.to(el, { color: '#E8E8E8', duration: 0.3 }, i * 0.1);
        });
      }

      // Accent line wipe
      gsap.fromTo(
        lineRef.current,
        { width: 0 },
        {
          width: 60,
          duration: 0.6,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: lineRef.current, start: 'top 75%' },
        },
      );

      // Bio 1 word spotlight — scrub from #444 → #C8C8C8
      const bw1 = bio1Ref.current?.querySelectorAll('[data-bw]');
      if (bw1?.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bio1Ref.current,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 1,
          },
        });
        bw1.forEach((el, i) => {
          tl.to(el, { color: '#C8C8C8', duration: 0.15 }, i * 0.05);
        });
      }

      // Bio 2 word spotlight
      const bw2 = bio2Ref.current?.querySelectorAll('[data-bw]');
      if (bw2?.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bio2Ref.current,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 1,
          },
        });
        bw2.forEach((el, i) => {
          tl.to(el, { color: '#C8C8C8', duration: 0.15 }, i * 0.05);
        });
      }

      // "How I work" label fade in
      gsap.fromTo(
        howLabelRef.current,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: howLabelRef.current, start: 'top 85%' },
        },
      );

      // "How I work" cards — clip-path reveal + number count-up
      const howCards = howLinesRef.current?.querySelectorAll('[data-how-line]');
      if (howCards?.length) {
        // Cards reveal with clip-path wipe from left
        howCards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              duration: 0.8,
              ease: 'power3.inOut',
              delay: 0.2 + i * 0.12,
              scrollTrigger: { trigger: howLinesRef.current, start: 'top 85%' },
            },
          );

          // Number count-up: animate from 00 to target
          const numEl = card.querySelector('[data-how-num]');
          if (numEl) {
            const target = parseInt(numEl.textContent, 10);
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.2,
              delay: 0.4 + i * 0.12,
              ease: 'power2.out',
              scrollTrigger: { trigger: howLinesRef.current, start: 'top 85%' },
              onUpdate: () => {
                numEl.textContent = String(Math.round(obj.val)).padStart(2, '0');
              },
            });
          }

          // Top border color sweep
          const border = card.querySelector('[data-how-border]');
          if (border) {
            gsap.fromTo(
              border,
              { scaleX: 0, transformOrigin: 'left' },
              {
                scaleX: 1,
                duration: 0.6,
                ease: 'power3.out',
                delay: 0.5 + i * 0.12,
                scrollTrigger: { trigger: howLinesRef.current, start: 'top 85%' },
              },
            );
          }
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.about} style={{ overflow: 'hidden' }}>
      {/* Canvas constellation — z-index 0, behind all content */}
      <Constellation sectionRef={sectionRef} bubbleElRef={bubbleRef} onBubbleGlow={handleBubbleGlow} />

      {/* Content container — flexbox: text left, bubble right */}
      <div className={styles.inner} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '100px' }}>
        {/* Left column: all text content */}
        <div className={styles.leftContent} style={{ flex: 1 }}>
          <p ref={labelRef} className={styles.label} style={{ opacity: 0 }}>
            01 / About
          </p>

          <h2 ref={headlineRef} className={styles.headline}>
            <WordSpan words={HEADLINE_WORDS} dataAttr="data-hw" />
          </h2>

          <div ref={lineRef} className={styles.accentLine} />

          <div className={styles.bio}>
            <p ref={bio1Ref} className={styles.bioPara}>
              <WordSpan words={BIO_1_WORDS} dataAttr="data-bw" />
            </p>
            <p ref={bio2Ref} className={styles.bioPara2}>
              <WordSpan words={BIO_2_WORDS} dataAttr="data-bw" />
            </p>
          </div>

        </div>

        {/* Right side: LinkedIn magnetic bubble */}
        <div style={{ flexShrink: 0, width: '150px', marginTop: '60px', marginRight: '40px' }}>
          <MagneticBubble ref={bubbleRef} glowStrength={bubbleGlow} />
        </div>
      </div>

      {/* How I work — full width below the flex layout */}
      <div className={styles.howBlock} style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.howBlockInner}>
          <p ref={howLabelRef} className={styles.howLabel} style={{ opacity: 0 }}>
            How I work
          </p>
          <div ref={howLinesRef} className={styles.howGrid}>
            {HOW_I_WORK.map((item) => (
              <div key={item.num} data-how-line className={styles.howCard} style={{ opacity: 0 }}>
                <div data-how-border className={styles.howCardBorder} />
                <div className={styles.howCardGlow} />
                <span data-how-num className={styles.howNum}>{item.num}</span>
                <div className={styles.howCardContent}>
                  <div className={styles.howTitleRow}>
                    <span className={styles.howPulse} />
                    <span className={styles.howTitle}>{item.title}</span>
                  </div>
                  <span className={styles.howDesc}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
