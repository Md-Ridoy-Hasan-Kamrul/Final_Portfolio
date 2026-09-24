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
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <div className='min-h-screen bg-transparent transition-colors duration-300'>
          <TargetCursor
            spinDuration={2}
            hideDefaultCursor={true}
            parallaxOn={true}
          />
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
              </SectionTransitions>
            </main>
            <Footer />
          </div>
        </div>
      </SmoothScroll>
    </ThemeProvider>
  );
}

export default App;
