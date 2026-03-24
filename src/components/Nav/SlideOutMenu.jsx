import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import styles from './SlideOutMenu.module.css';

const MENU_ITEMS = [
  { label: 'Home', href: '#' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/riddhimaan' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'Twitter', href: 'https://twitter.com' },
];

export default function SlideOutMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const itemsRef = useRef(null);

  // Stagger animate menu items on open
  useEffect(() => {
    if (!isOpen || !itemsRef.current) return;

    const items = itemsRef.current.querySelectorAll('[data-menu-item]');
    if (items.length) {
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.3,
        },
      );
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key closes menu
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleItemClick = useCallback((e, href) => {
    e.preventDefault();
    onClose();
    // Smooth scroll after menu closes
    setTimeout(() => {
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  }, [onClose]);

  return (
    <>
      {/* Dimmed overlay on left side */}
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div
        ref={menuRef}
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}
      >
        <div ref={itemsRef} className={styles.menuInner}>
          <span className={styles.menuLabel}>Navigation</span>
          <div className={styles.menuDivider} />

          <nav className={styles.menuNav}>
            {MENU_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                data-menu-item
                data-cursor-hover
                className={styles.menuItem}
                onClick={(e) => handleItemClick(e, item.href)}
                style={{ opacity: 0 }}
              >
                <span className={styles.menuBullet}>·</span>
                <span className={styles.menuItemText}>{item.label}</span>
              </a>
            ))}
          </nav>

          <span className={styles.menuLabel} style={{ display: 'block', marginTop: '2rem' }}>Socials</span>
          <div className={styles.menuDivider} />

          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className={styles.socialLink}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
