"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DashboardCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: "default" | "gold" | "dark" | "cyan";
  defaultOpen?: boolean;
}

interface VariantStyle {
  background: string;
  border: string;
  radius: string;
  boxShadow?: string;
  iconBg?: string;
  iconBorder?: string;
}

const VARIANTS: Record<string, VariantStyle> = {
  default: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    radius: "rounded-xl",
  },
  gold: {
    background: "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,215,0,0.02))",
    border: "1.5px solid rgba(255,215,0,0.15)",
    boxShadow: "0 0 20px rgba(255,215,0,0.08)",
    radius: "rounded-2xl",
    iconBg: "linear-gradient(145deg, rgba(255,215,0,0.2), rgba(255,215,0,0.08))",
    iconBorder: "1px solid rgba(255,215,0,0.25)",
  },
  dark: {
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.06)",
    radius: "rounded-xl",
  },
  cyan: {
    background: "rgba(56,189,248,0.03)",
    border: "1px dashed rgba(56,189,248,0.15)",
    radius: "rounded-xl",
  },
};

export function DashboardCard({
  icon,
  title,
  subtitle,
  children,
  variant = "default",
  defaultOpen = true,
}: DashboardCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const style = VARIANTS[variant];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={`${style.radius} px-5 py-4`}
        style={{
          background: style.background,
          border: style.border,
          ...(style.boxShadow && { boxShadow: style.boxShadow }),
        }}
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {variant === "gold" ? (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: style.iconBg,
                    border: style.iconBorder,
                  }}
                >
                  <span className="text-xl">{icon}</span>
                </div>
              ) : (
                <span className="text-xl">{icon}</span>
              )}
              <div className="text-left">
                <h2 className="text-[15px] font-bold font-sora text-text-primary">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-[10px] text-text-muted leading-snug">{subtitle}</p>
                )}
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-4">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
