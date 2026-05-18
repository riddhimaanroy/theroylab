import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lerp } from '../../utils/lerp';
import styles from './Nav.module.css';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const MAGNETIC_RADIUS = 150;
const MAX_PULL = 8;

export default function Nav({ visible, menuOpen, onMenuToggle }) {
  const logoRef = useRef(null);
  const btnRef = useRef(null);
  const linksRef = useRef(null);
  const btnPos = useRef({ x: 0, y: 0 });
  const btnTarget = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // Fade logo out when hero leaves viewport
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;
    const heroEl = document.querySelector('[data-section="hero"]');
    if (!heroEl) return;

    const st = ScrollTrigger.create({
      trigger: heroEl,
      start: 'bottom 10%',
      end: 'bottom 0%',
      scrub: true,
      onUpdate: (self) => {
        logo.style.opacity = String(1 - self.progress);
      },
    });

    return () => st.kill();
  }, []);

  // Crossfade: text links fade out, hamburger fades in as hero scrolls away
  useEffect(() => {
    const btn = btnRef.current;
    const links = linksRef.current;
    if (!btn || !links) return;

    // Start: links visible, hamburger hidden
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';

    const heroEl = document.querySelector('[data-section="hero"]');
    if (!heroEl) return;

    // Trigger when hero bottom reaches ~30% from top (section 2 almost at top)
    const st = ScrollTrigger.create({
      trigger: heroEl,
      start: 'bottom 40%',
      end: 'bottom 10%',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        // Links fade out
        links.style.opacity = String(1 - p);
        links.style.pointerEvents = p > 0.5 ? 'none' : 'auto';
        // Hamburger fades in
        btn.style.opacity = String(p);
        btn.style.pointerEvents = p > 0.5 ? 'auto' : 'none';
      },
    });

    return () => st.kill();
  }, []);

  // Magnetic effect on hamburger button
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAGNETIC_RADIUS) {
        const strength = (1 - dist / MAGNETIC_RADIUS) * MAX_PULL;
        const angle = Math.atan2(dy, dx);
        btnTarget.current = { x: Math.cos(angle) * strength, y: Math.sin(angle) * strength };
      } else {
        btnTarget.current = { x: 0, y: 0 };
      }
    };

    const animate = () => {
      btnPos.current.x = lerp(btnPos.current.x, btnTarget.current.x, 0.12);
      btnPos.current.y = lerp(btnPos.current.y, btnTarget.current.y, 0.12);
      btn.style.transform = `translate(${btnPos.current.x}px, ${btnPos.current.y}px)`;
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
    <header className={`${styles.header} ${visible ? styles.visible : ''}`}>
      <a ref={logoRef} href="/" className={styles.logo} data-cursor-hover>
        Riddhimaan Roy
      </a>
      <nav className={styles.nav}>
        <div ref={linksRef} className={styles.linkGroup}>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.link}
              data-cursor-hover
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector(link.href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className={styles.linkText}>{link.label}</span>
            </a>
          ))}
        </div>

        {/* Hamburger / close button */}
        <button
          ref={btnRef}
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={onMenuToggle}
          data-cursor-hover
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </nav>
    </header>
  );
}
