import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Package, label: "Inventory" },
  { icon: Truck, label: "Suppliers" },
  { icon: ShoppingCart, label: "Orders" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  return (
    <aside className="w-[220px] min-h-screen bg-sidebar-bg flex flex-col shrink-0">
      <div className="px-5 py-6">
        <h1 className="text-lg font-bold tracking-tight text-white">
          <Package className="inline-block mr-2 h-5 w-5" />
          InvenTrack
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-sidebar-active text-white"
                : "text-sidebar-fg hover:bg-sidebar-hover hover:text-white"
            )}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-fg hover:bg-sidebar-hover hover:text-white transition-colors">
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
