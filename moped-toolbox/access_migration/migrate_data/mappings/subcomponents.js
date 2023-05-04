// see https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1846025869
const SUBCOMPONENTS_MAP = [
  { in: "Continuous Flow Intersection", out: 6 },
  { in: "Curb Extension", out: 7 },
  { in: "Detection - Bicycle", out: 8 },
  { in: "Lane Changes", out: 9 },
  { in: "Protected Intersection Full", out: 10 },
  { in: "Protected Intersection Full (Shared Use)", out: 11 },
  { in: "Protected Intersection Partial", out: 12 },
  { in: "Radius Tightening", out: 13 },
  { in: "Slip Lane Removal", out: 14 },
  { in: "Smart Right", out: 15 },
  { in: "Square-up", out: 16 },
  { in: "Transit Corner Modification", out: 17 },
  { in: "Accessible Pedestrian Signal (APS)", out: 1 },
  { in: "Bicycle Accommodations at PHB", out: 18 },
  { in: "Bicycle Signal (Standard Signal + Bicycle Signal Sign)", out: 19 },
  { in: "Bicycle Signal Face (Experiment)", out: 20 },
  { in: "Bicycle Signal Face (InterimApp)", out: 21 },
  { in: "Detection - Vehicle", out: 22 },
  { in: "Leading Bicycle Interval", out: 23 },
  { in: "Leading Pedestrian Interval", out: 3 },
  { in: "Pedestrian Signal Head and Pushbuttons", out: 24 },
  { in: "Relocate Pedestrian Signal Pushbuttons", out: 24},
  // {in: "PHB to Traffic Signal", out: SPECIAL HANDLING},
  { in: "Protected Left Turn Phase", out: 25 },
  { in: "Timing Adjustment", out: 26 },
];

module.exports = {
  SUBCOMPONENTS_MAP,
};
