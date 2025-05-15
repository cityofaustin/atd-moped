ALTER TABLE moped_subphases
    ADD COLUMN subphase_order integer unique,
    ADD COLUMN subphase_average_length integer NULL,
    ADD COLUMN required_subphase boolean NULL;
