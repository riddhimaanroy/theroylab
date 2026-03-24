import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lerp } from '../../utils/lerp';
import ProjectPreview from './ProjectPreview';
import CapabilityCards from './CapabilityCards';
import projectsData from '../../data/projects.json';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const MAGNETIC_RADIUS = 150;
const MAX_PULL = 12;

export default function Projects() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const listRef = useRef(null);
  const btnRef = useRef(null);
  const btnInnerRef = useRef(null);
  const btnPos = useRef({ x: 0, y: 0 });
  const btnTarget = useRef({ x: 0, y: 0 });
  const btnRaf = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  // Scroll animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Label + first divider fade in
      gsap.fromTo(
        labelRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        },
      );

      // Rows stagger in
      const rows = listRef.current?.querySelectorAll('[data-row]');
      if (rows?.length) {
        gsap.fromTo(
          rows,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: { trigger: listRef.current, start: 'top 85%' },
          },
        );
      }

      // Dividers stagger
      const dividers = section.querySelectorAll('[data-divider]');
      if (dividers?.length) {
        gsap.fromTo(
          dividers,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: listRef.current, start: 'top 85%' },
          },
        );
      }

      // More button
      if (btnInnerRef.current) {
        gsap.fromTo(
          btnInnerRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: btnInnerRef.current, start: 'top 90%' },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Magnetic button effect
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
      btnRaf.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    btnRaf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(btnRaf.current);
    };
  }, []);

  const handleRowEnter = useCallback((project) => {
    setActiveProject(project);
  }, []);

  const handleRowLeave = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <section ref={sectionRef} className={styles.projects}>
      <div className={styles.inner}>
        <p ref={labelRef} className={styles.label} style={{ opacity: 0 }}>
          Recent Work
        </p>

        <div data-divider className={styles.divider} />

        <div ref={listRef} className={styles.list}>
          {projectsData.map((project, i) => (
            <div key={project.id}>
              <div
                data-row
                data-cursor-project
                className={styles.row}
                onMouseEnter={() => handleRowEnter(project)}
                onMouseLeave={handleRowLeave}
                style={{ opacity: 0 }}
              >
                <h3 className={styles.title}>{project.title}</h3>
                <span className={styles.category}>{project.category}</span>
              </div>
              {i < projectsData.length - 1 && (
                <div data-divider className={styles.divider} />
              )}
            </div>
          ))}
        </div>

        <div data-divider className={styles.divider} />

        <div ref={btnInnerRef} className={styles.moreWrap} style={{ opacity: 0 }}>
          <button
            ref={btnRef}
            className={styles.moreButton}
            data-cursor-hover
          >
            More work<sup className={styles.moreSup}>11</sup>
          </button>
        </div>

        <CapabilityCards />
      </div>

      <ProjectPreview activeProject={activeProject} />

      {/* Curved divider — dark bulges UPWARD into beige */}
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={styles.curveDivider}
      >
        <path d="M0,100 C360,0 1080,0 1440,100 L1440,100 L0,100 Z" fill="#1C1D20" />
      </svg>
    </section>
  );
}
