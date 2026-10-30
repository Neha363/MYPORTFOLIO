import { ProjectArchitecture, BenchmarkTarget, Publication } from '../types';

export const HERO_METRICS = [
  { value: '4.8×', label: 'ATTENTION KERNEL SPEEDUP', detail: 'Versus standard FlashAttention-2 at 128k context' },
  { value: '1.8ms', label: 'P99 TIME-TO-FIRST-TOKEN', detail: 'On 8k prompt using Speculative Streaming' },
  { value: '14.2B', label: 'ACTIVE ROUTED PARAMS', detail: 'KineticMoE-64B with top-2 expert gating' },
  { value: '94.2%', label: 'NVIDIA H100 MFU', detail: 'Model FLOPs utilization on Megatron-LM 8-way TP' },
];

export const PROJECTS: ProjectArchitecture[] = [
  {
    id: 'flashkernel-v4',
    title: 'FlashKernel-v4: IO-Aware Sparse Attention with Dynamic Block Tiling',
    category: 'kernel',
    categoryLabel: 'KERNEL ENGINEERING',
    abstract: 'A custom CUDA/Triton attention kernel written from scratch for extreme long-context LLMs. Leverages hardware asynchronous copy (TMA on Hopper), register-level FP8 accumulation, and dynamic causal sparsity masks to reduce SRAM-to-HBM traffic by 72%.',
    headlineMetric: '4.8×',
    headlineMetricLabel: 'Speedup @ 128K Context',
    tags: ['CUDA 12.4', 'TRITON', 'HOPPER TMA', 'FP8 W8A8', 'PYTORCH C++'],
    metrics: [
      { label: 'Kernel Latency (128k seq)', baseline: '28.4 ms', kinetic: '5.9 ms', improvement: '+381%', progressPercent: 88 },
      { label: 'SRAM Memory Bandwidth', baseline: '1.82 TB/s', kinetic: '3.14 TB/s', improvement: '+72%', progressPercent: 92 },
      { label: 'HBM Read Amplification', baseline: '3.4×', kinetic: '1.1×', improvement: '-68%', progressPercent: 94 },
      { label: 'Shared Memory Bank Conflicts', baseline: '14.2%', kinetic: '0.0%', improvement: 'Zero-conflict', progressPercent: 100 },
    ],
    parameters: {
      totalParams: 'Custom Kernel',
      activeParams: 'All Transformer heads',
      contextWindow: 'Up to 262,144 tokens',
      precision: 'FP8 (E4M3 / E5M2) & BF16',
      kernelThroughput: '1,420 TFLOPS (H100 SXM5)',
      memoryBandwidth: '3.14 TB/s effective',
    },
    details: {
      motivation: 'Standard FlashAttention implementations incur significant register pressure and thread divergence when dealing with structured sparsity and variable prompt lengths across distributed batches.',
      mathematicalFormulation: 'O_i = \\sum_{j \\in \\mathcal{S}_i} \\frac{\\exp(q_i^T k_j / \\sqrt{d})}{\\sum_{l \\in \\mathcal{S}_i} \\exp(q_i^T k_l / \\sqrt{d})} v_j \\quad \\text{where } \\mathcal{S}_i = \\{j : j \\le i \\land M_{ij} = 1\\}',
      kernelHighlights: [
        'Utilizes Asynchronous Tensor Memory Accelerator (TMA) to bypass register file during global-to-shared memory loads',
        'Warpgroup-level matrix multiply and accumulate (WGMMA) instructions executing 64x128x16 FP8 tiles',
        'Dynamic tile pruning skipping zero-attention blocks with zero pipeline stalling',
        'Double-buffering in SM shared memory with mbarrier synchronization primitives',
      ],
      codeSnippet: `@triton.jit
def _fwd_kernel_sparse_flash(
    Q, K, V, sm_scale,
    L, Out,
    stride_qz, stride_qh, stride_qm, stride_qk,
    stride_kz, stride_kh, stride_kn, stride_kk,
    Z, H, N_CTX,
    BLOCK_M: tl.constexpr, BLOCK_DMODEL: tl.constexpr, BLOCK_N: tl.constexpr,
):
    start_m = tl.program_id(0)
    offs_m = start_m * BLOCK_M + tl.arange(0, BLOCK_M)
    offs_n = tl.arange(0, BLOCK_N)
    offs_d = tl.arange(0, BLOCK_DMODEL)
    
    # Initialize accumulators & max scale in registers
    m_i = tl.zeros([BLOCK_M], dtype=tl.float32) - float("inf")
    l_i = tl.zeros([BLOCK_M], dtype=tl.float32)
    acc = tl.zeros([BLOCK_M, BLOCK_DMODEL], dtype=tl.float32)
    
    # Load Q tile with TMA async pipeline
    q = tl.load(Q + offs_m[:, None] * stride_qm + offs_d[None, :] * stride_qk)
    ...`,
      citation: 'Vance, A. et al. "FlashKernel-v4: Asynchronous Memory Hierarchies for High-Order Attention." MLSys 2024.',
      githubUrl: 'https://github.com/obsidian-kinetic/flashkernel-v4',
      paperUrl: 'https://arxiv.org/abs/2403.09812',
    },
  },
  {
    id: 'kinetic-moe-64b',
    title: 'KineticMoE-64B: Dynamic Sparse Mixture-of-Experts with Zero-Drop Routing',
    category: 'moe',
    categoryLabel: 'SPARSE MOE ARCHITECTURE',
    abstract: 'A distributed 64-billion parameter Mixture-of-Experts architecture activating 14.2B parameters per token. Introduces an adaptive capacity factor router that eliminates token-dropping bottlenecks while keeping expert load variance below 3.4% across 64 nodes.',
    headlineMetric: '3.2×',
    headlineMetricLabel: 'Inference Throughput vs Dense 70B',
    tags: ['TENSOR PARALLELISM', 'EXPERT PARALLELISM', 'MEGATRON-LM', 'ALL-TO-ALL OPTIMIZATION', 'NCCL'],
    metrics: [
      { label: 'Token Generation Speed', baseline: '38 tok/s (Dense 70B)', kinetic: '124 tok/s (MoE 64B)', improvement: '+226%', progressPercent: 86 },
      { label: 'Expert Load Imbalance Variance', baseline: '22.8%', kinetic: '3.4%', improvement: '-85%', progressPercent: 95 },
      { label: 'All-to-All Dispatch Latency', baseline: '4.8 ms', kinetic: '1.2 ms', improvement: '-75%', progressPercent: 90 },
      { label: 'Validation Perplexity (FineWeb-Edu)', baseline: '4.82', kinetic: '4.41', improvement: '-8.5%', progressPercent: 92 },
    ],
    parameters: {
      totalParams: '64.8 Billion',
      activeParams: '14.2 Billion (top-2 of 16 experts)',
      contextWindow: '65,536 tokens',
      precision: 'W4A8 & FP8 KV-Cache',
      kernelThroughput: '124 tokens/sec/user',
      memoryBandwidth: 'Fused All-to-All Overlap',
    },
    details: {
      motivation: 'Traditional top-k router implementations in MoE models either discard overflow tokens under fixed capacity constraints or suffer severe tail latency from communication imbalances across distributed nodes.',
      mathematicalFormulation: 'G(x)_i = \\text{Softmax}\\left(\\text{Top2}(x \\cdot W_g + \\epsilon \\odot \\sigma(x \\cdot W_a))\\right)_i, \\quad y = \\sum_{i \\in \\text{Top2}} G(x)_i E_i(x)',
      kernelHighlights: [
        'Fused gating and dispatch kernel overlapping GPU tensor compute with inter-node InfiniBand NCCL All-to-All transfers',
        'Auxiliary-loss-free balancing mechanism using momentum-based bias adjustment on routing logits',
        'Sub-8-bit weight compression per expert without degradation on MMLU or HumanEval benchmarks',
        'Dynamic expert offloading to NVMe storage for memory-constrained test nodes',
      ],
      codeSnippet: `class AdaptiveMoERouter(nn.Module):
    def __init__(self, d_model: int, num_experts: int = 16, top_k: int = 2):
        super().__init__()
        self.gate = nn.Linear(d_model, num_experts, bias=False)
        self.register_buffer("expert_bias", torch.zeros(num_experts))
        self.top_k = top_k
        
    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        # Compute routing logits with momentum compensation
        logits = self.gate(x) + self.expert_bias
        scores = torch.softmax(logits, dim=-1)
        topk_scores, topk_indices = torch.topk(scores, self.top_k, dim=-1)
        topk_scores = topk_scores / topk_scores.sum(dim=-1, keepdim=True)
        return topk_scores, topk_indices`,
      citation: 'Vance, A. & Rostova, E. "Zero-Drop Adaptive Gating for Hyperscale Mixture-of-Experts." NeurIPS 2025.',
      githubUrl: 'https://github.com/obsidian-kinetic/kinetic-moe',
      paperUrl: 'https://arxiv.org/abs/2410.14920',
    },
  },
  {
    id: 'speculative-stream',
    title: 'SpeculativeStream: Pipelined Tree-Decoded Speculative Inference Engine',
    category: 'quantization',
    categoryLabel: 'SPECULATIVE INFERENCE',
    abstract: 'An asynchronous speculative decoding engine that uses an ultra-fast 0.8B draft model to propose speculative token trees, verified in parallel by a 70B target model using customized masked multi-query attention.',
    headlineMetric: '2.6×',
    headlineMetricLabel: 'Wall-Clock Inference Acceleration',
    tags: ['SPECULATIVE DECODING', 'VLLM INTEGRATION', 'PAGE-ATTENTION', 'TENSORRT-LLM', 'CUDA STREAMS'],
    metrics: [
      { label: 'P50 Latency / Token', baseline: '24.1 ms', kinetic: '9.2 ms', improvement: '-61%', progressPercent: 88 },
      { label: 'Mean Accepted Tokens / Step', baseline: '1.0 (Autoregressive)', kinetic: '3.82 tokens', improvement: '+282%', progressPercent: 95 },
      { label: 'GPU Memory Footprint Increase', baseline: 'Baseline target', kinetic: '+4.2% (Draft model)', improvement: 'Negligible', progressPercent: 96 },
      { label: 'Output Distribution Divergence', baseline: '0.000 (Exact match)', kinetic: '0.000 (Lossless)', improvement: 'Bit-exact', progressPercent: 100 },
    ],
    parameters: {
      totalParams: '70B Target + 0.8B Draft',
      activeParams: 'Dynamic Tree Branching',
      contextWindow: '32,768 tokens',
      precision: 'Target: FP8 / Draft: INT4',
      kernelThroughput: '188 tokens/sec',
      memoryBandwidth: 'Zero KV-Cache Duplicate',
    },
    details: {
      motivation: 'Autoregressive transformer inference is memory-bandwidth bound at small batch sizes because each token generation requires loading all weights from HBM to registers. Speculative decoding converts bandwidth-bound workloads into compute-bound operations.',
      mathematicalFormulation: 'P(\\text{accept } x_{t+k}) = \\min\\left(1, \\frac{P_{\\text{target}}(x_{t+k} \\mid x_{<t+k})}{P_{\\text{draft}}(x_{t+k} \\mid x_{<t+k})}\\right)',
      kernelHighlights: [
        'Dynamic speculative tree search adjusting depth based on token entropy in real time',
        'Custom CUDA verification kernel evaluating full candidate trees in a single forward pass with causal mask indices',
        'Shared KV-cache pointer hierarchy eliminating memory duplication between draft and target models',
        'Integration with vLLM continuous batching scheduler handling up to 512 concurrent sessions',
      ],
      codeSnippet: `// CUDA Tree Verification Kernel (Draft verification phase)
__global__ void VerifySpeculativeTreeKernel(
    const float* __restrict__ target_logits,
    const float* __restrict__ draft_probs,
    const int* __restrict__ candidate_tokens,
    const int* __restrict__ tree_parent_map,
    int* __restrict__ accepted_tokens_out,
    int num_candidates, int vocab_size
) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid >= num_candidates) return;
    
    int token_id = candidate_tokens[tid];
    float p_target = target_logits[tid * vocab_size + token_id];
    float q_draft = draft_probs[tid * vocab_size + token_id];
    
    // Speculative accept criteria
    float acceptance_ratio = fminf(1.0f, p_target / (q_draft + 1e-8f));
    float rand_sample = curand_uniform(&state);
    if (rand_sample < acceptance_ratio) {
        atomicMax(&accepted_tokens_out[0], tree_depth[tid]);
    }
}`,
      citation: 'Vance, A., Chen, K., & Patel, S. "SpeculativeStream: Non-Uniform Tree Decoders on Shared Paged Memory." ICML 2024.',
      githubUrl: 'https://github.com/obsidian-kinetic/speculative-stream',
      paperUrl: 'https://arxiv.org/abs/2405.08319',
    },
  },
  {
    id: 'edgedistill-vlm',
    title: 'EdgeDistill: Sub-10W Vision-Language Model Quantization for On-Device Robotics',
    category: 'robotics',
    categoryLabel: 'EDGE & ROBOTICS AI',
    abstract: 'Distillation and 4-bit weight activation co-quantization framework for multimodal transformers. Enables a 2.4B vision-language policy network to run real-time visual grounding and trajectory synthesis at 48 FPS on NVIDIA Jetson Orin Nano (15W budget).',
    headlineMetric: '48 FPS',
    headlineMetricLabel: 'Real-time On-Device Inference',
    tags: ['TENSORRT', 'EDGE AI', 'JETSON ORIN', '4-BIT AWQ', 'ROBOTICS POLICY'],
    metrics: [
      { label: 'Inference Frame Rate', baseline: '11 FPS (FP16)', kinetic: '48 FPS (INT4/FP8)', improvement: '+336%', progressPercent: 92 },
      { label: 'Thermal Power Draw', baseline: '28.5 W', kinetic: '8.4 W', improvement: '-70%', progressPercent: 95 },
      { label: 'End-to-End Latency', baseline: '91 ms', kinetic: '20.8 ms', improvement: '-77%', progressPercent: 90 },
      { label: 'Robotic Success Rate (Calvin Benchmark)', baseline: '84.2%', kinetic: '83.9%', improvement: '99.6% fidelity', progressPercent: 99 },
    ],
    parameters: {
      totalParams: '2.4 Billion Multimodal',
      activeParams: 'All Layers Quantized',
      contextWindow: 'Vision Tokens + 2048 Text',
      precision: 'INT4-AWQ + FP8 Vision Patch',
      kernelThroughput: '48.2 Frames/sec',
      memoryBandwidth: 'DLA + Tensor Core Dual Pipeline',
    },
    details: {
      motivation: 'Embodied robotics requiring low-latency closed-loop control cannot rely on cloud API round-trip times (150-500ms) or heavy GPU power supplies that drain mobile battery payloads.',
      mathematicalFormulation: 'W_q = \\text{round}\\left(\\frac{W \\cdot S}{\\Delta}\\right) \\cdot \\frac{\\Delta}{S}, \\quad S = \\arg\\min_S \\|W X - W_q X\\|_2^2',
      kernelHighlights: [
        'Hardware-aware activation outlier clipping preserving spatial visual resolution tokens',
        'Fused Cross-Attention and SwiGLU operators written in TensorRT C++ Plugins',
        'Asynchronous dual-stream camera ingestion over V4L2 with zero-copy DMA to unified memory',
        'Tested across 2,000 physical test-bed robotic manipulation trajectories',
      ],
      codeSnippet: `// EdgeDistill TensorRT Plugin execution step
int EdgeDistillPlugin::enqueue(
    const PluginTensorDesc* inputDesc,
    const PluginTensorDesc* outputDesc,
    const void* const* inputs,
    void* const* outputs,
    void* workspace,
    cudaStream_t stream
) noexcept {
    const half* vision_tokens = static_cast<const half*>(inputs[0]);
    const int8_t* quantized_weights = static_cast<const int8_t*>(inputs[1]);
    half* trajectory_out = static_cast<half*>(outputs[0]);
    
    // Launch fused Int4-gemm + GeLU + LayerNorm kernel
    launch_fused_edge_spatial_gemm(
        vision_tokens, quantized_weights, trajectory_out,
        mBatchSize, mSeqLen, mHiddenDim, stream
    );
    return 0;
}`,
      citation: 'Vance, A. & Lin, Y. "Real-Time Quantized Multimodal Policies on Constrained Edge Silicon." ICLR 2024.',
      githubUrl: 'https://github.com/obsidian-kinetic/edgedistill-vlm',
      paperUrl: 'https://arxiv.org/abs/2402.11204',
    },
  },
];

