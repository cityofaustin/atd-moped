ALTER TABLE moped_proj_contract
    RENAME TO moped_purchase_order;

ALTER TABLE moped_purchase_order
  RENAME COLUMN contractor to vendor;

ALTER TABLE moped_purchase_order
  RENAME COLUMN contract_number TO purchase_order_number;
