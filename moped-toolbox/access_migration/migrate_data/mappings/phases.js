const PHASES_MAP = [
  {
    in: "100% Design",
    out: { phase_id: 6, subphase_id: null, milestone_id: null },
  },
  {
    in: "30% Design",
    out: { phase_id: 6, subphase_id: null, milestone_id: null },
  },
  {
    in: "60% Design",
    out: { phase_id: 6, subphase_id: null, milestone_id: null },
  },
  {
    in: "90% Design",
    out: { phase_id: 6, subphase_id: null, milestone_id: null },
  },
  {
    in: "Canceled",
    out: { phase_id: 15, subphase_id: null, milestone_id: null },
  },
  {
    in: "Complete",
    out: { phase_id: 11, subphase_id: null, milestone_id: null },
  },
  {
    in: "Complete - Minor Modifications in Progress",
    out: { phase_id: 10, subphase_id: 24, milestone_id: null },
  },
  {
    in: "Construction",
    out: { phase_id: 9, subphase_id: null, milestone_id: null },
  },
  {
    in: "Construction Ready",
    out: { phase_id: 8, subphase_id: null, milestone_id: null },
  },
  {
    in: "CorridorPlan - Corridor Funding Available",
    out: { phase_id: 3, subphase_id: null, milestone_id: null },
  },
  {
    in: "CorridorPlan - Environmental Study in Progress",
    out: { phase_id: 3, subphase_id: null, milestone_id: null },
  },
  {
    in: "CorridorPlan - Environmentally Cleared",
    out: { phase_id: 3, subphase_id: null, milestone_id: null },
  },
  {
    in: "CorridorPlan - Planning Process - Complete",
    out: { phase_id: 3, subphase_id: null, milestone_id: null },
  },
  {
    in: "CorridorPlan - Planning Process - In Progress",
    out: { phase_id: 3, subphase_id: null, milestone_id: null },
  },
  { in: "Design", out: { phase_id: 6, subphase_id: null, milestone_id: null } },
  {
    in: "Design - Initial Field Visit",
    out: { phase_id: 6, subphase_id: null, milestone_id: null },
  },
  {
    in: "Design - Preliminary Schematic Complete",
    out: { phase_id: 6, subphase_id: null, milestone_id: null },
  },
  {
    in: "Design by Others",
    out: { phase_id: 6, subphase_id: null, milestone_id: null },
  },
  { in: "Hold", out: { phase_id: 14, subphase_id: null, milestone_id: null } },
  {
    in: "Permitting",
    out: { phase_id: 7, subphase_id: null, milestone_id: null },
  },
  {
    in: "Planned",
    out: { phase_id: 2, subphase_id: null, milestone_id: null },
  },
  {
    in: "Planned - Coordination Needed",
    out: { phase_id: 2, subphase_id: null, milestone_id: null },
  },
  {
    in: "Planned - Need to Request Resurfacing",
    out: { phase_id: 2, subphase_id: null, milestone_id: null },
  },
  {
    in: "Planned - Resurfacing Not Required",
    out: { phase_id: 2, subphase_id: null, milestone_id: null },
  },
  {
    in: "Planned - Resurfacing Requested",
    out: { phase_id: 2, subphase_id: null, milestone_id: null },
  },
  {
    in: "Planned - Resurfacing Scheduled",
    out: { phase_id: 2, subphase_id: null, milestone_id: null },
  },
  {
    // todo
    in: "Plans Under Review by Transportation Engineering",
    out: { phase_id: null, subphase_id: null, milestone_id: null },
  },
  {
    in: "Post Construction",
    out: { phase_id: 10, subphase_id: null, milestone_id: null },
  },
  {
    in: "Post-inst. Study",
    out: { phase_id: 10, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential - Active Development Review",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential - Feasibility Study",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential - Need to Request Resurfacing",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential - Reconstruction Priority",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential - Resurfacing Deferred",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential - Resurfacing Not Required",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential - Resurfacing Requested",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Potential - Resurfacing Scheduled",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Pre-construction",
    out: { phase_id: 7, subphase_id: null, milestone_id: null },
  },
  {
    in: "Preliminary Design",
    out: { phase_id: 5, subphase_id: null, milestone_id: null },
  },
  {
    in: "Preliminary Engineering",
    out: { phase_id: 3, subphase_id: null, milestone_id: null },
  },
  {
    in: "Procurement",
    out: { phase_id: 7, subphase_id: null, milestone_id: null },
  },
  {
    in: "Removed",
    out: { phase_id: 15, subphase_id: null, milestone_id: null },
  },
  {
    in: "Resurfaced - On Hold",
    out: { phase_id: 1, subphase_id: null, milestone_id: null },
  },
  {
    in: "Scheduled for Construction",
    out: { phase_id: 8, subphase_id: null, milestone_id: null },
  },
  {
    in: "Scoping",
    out: { phase_id: 4, subphase_id: null, milestone_id: null },
  },
  {
    in: "Substantially Complete",
    out: { phase_id: 10, subphase_id: 24, milestone_id: null },
  },
  { in: "TBD", out: { phase_id: null, subphase_id: null, milestone_id: null } },
  {
    in: "Unlikely",
    out: { phase_id: 15, subphase_id: null, milestone_id: null },
  },
  {
    in: "Work Order Submitted",
    out: { phase_id: 8, subphase_id: null, milestone_id: null },
  },
];

module.exports = {
  PHASES_MAP,
};
