import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

const PHOTO_URL =
  'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=800&q=80';

export default function Hero({ started }) {
  const sectionRef = useRef(null);
  const photoWrapRef = useRef(null);
  const nameTrackRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const entranceDone = useRef(false);
  const scrollCtx = useRef(null);

  // ——— Phase 1: Entrance animations ———
  useEffect(() => {
    if (!started || entranceDone.current) return;

    const section = sectionRef.current;
    const photoWrap = photoWrapRef.current;
    const nameTrack = nameTrackRef.current;
    const title = titleRef.current;
    const badge = badgeRef.current;

    if (!section || !photoWrap || !nameTrack || !title || !badge) return;

    const tl = gsap.timeline({
      onComplete: () => {
        entranceDone.current = true;
        setupScrollAnimations();
      },
    });

    // Photo scales in
    tl.fromTo(
      photoWrap,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.4, ease: 'cubic-bezier(0.25, 1, 0.5, 1)' },
      0
    );

    // Name slides up from below
    tl.fromTo(
      nameTrack,
      { yPercent: 80, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.2, ease: 'cubic-bezier(0.76, 0, 0.24, 1)' },
      0.15
    );

    // Title fades up
    tl.fromTo(
      title,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'cubic-bezier(0.25, 1, 0.5, 1)' },
      0.5
    );

    // Badge fades up
    tl.fromTo(
      badge,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'cubic-bezier(0.25, 1, 0.5, 1)' },
      0.65
    );

    // ——— Phase 2: Scroll parallax (individual triggers, no pinning) ———
    // All elements lag behind natural scroll (positive y) at different rates.
    // This creates layered depth where elements separate cleanly on exit:
    //   Name exits first (no y lag, just drifts right) →
    //   Badge & title exit next (small lag) →
    //   Photo exits last (biggest lag, lingers longest)
    function setupScrollAnimations() {
      scrollCtx.current = gsap.context(() => {
        // Photo: 0.5x scroll speed — lags most, last to leave viewport.
        // No fade, no scale. Pure positional parallax.
        gsap.fromTo(
          photoWrap,
          { y: 0 },
          {
            y: '45vh',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.4,
            },
          }
        );

        // Name: drifts right on scroll, exits naturally (no y lag)
        gsap.fromTo(
          nameTrack,
          { x: 0 },
          {
            x: 600,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.3,
            },
          }
        );

        // Title: ~0.85x scroll speed — lags slightly behind natural scroll
        gsap.fromTo(
          title,
          { y: 0 },
          {
            y: '15vh',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );

        // Badge: ~0.9x scroll speed — barely lags, exits just after name
        gsap.fromTo(
          badge,
          { y: 0 },
          {
            y: '10vh',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      }, section);

      // Recalculate positions after all triggers are created
      // to prevent layout-shift jumps
      ScrollTrigger.refresh();
    }

    return () => {
      tl.kill();
      scrollCtx.current?.revert();
    };
  }, [started]);

  useEffect(() => {
    return () => scrollCtx.current?.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} data-section="hero">
      {/* ---- Photo: flex anchor handles centering, GSAP owns .photoWrap transform ---- */}
      <div className={styles.photoAnchor}>
        <div ref={photoWrapRef} className={styles.photoWrap} style={{ opacity: 0 }}>
          <div className={styles.photoMask}>
            <img
              src={PHOTO_URL}
              alt="Riddhimaan Roy"
              className={styles.photo}
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* ---- Title block: ↘ arrow + "Senior / Data Scientist" ---- */}
      <div ref={titleRef} className={styles.titleBlock} style={{ opacity: 0 }}>
        <span className={styles.titleArrow}>&#x2198;</span>
        <p className={styles.titleText}>
          Senior<br />
          Data Scientist
        </p>
      </div>

      {/* ---- Location badge (bottom-left, pill) ---- */}
      <div ref={badgeRef} className={styles.badge} style={{ opacity: 0 }}>
        <span className={styles.badgeGlobe}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </span>
        <span className={styles.badgeText}>Located in India</span>
      </div>

      {/* ---- Name at bottom — single instance, drifts right on scroll ---- */}
      <div className={styles.nameRow}>
        <h1 ref={nameTrackRef} className={styles.nameTrack} style={{ opacity: 0 }}>
          Riddhimaan Roy
        </h1>
      </div>
    </section>
  );
}
