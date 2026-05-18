import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Constellation from './Constellation';
import MagneticBubble from './MagneticBubble';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_WORDS =
  '80% thinking. 20% building. That\'s why it works.'.split(' ');

const BIO_1_WORDS =
  '8 years in data science and machine learning — NLP systems at Mastercard, production pipelines at Accenture. I\'ve spent my career understanding how AI actually works, not just how to call an API.'.split(' ');

const BIO_2_WORDS =
  'That same depth goes into everything I build. Websites, AI tools, WhatsApp bots, payment systems — I design every screen, write every API, and deploy it myself. No team. No handoffs. One person, full stack, live product.'.split(' ');

const DANCE_WORDS = new Set(['80%', '20%', 'Mastercard', 'Accenture']);

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
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        },
      );

      // Headline word spotlight — scrub from #555 → #E8E8E8
      const hw = headlineRef.current?.querySelectorAll('[data-hw]');
      if (hw?.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 95%',
            end: 'top 40%',
            scrub: 1,
          },
        });
        hw.forEach((el, i) => {
          tl.to(el, { color: '#E8E8E8', duration: 0.3 }, i * 0.08);
        });
      }

      // Accent line wipe
      gsap.fromTo(
        lineRef.current,
        { width: 0 },
        {
          width: 60, duration: 0.6, ease: 'power3.inOut',
          scrollTrigger: { trigger: lineRef.current, start: 'top 75%' },
        },
      );

      // Bio 1 word spotlight — scrub from #444 → #C8C8C8
      const bw1 = bio1Ref.current?.querySelectorAll('[data-bw]');
      if (bw1?.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bio1Ref.current,
            start: 'top 98%',
            end: 'top 30%',
            scrub: 1,
          },
        });
        bw1.forEach((el, i) => {
          tl.to(el, { color: '#C8C8C8', duration: 0.15 }, i * 0.03);
        });
      }

      // Bio 2 word spotlight
      const bw2 = bio2Ref.current?.querySelectorAll('[data-bw]');
      if (bw2?.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bio2Ref.current,
            start: 'top 98%',
            end: 'top 30%',
            scrub: 1,
          },
        });
        bw2.forEach((el, i) => {
          tl.to(el, { color: '#C8C8C8', duration: 0.15 }, i * 0.03);
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.about} style={{ overflow: 'hidden' }}>
      <Constellation sectionRef={sectionRef} bubbleElRef={bubbleRef} onBubbleGlow={handleBubbleGlow} />

      <div className={styles.inner} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '100px' }}>
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

        <div style={{ flexShrink: 0, width: '150px', marginTop: '60px', marginRight: '40px' }}>
          <MagneticBubble ref={bubbleRef} glowStrength={bubbleGlow} />
        </div>
      </div>
    </section>
  );
}
