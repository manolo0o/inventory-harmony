import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardKPICards } from "@/components/DashboardKPICards";
import { DashboardInventoryTable } from "@/components/DashboardInventoryTable";
import { ProductFormModal } from "@/components/ProductFormModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useInventory, type InventoryItem } from "@/hooks/useInventory";

export default function Dashboard() {
  const { items, loading, addItem, updateItem, deleteItem } = useInventory();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editItem) {
      return await updateItem(editItem.id, data);
    }
    return await addItem(data);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteItem(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onAddProduct={() => { setEditItem(null); setFormOpen(true); }} />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <DashboardKPICards items={items} />
          <DashboardInventoryTable
            items={items}
            loading={loading}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        </main>
      </div>

      <ProductFormModal
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditItem(null); }}
        onSubmit={handleFormSubmit}
        editItem={editItem}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        productName={deleteTarget?.product_name || ""}
      />
    </div>
  );
}
