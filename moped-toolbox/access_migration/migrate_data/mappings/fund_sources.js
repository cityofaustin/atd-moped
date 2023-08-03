const FUND_PROGRAMS_MAP = [
  { in: "Bikeways", out: 2 },
  { in: "Capital Renewal", out: 3 },
  { in: "Corridor Construction", out: 4 },
  { in: "Corridor Plan", out: 4 },
  { in: "Highway Safety Improvements", out: 5 },
  { in: "IH35", out: 6 },
  { in: "Intersection Safety", out: 7 },
  { in: "Large CIP", out: 24 },
  { in: "Neighborhood Partnering", out: 9 },
  { in: "Pedestrian Crossing", out: 11 },
  { in: "Project Development", out: 12 },
  { in: "Regional", out: 13 },
  { in: "Safe Routes to Schools", out: 14 },
  { in: "Sidewalk Fee in Lieu", out: 25 },
  { in: "Sidewalk Rehab", out: 26 },
  { in: "Sidewalks", out: 15 },
  { in: "Signals", out: 16 },
  { in: "Speed Management", out: 19 },
  { in: "Street & Bridge", out: 20 },
  { in: "Street Impact Fee", out: 27 },
  { in: "Street Rehabilitation", out: 28 },
  { in: "Substandard Streets Construction", out: 21 },
  { in: "Substandard Streets Plan", out: 21 },
  { in: "Traffic Mitigation Fees", out: 29 },
  { in: "Transit Enhancement Program", out: 30 },
  { in: "Transportation Enhancements 2009 Grant", out: 22 },
  { in: "Urban Trails", out: 23 },
  { in: "Vision Zero / Intersection Safety", out: 7 },
];

const FUND_SOURCES_MAP = [
  { in: "2010 Bond", out: 26 },
  { in: "2012 Bond", out: 1 },
  { in: "2016 Bond", out: 2 },
  { in: "2018 Bond", out: 3 },
  { in: "2020 Bond", out: 4 },
  { in: "_Misc Bond / CIP", out: 12 },
  { in: "Austin Transportation", out: 5 },
  { in: "Austin Water", out: 6 },
  { in: "Capital Area Metropolitan Planning Organization", out: 7 },
  { in: "CapMetro ILA 2018", out: 27 },
  { in: "Central Texas Regional Mobility Authority", out: 9 },
  { in: "Economic Development", out: 10 },
  { in: "Grant", out: 11 },
  { in: "Operatings & Maintenance", out: 12 },
  { in: "Other", out: 12 },
  { in: "Parks & Recreation", out: 13 },
  { in: "Private Development", out: 14 },
  { in: "Project Connect", out: 15 },
  { in: "Public Works", out: 16 },
  { in: "Quarter Cent", out: 17 },
  { in: "State of Texas", out: 18 },
  { in: "Street Impact Fee", out: 19 },
  { in: "Texas Department of Transportation", out: 20 },
  { in: "Traffic Impact Analysis", out: 21 },
  { in: "Travis County", out: 22 },
  { in: "University of Texas", out: 23 },
  { in: "Williamson County", out: 24 },
];

const FUND_STATUS_MAP = [
  { in: "Tentative", out: 1 },
  { in: "Set up", out: 5 },
  { in: "Funding setup requested", out: 4 },
  { in: "Confirmed", out: 2 },
  // todo: available?
  { in: "Available", out: 1 },
];

const MOPED_FUNDS = [
  { id: 4, fund_id: "7026", fund_name: "I-35 PARKING PROGRAM FUND" },
  { id: 5, fund_id: "8112", fund_name: "GCP TRANSPORTATION" },
  { id: 6, fund_id: "8119", fund_name: "GCP-MOBILITY P1/2016" },
  { id: 7, fund_id: "8127", fund_name: "2018 BOND" },
  { id: 8, fund_id: "8400", fund_name: "CIP IMPROVEMENTS FUND" },
  { id: 9, fund_id: "8581", fund_name: "QUARTER CENT FUND" },
  { id: 10, fund_id: "8950", fund_name: "GCP GRANTS FUN" },
  { id: 11, fund_id: "8181", fund_name: "2010 MOBILITY BOND" },
  { id: 12, fund_id: "820B", fund_name: "2020 BOND" },
  { id: 13, fund_id: "8401", fund_name: "ATD TRANSPORTATION CIP" },
  { id: 14, fund_id: "4730", fund_name: "PARKING CIP" },
  { id: 15, fund_id: "PLAN", fund_name: "PLANNING FAOS" },
  { id: 16, fund_id: "4720", fund_name: "ATD TRANSPORTATION CIP" },
  { id: 17, fund_id: "8071", fund_name: "GCP-TRANSP MOBILITY IMPV P1/00" },
];

module.exports = {
  FUND_PROGRAMS_MAP,
  FUND_SOURCES_MAP,
  FUND_STATUS_MAP,
  MOPED_FUNDS,
};
