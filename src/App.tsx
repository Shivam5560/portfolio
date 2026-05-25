import SectionShaders from "./components/SectionShaders";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { TextRevealByWord } from "./components/ui/text-reveal";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      {/* Section-aware shader system */}
      <SectionShaders />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <TextRevealByWord text="Building intelligent systems that move from experiments into production." />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
