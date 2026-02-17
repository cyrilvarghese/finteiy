interface ActionCardProps {
  emoji: string;
  title: string;
  description: string;
  cashImpact: number; // positive for earning, negative for spending, 0 for skip
}

export function ActionCard({ emoji, title, description, cashImpact }: ActionCardProps) {
  // Determine badge color based on impact
  const getBadgeStyle = () => {
    if (cashImpact > 0) {
      // Earning money - green
      return {
        background: "rgba(34,197,94,0.1)",
        color: "#22c55e",
        border: "1px solid rgba(34,197,94,0.2)",
      };
    } else if (cashImpact < 0) {
      // Spending money
      const isFullCost = cashImpact <= -10; // Adjust threshold as needed
      if (isFullCost) {
        // Full cost - red
        return {
          background: "rgba(239,68,68,0.1)",
          color: "#ef4444",
          border: "1px solid rgba(239,68,68,0.2)",
        };
      } else {
        // Half cost - amber
        return {
          background: "rgba(251,191,36,0.1)",
          color: "#fbbf24",
          border: "1px solid rgba(251,191,36,0.2)",
        };
      }
    } else {
      // Skip - neutral gray
      return {
        background: "rgba(148,163,184,0.1)",
        color: "#94a3b8",
        border: "1px solid rgba(148,163,184,0.2)",
      };
    }
  };

  const formatCash = (amount: number) => {
    if (amount > 0) return `+$${amount}`;
    if (amount < 0) return `-$${Math.abs(amount)}`;
    return "$0";
  };

  return (
    <div
      className="rounded-xl px-4 py-3.5 text-left"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="text-lg">{emoji}</div>
        <div className="text-[14px] font-bold text-text-primary font-sora">{title}</div>
        <div
          className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold font-space-mono"
          style={getBadgeStyle()}
        >
          {formatCash(cashImpact)}
        </div>
      </div>
      <div className="text-[11px] text-text-muted leading-relaxed">{description}</div>
    </div>
  );
}
