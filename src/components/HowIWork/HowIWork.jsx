import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HowIWork.module.css';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: '01',
    title: 'Understand the problem',
    desc: 'We talk. I ask questions most developers don\'t — what\'s the business goal, who\'s the user, what does success look like. No jumping into code.',
  },
  {
    num: '02',
    title: 'Design the solution',
    desc: 'I map out the architecture, the user flow, and the screens before writing a single line. You see what you\'re getting before I build it.',
  },
  {
    num: '03',
    title: 'Build everything',
    desc: 'Frontend, backend, AI, payments, deployment — I handle the full stack. One person, no handoffs, no miscommunication.',
  },
  {
    num: '04',
    title: 'Ship it live',
    desc: 'Not a prototype. Not a staging link. A live product with real users, real payments, and real uptime. Deployed and running.',
  },
];

export default function HowIWork() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Label fade in
      gsap.fromTo(
        labelRef.current,
        { y: 15, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 85%' },
        },
      );

      // Cards — clip-path reveal + number count-up
      const cards = gridRef.current?.querySelectorAll('[data-how-line]');
      if (cards?.length) {
        cards.forEach((card, i) => {
          // Card reveal with clip-path wipe from left
          gsap.fromTo(
            card,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            {
              clipPath: 'inset(0 0% 0 0)', opacity: 1,
              duration: 0.8, ease: 'power3.inOut',
              delay: 0.2 + i * 0.12,
              scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
            },
          );

          // Number count-up
          const numEl = card.querySelector('[data-how-num]');
          if (numEl) {
            const target = parseInt(numEl.getAttribute('data-target'), 10);
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target, duration: 1.2,
              delay: 0.4 + i * 0.12, ease: 'power2.out',
              scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
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
                scaleX: 1, duration: 0.6, ease: 'power3.out',
                delay: 0.5 + i * 0.12,
                scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
              },
            );
          }
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.howSection}>
      <div className={styles.howInner}>
        <p ref={labelRef} className={styles.howLabel} style={{ opacity: 0 }}>
          02 / How I Work
        </p>
        <div ref={gridRef} className={styles.howGrid}>
          {STEPS.map((item) => (
            <div key={item.num} data-how-line className={styles.howCard} style={{ opacity: 0 }}>
              <div data-how-border className={styles.howCardBorder} />
              <div className={styles.howCardGlow} />
              <span data-how-num data-target={item.num} className={styles.howNum}>00</span>
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
    </section>
  );
}
