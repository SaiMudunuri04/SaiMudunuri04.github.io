/* Portfolio project data — single source of truth for the projects grid.
   Cards are rendered by the inline script in index.html.
   "status": "live"      -> repo + helm links are shown
   "status": "progress"  -> "In progress" badge, no links (never link to 404s) */
const PROJECTS = [
  {
    name: "customer-churn-service",
    repo: "https://github.com/SaiMudunuri04/customer-churn-service",
    helm: "https://github.com/SaiMudunuri04/customer-churn-service/tree/main/k8s/helm/customer-churn-service",
    category: "Core ML",
    title: "Customer churn scoring",
    summary: "Leakage-aware scikit-learn pipeline with chronological holdouts, validation-only threshold selection, SageMaker script-mode training, and a bounded FastAPI scoring API.",
    pipeline: "Validated data → Train / evaluate → Model artifact → Scoring API",
    tags: ["Python", "scikit-learn", "SageMaker", "FastAPI"],
    status: "live"
  },
  {
    name: "demand-forecast-service",
    repo: "https://github.com/SaiMudunuri04/demand-forecast-service",
    helm: "https://github.com/SaiMudunuri04/demand-forecast-service/tree/main/k8s/helm/demand-forecast-service",
    category: "Core ML",
    title: "Demand forecasting",
    summary: "Time-series forecasting with lag and calendar features, expanding-window backtests, Ridge models, SageMaker training, and a forecast API guarded by history checks.",
    pipeline: "History → Backtest → Forecast API",
    tags: ["Python", "scikit-learn", "SageMaker", "Time series"],
    status: "live"
  },
  {
    name: "visual-defect-service",
    repo: "https://github.com/SaiMudunuri04/visual-defect-service",
    helm: "https://github.com/SaiMudunuri04/visual-defect-service/tree/main/k8s/helm/visual-defect-service",
    category: "Vision & Search",
    title: "Visual defect classification",
    summary: "ResNet18 transfer learning with split checks, early stopping, checkpoints, and validation history behind a bounded image-inference API.",
    pipeline: "Images → ResNet18 → Inference API",
    tags: ["PyTorch", "Computer vision", "FastAPI"],
    status: "live"
  },
  {
    name: "evidence-rag-service",
    repo: "https://github.com/SaiMudunuri04/evidence-rag-service",
    helm: "https://github.com/SaiMudunuri04/evidence-rag-service/tree/main/k8s/helm/evidence-rag-service",
    category: "Generative AI",
    title: "Evidence-first RAG",
    summary: "Document ingestion with BM25 retrieval and citation-ID checks — generated answers stay linked to source documents or the system abstains.",
    pipeline: "Documents → Retrieve → Cite / abstain",
    tags: ["RAG", "BM25", "Citations", "FastAPI"],
    status: "live"
  },
  {
    name: "multimodal-search-service",
    repo: "https://github.com/SaiMudunuri04/multimodal-search-service",
    helm: "https://github.com/SaiMudunuri04/multimodal-search-service/tree/main/k8s/helm/multimodal-search-service",
    category: "Vision & Search",
    title: "Image and text search",
    summary: "CLIP image-and-caption embeddings with catalog validation, normalized ranking, and text-to-image search over an inspectable catalog.",
    pipeline: "Catalog → CLIP embeddings → Ranked results",
    tags: ["CLIP", "Transformers", "Search"],
    status: "live"
  },
  {
    name: "incident-triage-agent",
    repo: "https://github.com/SaiMudunuri04/incident-triage-agent",
    helm: "https://github.com/SaiMudunuri04/incident-triage-agent/tree/main/k8s/helm/incident-triage-agent",
    category: "Agents",
    title: "Incident triage agent",
    summary: "Bounded plan–act–observe loop with read-only tools, an action allowlist, and evidence-based summaries tied to successful observations.",
    pipeline: "Incident → Allowed tools → Evidence summary",
    tags: ["Tool use", "Safety", "Observability"],
    status: "live"
  },
  {
    name: "lora-ticket-classifier",
    repo: "https://github.com/SaiMudunuri04/lora-ticket-classifier",
    helm: "https://github.com/SaiMudunuri04/lora-ticket-classifier/tree/main/k8s/helm/lora-ticket-classifier",
    category: "Fine-tuning",
    title: "LoRA ticket classifier",
    summary: "Parameter-efficient text classification with duplicate protection, held-out evaluation, adapter export, and an inference endpoint.",
    pipeline: "Tickets → LoRA adapter → Classifier API",
    tags: ["LoRA", "PEFT", "Transformers"],
    status: "live"
  },
  {
    name: "isolation-forest-anomaly-detection",
    repo: "https://github.com/SaiMudunuri04/isolation-forest-anomaly-detection",
    helm: "https://github.com/SaiMudunuri04/isolation-forest-anomaly-detection/tree/main/k8s/helm/isolation-forest",
    category: "Core ML",
    title: "Isolation Forest anomaly detection",
    summary: "Isolation Forest over industrial equipment telemetry — the same approach behind a ~15–25% reduction in unplanned downtime in production ML work.",
    pipeline: "Telemetry → Isolation Forest → Degradation alerts",
    tags: ["Anomaly detection", "scikit-learn", "MLOps"],
    status: "live"
  },
  {
    name: "langgraph-support-agent",
    repo: "https://github.com/SaiMudunuri04/langgraph-support-agent",
    helm: "https://github.com/SaiMudunuri04/langgraph-support-agent/tree/main/helm/support-agent",
    category: "Agents",
    title: "LangGraph support copilot",
    summary: "LangChain + LangGraph support agent with LangSmith traceability, tool use, guardrailed outputs, and an evaluated golden set.",
    pipeline: "Query → Retrieve → Generate → Validate",
    tags: ["LangGraph", "LangSmith", "AWS Bedrock"],
    status: "live"
  },
  {
    name: "mcp-agent-toolkit",
    repo: "https://github.com/SaiMudunuri04/mcp-agent-toolkit",
    helm: "https://github.com/SaiMudunuri04/mcp-agent-toolkit/tree/main/helm/mcp-toolkit",
    category: "Agents",
    title: "MCP agent toolkit",
    summary: "FastMCP tool server with a LangGraph agent client — scoped permissions, authenticated tools, and validated outputs.",
    pipeline: "Agent → MCP tools → Validated result",
    tags: ["MCP", "FastMCP", "LangGraph"],
    status: "live"
  }
];
