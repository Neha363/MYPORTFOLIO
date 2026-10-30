import React from 'react';
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { TECHNICAL_EXPERIENCE } from '../data/portfolioData';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section className="py-12 lg:py-20" id="experience">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold font-mono tracking-[0.14em] uppercase text-[#06B6D4]">
              ENGINEERING LEADERSHIP & LAB AFFILIATIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] tracking-tight">
            Systems Engineering Track Record
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mt-2">
            Spearheading high-throughput foundation model infrastructure across hyperscale compute clusters and premier research institutions.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="space-y-6">
          {TECHNICAL_EXPERIENCE.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-panel p-6 lg:p-8 border border-[#8B5CF6]/20 bg-[#0A0E1A]/80 hover:border-[#8B5CF6]/40 transition-all relative overflow-hidden group"
            >
              {/* Top hairline accent */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                    {item.role}
                  </h3>
                  <div className="text-sm font-semibold text-[#06B6D4] mt-0.5">
                    {item.organization}
                  </div>
                </div>

                {/* Clean Unboxed Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#94A3B8]">
                  <span className="flex items-center gap-1.5 text-[#D0BCFF]">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>{item.period}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>{item.location}</span>
                  </span>
                </div>
              </div>

              {/* Focus Area */}
              <div className="text-xs font-mono text-[#4CD7F6] mb-4">
                FOCUS: {item.focus.toUpperCase()}
              </div>

              {/* Achievement Bullet Points */}
              <ul className="space-y-2.5">
                {item.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#94A3B8] font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-2 shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
