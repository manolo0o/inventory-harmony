import { AppSidebar } from "@/components/AppSidebar";
import { DashboardKPICards } from "@/components/DashboardKPICards";
import { InventoryCharts } from "@/components/InventoryCharts";
import { useInventory } from "@/hooks/useInventory";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const { items } = useInventory();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "??";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="text-sm text-foreground font-medium">Dashboard</div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 pl-2 border-l border-border">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground max-w-[150px] truncate">
                    {user?.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <DashboardKPICards items={items} />
          <InventoryCharts items={items} />
        </main>
      </div>
    </div>
  );
}
