import { Package, AlertTriangle, XCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const kpis = [
  {
    label: "Total Items",
    value: "2,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: Package,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    label: "Low Stock Alerts",
    value: "23",
    change: "+3 today",
    trend: "down" as const,
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    label: "Out of Stock",
    value: "8",
    change: "-2 this week",
    trend: "up" as const,
    icon: XCircle,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    label: "Active Suppliers",
    value: "64",
    change: "+5 this month",
    trend: "up" as const,
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

function Sparkline({ trend }: { trend: "up" | "down" }) {
  const points =
    trend === "up"
      ? "0,20 10,18 20,15 30,16 40,12 50,10 60,6 70,4"
      : "0,6 10,8 20,10 30,9 40,14 50,16 60,18 70,20";
  const color = trend === "up" ? "hsl(var(--success))" : "hsl(var(--destructive))";
  return (
    <svg width="72" height="24" viewBox="0 0 72 24" className="mt-1">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

export function KPICards() {
  return (
    <div className="grid grid-cols-4 gap-5">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{kpi.label}</p>
              <p className={cn("text-3xl font-bold mt-1", kpi.color)}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{kpi.change}</p>
            </div>
            <div className={cn("p-2.5 rounded-lg", kpi.bgColor)}>
              <kpi.icon className={cn("h-5 w-5", kpi.color)} />
            </div>
          </div>
          <Sparkline trend={kpi.trend} />
        </div>
      ))}
    </div>
  );
}
