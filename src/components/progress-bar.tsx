import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  animated?: boolean;
  delay?: number;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  barClassName,
  animated = true,
  delay = 0
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full bg-zinc-800 rounded-full h-2 overflow-hidden", className)}>
      {animated ? (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8, 
            delay,
            ease: "easeOut"
          }}
          className={cn(
            "h-full rounded-full transition-colors duration-300",
            barClassName || "bg-gradient-to-r from-indigo-500 to-purple-500"
          )}
        />
      ) : (
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            barClassName || "bg-gradient-to-r from-indigo-500 to-purple-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      )}
    </div>
  );
} 