/* Portfolio project data — single source of truth for the Projects blueprint explorer.
   Rendered by the inline script in index.html.

   Each project has a `flow`: the end-to-end architecture drawn as a blueprint.
     lanes: row names (top → bottom)
     nodes: { id, t: title, s: subtitle, lane, col, d: what this stage does }
            — listed in the order the "Play flow" walkthrough visits them
     edges: [fromId, toId] connections
   `proof` holds facts taken from each repo's README (tests, checks, limits).
   "status": "live" -> repo + helm links are shown; "progress" -> badge only. */
const PROJECTS = [
  {
    name: "langgraph-support-agent",
    repo: "https://github.com/SaiMudunuri04/langgraph-support-agent",
    helm: "https://github.com/SaiMudunuri04/langgraph-support-agent/tree/main/helm/support-agent",
    category: "Agents",
    title: "LangGraph customer support agent",
    summary: "A LangGraph state machine that routes, retrieves, answers, validates — and escalates to a human when it should.",
    tags: ["LangGraph", "LangChain", "Amazon Bedrock", "LangSmith", "FastAPI"],
    proof: ["14/14 pytest", "8/8 golden-set eval", "Guardrail → human escalation"],
    status: "live",
    flow: {
      lanes: ["Request", "Agent graph", "Ship"],
      nodes: [
        { id: "chat", t: "POST /chat", s: "FastAPI · Pydantic", lane: 0, col: 0, d: "Validated request (1–2000 chars) enters the service; the serving layer re-validates agent output before responding." },
        { id: "router", t: "Router", s: "LLM intent classify", lane: 1, col: 1, d: "Classifies intent as billing, technical, account, general, or escalate — escalations skip straight to a safe handoff." },
        { id: "retrieve", t: "Retrieve", s: "kb_lookup · ticket_lookup", lane: 1, col: 2, d: "BM25 lookup over the knowledge base plus ticket lookup by ID or keyword." },
        { id: "answer", t: "Generate", s: "grounded in sources", lane: 1, col: 3, d: "Drafts an answer using only retrieved sources, via Amazon Bedrock (or a deterministic mock for tests)." },
        { id: "guard", t: "Guardrail", s: "output validation", lane: 1, col: 4, d: "Checks the draft is non-empty, length-capped, and free of prompt-marker leakage. Failures route to escalate." },
        { id: "reply", t: "Answer / escalate", s: "sources · tools_used", lane: 0, col: 4, d: "Returns the answer with sources and tools used, or a safe human-handoff message. Every run is traced in LangSmith." },
        { id: "ci", t: "CI", s: "pytest + golden eval", lane: 2, col: 1, d: "Every push runs the 14-test suite and the golden-set evaluation in mock mode — no secrets needed." },
        { id: "cd", t: "Image → GHCR", s: ":sha + :latest", lane: 2, col: 2, d: "On green, the CD workflow builds the Docker image and pushes it to GitHub Container Registry." },
        { id: "argo", t: "Argo CD", s: "Helm · self-heal", lane: 2, col: 3, d: "Argo CD syncs the Helm chart with automated prune and self-heal; secrets come from AWS Secrets Manager." }
      ],
      edges: [["chat", "router"], ["router", "retrieve"], ["retrieve", "answer"], ["answer", "guard"], ["guard", "reply"], ["ci", "cd"], ["cd", "argo"]]
    }
  },
  {
    name: "mcp-agent-toolkit",
    repo: "https://github.com/SaiMudunuri04/mcp-agent-toolkit",
    helm: "https://github.com/SaiMudunuri04/mcp-agent-toolkit/tree/main/helm/mcp-toolkit",
    category: "Agents",
    title: "MCP agent toolkit",
    summary: "A FastMCP tool server plus a LangGraph agent that discovers and calls its tools over MCP — with scoped permissions.",
    tags: ["MCP", "FastMCP", "LangGraph", "LangSmith"],
    proof: ["18/18 pytest", "6/6 golden-set eval", "Max 4 tool steps"],
    status: "live",
    flow: {
      lanes: ["Request", "Agent loop", "MCP server"],
      nodes: [
        { id: "ask", t: "POST /ask", s: "FastAPI", lane: 0, col: 0, d: "A question arrives; GET /tools also exposes live MCP tool discovery." },
        { id: "decide", t: "Decide", s: "LLM: tool or answer", lane: 1, col: 1, d: "The LangGraph loop lets the LLM pick a tool or finish, for at most 4 tool steps (multi-hop supported)." },
        { id: "client", t: "MCP client", s: "scoped permissions", lane: 1, col: 2, d: "Calls outside allowed_tools raise PermissionError, which is recorded as an observation instead of executing." },
        { id: "server", t: "FastMCP server", s: "3 read-only tools", lane: 2, col: 2, d: "doc_search (BM25), record_lookup (by ID), and text_stats — reachable in-process or over streamable HTTP." },
        { id: "observe", t: "Observe", s: "append to state", lane: 1, col: 3, d: "Each tool result (or denial) is appended to agent state and fed back into the next decision." },
        { id: "validate", t: "Validate", s: "output checks", lane: 1, col: 4, d: "The final answer is validated; failures return a safe fallback answer." },
        { id: "out", t: "Answer", s: "answer + tools_used", lane: 0, col: 4, d: "Returns the answer, tools used, and step count. LangSmith tracing turns on when a key is present." }
      ],
      edges: [["ask", "decide"], ["decide", "client"], ["client", "server"], ["server", "observe"], ["observe", "validate"], ["validate", "out"]]
    }
  },
  {
    name: "evidence-rag-service",
    repo: "https://github.com/SaiMudunuri04/evidence-rag-service",
    helm: "https://github.com/SaiMudunuri04/evidence-rag-service/tree/main/k8s/helm/evidence-rag-service",
    category: "Generative AI",
    title: "Evidence-first RAG",
    summary: "Retrieval-augmented generation that only answers with valid citations — otherwise it abstains.",
    tags: ["RAG", "BM25", "Citations", "FastAPI", "Argo CD"],
    proof: ["4/4 pytest", "Citation-ID validation", "Abstains when unverified"],
    status: "live",
    flow: {
      lanes: ["Index", "Answer path", "Ship"],
      nodes: [
        { id: "docs", t: "Documents", s: ".md / .txt", lane: 0, col: 0, d: "Operator-approved documents are loaded from DOCUMENT_ROOT; readiness fails if the folder is empty or missing." },
        { id: "chunk", t: "Chunk + index", s: "180 words · 30 overlap", lane: 0, col: 1, d: "Documents are split into overlapping windows and indexed with BM25, cached once per process." },
        { id: "q", t: "POST /answer", s: "question", lane: 1, col: 1, d: "A question enters the FastAPI service." },
        { id: "top", t: "Retrieve top-4", s: "BM25 scores", lane: 1, col: 2, d: "The four best-scoring passages become numbered sources [S1]…[S4]." },
        { id: "llm", t: "Generate", s: "OpenAI-compatible LLM", lane: 1, col: 3, d: "The model answers from the passages; the system prompt treats sources as data, never instructions." },
        { id: "cite", t: "Citation check", s: "valid IDs or abstain", lane: 1, col: 4, d: "Every [S#] must exist in the retrieved range. Missing or invalid citations replace the answer with an abstention." },
        { id: "ci", t: "CI", s: "pytest · ruff · helm lint", lane: 2, col: 2, d: "GitHub Actions runs tests, lint, and Helm validation on every push." },
        { id: "argo", t: "Argo CD", s: "pinned :sha image", lane: 2, col: 3, d: "The tested image SHA is pinned and auto-synced to Kubernetes with prune + self-heal." }
      ],
      edges: [["docs", "chunk"], ["chunk", "top"], ["q", "top"], ["top", "llm"], ["llm", "cite"], ["ci", "argo"]]
    }
  },
  {
    name: "customer-churn-service",
    repo: "https://github.com/SaiMudunuri04/customer-churn-service",
    helm: "https://github.com/SaiMudunuri04/customer-churn-service/tree/main/k8s/helm/customer-churn-service",
    category: "Core ML",
    title: "Customer churn prediction service",
    summary: "Leakage-aware churn scoring, from chronological training splits to a validated scoring API shipped through GitOps.",
    tags: ["scikit-learn", "SageMaker", "FastAPI", "Helm", "Argo CD"],
    proof: ["5/5 pytest", "Leakage + duplicate guards", "helm lint --strict"],
    status: "live",
    flow: {
      lanes: ["Train", "Serve", "Ship"],
      nodes: [
        { id: "csv", t: "churn.csv", s: "validated rows", lane: 0, col: 0, d: "Each customer appears once with an ISO timestamp; duplicates and invalid rows are rejected." },
        { id: "split", t: "Chronological split", s: "no future leakage", lane: 0, col: 1, d: "Data is sorted by observation time so the model never trains on the future." },
        { id: "pipe", t: "Pipeline", s: "impute · scale · log-reg", lane: 0, col: 2, d: "Median imputation with missing indicators, scaling, and class-weighted logistic regression — local or SageMaker training." },
        { id: "eval", t: "Evaluate", s: "threshold on validation", lane: 0, col: 3, d: "The decision threshold is chosen on validation only; ROC-AUC, F1, precision, recall, and Brier score are reported on the untouched test period." },
        { id: "art", t: "model.joblib", s: "pipeline + threshold", lane: 1, col: 3, d: "One artifact bundles the pipeline, feature list, and threshold, mounted read-only into the service." },
        { id: "api", t: "POST /predict", s: "schema-validated", lane: 1, col: 4, d: "FastAPI with Pydantic feature validation returns churn probability and decision; readiness fails without a valid artifact." },
        { id: "ci", t: "CI", s: "pytest · ruff · helm", lane: 2, col: 1, d: "Tests, lint, and Helm lint/template run on every push." },
        { id: "img", t: "GHCR image", s: "pinned commit SHA", lane: 2, col: 2, d: "CI pushes an immutable image and pins its SHA in values.yaml." },
        { id: "argo", t: "Argo CD", s: "HPA · PDB · NetworkPolicy", lane: 2, col: 3, d: "Argo CD auto-syncs the Helm chart to Kubernetes with prune + self-heal." }
      ],
      edges: [["csv", "split"], ["split", "pipe"], ["pipe", "eval"], ["eval", "art"], ["art", "api"], ["ci", "img"], ["img", "argo"]]
    }
  },
  {
    name: "isolation-forest-anomaly-detection",
    repo: "https://github.com/SaiMudunuri04/isolation-forest-anomaly-detection",
    helm: "https://github.com/SaiMudunuri04/isolation-forest-anomaly-detection/tree/main/k8s/helm/isolation-forest",
    category: "Core ML",
    title: "Isolation Forest anomaly detection",
    summary: "A reproducible reference build of the industrial anomaly-detection approach I shipped at Honeywell.",
    tags: ["scikit-learn", "Anomaly detection", "Drift", "Kubernetes"],
    proof: ["7/7 pytest", "200-tree Isolation Forest", "PSI + KS drift checks"],
    status: "live",
    flow: {
      lanes: ["Train", "Operate", "Ship"],
      nodes: [
        { id: "data", t: "Telemetry CSV", s: "or synthetic generator", lane: 0, col: 0, d: "Multivariate equipment telemetry; a bundled synthetic dataset lets the full loop run without proprietary data." },
        { id: "pipe", t: "Pipeline", s: "impute → IsolationForest", lane: 0, col: 1, d: "Median imputation feeding a 200-tree Isolation Forest, configured from one file." },
        { id: "art", t: "Versioned artifact", s: "model + threshold", lane: 0, col: 2, d: "A single joblib holds the preprocessor, model, feature list, calibrated threshold, and metadata." },
        { id: "score", t: "Batch scoring", s: "is_anomaly · score", lane: 1, col: 3, d: "infer.py scores new telemetry and writes flagged records." },
        { id: "explain", t: "Explain", s: "permutation + ablation", lane: 1, col: 2, d: "Permutation importance and per-record ablation show which sensors drove each alert." },
        { id: "drift", t: "Drift monitor", s: "OK · WATCH · RETRAIN", lane: 1, col: 4, d: "PSI and KS tests compare live data to training data and recommend a retrain when it shifts." },
        { id: "ci", t: "CI → GHCR", s: "pytest · docker", lane: 2, col: 2, d: "Tests run on push; the image is tagged with the commit SHA." },
        { id: "cron", t: "K8s CronJob", s: "via Argo CD", lane: 2, col: 3, d: "Argo CD deploys a scheduled CronJob for retraining and batch scoring." }
      ],
      edges: [["data", "pipe"], ["pipe", "art"], ["art", "explain"], ["art", "score"], ["score", "drift"], ["ci", "cron"]]
    }
  },
  {
    name: "lora-ticket-classifier",
    repo: "https://github.com/SaiMudunuri04/lora-ticket-classifier",
    helm: "https://github.com/SaiMudunuri04/lora-ticket-classifier/tree/main/k8s/helm/lora-ticket-classifier",
    category: "Fine-tuning",
    title: "LoRA ticket classifier",
    summary: "Parameter-efficient fine-tuning of DistilBERT with strict split hygiene, served behind a bounded API.",
    tags: ["LoRA", "PEFT", "DistilBERT", "FastAPI"],
    proof: ["6/6 pytest", "Train/val overlap rejected", "kubeconform strict"],
    status: "live",
    flow: {
      lanes: ["Fine-tune", "Serve", "Ship"],
      nodes: [
        { id: "jsonl", t: "Train / val JSONL", s: "text + label", lane: 0, col: 0, d: "Duplicate texts and train/validation overlap are rejected before training starts." },
        { id: "lora", t: "LoRA adapter", s: "on DistilBERT", lane: 0, col: 1, d: "PEFT trains a small adapter on a frozen base model, with held-out evaluation each epoch." },
        { id: "export", t: "Export adapter", s: "ADAPTER_PATH", lane: 0, col: 2, d: "Only the adapter and tokenizer are exported — a small artifact instead of a full model copy." },
        { id: "ready", t: "Readiness", s: "adapter bundle check", lane: 1, col: 2, d: "/health/ready returns 503 until the adapter bundle loads." },
        { id: "classify", t: "POST /classify", s: "3–4000 chars", lane: 1, col: 3, d: "Bounded input; returns a label and confidence from the LoRA model." },
        { id: "ci", t: "CI", s: "pytest · ruff · helm", lane: 2, col: 2, d: "Tests and Helm checks run on push; manifests pass kubeconform strict validation." },
        { id: "argo", t: "Argo CD", s: "Deployment + PDB", lane: 2, col: 3, d: "The SHA-tagged image is auto-synced to Kubernetes." }
      ],
      edges: [["jsonl", "lora"], ["lora", "export"], ["export", "ready"], ["ready", "classify"], ["ci", "argo"]]
    }
  },
  {
    name: "incident-triage-agent",
    repo: "https://github.com/SaiMudunuri04/incident-triage-agent",
    helm: "https://github.com/SaiMudunuri04/incident-triage-agent/tree/main/k8s/helm/incident-triage-agent",
    category: "Agents",
    title: "Incident triage agent",
    summary: "A bounded plan–act–observe agent with read-only tools that must cite evidence before it finishes.",
    tags: ["Tool use", "Safety", "FastAPI", "Argo CD"],
    proof: ["Read-only tool allowlist", "≤ 20 bounded steps", "Evidence-gated finish"],
    status: "live",
    flow: {
      lanes: ["Request", "Agent loop", "Data"],
      nodes: [
        { id: "triage", t: "POST /triage", s: "incident", lane: 0, col: 0, d: "An incident description enters the FastAPI service." },
        { id: "plan", t: "Plan", s: "LLM planner", lane: 1, col: 1, d: "The planner chooses the next action within a bounded loop of at most 20 steps." },
        { id: "act", t: "Act", s: "allowlisted tools only", lane: 1, col: 2, d: "Only search_runbook and read_metric run; any write-like action is rejected and logged in the audit trace." },
        { id: "rb", t: "Runbooks + metrics", s: "read-only data", lane: 2, col: 2, d: "Mounted markdown runbooks and a JSON metrics file — the agent can read but never change infrastructure." },
        { id: "obs", t: "Observe", s: "audit trace", lane: 1, col: 3, d: "Each observation is numbered so the final summary can cite it." },
        { id: "finish", t: "Finish", s: "must cite steps", lane: 1, col: 4, d: "A summary is accepted only if every cited step:N is a successful observation." },
        { id: "human", t: "Human review", s: "suggestion, not action", lane: 0, col: 4, d: "The output is a triage suggestion for an engineer; nothing is auto-remediated." }
      ],
      edges: [["triage", "plan"], ["plan", "act"], ["act", "rb"], ["rb", "obs"], ["obs", "finish"], ["finish", "human"]]
    }
  },
  {
    name: "demand-forecast-service",
    repo: "https://github.com/SaiMudunuri04/demand-forecast-service",
    helm: "https://github.com/SaiMudunuri04/demand-forecast-service/tree/main/k8s/helm/demand-forecast-service",
    category: "Core ML",
    title: "Demand forecasting",
    summary: "Next-day demand forecasts with backtests that never peek at the future, behind a history-checked API.",
    tags: ["scikit-learn", "Time series", "SageMaker", "FastAPI"],
    proof: ["3/3 pytest", "Expanding-window backtest", "History-guarded API"],
    status: "live",
    flow: {
      lanes: ["Train", "Serve", "Ship"],
      nodes: [
        { id: "csv", t: "demand.csv", s: "≥ 35 daily rows", lane: 0, col: 0, d: "Consecutive daily units, price, and promotion." },
        { id: "feat", t: "Features", s: "lags + calendar", lane: 0, col: 1, d: "Lag and calendar features built only from past observations." },
        { id: "bt", t: "Backtest", s: "expanding window", lane: 0, col: 2, d: "The model refits on the past at each step — no future actual ever enters a feature." },
        { id: "ridge", t: "Ridge model", s: "+ last history", lane: 0, col: 3, d: "The artifact stores the model, features, last date, and recent history." },
        { id: "api", t: "POST /forecast", s: "date + history guards", lane: 1, col: 4, d: "Rejects requests unless the date is the next day and the history matches the artifact's final seven observations." },
        { id: "argo", t: "GitOps", s: "CI → GHCR → Argo CD", lane: 2, col: 3, d: "Tested images are SHA-pinned and auto-synced to Kubernetes." }
      ],
      edges: [["csv", "feat"], ["feat", "bt"], ["bt", "ridge"], ["ridge", "api"]]
    }
  },
  {
    name: "visual-defect-service",
    repo: "https://github.com/SaiMudunuri04/visual-defect-service",
    helm: "https://github.com/SaiMudunuri04/visual-defect-service/tree/main/k8s/helm/visual-defect-service",
    category: "Vision & Search",
    title: "Visual defect classification",
    summary: "ResNet18 transfer learning with leakage checks, behind an upload-hardened inference API.",
    tags: ["PyTorch", "ResNet18", "Computer vision", "FastAPI"],
    proof: ["4/4 pytest", "8 MiB · 20 MP upload guards", "Cross-split leak check"],
    status: "live",
    flow: {
      lanes: ["Train", "Serve", "Ship"],
      nodes: [
        { id: "imgs", t: "Images", s: "train/ · val/", lane: 0, col: 0, d: "Byte-identical images across splits are rejected before training." },
        { id: "rn", t: "ResNet18", s: "frozen backbone", lane: 0, col: 1, d: "ImageNet backbone with a fine-tuned head, early stopping, and best-validation checkpointing." },
        { id: "ckpt", t: "Checkpoint", s: "MODEL_PATH", lane: 0, col: 2, d: "The best checkpoint is mounted read-only; a missing or incompatible one returns 503." },
        { id: "guard", t: "Upload guards", s: "type · size · pixels", lane: 1, col: 2, d: "Only PNG/JPEG/WebP up to 8 MiB and 20M pixels; malformed images are rejected before the model loads." },
        { id: "pred", t: "POST /predict", s: "class + confidence", lane: 1, col: 3, d: "Returns the class, confidence, and per-class scores." },
        { id: "argo", t: "GitOps", s: "CI → GHCR → Argo CD", lane: 2, col: 3, d: "SHA-tagged images auto-synced to Kubernetes." }
      ],
      edges: [["imgs", "rn"], ["rn", "ckpt"], ["ckpt", "guard"], ["guard", "pred"]]
    }
  },
  {
    name: "multimodal-search-service",
    repo: "https://github.com/SaiMudunuri04/multimodal-search-service",
    helm: "https://github.com/SaiMudunuri04/multimodal-search-service/tree/main/k8s/helm/multimodal-search-service",
    category: "Vision & Search",
    title: "Image and text search",
    summary: "Text-to-image retrieval with CLIP embeddings over a validated catalog — no external vector database.",
    tags: ["CLIP", "Transformers", "Search", "FastAPI"],
    proof: ["4/4 pytest", "Paths confined to IMAGE_ROOT", "In-memory cosine index"],
    status: "live",
    flow: {
      lanes: ["Index", "Search", "Ship"],
      nodes: [
        { id: "cat", t: "JSONL catalog", s: "id · path · caption", lane: 0, col: 0, d: "Unique IDs with image paths confined to IMAGE_ROOT." },
        { id: "clip", t: "CLIP encoders", s: "image + caption", lane: 0, col: 1, d: "Images and captions are embedded with CLIP." },
        { id: "idx", t: "Embedding index", s: "normalized, in memory", lane: 0, col: 2, d: "A transparent in-memory index of normalized vectors, rebuilt per process." },
        { id: "q", t: "POST /search", s: "text + limit", lane: 1, col: 2, d: "The text query is embedded with the same CLIP model." },
        { id: "rank", t: "Rank", s: "cosine similarity", lane: 1, col: 3, d: "Returns ranked IDs, captions, and scores." },
        { id: "argo", t: "GitOps", s: "CI → GHCR → Argo CD", lane: 2, col: 3, d: "SHA-tagged images auto-synced to Kubernetes." }
      ],
      edges: [["cat", "clip"], ["clip", "idx"], ["idx", "rank"], ["q", "rank"]]
    }
  }
];
