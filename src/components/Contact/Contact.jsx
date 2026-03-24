import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lerp } from '../../utils/lerp';
import styles from './Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_WORDS = ["Let's", 'work', 'together'];
const IS_TOUCH =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/riddhimaan' },
  { label: 'GitHub', href: 'https://github.com/riddhimaan' },
  { label: 'Twitter', href: 'https://twitter.com/riddhimaan' },
];

/* ---- Magnetic "Get in touch" bubble ---- */
function GetInTouchBubble() {
  const wrapRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const rafId = useRef(null);
  const cPos = useRef({ x: 0, y: 0 });
  const tPos = useRef({ x: 0, y: 0 });
  const cTarget = useRef({ x: 0, y: 0 });
  const tTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (IS_TOUCH) return;
    const wrap = wrapRef.current;
    const circle = circleRef.current;
    const text = textRef.current;
    if (!wrap || !circle || !text) return;

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 350) {
        const ratio = 1 - dist / 350;
        const angle = Math.atan2(dy, dx);
        const pull = ratio * 40;
        cTarget.current = { x: Math.cos(angle) * pull, y: Math.sin(angle) * pull };
        tTarget.current = { x: Math.cos(angle) * pull * 1.3, y: Math.sin(angle) * pull * 1.3 };
      } else {
        cTarget.current = { x: 0, y: 0 };
        tTarget.current = { x: 0, y: 0 };
      }
    };

    const animate = () => {
      cPos.current.x = lerp(cPos.current.x, cTarget.current.x, 0.12);
      cPos.current.y = lerp(cPos.current.y, cTarget.current.y, 0.12);
      tPos.current.x = lerp(tPos.current.x, tTarget.current.x, 0.18);
      tPos.current.y = lerp(tPos.current.y, tTarget.current.y, 0.18);
      circle.style.transform = `translate(${cPos.current.x}px, ${cPos.current.y}px)`;
      text.style.transform = `translate(${tPos.current.x}px, ${tPos.current.y}px)`;
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    rafId.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.bubbleWrap}>
      <a
        ref={circleRef}
        href="mailto:riddhimaan1994roy@gmail.com"
        className={styles.bubble}
        data-cursor-hover
      >
        <span ref={textRef} className={styles.bubbleText}>Get in touch</span>
      </a>
    </div>
  );
}

/* ---- Live local time ---- */
function LocalTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const tz = Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone.split('/')
        .pop()
        .replace(/_/g, ' ');
      setTime(`${t} ${tz}`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);
  return <span className={styles.footerValue}>{time}</span>;
}

/* ---- Main Contact section ---- */
export default function Contact() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const photoRef = useRef(null);
  const bubbleAreaRef = useRef(null);
  const pillsRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Master scrub timeline — everything is scroll-driven
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 35%',
          scrub: 1,
        },
      });

      // 1. Photo scales in at the start
      if (photoRef.current) {
        tl.fromTo(
          photoRef.current,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
          0,
        );
      }

      // 2. Headline words light up one by one
      const hw = headlineRef.current?.querySelectorAll('[data-hw]');
      if (hw?.length) {
        hw.forEach((el, i) => {
          tl.to(el, { color: '#E8E8E8', duration: 0.3 }, i * 0.15);
        });
      }

      // 3. Bubble scales in slightly after headline starts
      if (bubbleAreaRef.current) {
        tl.fromTo(
          bubbleAreaRef.current,
          { scale: 0.85, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
          0.2,
        );
      }

      // 4. Pills fade up after headline is mostly done
      const pills = pillsRef.current?.querySelectorAll('[data-pill]');
      if (pills?.length) {
        tl.fromTo(
          pills,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.12, ease: 'power2.out' },
          0.5,
        );
      }

      // 5. Footer fades in last
      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
          0.7,
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className={styles.contact}>
      <div className={styles.inner}>
        {/* Top row: photo + headline + bubble */}
        <div className={styles.topRow}>
          <div className={styles.topLeft}>
            <img
              ref={photoRef}
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80"
              alt="Portrait"
              className={styles.photo}
              style={{ opacity: 0 }}
            />
            <div ref={headlineRef} className={styles.headline}>
              {HEADLINE_WORDS.map((word, i) => (
                <span key={i} data-hw className={styles.headlineWord}>
                  {word}{' '}
                </span>
              ))}
            </div>
          </div>

          <div ref={bubbleAreaRef} className={styles.topRight} style={{ opacity: 0 }}>
            <GetInTouchBubble />
          </div>
        </div>

        {/* Contact pills */}
        <div className={styles.divider} />
        <div ref={pillsRef} className={styles.pills}>
          <a
            href="mailto:riddhimaan1994roy@gmail.com"
            data-pill
            data-cursor-hover
            className={styles.pill}
            style={{ opacity: 0 }}
          >
            riddhimaan1994roy@gmail.com
          </a>
          <a
            href="tel:+918390160679"
            data-pill
            data-cursor-hover
            className={styles.pill}
            style={{ opacity: 0 }}
          >
            +91-8390160679
          </a>
        </div>

        {/* Footer */}
        <div className={styles.footerLine} />
        <footer ref={footerRef} className={styles.footer} style={{ opacity: 0 }}>
          <div className={styles.footerCol}>
            <span className={styles.footerLabel}>Version</span>
            <span className={styles.footerValue}>2026 © Edition</span>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerLabel}>Local Time</span>
            <LocalTime />
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerLabel}>Socials</span>
            <div className={styles.footerSocials}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className={styles.footerSocialLink}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
