import { Package, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "@/hooks/useInventory";

interface Props {
  items: InventoryItem[];
}

export function DashboardKPICards({ items }: Props) {
  const totalProducts = items.length;
  const lowStock = items.filter((i) => i.quantity > 0 && i.quantity < 10).length;
  const outOfStock = items.filter((i) => i.quantity === 0).length;

  const kpis = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "text-primary", bgColor: "bg-primary/10" },
    { label: "Low Stock Alerts", value: lowStock, icon: AlertTriangle, color: "text-warning", bgColor: "bg-warning/10" },
    { label: "Out of Stock", value: outOfStock, icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{kpi.label}</p>
              <p className={cn("text-3xl font-bold mt-1", kpi.color)}>{kpi.value}</p>
            </div>
            <div className={cn("p-2.5 rounded-lg", kpi.bgColor)}>
              <kpi.icon className={cn("h-5 w-5", kpi.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
