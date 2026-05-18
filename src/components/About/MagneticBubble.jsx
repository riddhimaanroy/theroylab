import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from './About.module.css';

const MAGNETIC_RADIUS = 400;
const MAX_DISPLACEMENT = 50;
const TEXT_MAX_DISPLACEMENT = 60;
const CIRCLE_LERP = 0.12;
const TEXT_LERP = 0.2;
const IS_TOUCH =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const MagneticBubble = forwardRef(function MagneticBubble(
  { glowStrength = 0 },
  ref,
) {
  const wrapRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const rafId = useRef(null);

  useImperativeHandle(ref, () => wrapRef.current);

  const circlePos = useRef({ x: 0, y: 0 });
  const textPos = useRef({ x: 0, y: 0 });
  const circleTarget = useRef({ x: 0, y: 0 });
  const textTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (IS_TOUCH) return;
    const wrap = wrapRef.current;
    const circle = circleRef.current;
    const text = textRef.current;
    if (!wrap || !circle || !text) return;

    const onMouseMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      console.log('distance:', Math.round(dist), 'threshold:', MAGNETIC_RADIUS, 'maxDisplacement:', MAX_DISPLACEMENT);

      if (dist < MAGNETIC_RADIUS) {
        const ratio = 1 - dist / MAGNETIC_RADIUS;
        const angle = Math.atan2(dy, dx);
        const circleStrength = ratio * MAX_DISPLACEMENT;
        const textStrength = ratio * TEXT_MAX_DISPLACEMENT;
        circleTarget.current = { x: Math.cos(angle) * circleStrength, y: Math.sin(angle) * circleStrength };
        textTarget.current = { x: Math.cos(angle) * textStrength, y: Math.sin(angle) * textStrength };
      } else {
        circleTarget.current = { x: 0, y: 0 };
        textTarget.current = { x: 0, y: 0 };
      }
    };

    const animate = () => {
      circlePos.current.x = lerp(
        circlePos.current.x,
        circleTarget.current.x,
        CIRCLE_LERP,
      );
      circlePos.current.y = lerp(
        circlePos.current.y,
        circleTarget.current.y,
        CIRCLE_LERP,
      );
      textPos.current.x = lerp(
        textPos.current.x,
        textTarget.current.x,
        TEXT_LERP,
      );
      textPos.current.y = lerp(
        textPos.current.y,
        textTarget.current.y,
        TEXT_LERP,
      );

      circle.style.transform = `translate(${circlePos.current.x}px, ${circlePos.current.y}px)`;
      text.style.transform = `translate(${textPos.current.x}px, ${textPos.current.y}px)`;
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const blueGlow =
    glowStrength > 0.01
      ? `0 10px 40px rgba(0,0,0,0.3), 0 0 ${30 * glowStrength}px rgba(10, 102, 194, ${0.15 * glowStrength})`
      : '0 10px 40px rgba(0,0,0,0.3)';

  return (
    <div ref={wrapRef} className={styles.bubbleWrap}>
      <a
        ref={circleRef}
        href="https://www.linkedin.com/in/riddhimaan-roy/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.bubble}
        data-cursor-hover
        style={{ boxShadow: blueGlow }}
      >
        <span ref={textRef} className={styles.bubbleInner}>
          <svg
            className={styles.bubbleIcon}
            viewBox="0 0 24 24"
            fill="#0A66C2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span className={styles.bubbleLabel}>LinkedIn</span>
        </span>
      </a>
    </div>
  );
});

export default MagneticBubble;
