const lookups = {
  phases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15],
  subphases: [1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 16, 17],
  milestones: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62,
  ],
  entities: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27,
  ],
  project_types: [1, 2, 3, 4, 5, 6, 7, 8],
  project_note_types: [1, 2],
  proj_tags: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  users: [1, 2, 3],
  proj_roles: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  fund_sources: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25,
  ],
  fund_programs: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
  ],
  fund_statuses: [1, 2, 3, 4, 5],
  components: [
    1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 16, 17, 18, 5, 6, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
    44, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 13, 14, 15, 45,
    60, 61, 62, 0, 63, 64, 65, 66,
  ],
  task_orders: [
    {
      dept: "6000",
      name: "johnny Morris/Hwy 290 Water Line Extension",
      status: "Active",
      balance: "-1997.78",
      tk_type: "Memo",
      task_order: "60M7242QMD",
      display_name: "60M7242QMD | johnny Morris/Hwy 290 Water Line Extension",
      chargedamount: "1997.78",
      current_estimate: "0",
    },
    {
      dept: "2400",
      name: "FY17 Parking Mgmt. ROW",
      status: "Inactive",
      balance: "0",
      tk_type: "Internal Billed",
      buyer_fdus: "5610 2400 4200",
      task_order: "24ROW51000",
      display_name: "24ROW51000 | FY17 Parking Mgmt. ROW",
      chargedamount: "119095.09",
      current_estimate: "119095.09",
    },
  ],
};

module.exports = {
  lookups,
};
