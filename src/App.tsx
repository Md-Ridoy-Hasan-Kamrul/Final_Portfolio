import Navigation from './components/Navigation';
import HeroVideoBg from './components/HeroVideoBg';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TargetCursor from './components/TargetCursor';
import SmoothScroll from './components/SmoothScroll';
import SectionTransitions from './components/SectionTransitions';
import MotionPauseToggle from './components/ui/MotionPauseToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { MotionProvider, useMotionProfile } from './contexts/MotionContext';

function AppShell() {
  const { isAdvanced } = useMotionProfile();

  return (
    <SmoothScroll>
      <div className='min-h-screen bg-transparent transition-colors duration-[var(--motion-structural)]'>
        {isAdvanced && (
          <TargetCursor
            spinDuration={2}
            hideDefaultCursor={true}
            parallaxOn={true}
          />
        )}
        <MotionPauseToggle />
        <HeroVideoBg />
        <Navigation />
        <div className='relative z-10'>
          <main className='overflow-x-hidden'>
            <SectionTransitions>
              <Hero />
              <About />
              <Experience />
              <Projects />
              <Skills />
              <Contact />
              <Footer />
            </SectionTransitions>
          </main>
        </div>
      </div>
    </SmoothScroll>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <AppShell />
      </MotionProvider>
    </ThemeProvider>
  );
}

export default App;
