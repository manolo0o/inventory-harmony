import { Search, Bell, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopBar() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Inventory</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">Product List</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search SKU, Product Name..."
            className="h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">AR</AvatarFallback>
          </Avatar>
          <div className="text-sm leading-tight">
            <p className="font-medium text-foreground">Alex R.</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>

        {/* Add Product */}
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>
    </header>
  );
}
