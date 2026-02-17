"use client";

type ActionType = "join" | "split" | "skip" | "earn";

interface ActionButtonProps {
  action: ActionType;
  cost?: number;
  disabled?: boolean;
  onClick?: () => void;
}

const ACTION_CONFIG: Record<
  ActionType,
  {
    icon: string;
    labelFn: (cost: number) => string;
    border: string;
    bg: string;
    bg2: string;
    color: string;
    needsEnergy: boolean;
  }
> = {
  join: {
    icon: "\u2713",
    labelFn: (cost) => `Join -$${cost}`,
    border: "rgba(239,68,68,0.2)",
    bg: "rgba(239,68,68,0.08)",
    bg2: "rgba(239,68,68,0.03)",
    color: "#fca5a5",
    needsEnergy: true,
  },
  split: {
    icon: "\u26A1",
    labelFn: (cost) => `Split -$${Math.ceil(cost / 2)}`,
    border: "rgba(251,146,60,0.2)",
    bg: "rgba(251,146,60,0.08)",
    bg2: "rgba(251,146,60,0.03)",
    color: "#fed7aa",
    needsEnergy: true,
  },
  skip: {
    icon: "\u2715",
    labelFn: () => "Skip $0",
    border: "rgba(34,197,94,0.2)",
    bg: "rgba(34,197,94,0.08)",
    bg2: "rgba(34,197,94,0.03)",
    color: "#86efac",
    needsEnergy: false,
  },
  earn: {
    icon: "\u{1F4B0}",
    labelFn: () => "Earn First",
    border: "rgba(250,204,21,0.2)",
    bg: "rgba(250,204,21,0.08)",
    bg2: "rgba(250,204,21,0.03)",
    color: "#fde68a",
    needsEnergy: true,
  },
};

export function ActionButton({ action, cost = 0, disabled = false, onClick }: ActionButtonProps) {
  const cfg = ACTION_CONFIG[action];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-game rounded-xl text-[13px] font-bold font-dm-sans cursor-pointer transition-all duration-200 py-3.5 px-2"
      style={{
        border: `1px solid ${cfg.border}`,
        background: `linear-gradient(135deg, ${cfg.bg}, ${cfg.bg2})`,
        color: cfg.color,
        opacity: disabled ? 0.3 : 1,
      }}
    >
      <div className="text-xl mb-0.5">{cfg.icon}</div>
      {cfg.labelFn(cost)}
    </button>
  );
}
