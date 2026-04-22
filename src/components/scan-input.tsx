import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function useCreateScan() {
  return useMutation({
    mutationFn: (data: { data: { url: string } }) =>
      fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.data),
      }).then((r) => r.json()),
  });
}

export function ScanInput() {
  const [url, setUrl] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createScan = useCreateScan();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }
    createScan.mutate({ data: { url: targetUrl } }, {
      onSuccess: (data) => {
        setLocation(`/scan/${data.id}`);
      },
      onError: (err: any) => {
        toast({
          title: "Scan Initialization Failed",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
      <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
      <div className="relative flex items-center bg-card border border-border/50 hover:border-primary/50 transition-colors p-1 pl-4 h-16 shadow-2xl">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="ENTER DOMAIN TO ANALYZE (e.g. example.com)"
          className="flex-1 border-0 bg-transparent h-full text-lg font-mono placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={createScan.isPending}
        />
        <Button
          type="submit"
          size="lg"
          disabled={!url || createScan.isPending}
          className="h-full rounded-none px-8 font-mono tracking-wider font-bold"
        >
          {createScan.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>INITIATE SCAN <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </form>
  );
}
