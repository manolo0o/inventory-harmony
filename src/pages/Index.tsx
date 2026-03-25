import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { KPICards } from "@/components/KPICards";
import { InventoryTable } from "@/components/InventoryTable";

const Index = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <KPICards />
          <InventoryTable />
        </main>
      </div>
    </div>
  );
};

export default Index;
