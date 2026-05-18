import { useEffect, useRef, useState } from 'react';
import { lerp } from '../../utils/lerp';
import styles from './Projects.module.css';
import previewStyles from './ProjectPreview.module.css';

/* ============================================
   NUTRIPING — WhatsApp chat simulation
   ============================================ */
function NutriPingPreview() {
  const messages = [
    { type: 'user', text: 'Had 2 rotis with dal and sabzi for lunch', delay: 0 },
    { type: 'bot', text: '🎯 Meal Score: 7.8/10', delay: 1.2 },
    { type: 'bot', text: 'Good balance! Protein: 18g, Fiber: 6g', delay: 2.0 },
    { type: 'bot', text: '💡 Add a side of curd for calcium', delay: 3.0 },
    { type: 'user', text: 'What about my daily progress?', delay: 4.2 },
    { type: 'bot', text: '📊 Today: 1,480 cal | Target: 1,850', delay: 5.2 },
  ];

  return (
    <div className={previewStyles.waContainer}>
      <div className={previewStyles.waHeader}>
        <div className={previewStyles.waAvatar}>N</div>
        <div className={previewStyles.waHeaderText}>
          <span className={previewStyles.waName}>NutriPing</span>
          <span className={previewStyles.waStatus}>online</span>
        </div>
      </div>
      <div className={previewStyles.waMessages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${previewStyles.waMsg} ${msg.type === 'user' ? previewStyles.waMsgUser : previewStyles.waMsgBot}`}
            style={{ animationDelay: `${msg.delay}s` }}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   REVIZ — Quiz flow simulation
   ============================================ */
function RevizPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 2200),
      setTimeout(() => setStep(3), 3400),
      setTimeout(() => setStep(4), 4600),
      setTimeout(() => setStep(0), 7000),
    ];
    const loop = setInterval(() => {
      setStep(0);
      timers.push(setTimeout(() => setStep(1), 800));
      timers.push(setTimeout(() => setStep(2), 2200));
      timers.push(setTimeout(() => setStep(3), 3400));
      timers.push(setTimeout(() => setStep(4), 4600));
    }, 7000);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  return (
    <div className={previewStyles.revizContainer}>
      <div className={previewStyles.revizHeader}>
        <span className={previewStyles.revizLogo}>Reviz</span>
        <span className={previewStyles.revizBadge}>Q12 of 25</span>
      </div>
      <div className={previewStyles.revizQuestion}>
        {step >= 0 && <p className={previewStyles.revizQ}>A patient presents with acute periapical abscess on tooth 36. The most appropriate initial management is:</p>}
      </div>
      <div className={previewStyles.revizOptions}>
        {['Extraction', 'Incision & drainage', 'Antibiotics only', 'Root canal treatment'].map((opt, i) => (
          <div
            key={i}
            className={`${previewStyles.revizOpt} ${step >= 1 ? previewStyles.revizOptVisible : ''} ${step >= 2 && i === 1 ? previewStyles.revizOptSelected : ''} ${step >= 3 && i === 1 ? previewStyles.revizOptCorrect : ''} ${step >= 3 && i === 0 ? previewStyles.revizOptWrong : ''}`}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <span className={previewStyles.revizOptLetter}>{String.fromCharCode(65 + i)}</span>
            {opt}
          </div>
        ))}
      </div>
      {step >= 4 && (
        <div className={previewStyles.revizFeedback}>
          <span className={previewStyles.revizFeedbackIcon}>✓</span>
          Correct! Establish drainage first before definitive treatment.
        </div>
      )}
      <div className={previewStyles.revizProgress}>
        <div className={previewStyles.revizProgressFill} style={{ width: step >= 3 ? '48%' : '44%' }} />
      </div>
    </div>
  );
}

/* ============================================
   UMI — Image carousel with Ken Burns
   ============================================ */
function UmiPreview() {
  const images = [
    'https://umi-v6.theroylab.com/img/pool-terrace.jpg',
    'https://umi-v6.theroylab.com/img/cocktail-pool.jpg',
    'https://umi-v6.theroylab.com/img/restaurant.jpg',
    'https://umi-v6.theroylab.com/img/spa.jpg',
  ];
  const [active, setActive] = useState(0);
  const greetings = ['नमस्ते', 'Hello', 'こんにちは', 'Bonjour'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={previewStyles.umiContainer}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="UMI Bali"
          className={`${previewStyles.umiImg} ${i === active ? previewStyles.umiImgActive : ''}`}
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
      <div className={previewStyles.umiOverlay}>
        <span className={previewStyles.umiGreeting} key={active}>
          {greetings[active]}
        </span>
        <span className={previewStyles.umiName}>UMI · Bali</span>
      </div>
    </div>
  );
}

/* ============================================
   Preview component map
   ============================================ */
const PREVIEW_COMPONENTS = {
  1: NutriPingPreview,
  2: RevizPreview,
  3: UmiPreview,
};

/* ============================================
   Main ProjectPreview — follows cursor
   ============================================ */
export default function ProjectPreview({ activeProject }) {
  const containerRef = useRef(null);
  const pos = useRef({ x: -600, y: -600 });
  const target = useRef({ x: -600, y: -600 });
  const rafId = useRef(null);
  const [visibleProject, setVisibleProject] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (activeProject) {
      setVisibleProject(activeProject);
      clearTimeout(timeoutRef.current);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setVisibleProject(null);
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
  const PreviewComponent = visibleProject ? PREVIEW_COMPONENTS[visibleProject.id] : null;

  return (
    <div
      ref={containerRef}
      className={`${styles.preview} ${isVisible ? styles.previewVisible : ''}`}
    >
      {PreviewComponent && <PreviewComponent />}
    </div>
  );
}
