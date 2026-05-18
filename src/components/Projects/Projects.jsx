import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectPreview from './ProjectPreview';
import CapabilityCards from './CapabilityCards';
import projectsData from '../../data/projects.json';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const listRef = useRef(null);
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

    }, section);

    return () => ctx.revert();
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
          03 / Work
        </p>

        <div data-divider className={styles.divider} />

        <div ref={listRef} className={styles.list}>
          {projectsData.map((project, i) => (
            <div key={project.id}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                data-row
                data-cursor-project
                className={styles.row}
                onMouseEnter={() => handleRowEnter(project)}
                onMouseLeave={handleRowLeave}
                style={{ opacity: 0, textDecoration: 'none' }}
              >
                <h3 className={styles.title}>{project.title}</h3>
                <span className={styles.category}>{project.category}</span>
              </a>
              {i < projectsData.length - 1 && (
                <div data-divider className={styles.divider} />
              )}
            </div>
          ))}
        </div>

        <div data-divider className={styles.divider} />

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
