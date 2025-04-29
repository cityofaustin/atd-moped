-- if we delete the component tag in the future, we will soft delete and leave existing data intact

-- Restore previous component tag name
UPDATE moped_component_tags SET name = 'Upgrades Existing', type = 'Bikeways - Performance Measure', slug = 'bikeways_performance_measure_upgrades_existing'
WHERE slug = 'upgrades_existing_component';
