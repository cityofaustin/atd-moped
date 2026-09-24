--Clear milestone_order, set as null
UPDATE moped_milestones 
SET milestone_order = null 
WHERE milestone_id > 0;

-- Insert new milestone records
INSERT INTO public.moped_milestones (
        milestone_name,
        milestone_description,
        related_phase_id
    ) VALUES
        ('Funded not studied', NULL, 1),
        ('Recommended not funded', NULL, 1),
        ('FDU and Task Orders created including Signs and Markings', NULL, 6),
        ('Design started', NULL, 6),
        ('Design completed', NULL, 6),
        ('Cost estimate completed', NULL, 6),
        ('Contractor DO created', NULL, 8),
        ('One Call completed', NULL, 9),
        ('Construction Start', NULL, 9),
        ('Power has been installed', NULL, 9),
        ('Cabinet ready to be set', NULL, 9),
        ('Heads installed and tested', 'traffic and pedestrian', 9),
        ('Deficiency list created', NULL, 9),
        ('Signs/Markings installed', NULL, 9),
        ('Detection has been installed and tested', NULL, 9),
        ('Communication installed and functional', NULL, 9),
        ('Verification deficiencies have been addressed', NULL, 9),
        ('Signal turn on', NULL, 9),
        ('Burn in period', 'typically 30 days', 10),
        ('Acceptance Letter', 'for signals constructed by others/documentation that burn in period is complete', 10);

UPDATE moped_milestones SET related_phase_id = 6 where milestone_id = 31;
