import { useState, useCallback } from 'react';
import useSmoothScroll from './hooks/useSmoothScroll';
import CustomCursor from './components/Cursor/CustomCursor';
import GreetingLoader from './components/Loader/GreetingLoader';
import Nav from './components/Nav/Nav';
import SlideOutMenu from './components/Nav/SlideOutMenu';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import HowIWork from './components/HowIWork/HowIWork';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import styles from './App.module.css';

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useSmoothScroll();

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <CustomCursor />
      {!loaderDone && <GreetingLoader onComplete={handleLoaderComplete} />}
      <Nav visible={loaderDone} menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
      <SlideOutMenu isOpen={menuOpen} onClose={handleMenuClose} />
      <main className={menuOpen ? styles.mainShifted : ''}>
        <Hero started={loaderDone} />

        {/* Ombre bridge — sits OUTSIDE the hero's overflow:hidden
            so it's fully visible. Blends hero bg into dark. */}
        <div className={styles.ombreBridge} />

        {/* Section 2: About */}
        <About />

        {/* Section 3: How I Work */}
        <HowIWork />

        {/* Ombre bridge — dark (#1C1D20) to light beige (#E8E4DE) */}
        <div className={styles.darkToBeigeBridge} />

        {/* Section 3: Projects + Toolkit */}
        <Projects />

        {/* Section 5: Contact / Footer */}
        <Contact />
      </main>
    </>
  );
}
