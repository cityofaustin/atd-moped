CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$ 
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
