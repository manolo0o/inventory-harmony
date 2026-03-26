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

  const addItem = async (data: InventoryFormData) => {
    if (!user) return;
    const { error } = await supabase.from("inventory").insert({
      ...data,
      user_id: user.id,
    });
    if (error) {
      toast({ title: "Error adding product", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Product added successfully" });
    return true;
  };

  const updateItem = async (id: string, data: InventoryFormData) => {
    const { error } = await supabase.from("inventory").update(data).eq("id", id);
    if (error) {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Product updated successfully" });
    return true;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Product deleted successfully" });
    return true;
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}
