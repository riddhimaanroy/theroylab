import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import styles from './GreetingLoader.module.css';

const GREETINGS = [
  { text: 'Hello', lang: 'en' },
  { text: 'नमस्ते', lang: 'hi' },
  { text: 'こんにちは', lang: 'ja' },
  { text: 'Bonjour', lang: 'fr' },
  { text: 'Hola', lang: 'es' },
];

const SESSION_KEY = 'hero_v2_greeted';

export default function GreetingLoader({ onComplete }) {
  const overlayRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasVisited = useRef(false);

  useEffect(() => {
    hasVisited.current = sessionStorage.getItem(SESSION_KEY) === '1';
  }, []);

  const exit = useCallback(() => {
    if (!overlayRef.current) return;
    sessionStorage.setItem(SESSION_KEY, '1');

    const tl = gsap.timeline();
    const activeEl = overlayRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      tl.to(activeEl, {
        opacity: 0,
        duration: 0.3,
        ease: 'cubic-bezier(0.76, 0, 0.24, 1)',
      });
    }
    tl.to({}, { duration: 0.3 });
    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'cubic-bezier(0.76, 0, 0.24, 1)',
      onComplete: () => onComplete?.(),
    });
  }, [onComplete]);

  useEffect(() => {
    const isReturn = hasVisited.current;
    const interval = isReturn ? 250 : 420;
    const totalSteps = GREETINGS.length;
    let step = 0;
    let intervalId;

    const startDelay = setTimeout(() => {
      intervalId = setInterval(() => {
        step++;
        if (step >= totalSteps) {
          clearInterval(intervalId);
          exit();
          return;
        }
        indexRef.current = step % GREETINGS.length;
        setActiveIndex(indexRef.current);
      }, interval);
    }, isReturn ? 100 : 250);

    return () => {
      clearTimeout(startDelay);
      if (intervalId) clearInterval(intervalId);
    };
  }, [exit]);

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.stack}>
        {GREETINGS.map((g, i) => (
          <span
            key={g.lang}
            className={`${styles.word} ${i === activeIndex ? styles.active : ''}`}
            data-active={i === activeIndex ? 'true' : 'false'}
            lang={g.lang}
          >
            {g.text}
          </span>
        ))}
      </div>
    </div>
  );
}
