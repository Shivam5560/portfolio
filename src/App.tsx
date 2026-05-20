import { lazy, Suspense } from "react";
import ShaderBackground from "./components/ShaderBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const ThreeScene = lazy(() => import("./components/ThreeScene"));

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      {/* Shader background */}
      <ShaderBackground />

      {/* 3D geometric shapes (desktop only, no SSR flash) */}
      <Suspense fallback={null}>
        <ThreeScene />
      </Suspense>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
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
