import { useEffect, useRef } from 'react';
import { lerp } from '../../utils/lerp';
import styles from './CustomCursor.module.css';

const HOVER_SELECTOR = [
  'a', 'button', 'input', 'textarea', 'select',
  'label[for]', '[role="button"]', '[data-cursor-hover]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const PROJECT_SELECTOR = '[data-cursor-project]';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);
  const hovering = useRef(false);
  const projectHovering = useRef(false);

  useEffect(() => {
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot) return;

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onOver = (e) => {
      // Project row hover — takes priority
      if (e.target.closest(PROJECT_SELECTOR) && !projectHovering.current) {
        projectHovering.current = true;
        hovering.current = false;
        dot.classList.remove(styles.hovering);
        dot.classList.add(styles.projectHover);
        return;
      }
      // Regular hover
      if (e.target.closest(HOVER_SELECTOR) && !hovering.current && !projectHovering.current) {
        hovering.current = true;
        dot.classList.add(styles.hovering);
      }
    };

    const onOut = (e) => {
      // Project row leave
      if (e.target.closest(PROJECT_SELECTOR) && projectHovering.current) {
        const related = e.relatedTarget;
        if (!related || !related.closest?.(PROJECT_SELECTOR)) {
          projectHovering.current = false;
          dot.classList.remove(styles.projectHover);
        }
        return;
      }
      // Regular hover leave
      if (e.target.closest(HOVER_SELECTOR) && hovering.current) {
        const related = e.relatedTarget;
        if (!related || !related.closest?.(HOVER_SELECTOR)) {
          hovering.current = false;
          dot.classList.remove(styles.hovering);
        }
      }
    };

    const onLeave = () => { dot.style.opacity = '0'; };
    const onEnter = () => { dot.style.opacity = '1'; };

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);
      dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={dotRef} className={styles.cursor}>
      <span ref={labelRef} className={styles.cursorLabel}>View</span>
    </div>
  );
}
