/* Portfolio project data — single source of truth for the projects section.
   Cards are rendered by the inline script in index.html.
   "featured": true      -> large case-study card with "highlights"
   "status": "live"      -> repo + helm links are shown
   "status": "progress"  -> "In progress" badge, no links (never link to 404s) */
const PROJECTS = [
  {
    name: "customer-churn-service",
    repo: "https://github.com/SaiMudunuri04/customer-churn-service",
    helm: "https://github.com/SaiMudunuri04/customer-churn-service/tree/main/k8s/helm/customer-churn-service",
    category: "Core ML",
    title: "Customer churn prediction service",
    summary: "Leakage-aware churn scoring, from chronological training splits to a validated FastAPI scoring API shipped through GitOps.",
    highlights: [
      "Leakage-aware scikit-learn pipeline: imputation with missing indicators, scaling, class-weighted logistic regression.",
      "Chronological splits and validation-only threshold tuning; ROC-AUC, F1, precision, recall, and Brier score on an untouched test period.",
      "FastAPI scoring API with Pydantic feature-schema validation, health/readiness probes, and a SageMaker training launcher.",
      "GitHub Actions CI (pytest, ruff, Helm lint) pins tested image SHAs for Argo CD deployment to Kubernetes."
    ],
    pipeline: ["Validated data", "Train & evaluate", "Model artifact", "Scoring API"],
    tags: ["scikit-learn", "SageMaker", "FastAPI", "Helm", "Argo CD"],
    featured: true,
    status: "live"
  },
  {
    name: "langgraph-support-agent",
    repo: "https://github.com/SaiMudunuri04/langgraph-support-agent",
    helm: "https://github.com/SaiMudunuri04/langgraph-support-agent/tree/main/helm/support-agent",
    category: "Agents",
    title: "LangGraph customer support agent",
    summary: "A LangGraph state machine that routes, retrieves, answers, and validates — and escalates to a human when it should.",
    highlights: [
      "LangGraph copilot that routes user intent with an LLM to knowledge-base (BM25) and ticket-lookup tools.",
      "Guardrail node validates every answer (empty, length, prompt-leak checks) and escalates failures to a human handoff.",
      "Golden-set evaluation for routing and answer grounding plus 14 pytest tests, run in CI on every push.",
      "FastAPI service on Amazon Bedrock with LangSmith tracing and Secrets Manager; Docker, Helm, and Argo CD delivery."
    ],
    pipeline: ["Route intent", "Retrieve", "Generate", "Guardrail", "Answer / escalate"],
    tags: ["LangGraph", "LangChain", "Amazon Bedrock", "LangSmith", "FastAPI"],
    featured: true,
    status: "live"
  },
  {
    name: "mcp-agent-toolkit",
    repo: "https://github.com/SaiMudunuri04/mcp-agent-toolkit",
    helm: "https://github.com/SaiMudunuri04/mcp-agent-toolkit/tree/main/helm/mcp-toolkit",
    category: "Agents",
    title: "MCP agent toolkit",
    summary: "FastMCP tool server with a LangGraph agent client — scoped permissions, authenticated tools, and validated outputs.",
    pipeline: ["Agent", "MCP tools", "Validated result"],
    tags: ["MCP", "FastMCP", "LangGraph"],
    status: "live"
  },
  {
    name: "evidence-rag-service",
    repo: "https://github.com/SaiMudunuri04/evidence-rag-service",
    helm: "https://github.com/SaiMudunuri04/evidence-rag-service/tree/main/k8s/helm/evidence-rag-service",
    category: "Generative AI",
    title: "Evidence-first RAG",
    summary: "BM25 retrieval with citation-ID checks — answers stay linked to retrieved sources, or the service abstains.",
    pipeline: ["Documents", "Retrieve", "Cite / abstain"],
    tags: ["RAG", "BM25", "Citations", "FastAPI"],
    status: "live"
  },
  {
    name: "incident-triage-agent",
    repo: "https://github.com/SaiMudunuri04/incident-triage-agent",
    helm: "https://github.com/SaiMudunuri04/incident-triage-agent/tree/main/k8s/helm/incident-triage-agent",
    category: "Agents",
    title: "Incident triage agent",
    summary: "Bounded plan–act–observe loop with read-only tools, an action allowlist, and evidence-based summaries.",
    pipeline: ["Incident", "Allowed tools", "Evidence summary"],
    tags: ["Tool use", "Safety", "Observability"],
    status: "live"
  },
  {
    name: "lora-ticket-classifier",
    repo: "https://github.com/SaiMudunuri04/lora-ticket-classifier",
    helm: "https://github.com/SaiMudunuri04/lora-ticket-classifier/tree/main/k8s/helm/lora-ticket-classifier",
    category: "Fine-tuning",
    title: "LoRA ticket classifier",
    summary: "Parameter-efficient text classification with duplicate protection, held-out evaluation, adapter export, and an inference API.",
    pipeline: ["Tickets", "LoRA adapter", "Classifier API"],
    tags: ["LoRA", "PEFT", "Transformers"],
    status: "live"
  },
  {
    name: "isolation-forest-anomaly-detection",
    repo: "https://github.com/SaiMudunuri04/isolation-forest-anomaly-detection",
    helm: "https://github.com/SaiMudunuri04/isolation-forest-anomaly-detection/tree/main/k8s/helm/isolation-forest",
    category: "Core ML",
    title: "Isolation Forest anomaly detection",
    summary: "Train, infer, evaluate, drift-check, and explain anomalies over industrial telemetry — a reference build of the approach used in production work.",
    pipeline: ["Telemetry", "Isolation Forest", "Alerts"],
    tags: ["Anomaly detection", "scikit-learn", "MLOps"],
    status: "live"
  },
  {
    name: "demand-forecast-service",
    repo: "https://github.com/SaiMudunuri04/demand-forecast-service",
    helm: "https://github.com/SaiMudunuri04/demand-forecast-service/tree/main/k8s/helm/demand-forecast-service",
    category: "Core ML",
    title: "Demand forecasting",
    summary: "Lag and calendar features, expanding-window backtests that never peek at the future, and a forecast API guarded by history checks.",
    pipeline: ["History", "Backtest", "Forecast API"],
    tags: ["scikit-learn", "Time series", "SageMaker"],
    status: "live"
  },
  {
    name: "visual-defect-service",
    repo: "https://github.com/SaiMudunuri04/visual-defect-service",
    helm: "https://github.com/SaiMudunuri04/visual-defect-service/tree/main/k8s/helm/visual-defect-service",
    category: "Vision & Search",
    title: "Visual defect classification",
    summary: "ResNet18 transfer learning with split checks, early stopping, and checkpoints behind a bounded image-inference API.",
    pipeline: ["Images", "ResNet18", "Inference API"],
    tags: ["PyTorch", "Computer vision", "FastAPI"],
    status: "live"
  },
  {
    name: "multimodal-search-service",
    repo: "https://github.com/SaiMudunuri04/multimodal-search-service",
    helm: "https://github.com/SaiMudunuri04/multimodal-search-service/tree/main/k8s/helm/multimodal-search-service",
    category: "Vision & Search",
    title: "Image and text search",
    summary: "CLIP image-and-caption embeddings with catalog validation and normalized ranking for text-to-image search.",
    pipeline: ["Catalog", "CLIP embeddings", "Ranked results"],
    tags: ["CLIP", "Transformers", "Search"],
    status: "live"
  }
];
