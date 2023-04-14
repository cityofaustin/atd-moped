-- drop unused columns
ALTER TABLE moped_subphases
    DROP COLUMN subphase_order,
    DROP COLUMN subphase_average_length,
    DROP COLUMN required_subphase;
