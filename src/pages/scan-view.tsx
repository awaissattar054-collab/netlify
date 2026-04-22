import { useEffect } from "react";
import { useRoute } from "wouter";
import { useGetScan, getGetScanQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { ShieldAlert, Scale, Leaf, AlertTriangle, ArrowLeft, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ScoreRing } from "@/components/score-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function ScanView() {
  const [, params] = useRoute("/scan/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const queryClient = useQueryClient();

  const { data: scan, isLoading, isError } = useGetScan(id, {
    query: {
      enabled: !!id,
      queryKey: getGetScanQueryKey(id),
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return status === "pending" || status === "analyzing" ? 2000 : false;
      }
    }
  });

  const isAnalyzing = scan?.status === "pending" || scan?.status === "analyzing";
  const isFailed = scan?.status === "failed";

  const handlePrint = () => {
    window.print();
  };

  if (isLoading && !scan) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="font-mono text-muted-foreground uppercase tracking-widest">Establishing Connection...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !scan) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-mono mb-4 uppercase">Target Not Found</h1>
          <p className="text-muted-foreground font-mono mb-8">The requested intelligence report does not exist or access was denied.</p>
          <Button asChild variant="outline">
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Return to Base</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (isFailed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 max-w-2xl">
          <div className="border border-destructive/50 bg-destructive/10 p-8 flex flex-col items-center text-center">
            <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold font-mono uppercase text-destructive mb-2">Analysis Failed</h1>
            <p className="text-muted-foreground font-mono mb-6">{scan.errorMessage || "Unknown error occurred during analysis."}</p>
            <div className="font-mono text-xs text-muted-foreground mb-8 bg-black/50 p-4 border border-border/50 w-full text-left break-all">
              TARGET: {scan.url}
            </div>
            <Button asChild variant="outline">
              <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Return to Base</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isAnalyzing) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
            {/* Radar scanner effect */}
            <div className="absolute inset-0 border border-primary/30 rounded-full" />
            <div className="absolute inset-[10%] border border-primary/20 rounded-full" />
            <div className="absolute inset-[20%] border border-primary/10 rounded-full" />
            <div className="absolute inset-0 radar-sweep" />
            
            {/* Target indicator */}
            <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" />
            
            <ShieldAlert className="w-12 h-12 text-primary absolute z-10 opacity-50" />
          </div>
          
          <h2 className="text-2xl font-bold font-mono uppercase tracking-widest text-primary mb-2">Analyzing Target</h2>
          <p className="font-mono text-muted-foreground mb-8 max-w-md text-center truncate px-4">
            {scan.url}
          </p>
          
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase">
              <span>Gemini AI Pipeline</span>
              <span className="animate-pulse">Processing</span>
            </div>
            <div className="h-1 bg-muted w-full overflow-hidden">
              <div className="h-full bg-primary w-full origin-left animate-[pulse_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Completed State
  const findings = scan.findings || [];
  const legalFindings = findings.filter(f => f.category === 'legal');
  const privacyFindings = findings.filter(f => f.category === 'privacy');
  const carbonFindings = findings.filter(f => f.category === 'carbon');

  return (
    <Layout>
      {/* Report Header */}
      <div className="border-b border-border/50 bg-muted/20 pb-8 pt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-xs uppercase tracking-widest mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Analysis Complete
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-mono tracking-tight mb-2 truncate max-w-3xl">
                {scan.url}
              </h1>
              <p className="text-muted-foreground font-mono text-sm">
                Generated: {format(new Date(scan.completedAt || scan.createdAt), "yyyy-MM-dd HH:mm:ss 'UTC'")}
              </p>
            </div>
            <div className="flex items-center gap-4 no-print">
              <Button asChild variant="outline" size="sm" className="font-mono">
                <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
              </Button>
              <Button onClick={handlePrint} size="sm" className="font-mono">
                <Printer className="w-4 h-4 mr-2" /> Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/50">
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Overall</span>
              <ScoreRing score={scan.overallScore} size={140} strokeWidth={8} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1.5"><Scale className="w-3 h-3" /> Legal</span>
              <ScoreRing score={scan.legalScore} size={100} strokeWidth={6} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> Privacy</span>
              <ScoreRing score={scan.privacyScore} size={100} strokeWidth={6} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1.5"><Leaf className="w-3 h-3" /> Carbon</span>
              <ScoreRing score={scan.carbonScore} size={100} strokeWidth={6} />
            </div>
          </div>
        </div>
      </div>

      {/* Report Body */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4 no-print">
            <h2 className="text-xl font-bold font-mono uppercase tracking-tight">Threat Vectors</h2>
            <TabsList className="bg-transparent border border-border h-auto p-1 rounded-none">
              <TabsTrigger value="all" className="rounded-none font-mono text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All ({findings.length})</TabsTrigger>
              <TabsTrigger value="legal" className="rounded-none font-mono text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Legal ({legalFindings.length})</TabsTrigger>
              <TabsTrigger value="privacy" className="rounded-none font-mono text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Privacy ({privacyFindings.length})</TabsTrigger>
              <TabsTrigger value="carbon" className="rounded-none font-mono text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Carbon ({carbonFindings.length})</TabsTrigger>
            </TabsList>
          </div>

          {/* Print only heading */}
          <h2 className="text-xl font-bold font-mono uppercase tracking-tight mb-6 hidden print:block border-b border-border pb-2">Detailed Findings</h2>

          <TabsContent value="all" className="m-0 space-y-6">
            <FindingsList findings={findings} />
          </TabsContent>
          <TabsContent value="legal" className="m-0 space-y-6">
            <FindingsList findings={legalFindings} />
          </TabsContent>
          <TabsContent value="privacy" className="m-0 space-y-6">
            <FindingsList findings={privacyFindings} />
          </TabsContent>
          <TabsContent value="carbon" className="m-0 space-y-6">
            <FindingsList findings={carbonFindings} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function FindingsList({ findings }: { findings: any[] }) {
  if (findings.length === 0) {
    return (
      <div className="border border-border/50 border-dashed p-12 text-center text-muted-foreground font-mono uppercase tracking-widest">
        No vulnerabilities detected in this category
      </div>
    );
  }

  // Sort by severity (critical first)
  const severityWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
  const sorted = [...findings].sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {sorted.map(finding => (
        <div key={finding.id} className="border border-border/50 bg-card p-6 relative overflow-hidden group hover:border-primary/30 transition-colors page-break-inside-avoid">
          {/* Severity colored left border */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${getSeverityColor(finding.severity)}`} />
          
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className={`font-mono text-xs uppercase px-2 py-0.5 font-bold ${getSeverityBadge(finding.severity)}`}>
                {finding.severity}
              </span>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest border border-border px-2 py-0.5">
                {finding.category}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold mb-3 font-mono leading-tight">{finding.title}</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Description</h4>
              <p className="text-sm text-foreground/90 leading-relaxed font-serif">{finding.description}</p>
            </div>
            {finding.recommendation && (
              <div className="bg-muted/30 border border-border/50 p-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> Recommended Action
                </h4>
                <p className="text-sm font-mono text-foreground/90 leading-relaxed">{finding.recommendation}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'bg-destructive';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-blue-500';
    default: return 'bg-slate-500';
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical': return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'high': return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
    case 'medium': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
    case 'low': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    default: return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
  }
}
