INSERT INTO moped_tags (type, name, slug) VALUES ('Work Plan','MAP Transit Speed and Reliability (CapMetro ILA) 2023','map-transit-speed-and-reliability-capmetro-ila-2023');
INSERT INTO moped_tags (type, name, slug) VALUES ('Work Plan','MAP Vision Zero - Ped Safety 2023','map-vision-zero-ped-safety-2023');
INSERT INTO moped_tags (type, name, slug) VALUES ('Work Plan','MAP Vision Zero - Rapid Response/Small Scale 2023','map-vision-zero-rapid-response-small-scale-2023');
INSERT INTO moped_tags (type, name, slug) VALUES ('Work Plan','MAP Vision Zero - Street Lighting 2023','map-vision-zero-street-lighting-2023');
insert into moped_tags (type, name, slug) VALUES ('Work Plan','MAP Vision Zero - Systemic Safety 2023','map-vision-zero-systemic-safety-2023');
UPDATE moped_tags SET is_deleted = TRUE WHERE slug = 'map_vzero_intersectionspotential2023';
UPDATE moped_tags SET name = 'MAP Vision Zero - Major Safety 2023', slug = 'map-vision-zero-major-safety-2023' WHERE slug = 'map_vzero_intersections2023';
UPDATE moped_tags SET name = 'MAP Vision Zero - Speed Management 2023' WHERE slug = 'map_vzero_speedmanagement2023';
UPDATE moped_tags SET name = 'MAP Vision Zero - Systemic Safety Curves 2023' WHERE slug = 'map_vzero_systemicsafety_curves2023';
