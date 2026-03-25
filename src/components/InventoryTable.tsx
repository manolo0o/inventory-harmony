import { Eye, Pencil, RotateCcw, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const products = [
  { name: "ThinkPad Laptop X1", sku: "TPX1-2024", category: "Electronics", warehouse: "Main NY", price: "$1,450", qty: 45, status: "In Stock" },
  { name: 'Samsung Monitor 27"', sku: "SM27-2024", category: "Electronics", warehouse: "West LA", price: "$389", qty: 122, status: "In Stock" },
  { name: "Ergonomic Office Chair", sku: "EOC-3310", category: "Furniture", warehouse: "Main NY", price: "$275", qty: 8, status: "Low Stock" },
  { name: "Wireless Keyboard K380", sku: "WK380-LG", category: "Peripherals", warehouse: "South TX", price: "$49", qty: 0, status: "Out of Stock" },
  { name: "USB-C Hub Adapter", sku: "USBC-7P1", category: "Accessories", warehouse: "Main NY", price: "$34", qty: 210, status: "In Stock" },
  { name: "Standing Desk Pro", sku: "SDP-6072", category: "Furniture", warehouse: "West LA", price: "$699", qty: 15, status: "In Stock" },
  { name: "Noise-Cancel Headset", sku: "NCH-WH10", category: "Audio", warehouse: "South TX", price: "$199", qty: 3, status: "Low Stock" },
  { name: "LED Desk Lamp", sku: "LDL-A200", category: "Lighting", warehouse: "Main NY", price: "$45", qty: 87, status: "In Stock" },
];

const statusStyles: Record<string, string> = {
  "In Stock": "bg-success/10 text-success border-success/20",
  "Low Stock": "bg-warning/10 text-warning border-warning/20",
  "Out of Stock": "bg-destructive/10 text-destructive border-destructive/20",
};

export function InventoryTable() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Current Inventory List</h2>
        <span className="text-xs text-muted-foreground">Showing 1-8 of 2,847 items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["", "Product Name", "SKU", "Category", "Warehouse", "Unit Price", "Qty", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.sku} className={cn("border-b border-border last:border-0 hover:bg-accent/50 transition-colors", i % 2 === 1 && "bg-muted/30")}>
                <td className="px-4 py-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {p.name.charAt(0)}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.warehouse}</td>
                <td className="px-4 py-3 font-medium text-foreground">{p.price}</td>
                <td className="px-4 py-3">
                  <span className={cn("font-semibold", p.qty === 0 ? "text-destructive" : p.qty < 10 ? "text-warning" : "text-success")}>
                    {p.qty}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={cn("text-xs font-medium", statusStyles[p.status])}>
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[Eye, Pencil, RotateCcw, Trash2].map((Icon, idx) => (
                      <button
                        key={idx}
                        className={cn(
                          "p-1.5 rounded-md hover:bg-accent transition-colors",
                          idx === 3 ? "text-destructive/70 hover:text-destructive" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Page 1 of 50</p>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md text-muted-foreground hover:bg-accent transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3, "...", 50].map((p, i) => (
            <button
              key={i}
              className={cn(
                "h-8 min-w-[32px] px-2 rounded-md text-xs font-medium transition-colors",
                p === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              {p}
            </button>
          ))}
          <button className="p-1.5 rounded-md text-muted-foreground hover:bg-accent transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
