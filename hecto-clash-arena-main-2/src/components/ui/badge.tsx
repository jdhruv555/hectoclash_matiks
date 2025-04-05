
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        game: "border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white animate-pulse-glow",
        achievement: "border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-400 animate-shimmer bg-[length:200%_100%]",
        level: "border-2 border-green-500/30 bg-gradient-to-r from-green-500/20 to-emerald-400/20 text-green-400 animate-bounce-subtle",
        streak: "border-2 border-red-500/30 bg-gradient-to-r from-red-500/20 to-orange-400/20 text-red-400 animate-pulse-glow",
        rare: "border-2 border-blue-400/30 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 text-blue-400",
        epic: "border-2 border-purple-400/30 bg-gradient-to-r from-purple-600/20 to-pink-400/20 text-purple-400",
        legendary: "border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-400 animate-shimmer bg-[length:200%_100%]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
