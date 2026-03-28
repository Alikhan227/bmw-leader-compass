import { WebhookDecision, WebhookRisk } from "@/hooks/useDecisionWebhook";
import { motion } from "framer-motion";
import { Cpu, AlertTriangle, CheckCircle2, Users, RefreshCw, Zap } from "lucide-react";

interface AiDecisionPanelProps {
  decision: WebhookDecision | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

function severityColor(severity: string) {
  switch (severity) {
    case "High": return { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", dot: "bg-red-400" };
    case "Medium": return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", dot: "bg-yellow-400" };
    case "Low": return { bg: "bg-[#0066B1]/10", border: "border-[#0066B1]/30", text: "text-[#0066B1]", dot: "bg-[#0066B1]" };
    default: return { bg: "bg-[#111111]", border: "border-[#333333]", text: "text-muted-foreground", dot: "bg-muted-foreground" };
  }
}

export function AiDecisionPanel({ decision, isLoading, error, onRetry }: AiDecisionPanelProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-8 space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#0066B1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1]">BMW AI Agent is analyzing candidates...</p>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-[#111111] rounded-none w-3/4"></div>
          <div className="h-4 bg-[#111111] rounded-none w-1/2"></div>
          <div className="h-4 bg-[#111111] rounded-none w-5/6"></div>
          <div className="h-4 bg-[#111111] rounded-none w-2/3"></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 bg-[#111111] rounded-none"></div>
          <div className="h-20 bg-[#111111] rounded-none"></div>
          <div className="h-20 bg-[#111111] rounded-none"></div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-[#0A0A0A] border border-red-500/30 rounded-none p-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Connection Failed</p>
        </div>
        <p className="text-sm text-slate-300 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-[#0066B1] hover:bg-white hover:text-[#0066B1] text-white rounded-none font-bold uppercase tracking-[0.2em] text-[10px] transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  // No data yet
  if (!decision) {
    return (
      <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-8 flex flex-col items-center justify-center min-h-[200px]">
        <Cpu className="w-8 h-8 text-[#333333] mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Select a scenario to activate the AI Agent</p>
      </div>
    );
  }

  // Decision Result
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Recommended Candidate — Hero Card */}
      <div className="bg-[#0A0A0A] border border-[#0066B1]/40 rounded-none p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#0066B1]"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-2 flex items-center gap-2">
              <Zap className="w-3 h-3" /> AI Recommendation
            </p>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{decision.recommended_candidate}</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Top Match by Decision Intelligence Agent</p>
          </div>
          <div className="w-16 h-16 rounded-none bg-[#0066B1]/10 border border-[#0066B1]/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#0066B1]" />
          </div>
        </div>
      </div>

      {/* Rationale + Trade-off */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-3">Rationale</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{decision.rationale}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-3">Trade-Off Analysis</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{decision.trade_off}</p>
        </div>
      </div>

      {/* Risk Heatmap */}
      {decision.risks.length > 0 && (
        <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-4">Risk Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {decision.risks.map((risk: WebhookRisk, i: number) => {
              const sc = severityColor(risk.severity);
              return (
                <div key={i} className={`${sc.bg} border ${sc.border} rounded-none p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 ${sc.dot} rounded-none`}></span>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${sc.text}`}>{risk.severity}</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{risk.risk_type}</p>
                  <p className="text-[11px] text-muted-foreground">{risk.mitigation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Alternatives */}
      {decision.alternatives.length > 0 && (
        <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-4 flex items-center gap-2">
            <Users className="w-3 h-3" /> Alternative Candidates
          </h3>
          <div className="space-y-3">
            {decision.alternatives.map((alt, i) => (
              <div key={i} className="flex items-start gap-4 p-3 bg-[#111111] border border-[#222222] rounded-none">
                <div className="w-8 h-8 rounded-none bg-[#222222] border border-[#333333] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {i + 2}
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{alt.candidate_name}</p>
                  <p className="text-[11px] text-muted-foreground">{alt.brief_rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
