-- Insert new milestone records
INSERT INTO public.moped_milestones (
        milestone_name,
        milestone_description,
        related_phase_id
    ) VALUES
        ('Draft Study Submitted', 'Draft report submitted to ATD and being reviewed', 4),
        ('Draft Preliminary Schematic Submitted', 'Concept schematic submitted to ATD and being reviewed', 4),
        ('Need to Assign Study', 'Identified priority location is ready for scoping study and preliminary schematic assignment', 4);
        
