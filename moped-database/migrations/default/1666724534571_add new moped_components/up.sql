-- Insert new moped_components
INSERT INTO public.moped_components (
        component_name,
        status_id,
        component_subtype,
        line_representation
    ) VALUES
        ('Intersection', 1, 'Improvement (linear)', true),
        ('Intersection', 1, 'Improvement', false);
