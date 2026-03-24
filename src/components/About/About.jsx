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
const CHIPS = ['Mastercard', 'Accenture', 'NLP', '8 Years'];

function WordSpan({ words, dataAttr }) {
  return words.map((word, i) => (
    <span key={i} className={styles.spotWord} {...{ [dataAttr]: '' }}>
      {word}
      {i < words.length - 1 ? '\u00A0' : ''}
    </span>
  ));
}

export default function About() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const lineRef = useRef(null);
  const bio1Ref = useRef(null);
  const bio2Ref = useRef(null);
  const chipsRef = useRef(null);
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

      // Chips stagger in after text reveals
      const chips = chipsRef.current?.querySelectorAll('[data-chip]');
      if (chips?.length) {
        gsap.fromTo(
          chips,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: chipsRef.current, start: 'top 88%' },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.about} style={{ overflow: 'hidden' }}>
      {/* Canvas constellation — z-index 0, behind all content */}
      <Constellation sectionRef={sectionRef} bubbleElRef={bubbleRef} onBubbleGlow={handleBubbleGlow} />

      {/* Content container — flexbox: text left, bubble right */}
      <div className={styles.inner} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '60px' }}>
        {/* Left column: all text content */}
        <div className={styles.leftContent} style={{ flex: 1, maxWidth: '600px' }}>
          <p ref={labelRef} className={styles.label} style={{ opacity: 0 }}>
            01 / About
          </p>

          <h2 ref={headlineRef} className={styles.headline}>
            <WordSpan words={HEADLINE_WORDS} dataAttr="data-hw" />
          </h2>

          <div ref={lineRef} className={styles.accentLine} />

          <div className={styles.bio} style={{ maxWidth: '550px', overflow: 'hidden' }}>
            <p ref={bio1Ref} className={styles.bioPara} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              <WordSpan words={BIO_1_WORDS} dataAttr="data-bw" />
            </p>
            <p ref={bio2Ref} className={styles.bioPara2} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              <WordSpan words={BIO_2_WORDS} dataAttr="data-bw" />
            </p>
          </div>

          <div ref={chipsRef} className={styles.chips}>
            {CHIPS.map((chip) => (
              <span
                key={chip}
                data-chip
                data-cursor-hover
                className={styles.chip}
                style={{ opacity: 0 }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Right side: LinkedIn magnetic bubble */}
        <div style={{ flexShrink: 0, width: '150px', marginTop: '60px', marginRight: '40px' }}>
          <MagneticBubble ref={bubbleRef} glowStrength={bubbleGlow} />
        </div>
      </div>
    </section>
  );
}
