import React from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
}

export function ScoreRing({ 
  score, 
  size = 120, 
  strokeWidth = 8, 
  className,
  animate = true
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedScore = score ?? 0;
  const offset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = "text-primary";
  if (score !== null) {
    if (score >= 80) colorClass = "text-emerald-500";
    else if (score >= 60) colorClass = "text-yellow-500";
    else colorClass = "text-destructive";
  } else {
    colorClass = "text-muted";
  }

  return (
    <div 
      className={cn("relative flex items-center justify-center font-mono", className)} 
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/30"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={score === null ? 0 : offset}
          strokeLinecap="square"
          className={cn(
            colorClass, 
            animate && "transition-all duration-1000 ease-out"
          )}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {score !== null ? (
          <>
            <span className="text-3xl font-bold tracking-tighter">{score}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Score</span>
          </>
        ) : (
          <span className="text-lg text-muted-foreground">--</span>
        )}
      </div>
    </div>
  );
}
