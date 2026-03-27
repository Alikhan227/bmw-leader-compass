export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">B</span>
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bmw-success/15 text-bmw-success font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-bmw-success" />
            Agents Online
          </span>
        </div>
      </div>
    </header>
  );
}
