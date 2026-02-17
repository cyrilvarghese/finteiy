"use client";

interface BorrowWarningProps {
  visible: boolean;
}

export function BorrowWarning({ visible }: BorrowWarningProps) {
  if (!visible) return null;

  return (
    <div
      className="mx-4 mb-3 max-w-[388px] mx-auto px-3.5 py-2.5 rounded-lg text-[13px] text-red-300 text-center font-semibold"
      style={{
        background: "linear-gradient(90deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))",
        border: "1px solid rgba(239,68,68,0.2)",
      }}
    >
      {"\u{1F6A8}"} One more borrow and it&apos;s GAME OVER!
    </div>
  );
}
