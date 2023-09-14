ALTER TABLE moped_proj_milestones
    DROP COLUMN completion_percentage,
    DROP COLUMN milestone_status,
    DROP COLUMN milestone_privacy,
    DROP COLUMN milestone_priority,
    DROP COLUMN milestone_date_type,
    DROP COLUMN milestone_start,
    DROP COLUMN milestone_related_phase_id,
    DROP COLUMN started_by_user_id,
    DROP COLUMN completed_by_user_id,
    DROP COLUMN is_current_milestone;

ALTER TABLE moped_proj_milestones RENAME COLUMN milestone_description TO description;
ALTER TABLE moped_proj_milestones RENAME COLUMN milestone_end TO date_actual;
ALTER TABLE moped_proj_milestones RENAME COLUMN milestone_estimate TO date_estimate;
