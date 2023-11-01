ALTER TABLE moped_components
    ADD COLUMN component_name_full text 
        GENERATED ALWAYS AS (component_name::text || ' - ' || component_subtype::text) STORED;

COMMENT ON COLUMN moped_components.component_name_with_subtype IS 'component name concatenated with component subtype, separated by -'
