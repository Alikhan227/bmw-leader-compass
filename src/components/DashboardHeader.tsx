import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  onLogout?: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          {onLogout && (
            <Button variant="ghost" size="icon" onClick={onLogout} className="mr-2 h-8 w-8 hover:bg-muted/50" aria-label="Back to Hub">
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Button>
          )}
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center p-0.5 pointer-events-none">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW" className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">
              Decision Intelligence
            </h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">
              BMW Leadership Selection · Multi-Agent System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link to="/hr-admin" className="font-bold uppercase tracking-widest text-[#0066B1] hover:text-[#005596] transition-colors">
            HR Admin
          </Link>
          <div className="border border-bmw-success/30 bg-bmw-success/10 px-2 py-1 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-bmw-success font-bold uppercase tracking-widest text-[10px]">
              <span className="w-1.5 h-1.5 bg-bmw-success rounded-none" />
              System Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
