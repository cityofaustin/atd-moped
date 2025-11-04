-- Add MAP Signals - 2026, Map Bikeshare - 2025, Map Bikeshare - 2026, and Arterial Management - PIP component tags
INSERT INTO public.moped_component_tags (type, name, slug) VALUES
('MAP Signals', '2026', 'map_signals_2026'),
('MAP Bikeshare', '2025', 'map_bikeshare_2025'),
('MAP Bikeshare', '2026', 'map_bikeshare_2026'),
('Arterial Management', 'PIP', 'arterial_management_pip');

-- Add Arterial Management - PIP project tag
INSERT INTO moped_tags (name, type, slug, is_deleted) VALUES
('Arterial Management - PIP', 'Other', 'arterial_management_pip', FALSE);
