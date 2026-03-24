import { useEffect, useRef, useState } from 'react';
import { lerp } from '../../utils/lerp';
import styles from './Projects.module.css';

/**
 * Floating image preview that follows cursor with smooth lerp.
 * Crossfades between project images instead of hard-swapping.
 */
export default function ProjectPreview({ activeProject }) {
  const containerRef = useRef(null);
  const pos = useRef({ x: -600, y: -600 });
  const target = useRef({ x: -600, y: -600 });
  const rafId = useRef(null);

  // Stack of images for crossfade — keeps previous image visible during transition
  const [imageStack, setImageStack] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (activeProject) {
      // Push new image onto stack
      setImageStack((prev) => {
        const filtered = prev.filter((p) => p.id !== activeProject.id);
        return [...filtered, { ...activeProject, entering: true }];
      });
      // Clean up old images after transition completes
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setImageStack((prev) => (prev.length > 1 ? prev.slice(-1) : prev));
      }, 400);
    } else {
      // Clear after fade-out
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setImageStack([]);
      }, 350);
    }
  }, [activeProject]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.08);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.08);
      el.style.transform = `translate3d(${pos.current.x - 200}px, ${pos.current.y - 140}px, 0)`;
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const isVisible = !!activeProject;

  return (
    <div
      ref={containerRef}
      className={`${styles.preview} ${isVisible ? styles.previewVisible : ''}`}
    >
      {imageStack.map((project, i) => (
        <img
          key={project.id}
          src={project.image}
          alt={project.title}
          className={styles.previewImage}
          style={{
            opacity: activeProject?.id === project.id ? 1 : 0,
            zIndex: i,
          }}
        />
      ))}
    </div>
  );
}
