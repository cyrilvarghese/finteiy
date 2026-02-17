"use client";

interface EnergyDotsProps {
  energy: number;
}

export function EnergyDots({ energy }: EnergyDotsProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-secondary tracking-[0.05em] font-dm-sans">
          {"\u26A1"} Energy
        </span>
        <span className="text-[13px] font-bold text-energy font-space-mono">
          {energy}/3
        </span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 rounded-[3px] transition-colors duration-300"
            style={{
              width: 28,
              background:
                i < energy
                  ? "linear-gradient(90deg, #facc15, #f59e0b)"
                  : "rgba(255,255,255,0.06)",
              boxShadow: i < energy ? "0 0 6px #facc1555" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
