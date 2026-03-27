import { Scenario, ScenarioConfig } from "@/lib/types";
import { scenarios } from "@/lib/data";
import { motion } from "framer-motion";

interface ScenarioToggleProps {
  active: Scenario;
  onChange: (scenario: Scenario) => void;
}

export function ScenarioToggle({ active, onChange }: ScenarioToggleProps) {
  return (
    <div className="bmw-card p-2" role="radiogroup" aria-label="Business Scenario">
      <div className="flex gap-1">
        {scenarios.map((s: ScenarioConfig) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(s.id)}
              className={`relative flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="scenario-indicator"
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span aria-hidden="true">{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
