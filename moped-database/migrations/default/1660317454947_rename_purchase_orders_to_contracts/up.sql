ALTER TABLE moped_purchase_order
    RENAME TO moped_proj_contract;

ALTER TABLE moped_proj_contract
  RENAME COLUMN vendor TO contractor;

ALTER TABLE moped_proj_contract
  RENAME COLUMN purchase_order_number TO contract_number;
