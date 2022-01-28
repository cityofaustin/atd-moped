ALTER TABLE "public"."moped_project" ADD COLUMN "task_order" jsonb NULL;

-- Example JSONB shape for task_order data
-- [
--   {
--     "id": "5b021e48133001200fed37b8",
--     "dept": "2400",
--     "name": "Gap Analysis (Strategic Mobility Plan)",
--     "status": "Inactive",
--     "balance": "462.38",
--     "tk_type": "Internal Billed",
--     "buyer_fdus": "8581 2507 9452",
--     "deactivate": true,
--     "task_order": "2400002000",
--     "display_name": "2400002000 | Gap Analysis (Strategic Mobility Plan)",
--     "chargedamount": "154093.12",
--     "modified_date": "01/23/2021 12:00am",
--     "current_estimate": "154555.50",
--     "atd_task_order__internal": "2"
--   }
-- ]