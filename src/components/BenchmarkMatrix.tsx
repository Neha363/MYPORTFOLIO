import React, { useState } from 'react';
import { Cpu, Server, HardDrive, BarChart3, Zap, ShieldCheck } from 'lucide-react';
import { BENCHMARKS } from '../data/portfolioData';

type MetricMode = 'throughput' | 'ttft' | 'vram';

export const BenchmarkMatrix: React.FC = () => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>('h100-cluster');
  const [metricMode, setMetricMode] = useState<MetricMode>('throughput');

  const currentCluster = BENCHMARKS.find((b) => b.id === selectedClusterId) || BENCHMARKS[0];

  const maxThroughput = Math.max(...currentCluster.records.map((r) => r.throughputTokSec));
  const maxTtft = Math.max(...currentCluster.records.map((r) => r.ttftMs));
  const maxVram = Math.max(...currentCluster.records.map((r) => r.vramUsedGb));

  return (
    <section className="py-12 lg:py-20" id="benchmarks">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 lg:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold font-mono tracking-[0.14em] uppercase text-[#06B6D4]">
                EMPIRICAL VERIFICATION & BENCHMARKS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] tracking-tight">
              Hardware Cluster Benchmark Telemetry
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mt-2">
              Rigorous comparative evaluations across production server topologies and embedded edge accelerators under real-world context lengths.
            </p>
          </div>

          {/* Metric View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#0A0E1A]/80 border border-[#8B5CF6]/20 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setMetricMode('throughput')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                metricMode === 'throughput'
                  ? 'bg-[#1E293B] text-[#06B6D4] font-semibold border border-[#06B6D4]/40 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Throughput (tok/s)
            </button>
            <button
              onClick={() => setMetricMode('ttft')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                metricMode === 'ttft'
                  ? 'bg-[#1E293B] text-[#06B6D4] font-semibold border border-[#06B6D4]/40 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              TTFT Latency (ms)
            </button>
            <button
              onClick={() => setMetricMode('vram')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                metricMode === 'vram'
                  ? 'bg-[#1E293B] text-[#06B6D4] font-semibold border border-[#06B6D4]/40 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              VRAM Footprint (GB)
            </button>
          </div>
        </div>

        {/* Hardware Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {BENCHMARKS.map((cluster) => {
            const isSelected = selectedClusterId === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => setSelectedClusterId(cluster.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#0F172A]/90 border-[#06B6D4] shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-[#0A0E1A]/60 border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 hover:bg-[#0F172A]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#F8FAFC]">
                    {cluster.name}
                  </span>
                  <Cpu className={`w-4 h-4 ${isSelected ? 'text-[#06B6D4]' : 'text-[#64748B]'}`} />
                </div>
                <div className="text-[11px] text-[#94A3B8] font-sans truncate mb-1">
                  {cluster.hardware}
                </div>
                <div className="text-[10px] text-[#64748B] font-mono truncate">
                  {cluster.vram}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Benchmark Display Module */}
        <div className="rounded-2xl glass-panel p-6 lg:p-8 border border-[#8B5CF6]/20 bg-[#0A0E1A]/85 shadow-xl">
          {/* Cluster Telemetry Spec Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 mb-6 border-b border-[#94A3B8]/10 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase">INTERCONNECT FABRIC</span>
              <span className="text-[#F8FAFC] font-semibold mt-0.5 block truncate">
                {currentCluster.interconnect}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase">MEMORY ARCHITECTURE</span>
              <span className="text-[#4CD7F6] font-semibold mt-0.5 block truncate">
                {currentCluster.vram}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase">CONVERGENCE & PRECISION</span>
              <span className="text-[#10B981] font-semibold mt-0.5 block flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Lossless Perplexity Guaranteed</span>
              </span>
            </div>
          </div>

          {/* Interactive Benchmark Rows */}
          <div className="space-y-5">
            {currentCluster.records.map((record, idx) => {
              const isKinetic = record.framework.includes('Kinetic');
              
              // Calculate percentage for bar width based on active metric
              let barPercent = 0;
              let mainStatDisplay = '';
              let subStatDisplay = '';

              if (metricMode === 'throughput') {
                barPercent = (record.throughputTokSec / maxThroughput) * 100;
                mainStatDisplay = `${record.throughputTokSec.toLocaleString()} tok/s`;
                subStatDisplay = record.speedupVsBaseline;
              } else if (metricMode === 'ttft') {
                // For TTFT, lower is better: invert relative to max
                barPercent = Math.max(12, ((maxTtft - record.ttftMs + 1) / maxTtft) * 100);
                mainStatDisplay = `${record.ttftMs.toFixed(1)} ms`;
                subStatDisplay = `${record.ttftMs < 3 ? 'Ultra-low P99' : 'Standard batch'}`;
              } else {
                barPercent = (record.vramUsedGb / maxVram) * 100;
                mainStatDisplay = `${record.vramUsedGb.toFixed(1)} GB`;
                subStatDisplay = `${record.vramUsedGb < 50 ? 'Compact footprint' : 'Full precision'}`;
              }

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isKinetic
                      ? 'bg-[#1E293B]/60 border-[#06B6D4]/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'bg-[#060913]/60 border-[#94A3B8]/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${isKinetic ? 'bg-[#06B6D4]' : 'bg-[#64748B]'}`} />
                      <span className="font-bold text-sm text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                        {record.model}
                      </span>
                      <span className="text-xs font-mono text-[#94A3B8]">
                        ({record.framework})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-[11px] text-[#64748B] hidden md:inline">
                        Batch: {record.batchSize}
                      </span>
                      <span className={`font-bold tabular-nums text-sm sm:text-base ${
                        isKinetic ? 'text-[#06B6D4]' : 'text-[#F8FAFC]'
                      }`}>
                        {mainStatDisplay}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#060913] border border-[#94A3B8]/20 text-[#D0BCFF]">
                        {subStatDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Indicator */}
                  <div className="w-full h-2.5 bg-[#060913] rounded-full overflow-hidden border border-[#94A3B8]/10 relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isKinetic
                          ? 'bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4]'
                          : 'bg-[#475569]'
                      }`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benchmark Footer Note */}
          <div className="mt-6 pt-4 border-t border-[#94A3B8]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#64748B]">
            <span>
              Evaluation: 4,096 prompt tokens, 512 generated tokens, temperature=0.7.
            </span>
            <span className="text-[#06B6D4]">
              Reproducible with Slurm job scripts in repo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
