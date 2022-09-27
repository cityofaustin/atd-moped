-- Add "Construction Bid Published" with phase "Bid/Award/Execution"
INSERT INTO moped_milestones (milestone_name, related_phase_id) VALUES ('Construction Bid Published', 12);

-- Add "Construction Bid Due" with phase "Bid/Award/Execution"
INSERT INTO moped_milestones (milestone_name, related_phase_id) VALUES ('Construction Bid Due', 12);

-- Add "Design RFQ Published" with no phase
INSERT INTO moped_milestones (milestone_name) VALUES ('Design RFQ Published');

-- Add "Design RFQ Due" with no phase
INSERT INTO moped_milestones (milestone_name) VALUES ('Design RFQ Due');

-- Add "Design Contract Execution" with no phase
INSERT INTO moped_milestones (milestone_name) VALUES ('Design Contract Execution');

-- Add "Inter-agency Agreement Council Award" with phase "Design"
INSERT INTO moped_milestones (milestone_name, related_phase_id) VALUES ('Inter-agency Agreement Council Award', 6);
