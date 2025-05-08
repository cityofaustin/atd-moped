-- if we delete the added component tag in the future, we will soft delete and leave existing data intact

-- Remove unique constraint to allow for duplicate component/subcomponent associations
ALTER TABLE moped_components_subcomponents
DROP CONSTRAINT unique_component_subcomponents;

-- Restore previous component tag name
UPDATE moped_component_tags SET name = 'Upgrades Existing', type = 'Bikeways - Performance Measure', slug = 'bikeways_performance_measure_upgrades_existing'
WHERE slug = 'upgrades_existing_component';
