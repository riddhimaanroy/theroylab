import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

const PHOTO_URL = '/hero-photo.png';
const ILLUSTRATION_URL = '/hero-illustration.png';

export default function Hero({ started }) {
  const sectionRef = useRef(null);
  const portraitRef = useRef(null);
  const photoRef = useRef(null);
  const labelLeftRef = useRef(null);
  const labelRightRef = useRef(null);
  const nameTrackRef = useRef(null);
  const badgeRef = useRef(null);
  const entranceDone = useRef(false);
  const scrollCtx = useRef(null);
  const rafId = useRef(null);
  const mouseX = useRef(0.5);
  const targetX = useRef(0.5);
  const isMobile = useRef(false);
  const autoTime = useRef(0);

  /* Detect touch device on mount */
  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches
      || 'ontouchstart' in window;
  }, []);

  /* ---- Smooth split tracking ---- */
  /* mouseX: 0 = cursor far left, 1 = cursor far right
     Illustration = base layer (always visible underneath).
     Photo = top layer, clipped from the LEFT.
     - mouseX=0 → leftClip=100% → photo hidden → illustration shows
     - mouseX=0.5 → leftClip=50% → 50/50 split
     - mouseX=1 → leftClip=0% → photo fully visible */
  const updateSplit = useCallback(() => {
    // On mobile: auto-oscillate between 35% and 65%
    if (isMobile.current) {
      autoTime.current += 0.008;
      targetX.current = 0.5 + Math.sin(autoTime.current) * 0.15;
    }

    mouseX.current += (targetX.current - mouseX.current) * 0.8;

    const photo = photoRef.current;
    const labelL = labelLeftRef.current;
    const labelR = labelRightRef.current;

    if (photo) {
      const leftClip = (1 - mouseX.current) * 100;
      photo.style.clipPath = `inset(0 0 0 ${leftClip}%)`;

      // Labels: active side gets full opacity + slight scale, inactive fades
      if (labelL) {
        const leftStrength = Math.max(0, 1 - mouseX.current / 0.55);
        labelL.style.opacity = 0.25 + leftStrength * 0.75;
        labelL.style.transform = `translateY(-50%) scale(${1 + leftStrength * 0.03})`;
      }
      if (labelR) {
        const rightStrength = Math.max(0, (mouseX.current - 0.45) / 0.55);
        labelR.style.opacity = 0.25 + rightStrength * 0.75;
        labelR.style.transform = `translateY(-50%) scale(${1 + rightStrength * 0.03})`;
      }
    }

    rafId.current = requestAnimationFrame(updateSplit);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isMobile.current) return;
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    targetX.current = Math.max(0.05, Math.min(0.95, x));
  }, []);

  const handleTouchMove = useCallback((e) => {
    const section = sectionRef.current;
    if (!section || !e.touches[0]) return;
    const rect = section.getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) / rect.width;
    targetX.current = Math.max(0.05, Math.min(0.95, x));
    isMobile.current = false; // stop auto-oscillation once user interacts
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetX.current = 0.5;
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(updateSplit);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [updateSplit]);

  /* ---- Entrance + scroll ---- */
  useEffect(() => {
    if (!started || entranceDone.current) return;

    const section = sectionRef.current;
    const portrait = portraitRef.current;
    const nameTrack = nameTrackRef.current;
    const badge = badgeRef.current;

    if (!section || !portrait || !nameTrack || !badge) return;

    const tl = gsap.timeline({
      onComplete: () => {
        entranceDone.current = true;
        setupScroll();
      },
    });

    tl.fromTo(portrait,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.4, ease: 'cubic-bezier(0.25, 1, 0.5, 1)' }, 0);

    tl.fromTo(nameTrack,
      { yPercent: 80, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.2, ease: 'cubic-bezier(0.76, 0, 0.24, 1)' }, 0.15);

    tl.fromTo(badge,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'cubic-bezier(0.25, 1, 0.5, 1)' }, 0.65);

    tl.fromTo(
      [labelLeftRef.current, labelRightRef.current].filter(Boolean),
      { opacity: 0, y: 15 },
      { opacity: 0.6, y: 0, duration: 1, ease: 'power2.out' }, 0.8);

    function setupScroll() {
      scrollCtx.current = gsap.context(() => {
        gsap.fromTo(portrait, { y: 0 },
          { y: '45vh', ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.4 } });

        gsap.fromTo(nameTrack, { x: 0 },
          { x: 600, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.3 } });

        gsap.fromTo(badge, { y: 0 },
          { y: '10vh', ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.6 } });
      }, section);
      ScrollTrigger.refresh();
    }

    return () => { tl.kill(); scrollCtx.current?.revert(); };
  }, [started]);

  useEffect(() => () => scrollCtx.current?.revert(), []);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      data-section="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
    >
      {/* ---- Split portrait ---- */}
      <div className={styles.portraitAnchor}>
        <div ref={portraitRef} className={styles.portraitWrap} style={{ opacity: 0 }}>
          <div className={styles.portraitMask}>
            <img src={ILLUSTRATION_URL} alt="Riddhimaan Roy illustrated"
              className={styles.portraitImg} loading="eager" />
            <img ref={photoRef} src={PHOTO_URL} alt="Riddhimaan Roy"
              className={`${styles.portraitImg} ${styles.portraitPhoto}`}
              style={{ clipPath: 'inset(0 0 0 50%)' }} loading="eager" />
          </div>
        </div>
      </div>

      {/* ---- Left label: creator ---- */}
      <div ref={labelLeftRef} className={styles.labelLeft} style={{ opacity: 0 }}>
        <span className={styles.labelMain}>creator</span>
        <span className={styles.labelDesc}>
          I design and build products from<br />
          zero to live — websites, AI tools,<br />
          and everything in between.
        </span>
      </div>

      {/* ---- Right label: AI native + code snippets ---- */}
      <div ref={labelRightRef} className={styles.labelRight} style={{ opacity: 0 }}>
        <span className={styles.labelMain}>&lt;AI&nbsp;native&gt;</span>
        <span className={styles.labelDesc}>
          I don't just use AI, I understand it.<br />
          Data scientist by trade,<br />
          builder by obsession.
        </span>
      </div>

      {/* ---- Location badge ---- */}
      <div ref={badgeRef} className={styles.badge} style={{ opacity: 0 }}>
        <div className={styles.badgeTextZone}>
          <span className={styles.badgeLine}>Located</span>
          <span className={styles.badgeLine}>in India</span>
        </div>
        <div className={styles.badgeGlobeZone}>
          <div className={styles.badgeGlobeInner}>
            <svg className={styles.badgeGlobeSvg} width="30" height="30"
              viewBox="0 0 40 40" fill="none" stroke="#D4CBC2" strokeWidth="1.1">
              <circle cx="20" cy="20" r="18" />
              <ellipse cx="20" cy="20" rx="7" ry="18" />
              <ellipse cx="20" cy="20" rx="13" ry="18" />
              <line x1="2" y1="12" x2="38" y2="12" />
              <line x1="2" y1="20" x2="38" y2="20" />
              <line x1="2" y1="28" x2="38" y2="28" />
            </svg>
          </div>
        </div>
      </div>

      {/* ---- Name at bottom ---- */}
      <div className={styles.nameRow}>
        <h1 ref={nameTrackRef} className={styles.nameTrack} style={{ opacity: 0 }}>
          Riddhimaan Roy
        </h1>
      </div>
    </section>
  );
}
