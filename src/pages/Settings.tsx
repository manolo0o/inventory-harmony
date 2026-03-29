import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Save, Mail } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function Settings() {
  const { settings, defaults, loading, saving, saveSettings } = useAppSettings();

  const [phone, setPhone] = useState(defaults.admin_phone);
  const [threshold, setThreshold] = useState(defaults.alert_threshold);
  const [enabled, setEnabled] = useState(defaults.alerts_enabled);

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      setPhone(settings.admin_phone);
      setThreshold(settings.alert_threshold);
      setEnabled(settings.alerts_enabled);
    }
  }, [settings]);

  const handleSave = () => {
    saveSettings({
      admin_phone: phone,
      alert_threshold: threshold,
      alerts_enabled: enabled,
    });
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onAddProduct={() => {}} showAddProduct={false} />
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Settings</h2>

          <Tabs defaultValue="notifications" className="w-full max-w-2xl">
            <TabsList>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">WhatsApp Low-Stock Alerts</CardTitle>
                  <CardDescription>
                    Receive a WhatsApp message when any product drops below the
                    stock threshold.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading settings…</p>
                  ) : (
                    <>
                      {/* Enable toggle */}
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="alerts-enabled" className="text-base font-medium">
                            Enable WhatsApp Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Toggle automatic low-stock notifications
                          </p>
                        </div>
                        <Switch
                          id="alerts-enabled"
                          checked={enabled}
                          onCheckedChange={setEnabled}
                        />
                      </div>

                      {/* Admin phone */}
                      <div className="space-y-2">
                        <Label htmlFor="admin-phone">Admin WhatsApp Number</Label>
                        <Input
                          id="admin-phone"
                          type="tel"
                          placeholder="+573001234567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Include country code, e.g. +1 for US, +57 for Colombia
                        </p>
                      </div>

                      {/* Threshold */}
                      <div className="space-y-2">
                        <Label htmlFor="alert-threshold">Low Stock Threshold</Label>
                        <Input
                          id="alert-threshold"
                          type="number"
                          min={1}
                          value={threshold}
                          onChange={(e) => setThreshold(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">
                          Alert triggers when product quantity is at or below this value
                        </p>
                      </div>

                      {/* Save */}
                      <Button onClick={handleSave} disabled={saving} className="gap-2">
                        <Save className="h-4 w-4" />
                        {saving ? "Saving…" : "Save Settings"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
