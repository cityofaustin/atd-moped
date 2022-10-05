DELETE FROM moped_tags WHERE slug = 'map-transit-speed-and-reliability-capmetro-ila-2023';
DELETE FROM moped_tags WHERE slug = 'map-vision-zero-ped-safety-2023';
DELETE FROM moped_tags WHERE slug = 'map-vision-zero-rapid-response-small-scale-2023';
DELETE FROM moped_tags WHERE slug = 'map-vision-zero-street-lighting-2023';
DELETE FROM moped_tags WHERE slug = 'map-vision-zero-systemic-safety-2023';
UPDATE moped_tags SET is_deleted = FALSE WHERE slug = 'map_vzero_intersectionspotential2023';
UPDATE moped_tags SET name = 'MAP Vision Zero Intersections 2023', slug = 'map_vzero_intersections2023' WHERE slug = 'map-vision-zero-major-safety-2023';
UPDATE moped_tags set name = 'MAP Vision Zero Systemic Safety Curves 2023' WHERE slug = 'map_vzero_systemicsafety_curves2023';
UPDATE moped_tags set name = 'MAP Vision Zero Speed Management 2023' WHERE slug = 'map_vzero_speedmanagement2023';
