import { useEffect, useRef, useCallback } from 'react';
import styles from './About.module.css';

const DOT_COUNT = 60;
const BUBBLE_EXTRA_DOTS = 25;
const DOT_RADIUS = 2;
const LINE_RADIUS = 150;
const DOT_PULL = 4;
const DOT_RETURN = 0.04;
const BUBBLE_ZONE = 300;
const BUBBLE_CLUSTER_RADIUS = 200;
const BEIGE = { r: 212, g: 203, b: 194 };
const BLUE = { r: 10, g: 102, b: 194 };
const IS_TOUCH =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

// Shooting star config
const STAR_MIN_INTERVAL = 4000;
const STAR_MAX_INTERVAL = 6000;
const STAR_DURATION = 500;
const STAR_LENGTH = 120;
const STAR_TRAVEL = 350;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return {
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t),
  };
}

function rgbaStr(c, a) {
  return `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${a})`;
}

/**
 * sectionRef: ref to the <section> element — used for mouse events
 * so that interactions work even when cursor is over content (z-index 1).
 */
export default function Constellation({ sectionRef, bubbleElRef, onBubbleGlow }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dots = useRef([]);
  const isInside = useRef(false);
  const rafId = useRef(null);
  const isVisible = useRef(false);

  // Shooting star state
  const star = useRef(null);
  const nextStarTime = useRef(0);

  const initDots = useCallback((w, h, bubbleCx, bubbleCy) => {
    const base = Array.from({ length: DOT_COUNT }, () => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      return { ox: x, oy: y, x, y };
    });
    const clustered = Array.from({ length: BUBBLE_EXTRA_DOTS }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * BUBBLE_CLUSTER_RADIUS;
      const x = Math.max(0, Math.min(w, bubbleCx + Math.cos(angle) * r));
      const y = Math.max(0, Math.min(h, bubbleCy + Math.sin(angle) * r));
      return { ox: x, oy: y, x, y };
    });
    dots.current = [...base, ...clustered];
  }, []);

  useEffect(() => {
    if (IS_TOUCH) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const section = sectionRef?.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      let bcx = w * 0.85;
      let bcy = h * 0.5;
      if (bubbleElRef?.current) {
        const bRect = bubbleElRef.current.getBoundingClientRect();
        bcx = bRect.left + bRect.width / 2 - rect.left;
        bcy = bRect.top + bRect.height / 2 - rect.top;
      }
      initDots(w, h, bcx, bcy);
    };

    resize();
    window.addEventListener('resize', resize);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    // Listen on the SECTION element so mouse events fire even over z-index:1 content
    const eventTarget = section || container;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onMouseEnter = () => {
      isInside.current = true;
    };
    const onMouseLeave = () => {
      isInside.current = false;
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    eventTarget.addEventListener('mousemove', onMouseMove);
    eventTarget.addEventListener('mouseenter', onMouseEnter);
    eventTarget.addEventListener('mouseleave', onMouseLeave);

    // Schedule first shooting star
    nextStarTime.current = performance.now() + STAR_MIN_INTERVAL + Math.random() * (STAR_MAX_INTERVAL - STAR_MIN_INTERVAL);

    const animate = (now) => {
      rafId.current = requestAnimationFrame(animate);
      if (!isVisible.current) return;

      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Bubble center relative to container
      let bubbleCx = -9999;
      let bubbleCy = -9999;
      if (bubbleElRef?.current) {
        const bRect = bubbleElRef.current.getBoundingClientRect();
        const cRect = container.getBoundingClientRect();
        bubbleCx = bRect.left + bRect.width / 2 - cRect.left;
        bubbleCy = bRect.top + bRect.height / 2 - cRect.top;
      }

      // Mouse-to-bubble distance
      const mouseToBubble = Math.sqrt(
        (mx - bubbleCx) ** 2 + (my - bubbleCy) ** 2,
      );
      const zoneActive = isInside.current && mouseToBubble < BUBBLE_ZONE;
      const mouseStrength = zoneActive
        ? Math.max(0, 1 - mouseToBubble / BUBBLE_ZONE)
        : 0;

      if (onBubbleGlow) {
        onBubbleGlow(mouseStrength);
      }

      // --- Draw dots and connection lines ---
      for (const dot of dots.current) {
        const dxm = dot.ox - mx;
        const dym = dot.oy - my;
        const distMouse = Math.sqrt(dxm * dxm + dym * dym);

        // Gentle drift toward cursor
        if (distMouse < LINE_RADIUS && isInside.current) {
          const angle = Math.atan2(-dym, -dxm);
          const force = (1 - distMouse / LINE_RADIUS) * DOT_PULL;
          dot.x += (dot.ox + Math.cos(angle) * force - dot.x) * 0.02;
          dot.y += (dot.oy + Math.sin(angle) * force - dot.y) * 0.02;
        } else {
          dot.x = lerp(dot.x, dot.ox, DOT_RETURN);
          dot.y = lerp(dot.y, dot.oy, DOT_RETURN);
        }

        // Color: beige → blue based on dot proximity to bubble
        let dotColor = BEIGE;
        const distBubble = Math.sqrt(
          (dot.ox - bubbleCx) ** 2 + (dot.oy - bubbleCy) ** 2,
        );
        if (distBubble < BUBBLE_ZONE && zoneActive) {
          const proximity = 1 - distBubble / BUBBLE_ZONE;
          dotColor = lerpColor(BEIGE, BLUE, proximity * mouseStrength);
        }

        // Connection line: dot → mouse cursor
        const inRange = distMouse < LINE_RADIUS && isInside.current;
        if (inRange) {
          const lineAlpha = 0.7 * (1 - distMouse / LINE_RADIUS);
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = rgbaStr(dotColor, lineAlpha);
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw dot — brighter when connected
        const dotAlpha = inRange ? 0.4 : 0.2;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = rgbaStr(dotColor, dotAlpha);
        ctx.fill();
      }

      // --- Shooting star ---
      if (!star.current && now >= nextStarTime.current) {
        const angleDeg = 20 + Math.random() * 30;
        const angleRad = (angleDeg * Math.PI) / 180;
        star.current = {
          sx: Math.random() * w * 0.8,
          sy: Math.random() * h * 0.6,
          angle: angleRad,
          dx: Math.cos(angleRad) * STAR_TRAVEL,
          dy: Math.sin(angleRad) * STAR_TRAVEL,
          startTime: now,
        };
      }

      if (star.current) {
        const s = star.current;
        const elapsed = now - s.startTime;
        const progress = Math.min(elapsed / STAR_DURATION, 1);

        const headX = s.sx + s.dx * progress;
        const headY = s.sy + s.dy * progress;
        const tailX = headX - Math.cos(s.angle) * STAR_LENGTH;
        const tailY = headY - Math.sin(s.angle) * STAR_LENGTH;

        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        grad.addColorStop(0, 'rgba(212, 203, 194, 0)');
        grad.addColorStop(1, 'rgba(212, 203, 194, 0.8)');

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (progress >= 1) {
          star.current = null;
          nextStarTime.current =
            now +
            STAR_MIN_INTERVAL +
            Math.random() * (STAR_MAX_INTERVAL - STAR_MIN_INTERVAL);
        }
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resize);
      eventTarget.removeEventListener('mousemove', onMouseMove);
      eventTarget.removeEventListener('mouseenter', onMouseEnter);
      eventTarget.removeEventListener('mouseleave', onMouseLeave);
      io.disconnect();
    };
  }, [initDots, sectionRef, bubbleElRef, onBubbleGlow]);

  if (IS_TOUCH) return null;

  return (
    <div ref={containerRef} className={styles.constellationField}>
      <canvas ref={canvasRef} className={styles.constellationCanvas} />
    </div>
  );
}
