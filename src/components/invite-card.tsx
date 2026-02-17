"use client";

import type { Invite } from "@/lib/constants";

interface InviteCardProps {
  invite: Invite;
  cash?: number;
}

export function InviteCard({ invite, cash = Infinity }: InviteCardProps) {
  const willBorrowJoin = cash < invite.cost;
  const willBorrowSplit = cash < Math.ceil(invite.cost / 2);

  return (
    <div className="rounded-2xl p-5 transition-all duration-300 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-[0.1em] font-space-mono mb-1">
            {invite.type === "hangout" ? "\u{1F389} Invite" : "\u{1F6CD}\uFE0F Buy"}
          </div>
          <h2 className="text-lg font-bold text-text-primary m-0 font-sora">
            {invite.title}
          </h2>
        </div>
        <div className="text-lg font-bold text-danger font-space-mono bg-danger/10 px-2.5 py-1 rounded-lg">
          -${invite.cost}
        </div>
      </div>

      <p className="text-[13px] text-text-secondary m-0 leading-relaxed">
        {invite.desc}
      </p>

      {(willBorrowJoin || willBorrowSplit) && (
        <div className="flex gap-2 flex-wrap mt-2.5">
          {willBorrowJoin && (
            <span className="text-[10px] text-danger bg-danger/10 px-1.5 py-0.5 rounded font-space-mono">
              {"\u{1F4B3}"} Join triggers borrow
            </span>
          )}
          {willBorrowSplit && (
            <span className="text-[10px] text-split bg-split/10 px-1.5 py-0.5 rounded font-space-mono">
              {"\u{1F4B3}"} Split triggers borrow
            </span>
          )}
        </div>
      )}
    </div>
  );
}
