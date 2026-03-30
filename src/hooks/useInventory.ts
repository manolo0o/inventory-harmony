import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface InventoryItem {
  id: string;
  user_id: string;
  product_name: string;
  sku: string;
  category: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryFormData {
  product_name: string;
  sku: string;
  category: string;
  unit_price: number;
  quantity: number;
  image_url?: string;
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching inventory", description: error.message, variant: "destructive" });
    } else {
      setItems(data as InventoryItem[]);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchItems]);

  const checkLowStock = async (record: { id: string; product_name: string; sku: string; quantity: number; user_id: string }) => {
    try {
      await supabase.functions.invoke("notify-low-stock", {
        body: { record },
      });
    } catch (err) {
      console.error("Low stock check failed:", err);
    }
  };

  const addItem = async (data: InventoryFormData) => {
    if (!user) return;
    const { data: inserted, error } = await supabase.from("inventory").insert({
      ...data,
      user_id: user.id,
    }).select().single();
    if (error) {
      toast({ title: "Error adding product", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Product added successfully" });
    await fetchItems();
    if (inserted) {
      checkLowStock({ id: inserted.id, product_name: inserted.product_name, sku: inserted.sku, quantity: inserted.quantity, user_id: inserted.user_id });
    }
    return true;
  };

  const updateItem = async (id: string, data: InventoryFormData) => {
    const { data: updated, error } = await supabase.from("inventory").update(data).eq("id", id).select().single();
    if (error) {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Product updated successfully" });
    await fetchItems();
    if (updated) {
      checkLowStock({ id: updated.id, product_name: updated.product_name, sku: updated.sku, quantity: updated.quantity, user_id: updated.user_id });
    }
    return true;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Product deleted successfully" });
    await fetchItems();
    return true;
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}
