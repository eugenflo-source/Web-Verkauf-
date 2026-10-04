import type { VisualKind } from "@/data/products";
import {
  AutomationScreen,
  CalculatorScreen,
  DashboardScreen,
  KanbanScreen,
  LandingScreen,
  PlannerScreen,
  PromptsScreen,
  RateScreen,
  WebsiteScreen,
} from "./screens";

const screens: Record<VisualKind, () => React.ReactElement> = {
  calculator: () => <CalculatorScreen />,
  planner: () => <PlannerScreen />,
  website: () => <WebsiteScreen />,
  landing: () => <LandingScreen />,
  dashboard: () => <DashboardScreen />,
  prompts: () => <PromptsScreen />,
  automation: () => <AutomationScreen />,
  kanban: () => <KanbanScreen />,
  rate: () => <RateScreen />,
};

/** Ein Screen in fester Proportion, skaliert über Container-Einheiten. */
export function Screen({ kind, className = "" }: { kind: VisualKind; className?: string }) {
  const Render = screens[kind];
  return (
    <div className={`mock aspect-[16/10] ${className}`}>
      <div className="mock-canvas h-full">
        <Render />
      </div>
    </div>
  );
}

type StageProps = {
  kind: VisualKind;
  label: string;
  mode?: "card" | "detail" | "zoom" | "mobile";
  className?: string;
};

/**
 * Produktbühne: dunkle Fläche mit dezentem Licht, darauf das Interface-Mockup.
 * Ersetzt austauschbare Stockfotos durch produktbezogene Vorschauen.
 */
export function ProductVisual({ kind, label, mode = "card", className = "" }: StageProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative isolate overflow-hidden bg-ink-850 ${mode === "card" ? "aspect-[4/3]" : "aspect-[16/11]"} ${className}`}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_70%_0%,rgba(111,220,255,0.14),transparent_70%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

      {mode === "card" && (
        <div className="absolute left-[9%] top-[13%] w-[112%] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-x-[2%] group-hover:-translate-y-[2%]">
          <Screen kind={kind} />
        </div>
      )}

      {mode === "detail" && (
        <div className="absolute inset-[7%] flex items-center">
          <Screen kind={kind} className="w-full" />
        </div>
      )}

      {mode === "zoom" && (
        <div className="absolute left-[-12%] top-[-6%] w-[170%]">
          <Screen kind={kind} />
        </div>
      )}

      {mode === "mobile" && (
        <div className="absolute inset-y-[6%] left-1/2 aspect-[9/19] -translate-x-1/2 rounded-[1.6rem] border border-white/15 bg-ink-950 p-[2.5%] shadow-2xl">
          <div className="mock h-full overflow-hidden rounded-[1.25rem]">
            <div className="mock-canvas h-full !text-[4.6cqw]">
              <WebsiteScreen compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
