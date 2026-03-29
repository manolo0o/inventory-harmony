import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { InventoryItem } from "@/hooks/useInventory";

interface Props {
  items: InventoryItem[];
}

const COLORS = [
  "hsl(152, 55%, 45%)",
  "hsl(215, 60%, 55%)",
  "hsl(30, 90%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(270, 50%, 55%)",
  "hsl(180, 50%, 45%)",
  "hsl(340, 60%, 55%)",
  "hsl(50, 80%, 50%)",
];

export function InventoryCharts({ items }: Props) {
  // Stock by category — show ALL categories
  const categoryData = useMemo(() => {
    const map = new Map<string, { count: number; totalQty: number; totalValue: number }>();
    items.forEach((item) => {
      const cat = item.category || "Uncategorized";
      const existing = map.get(cat) || { count: 0, totalQty: 0, totalValue: 0 };
      existing.count += 1;
      existing.totalQty += item.quantity;
      existing.totalValue += item.quantity * item.unit_price;
      map.set(cat, existing);
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [items]);

  // Stock status distribution
  const statusData = useMemo(() => {
    let inStock = 0, lowStock = 0, outOfStock = 0;
    items.forEach((item) => {
      if (item.quantity === 0) outOfStock++;
      else if (item.quantity < 10) lowStock++;
      else inStock++;
    });
    return [
      { name: "In Stock", value: inStock, color: "hsl(152, 55%, 45%)" },
      { name: "Low Stock", value: lowStock, color: "hsl(30, 90%, 55%)" },
      { name: "Out of Stock", value: outOfStock, color: "hsl(0, 72%, 55%)" },
    ].filter((d) => d.value > 0);
  }, [items]);

  // Top 10 products by stock value
  const topProducts = useMemo(() => {
    return [...items]
      .map((i) => ({ name: i.product_name.length > 16 ? i.product_name.slice(0, 16) + "…" : i.product_name, value: i.quantity * i.unit_price }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
        No inventory data to display charts. Add some products first.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Stock Value by Category */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Stock Value by Category</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(215, 10%, 52%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(215, 10%, 52%)" }} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Stock Value"]}
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(215, 20%, 90%)", fontSize: "13px" }}
            />
            <Bar dataKey="totalValue" radius={[6, 6, 0, 0]}>
              {categoryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Status Distribution */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Stock Status Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(215, 20%, 90%)", fontSize: "13px" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products by Stock Value */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm lg:col-span-2">
        <h3 className="text-sm font-semibold text-foreground mb-4">Top 10 Products by Stock Value</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(215, 10%, 52%)" }} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: "hsl(215, 10%, 52%)" }} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Stock Value"]}
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(215, 20%, 90%)", fontSize: "13px" }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="hsl(215, 60%, 55%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
