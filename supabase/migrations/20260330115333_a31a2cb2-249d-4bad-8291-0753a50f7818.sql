DROP TRIGGER IF EXISTS inventory_low_stock_webhook ON public.inventory;
DROP FUNCTION IF EXISTS notify_low_stock_webhook();