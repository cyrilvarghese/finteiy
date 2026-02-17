"use client";

import { CollectibleCard } from "@/components/collectible-card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Collectible } from "@/lib/constants";

interface StashSheetProps {
  collection: Collectible[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StashSheet({ collection, open, onOpenChange }: StashSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl"
      >
        {/* Drag handle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />

        <SheetHeader className="pt-4">
          <SheetTitle className="text-[22px] font-extrabold font-sora text-text-primary text-center">
            🎁 Your Stash
          </SheetTitle>
          <p className="text-[13px] text-text-muted text-center">
            {collection.length} card{collection.length !== 1 ? "s" : ""} collected • Tap to flip!
          </p>
        </SheetHeader>

        <div className="mt-6 overflow-y-auto h-[calc(85vh-120px)] px-2">
          {collection.length === 0 ? (
            <div className="text-center py-16 px-5">
              <div className="text-6xl mb-4 opacity-30">🏆</div>
              <div className="text-[18px] font-semibold text-text-secondary font-sora mb-2">
                No cards yet
              </div>
              <p className="text-[14px] text-text-muted leading-relaxed">
                Achieve goals to unlock collectible cards!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-8">
              {collection.map((item, i) => (
                <CollectibleCard key={i} item={item} index={i} flippable />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
