import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { ShieldAlert, Scale, Leaf, AlertTriangle, ArrowLeft, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ScoreRing } from "@/components/score-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

function useGetScan(id: number) {
  return useQuery({
    queryKey: ["scan", id],
    queryFn: () => fetch(`/api/scans/${id}`).then((r) => r.json()),
    enabled: !!id,
    refetchInterval: (query: any) => {
      const status = query.state.data?.status;
      return status === "pending" || status === "analyzing" ? 2000 : false;
    },
  });
}

export default function ScanView() {
  const [, params] = useRoute("/scan/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const { data: scan, isLoading, isError } = useGetScan(id);

  const isAnalyzing = scan?.status === "pending" || scan?.status === "analyzing";
  const isFailed = scan?.status === "failed";

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
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2
