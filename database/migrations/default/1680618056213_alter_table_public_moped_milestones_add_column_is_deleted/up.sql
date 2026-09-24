alter table "public"."moped_milestones" add column "is_deleted" boolean
 not null default 'False';

ALTER TABLE moped_milestones
    DROP COLUMN milestone_average_length,
    DROP COLUMN required_milestone;

-- rename milestones (see list in issue 11863)
UPDATE moped_milestones SET milestone_name = 'Financial approval (FDU/TK)' WHERE milestone_id = 36;
UPDATE moped_milestones SET milestone_name = 'Work authorization (DO)' WHERE milestone_id = 40;
UPDATE moped_milestones SET milestone_name = 'AE power complete' WHERE milestone_id = 43;
UPDATE moped_milestones SET milestone_name = 'Deficiencies addressed' WHERE milestone_id = 50;
UPDATE moped_milestones SET milestone_name = 'Signal turned on / asset updated' WHERE milestone_id = 51;
UPDATE moped_milestones SET milestone_name = 'Cabinet / Battery Backup System terminated' WHERE milestone_id = 44;

-- soft delete milestones (see list in issue 11863)
UPDATE moped_milestones SET is_deleted = true WHERE milestone_id = 46;
UPDATE moped_milestones SET is_deleted = true WHERE milestone_id = 45;
UPDATE moped_milestones SET is_deleted = true WHERE milestone_id = 48;
UPDATE moped_milestones SET is_deleted = true WHERE milestone_id = 49;
UPDATE moped_milestones SET is_deleted = true WHERE milestone_id = 52;


INSERT INTO moped_milestones ("is_deleted","milestone_order", "related_phase_id", "milestone_description", "milestone_name") VALUES (false, null, 9, null, E'AMD power construction complete');
INSERT INTO moped_milestones ("is_deleted","milestone_order", "related_phase_id", "milestone_description", "milestone_name") VALUES (false, null, 9, null, E'Arms hung / cabinet ready to be set');
