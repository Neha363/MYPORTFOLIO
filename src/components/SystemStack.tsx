import React from 'react';
import { Cpu, Terminal, Activity, Layers, Database, ShieldCheck } from 'lucide-react';
import { SYSTEM_STACK } from '../data/portfolioData';

export const SystemStack: React.FC = () => {
  return (
    <section className="py-12 lg:py-16" id="stack">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold font-mono tracking-[0.14em] uppercase text-[#06B6D4]">
              TOOLCHAIN & RUNTIME CAPABILITIES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] tracking-tight">
            Production ML Systems Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SYSTEM_STACK.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-panel border border-[#8B5CF6]/20 bg-[#0A0E1A]/70"
            >
              <h3 className="text-sm font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span>{cat.category}</span>
              </h3>

              <div className="space-y-2">
                {cat.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-2.5 rounded-lg bg-[#060913]/70 border border-[#94A3B8]/10 text-xs font-mono text-[#D0BCFF] flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <span className="text-[10px] text-[#64748B]">PROD</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