export const BENCHMARKS: BenchmarkTarget[] = [
  {
    id: 'h100-cluster',
    name: 'NVIDIA H100 SXM5 Cluster',
    hardware: '8× H100 80GB SXM5 (Hopper)',
    vram: '640 GB HBM3 @ 3.35 TB/s per GPU',
    interconnect: 'NVLink 4.0 (900 GB/s) + 400Gb/s NDR InfiniBand',
    records: [
      { model: 'KineticMoE-64B', framework: 'Kinetic Engine (FP8)', batchSize: 64, ttftMs: 1.8, throughputTokSec: 1420, vramUsedGb: 44.2, speedupVsBaseline: '3.4×', lossConvergence: 0.998 },
      { model: 'Llama-3-70B', framework: 'vLLM 0.6.1 (FP8)', batchSize: 64, ttftMs: 6.2, throughputTokSec: 620, vramUsedGb: 74.8, speedupVsBaseline: '1.5×', lossConvergence: 0.999 },
      { model: 'Llama-3-70B', framework: 'HuggingFace TGI (BF16)', batchSize: 64, ttftMs: 14.8, throughputTokSec: 418, vramUsedGb: 142.0, speedupVsBaseline: '1.0× (Baseline)', lossConvergence: 1.000 },
      { model: 'SpeculativeStream-70B', framework: 'Kinetic Speculative', batchSize: 16, ttftMs: 1.2, throughputTokSec: 1880, vramUsedGb: 78.4, speedupVsBaseline: '4.5×', lossConvergence: 1.000 },
    ],
  },
  {
    id: 'l40s-enterprise',
    name: 'NVIDIA L40S Enterprise Node',
    hardware: '4× L40S 48GB PCIe Gen4 (Ada Lovelace)',
    vram: '192 GB GDDR6 @ 864 GB/s',
    interconnect: 'PCIe 4.0 x16 + 100GbE RoCE',
    records: [
      { model: 'KineticMoE-64B', framework: 'Kinetic Engine (W4A8)', batchSize: 32, ttftMs: 4.8, throughputTokSec: 680, vramUsedGb: 38.5, speedupVsBaseline: '2.8×', lossConvergence: 0.997 },
      { model: 'Llama-3-70B', framework: 'vLLM (AWQ 4-bit)', batchSize: 32, ttftMs: 12.4, throughputTokSec: 340, vramUsedGb: 42.1, speedupVsBaseline: '1.4×', lossConvergence: 0.996 },
      { model: 'Llama-3-70B', framework: 'TensorRT-LLM (INT8)', batchSize: 32, ttftMs: 9.8, throughputTokSec: 420, vramUsedGb: 78.0, speedupVsBaseline: '1.7×', lossConvergence: 0.999 },
    ],
  },
  {
    id: 'edge-orin',
    name: 'NVIDIA Jetson Orin AGX 64GB',
    hardware: 'Embedded Ampere 2048-core GPU + 12-core ARM64',
    vram: '64 GB LPDDR5 Unified Memory @ 204 GB/s',
    interconnect: 'On-die unified bus (30W TDP max)',
    records: [
      { model: 'EdgeDistill-VLM-2.4B', framework: 'Kinetic Edge (W4A8)', batchSize: 1, ttftMs: 8.4, throughputTokSec: 48.2, vramUsedGb: 2.1, speedupVsBaseline: '3.8×', lossConvergence: 0.996 },
      { model: 'Llava-1.5-7B', framework: 'Ollama / llama.cpp (Q4_K)', batchSize: 1, ttftMs: 42.0, throughputTokSec: 12.6, vramUsedGb: 4.8, speedupVsBaseline: '1.0× (Baseline)', lossConvergence: 0.998 },
    ],
  },
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'neurips-2025',
    title: 'Zero-Drop Adaptive Gating for Hyperscale Mixture-of-Experts',
    conference: 'NeurIPS 2025',
    year: 2025,
    award: 'Oral Presentation (Top 1.8%)',
    authors: ['Alex Vance', 'Elena Rostova', 'Marcus Thorne', 'David Wu'],
    abstract: 'We present a momentum-driven auxiliary-loss-free routing mechanism that stabilizes expert token allocation in Mixture-of-Experts models. Across a cluster of 512 H100 GPUs, our system eliminates token drop while cutting all-to-all communication latency by 75%.',
    arxivId: '2410.14920',
    doi: '10.48550/arXiv.2410.14920',
    bibtex: `@inproceedings{vance2025zerodrop,
  title={Zero-Drop Adaptive Gating for Hyperscale Mixture-of-Experts},
  author={Vance, Alex and Rostova, Elena and Thorne, Marcus and Wu, David},
  booktitle={Advances in Neural Information Processing Systems (NeurIPS)},
  year={2025}
}`,
    citations: 84,
    pdfSize: '1.4 MB',
    links: {
      paper: 'https://arxiv.org/abs/2410.14920',
      code: 'https://github.com/obsidian-kinetic/kinetic-moe',
      poster: '#',
    },
  },
  {
    id: 'mlsys-2024',
    title: 'FlashKernel-v4: Asynchronous Memory Hierarchies for High-Order Attention',
    conference: 'MLSys 2024',
    year: 2024,
    award: 'Outstanding Paper Award Candidate',
    authors: ['Alex Vance', 'Kenji Sato', 'Sarah Jenkins'],
    abstract: 'Investigates shared-memory bank conflict elimination and warp-group matrix multiply instructions (WGMMA) on modern GPU architectures. Demonstrates a 4.8x throughput improvement at 128,000 sequence length without approximation.',
    arxivId: '2403.09812',
    doi: '10.48550/arXiv.2403.09812',
    bibtex: `@inproceedings{vance2024flashkernel,
  title={FlashKernel-v4: Asynchronous Memory Hierarchies for High-Order Attention},
  author={Vance, Alex and Sato, Kenji and Jenkins, Sarah},
  booktitle={Proceedings of Machine Learning and Systems (MLSys)},
  year={2024}
}`,
    citations: 216,
    pdfSize: '2.1 MB',
    links: {
      paper: 'https://arxiv.org/abs/2403.09812',
      code: 'https://github.com/obsidian-kinetic/flashkernel-v4',
      poster: '#',
    },
  },
  {
    id: 'icml-2024',
    title: 'SpeculativeStream: Non-Uniform Tree Decoders on Shared Paged Memory',
    conference: 'ICML 2024',
    year: 2024,
    authors: ['Alex Vance', 'Kexin Chen', 'Saurabh Patel'],
    abstract: 'Introduces dynamic entropy-guided tree branching for speculative decoding that maximizes accepted tokens while reusing the base model’s KV-cache pages via zero-copy GPU pointer tables.',
    arxivId: '2405.08319',
    doi: '10.48550/arXiv.2405.08319',
    bibtex: `@inproceedings{vance2024speculative,
  title={SpeculativeStream: Non-Uniform Tree Decoders on Shared Paged Memory},
  author={Vance, Alex and Chen, Kexin and Patel, Saurabh},
  booktitle={International Conference on Machine Learning (ICML)},
  year={2024}
}`,
    citations: 139,
    pdfSize: '1.8 MB',
    links: {
      paper: 'https://arxiv.org/abs/2405.08319',
      code: 'https://github.com/obsidian-kinetic/speculative-stream',
      poster: '#',
    },
  },
  {
    id: 'iclr-2024',
    title: 'Real-Time Quantized Multimodal Policies on Constrained Edge Silicon',
    conference: 'ICLR 2024',
    year: 2024,
    authors: ['Alex Vance', 'Yulong Lin', 'Maya Al-Mansoor'],
    abstract: 'An end-to-end framework enabling 48 FPS visual robot manipulation policies on low-power ARM+GPU SOCs using activation outlier-aware quantization and unified memory DMA streaming.',
    arxivId: '2402.11204',
    doi: '10.48550/arXiv.2402.11204',
    bibtex: `@inproceedings{vance2024edgedistill,
  title={Real-Time Quantized Multimodal Policies on Constrained Edge Silicon},
  author={Vance, Alex and Lin, Yulong and Al-Mansoor, Maya},
  booktitle={International Conference on Learning Representations (ICLR)},
  year={2024}
}`,
    citations: 104,
    pdfSize: '3.2 MB',
    links: {
      paper: 'https://arxiv.org/abs/2402.11204',
      code: 'https://github.com/obsidian-kinetic/edgedistill-vlm',
      poster: '#',
    },
  },
];

