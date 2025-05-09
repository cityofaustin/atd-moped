-- replace dropped columns
ALTER TABLE moped_proj_milestones ADD COLUMN contractor TEXT;
ALTER TABLE moped_proj_milestones ADD COLUMN purchase_order_number TEXT;
