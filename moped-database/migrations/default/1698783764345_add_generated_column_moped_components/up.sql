ALTER TABLE moped_components
    ADD COLUMN component_name_full text 
        GENERATED ALWAYS AS
         (CASE WHEN component_subtype IS NULL THEN component_name
              ELSE (component_name::text || ' - ' || component_subtype::text)
          END)
        STORED;

COMMENT ON COLUMN moped_components.component_name_full IS 'component name concatenated with component subtype, separated by -'
