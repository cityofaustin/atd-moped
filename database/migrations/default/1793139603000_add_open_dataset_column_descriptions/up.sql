-- Descriptions copied from the corresponding Austin Open Data datasets:
-- https://data.austintexas.gov/Transportation-and-Mobility/Traffic-Signals-and-Pedestrian-Signals/p53x-x73x/about_data
-- https://data.austintexas.gov/Transportation-and-Mobility/School-Zone-Beacons/mzsm-hucz/about_data

COMMENT ON COLUMN public.feature_signals.signal_id IS
  'Unique identifier of the traffic or pedestrian signal.';
COMMENT ON COLUMN public.feature_signals.location_name IS
  'Canonical name of the location at which the traffic signal is located.';
COMMENT ON COLUMN public.feature_signals.signal_type IS
  'The type of signal. Either traffic or PHB (pedestrian hybrid beacon).';

COMMENT ON COLUMN public.feature_school_beacons.school_zone_beacon_id IS
  'Unique identifier of the school zone beacon';
COMMENT ON COLUMN public.feature_school_beacons.beacon_id IS
  'Identifier of the beacon in correlating to a unique beacon clock. Used to identify one of multiple beacons correlating to a single beacon clock.';
COMMENT ON COLUMN public.feature_school_beacons.location_name IS
  'Canonical name of the location at which the beacon is located. Includes nearest cross street in parenthesis.';
COMMENT ON COLUMN public.feature_school_beacons.zone_name IS
  'Annotated name for a group of school beacons. Contains a group of beacons in spacial proximity to one or more schools.';
