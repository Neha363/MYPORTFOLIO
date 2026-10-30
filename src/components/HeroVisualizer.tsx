import React, { useState, useEffect } from 'react';
import { Play, Pause, Activity, RefreshCw, Layers, ShieldCheck, Database, Zap } from 'lucide-react';

interface PipelineNode {
  id: string;
  name: string;
  stage: string;
  shape: string;
  precision: string;
  latencyMs: number;
  memoryBandwidth: string;
  description: string;
  status: 'active' | 'prefetch' | 'fused';
}

const NODES: PipelineNode[] = [
  {
    id: 'input',
    name: 'Token Ingestion & Positional RoPE',
    stage: 'STAGE 01 // FRONTEND',
    shape: '[batch: 32, seq: 8192, hidden: 8192]',
    precision: 'BF16 Unified Memory',
    latencyMs: 0.12,
    memoryBandwidth: '1.24 TB/s',
    description: 'Paged sequence batching with rotary position embeddings fused into memory layout.',
    status: 'prefetch',
  },
  {
    id: 'tma-load',
    name: 'Hopper TMA Async Shared Memory Prefetch',
    stage: 'STAGE 02 // HARDWARE DMA',
    shape: 'Tile [128, 64] -> Shared SM Mem (228KB)',
    precision: 'FP8 (E4M3) Descriptors',
    latencyMs: 0.28,
    memoryBandwidth: '3.35 TB/s HBM3',
    description: 'Bypasses GPU register files using Asynchronous Tensor Memory Accelerator hardware pipelines.',
    status: 'active',
  },
  {
    id: 'flash-attn',
    name: 'FlashKernel-v4 Sparse Attention',
    stage: 'STAGE 03 // CORE COMPUTE',
    shape: 'Heads: 64, Dim: 128, Dynamic Sparsity: 48%',
    precision: 'WGMMA FP8 Tensor Core Accum',
    latencyMs: 0.84,
    memoryBandwidth: '3.14 TB/s effective',
    description: 'Non-divergent causal block pruning with double-buffered shared memory barriers.',
    status: 'active',
  },
  {
    id: 'moe-route',
    name: 'Top-2 Adaptive Zero-Drop MoE Router',
    stage: 'STAGE 04 // DISPATCH',
    shape: '16 Experts -> Routed: [Exp 04, Exp 11]',
    precision: 'FP32 Gating Logits + Momentum Bias',
    latencyMs: 0.22,
    memoryBandwidth: '900 GB/s NVLink 4.0',
    description: 'Auxiliary-loss-free gating distributing token vectors without dropping or token padding.',
    status: 'active',
  },
  {
    id: 'swiglu',
    name: 'Fused SwiGLU Expert Feed-Forward',
    stage: 'STAGE 05 // EXPERT FFN',
    shape: 'Intermediate: 28,672 -> 8,192',
    precision: 'INT4-AWQ Weights / FP8 Activations',
    latencyMs: 0.42,
    memoryBandwidth: '2.85 TB/s',
    description: 'Fused element-wise gated silu multiplication and down-projection in a single kernel pass.',
    status: 'fused',
  },
  {
    id: 'kv-cache',
    name: 'Zero-Copy Paged KV-Cache Update',
    stage: 'STAGE 06 // MEMORY LAYER',
    shape: 'Block Size: 16 tokens / Virtual Page Hash',
    precision: 'FP8 Quantized KV Pages',
    latencyMs: 0.14,
    memoryBandwidth: '3.35 TB/s HBM3',
    description: 'Dynamically allocated non-contiguous physical memory blocks with zero internal fragmentation.',
    status: 'active',
  },
];

