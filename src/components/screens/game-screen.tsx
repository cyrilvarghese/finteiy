"use client";

import { useGameEngine } from "@/hooks/use-game-engine";
import { GameHeader } from "@/components/game-header";
import { GoalProgressBar } from "@/components/goal-progress-bar";
import { MeterBar } from "@/components/meter-bar";
import { EnergyDots } from "@/components/energy-dots";
import { BorrowWarning } from "@/components/borrow-warning";
import { InviteCard } from "@/components/invite-card";
import { SurpriseEvent } from "@/components/surprise-event";
import { Callout } from "@/components/callout";
import { ActionButton } from "@/components/action-button";
import { GameOverOverlay } from "@/components/game-over-overlay";
import { type Goal, type GameState, clamp } from "@/lib/constants";

interface GameScreenProps {
  goal: Goal;
  onEnd: (state: GameState) => void;
}

export function GameScreen({ goal, onEnd }: GameScreenProps) {
  const { state, handleAction } = useGameEngine(goal, onEnd);
  const inv = state.currentInvite;
  const goalPct = clamp((state.cash / goal.amount) * 100, 0, 100);

  return (
    <div className="min-h-screen font-dm-sans">
      <div className="px-4 pt-4 max-w-game mx-auto">
        {/* Header: DAY + borrow badge + goal */}
        <GameHeader
          day={state.day}
          borrowCount={state.borrowCount}
          showBorrowWarning={state.showBorrowWarning}
          goal={goal}
        />

        {/* Goal progress bar */}
        <div className="mb-4">
          <GoalProgressBar
            name={goal.name}
            cash={Math.max(0, state.cash)}
            goalAmount={goal.amount}
            color={goal.color}
          />
        </div>

        {/* 2x2 meters grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <MeterBar
            label="Cash"
            value={state.cash}
            max={goal.amount}
            color="#22c55e"
            icon={"\u{1F4B5}"}
            prefix="$"
          />
          <EnergyDots energy={state.energy} />
          <MeterBar
            label="Social"
            value={state.social}
            max={100}
            color="#38bdf8"
            icon={"\u{1F465}"}
          />
          <MeterBar
            label="Goal"
            value={Math.max(0, state.cash)}
            max={goal.amount}
            color={goal.color}
            icon={"\u{1F3AF}"}
            prefix="$"
          />
        </div>
      </div>

      {/* Borrow warning banner */}
      <BorrowWarning visible={state.showBorrowWarning} />

      <div className="px-4 max-w-game mx-auto">
        {/* Current invite */}
        {inv && !state.gameOver && (
          <div
            className="mb-3 transition-all duration-300"
            style={{
              opacity: state.animatingAction ? 0.5 : 1,
              transform: state.animatingAction ? "scale(0.97)" : "scale(1)",
            }}
          >
            <InviteCard invite={inv} cash={state.cash} />
          </div>
        )}

        {/* Surprise event */}
        {state.surprise && !state.gameOver && (
          <div className="mb-3">
            <SurpriseEvent event={state.surprise} />
          </div>
        )}

        {/* Educational callout */}
        {state.callout && !state.gameOver && (
          <div className="mb-4">
            <Callout text={state.callout} />
          </div>
        )}

        {/* Action buttons */}
        {!state.gameOver && (
          <div className="grid grid-cols-2 gap-2.5 pb-6">
            <ActionButton
              action="join"
              cost={inv?.cost || 0}
              disabled={state.energy < 1 || !inv}
              onClick={() => handleAction("join")}
            />
            <ActionButton
              action="split"
              cost={inv?.cost || 0}
              disabled={state.energy < 1 || !inv}
              onClick={() => handleAction("split")}
            />
            <ActionButton
              action="skip"
              disabled={!inv}
              onClick={() => handleAction("skip")}
            />
            <ActionButton
              action="earn"
              disabled={state.energy < 1 || !inv}
              onClick={() => handleAction("earn")}
            />
          </div>
        )}

        {/* Game over overlay */}
        {state.gameOver && <GameOverOverlay won={state.won} />}
      </div>
    </div>
  );
}
