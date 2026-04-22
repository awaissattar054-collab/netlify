import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, ShieldAlert, Leaf, Scale, Activity, Trash2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Layout } from "@/components/layout";
import { ScanInput } from "@/components/scan-input";

const API = "";

function useGetScansSummary() {
  return useQuery({ queryKey: ["scans-summary"], queryFn: () => fetch(`${API}/api/scans/summary`).then(r => r.json()) });
}
function useListScans() {
  return useQuery({ queryKey: ["scans"], queryFn: () => fetch(`${API}/api/scans`).then(r => r.json()) });
}
function useDeleteScan() {
  return useMutation({ mutationFn: ({ id }: { id: number }) => fetch(`${API}/api/scans/${id}`, { method: "DELETE" }).then(r => r.json()) });
}

export default function Home() {
  const queryClient = useQueryClient();
  const { data: summary, isLoading: loadingSummary } = useGetScansSummary();
  const { data: scans, isLoading: loadingScans } = useListScans();
  const deleteScan = useDeleteScan();

  const handleDelete = (id: number) => {
    deleteScan.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["scans"] });
        queryClient.invalidateQueries({ queryKey: ["scans-summary"] });
      }
    });
  };

  return (
    <Layout>
      <section className="relative py-24 flex flex-col items-center justify-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-8 text-xs font-mono tracking-widest text-primary border border-primary/20 bg-primary/5 uppercase">
            System Operational // Ready for Target
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl leading-tight">
            COMPLIANCE <span className="text-primary font-serif italic">INTELLIGENCE</span> PROTOCOL
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 font-mono">
            Analyze targets for legal vulnerabilities, privacy risks, and carbon emission footprint in real-time.
          </p>
          <ScanInput />
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="font-mono text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Activity className="w-5 h-5 text-primary" /> Global Metrics
            </h2>
            {loadingSummary ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : summary ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <StatCard title="Total Analyzed" value={summary.completedScans?.toString() ?? "0"} subtitle={`${summary.totalScans} targets identified`} />
                <StatCard title="Critical Vulnerabilities" value={summary.criticalFindings?.toString() ?? "0"} valueClass="text-destructive" subtitle="Immediate action required" />
                <div className="bg-card border border-border/50 p-6 flex flex-col gap-4">
                  <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider">Average Threat Scores</h3>
                  <div className="space-y-3">
                    <ScoreBar label="Legal" score={summary.avgLegalScore} icon={<Scale className="w-4 h-4" />} />
                    <ScoreBar label="Privacy" score={summary.avgPrivacyScore} icon={<ShieldAlert className="w-4 h-4" />} />
                    <ScoreBar label="Carbon" score={summary.avgCarbonScore} icon={<Leaf className="w-4 h-4" />} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
              <Shield className="w-5 h-5 text-primary" /> Target History
            </h2>
          </div>
          {loadingScans ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : !scans || scans.length === 0 ? (
            <div className="border border-border/50 border-dashed p-12 flex flex-col items-center justify-center text-center bg-card/30">
              <Shield className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="font-mono font-bold text-lg mb-2">No Targets Analyzed</h3>
              <p className="text-muted-foreground font-mono text-sm max-w-sm">
                Initialize a scan above to build compliance intelligence on your first target.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan: any) => (
                <div key={scan.id} className="group border border-border/50 bg-card hover:border-primary/50 transition-colors p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-12 ${scan.status === 'completed' ? 'bg-primary' : scan.status === 'failed' ? 'bg-destructive' : 'bg-yellow-500 animate-pulse'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/scan/${scan.id}`} className="font-mono font-bold text-lg hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-xs">
                          {scan.url}
                        </Link>
                        <span className="text-xs font-mono px-2 py-0.5 bg-muted text-muted-foreground uppercase border border-border">
                          {scan.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {format(new Date(scan.createdAt), "MMM d, yyyy HH:mm:ss")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {scan.status === 'completed' && scan.overallScore !== null && (
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Overall</span>
                        <span className={`font-mono font-bold text-xl ${scan.overallScore >= 80 ? 'text-emerald-500' : scan.overallScore >= 60 ? 'text-yellow-500' : 'text-destructive'}`}>
                          {scan.overallScore}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/scan/${scan.id}`}><ArrowRight className="w-4 h-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(scan.id)} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, subtitle, valueClass = "text-foreground" }: { title: string, value: string, subtitle?: string, valueClass?: string }) {
  return (
    <div className="bg-card border border-border/50 p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors">
      <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-4">{title}</h3>
      <div>
        <div className={`text-4xl font-bold font-mono tracking-tighter mb-1 ${valueClass}`}>{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground font-mono">{subtitle}</div>}
      </div>
    </div>
  );
}

function ScoreBar({ label, score, icon }: { label: string, score: number | null, icon: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono items-center">
        <span className="flex items-center gap-1.5 text-muted-foreground">{icon} {label}</span>
        <span className="font-bold">{score !== null ? score : '--'}</span>
      </div>
      <div className="h-1.5 bg-muted w-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${score ?? 0}%` }} />
      </div>
    </div>
  );
}
