import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/** Shape of a row in the app_settings table */
export interface AppSettings {
  id: string;
  user_id: string;
  admin_phone: string;
  alert_threshold: number;
  alerts_enabled: boolean;
}

/** Default values shown before a row exists */
const defaults: Omit<AppSettings, "id" | "user_id"> = {
  admin_phone: "",
  alert_threshold: 5,
  alerts_enabled: false,
};

export function useAppSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings for the current user
  const fetchSettings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("app_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch settings:", error);
    }
    setSettings(data as AppSettings | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Upsert settings
  const saveSettings = async (values: Omit<AppSettings, "id" | "user_id">) => {
    if (!user) return;
    setSaving(true);

    const payload = { ...values, user_id: user.id };

    let error;
    if (settings?.id) {
      // Update existing row
      ({ error } = await supabase
        .from("app_settings")
        .update(payload)
        .eq("id", settings.id));
    } else {
      // Insert new row
      ({ error } = await supabase.from("app_settings").insert(payload));
    }

    if (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved successfully");
      await fetchSettings();
    }
    setSaving(false);
  };

  return {
    settings,
    defaults,
    loading,
    saving,
    saveSettings,
  };
}