export const HeroVisualizer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<PipelineNode>(NODES[2]); // FlashKernel default
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(2);
  const [throughputCounter, setThroughputCounter] = useState<number>(1420);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % NODES.length);
      setThroughputCounter((prev) => 1400 + Math.floor(Math.sin(Date.now() / 800) * 45));
    }, 1200);
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="relative w-full rounded-2xl glass-panel p-5 lg:p-6 border border-[#8B5CF6]/25 shadow-2xl overflow-hidden group">
      {/* Top subtle radiant gradient highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent" />
      
      {/* Visualizer Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#94A3B8]/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]" />
          <span className="text-xs font-mono font-medium text-[#F8FAFC]">
            LIVE INFERENCE PIPELINE
          </span>
          <span className="text-[11px] font-mono text-[#64748B] hidden sm:inline">
            // H100 SXM5 · 8-WAY TP
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] bg-[#060913]/70 border border-[#8B5CF6]/20 rounded-md transition-colors"
          >
            {isSimulating ? (
              <>
                <Pause className="w-3 h-3 text-[#F59E0B]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#10B981]" />
                <span>Simulate</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setActiveStep(2)}
            className="p-1 text-[#94A3B8] hover:text-[#06B6D4] bg-[#060913]/70 border border-[#8B5CF6]/20 rounded-md transition-colors"
            title="Reset to Attention Kernel"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Interactive Compute Flow Graphic */}
      <div className="space-y-2 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NODES.map((node, index) => {
            const isCurrent = activeStep === index;
            const isSelected = selectedNode.id === node.id;
            
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`relative text-left p-3 rounded-xl border transition-all text-xs font-mono group/btn ${
                  isSelected
                    ? 'bg-[#1E293B]/90 border-[#06B6D4] shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : isCurrent
                    ? 'bg-[#0F172A]/80 border-[#8B5CF6]/60 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                    : 'bg-[#0A0E1A]/60 border-[#8B5CF6]/15 hover:border-[#8B5CF6]/40 hover:bg-[#0F172A]/50'
                }`}
              >
                {/* Node Status Dot */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-[#64748B]">
                    NODE 0{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                    )}
                    <span 
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#06B6D4]' : isCurrent ? 'bg-[#8B5CF6]' : 'bg-[#494454]'
                      }`} 
                    />
                  </div>
                </div>

                <div className="font-semibold text-[#F8FAFC] truncate font-['Plus_Jakarta_Sans'] text-[13px] mb-1">
                  {node.name.split(' ')[0]} {node.name.split(' ')[1]}
                </div>

                <div className="text-[10px] text-[#94A3B8] truncate">
                  {node.latencyMs} ms · {node.precision.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Inspector */}
      <div className="rounded-xl bg-[#060913]/90 border border-[#8B5CF6]/20 p-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#94A3B8]/10">
          <div>
            <span className="text-[10px] text-[#8B5CF6] font-bold tracking-widest block">
              {selectedNode.stage}
            </span>
            <h4 className="text-sm font-semibold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
              {selectedNode.name}
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#64748B] block">KERNEL LATENCY</span>
            <span className="text-sm font-bold text-[#06B6D4] tabular-nums">
              {selectedNode.latencyMs.toFixed(2)} ms
            </span>
          </div>
        </div>

        <p className="text-[#94A3B8] text-[11px] font-sans leading-relaxed mb-3">
          {selectedNode.description}
        </p>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-[#0A0E1A]/80 border border-[#94A3B8]/10">
            <span className="text-[10px] text-[#64748B] block">TENSOR SHAPE</span>
            <span className="text-[#F8FAFC] font-mono truncate block" title={selectedNode.shape}>
              {selectedNode.shape}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#0A0E1A]/80 border border-[#94A3B8]/10">
            <span className="text-[10px] text-[#64748B] block">PRECISION FORMAT</span>
            <span className="text-[#4CD7F6] font-mono truncate block">
              {selectedNode.precision}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#0A0E1A]/80 border border-[#94A3B8]/10">
            <span className="text-[10px] text-[#64748B] block">HBM BANDWIDTH</span>
            <span className="text-[#10B981] font-mono font-semibold tabular-nums">
              {selectedNode.memoryBandwidth}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#0A0E1A]/80 border border-[#94A3B8]/10">
            <span className="text-[10px] text-[#64748B] block">SYSTEM THROUGHPUT</span>
            <span className="text-[#D0BCFF] font-mono font-semibold tabular-nums">
              {throughputCounter} tok/s
            </span>
          </div>
        </div>
      </div>

      {/* Micro Status Bar */}
      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#64748B] px-1">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-[#06B6D4]" />
          <span>SRAM Occupancy: 96.4%</span>
        </span>
        <span className="text-[#06B6D4]">
          Zero Bank Conflicts Verified
        </span>
      </div>
    </div>
  );
};
