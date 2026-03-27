
-- Create a trigger function that calls the notify-low-stock edge function
-- via pg_net whenever an inventory row is updated
CREATE OR REPLACE FUNCTION public.notify_low_stock_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _supabase_url text;
  _service_key text;
BEGIN
  -- Only fire when quantity actually changed
  IF NEW.quantity IS DISTINCT FROM OLD.quantity THEN
    -- Read project URL and service key from vault or hardcode project URL
    SELECT decrypted_secret INTO _supabase_url
      FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1;
    SELECT decrypted_secret INTO _service_key
      FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1;

    -- If vault secrets aren't available, use the known project URL
    IF _supabase_url IS NULL THEN
      _supabase_url := 'https://qzbkmmemesaamtnrcrgy.supabase.co';
    END IF;

    -- Call edge function via pg_net (fire-and-forget)
    PERFORM net.http_post(
      url := _supabase_url || '/functions/v1/notify-low-stock',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || COALESCE(_service_key, '')
      ),
      body := jsonb_build_object(
        'record', jsonb_build_object(
          'id', NEW.id,
          'product_name', NEW.product_name,
          'sku', NEW.sku,
          'quantity', NEW.quantity,
          'user_id', NEW.user_id
        )
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Attach the trigger to fire AFTER UPDATE on inventory
CREATE TRIGGER inventory_low_stock_webhook
  AFTER UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_low_stock_webhook();
