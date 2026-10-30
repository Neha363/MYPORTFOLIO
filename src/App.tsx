import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { ProjectShowcase } from './components/ProjectShowcase';
import { BenchmarkMatrix } from './components/BenchmarkMatrix';
import { PublicationsSection } from './components/PublicationsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SystemStack } from './components/SystemStack';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { ProjectArchitecture } from './types';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectArchitecture | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const handleOpenTerminal = () => {
    const el = document.getElementById('terminal');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreProjects = () => {
    const el = document.getElementById('architectures');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBibtex = () => {
    const el = document.getElementById('publications');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-[#F8FAFC] selection:bg-[#8B5CF6]/30 selection:text-[#4CD7F6]">
      {/* Top Navigation Bar adhering to the 3-Zone Top Bar Contract */}
      <Navbar
        onOpenTerminal={handleOpenTerminal}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <main>
        {/* Split-Screen Hero with Neural Pipeline Visualizer & 4-Column Metric Strip */}
        <HeroSection
          onOpenTerminal={handleOpenTerminal}
          onExploreProjects={handleExploreProjects}
          onOpenBibtex={handleOpenBibtex}
        />

        {/* Interactive Deep Obsidian Terminal Shell */}
        <InteractiveTerminal />

        {/* Flagship Architectures Bento Showcase */}
        <ProjectShowcase onSelectProject={(project) => setSelectedProject(project)} />

        {/* Hardware Benchmark & Latency Telemetry Matrix */}
        <BenchmarkMatrix />

        {/* Peer-Reviewed Publications & Preprints */}
        <PublicationsSection />

        {/* Systems Engineering Experience */}
        <ExperienceTimeline />

        {/* Toolchain & Production Stack */}
        <SystemStack />
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Deep Architecture Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Technical Consultation & Inquiry Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