export const TECHNICAL_EXPERIENCE = [
  {
    role: 'Principal ML Systems Engineer',
    organization: 'Synthetix AI Research Labs',
    period: '2023 — Present',
    location: 'San Francisco, CA',
    focus: 'Distributed Inference & Custom Kernel Development',
    points: [
      'Architected the inference serving stack powering 80,000 queries per second with sub-10ms P95 latency across a 2,048 H100 GPU fleet.',
      'Authored custom Triton and CUDA WGMMA kernels cutting attention and MoE dispatch overhead by 48%.',
      'Designed dynamic KV-cache eviction protocols reducing peak memory footprints by 62% on 128k long-document synthesis.',
    ],
  },
  {
    role: 'Senior Deep Learning Systems Researcher',
    organization: 'TensorScale Core Team',
    period: '2021 — 2023',
    location: 'Palo Alto, CA',
    focus: 'Large Scale Foundation Model Pretraining',
    points: [
      'Led 3D parallelism scaling (Megatron Tensor Parallelism + ZeRO-3 + Pipeline Parallelism) for 100B+ parameter pretraining runs.',
      'Reduced multi-node All-Reduce communication time by 34% by tuning NCCL algorithms over InfiniBand HDR rails.',
      'Co-authored 5 papers in top-tier conferences (NeurIPS, ICML, MLSys).',
    ],
  },
  {
    role: 'CUDA Kernel & Systems Fellow',
    organization: 'Stanford Scalable Systems Lab',
    period: '2019 — 2021',
    location: 'Stanford, CA',
    focus: 'Hardware Accelerator Compiler & Runtime Optimization',
    points: [
      'Researched GPU memory coalescing and warp scheduling dynamics on Volta and Ampere architectures.',
      'Constructed open-source profiler visualizers downloaded over 200,000 times by machine learning engineers.',
    ],
  },
];

export const SYSTEM_STACK = [
  {
    category: 'Kernels & Hardware Acceleration',
    items: ['CUDA C++ (12.4)', 'Triton 3.0', 'PTX Assembly', 'WGMMA / Hopper TMA', 'SIMD / AVX-512', 'C++20'],
  },
  {
    category: 'Distributed Inference & Serving',
    items: ['vLLM', 'TensorRT-LLM', 'Megatron-LM', 'DeepSpeed', 'Ray Train', 'NCCL / InfiniBand NDR'],
  },
  {
    category: 'Profiling & Systems Observability',
    items: ['NVIDIA Nsight Systems', 'Nsight Compute (NCU)', 'PyTorch Kineto', 'Perf & eBPF', 'Prometheus / Grafana'],
  },
  {
    category: 'Precision & Quantization',
    items: ['FP8 (E4M3/E5M2)', 'AWQ 4-Bit', 'SmoothQuant', 'GPTQ', 'BitsAndBytes', 'INT8 Matrix Engines'],
  },
];
