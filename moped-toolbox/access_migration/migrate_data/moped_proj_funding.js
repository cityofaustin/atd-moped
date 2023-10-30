const { logger_transform: logger } = require("./utils/logger");
const { loadJsonFile } = require("./utils/loader");
const { mapRow } = require("./utils/misc");
const {
  MOPED_FUNDS,
  FUND_PROGRAMS_MAP,
  FUND_SOURCES_MAP,
  FUND_STATUS_MAP,
} = require("./mappings/fund_sources");
const PROJ_FUNDING_FNAME = "./data/raw/project_funding.json";
const PROJ_FUNDING = loadJsonFile(PROJ_FUNDING_FNAME);

let UNITS;

// "FDU": null,

const fields = [
  { in: "ProjectID", out: "interim_project_id" },
  { in: "Amount", out: "funding_amount" },
  { in: "Description", out: "funding_description" },
  // we keep fdu as a placeholder and query socrata for each FDU after mapping rows
  { in: "FDU", out: "fdu" },
  {
    in: "Status",
    out: "funding_status_id",
    transform: (row) => {
      const status = row.Status;
      if (!status) {
        // todo: fallback status
        // currently `tentative`
        return 1;
      }
      const matchedStatus = FUND_STATUS_MAP.find(
        (fundStatus) => fundStatus.in === status
      );
      if (!matchedStatus) {
        throw `Unknown funding status: ${status}`;
      }
      return matchedStatus.out;
    },
  },
  {
    in: "Source",
    out: "funding_source_id",
    transform: (row) => {
      const source = row.Source;
      if (!source) {
        return null;
      }
      const matchedSource = FUND_SOURCES_MAP.find(
        (fundSource) => fundSource.in === source
      );
      if (!matchedSource) {
        throw `Unknown funding source: ${source}`;
      }
      return matchedSource?.out;
    },
  },
  {
    in: "Program",
    out: "funding_program_id",
    transform: (row) => {
      const program = row.Program;
      if (!program) {
        return null;
      }
      const matchedProgram = FUND_PROGRAMS_MAP.find(
        (fundProgram) => fundProgram.in === program
      );
      if (!matchedProgram) {
        throw `Unknown funding program: ${program}`;
      }
      return matchedProgram.out;
    },
  },
];

async function fetchUnit(dept, unit) {
  logger.info(`Getting fund-unit ${dept}-${unit} from Socrata...`);
  const endpoint = `https://data.austintexas.gov/resource/bgrt-2m2z.json?$limit=10000000&dept=${dept}&unit=${unit}`;
  const response = await fetch(endpoint, {
    method: "GET",
  });
  return await response.json();
}

async function getFunding() {
  const fundingSources = PROJ_FUNDING.map((row) => mapRow(row, fields));
  /**
   * Fetch valid FDUs from Socrata
   * All this to handle 4 (!) records that have FDUs
   */
  for (let i = 0; i < fundingSources.length; i++) {
    const { fdu, ...fundingSource } = fundingSources[i];

    if (fdu && fdu !== "TBD") {
      const [fund, dept, unit] = fdu.split(" ");
      const matchedFund = MOPED_FUNDS.find((f) => f.fund_id === fund);
      if (!matchedFund) {
        debugger;
        throw `Unknow fund code: ${fund}`;
      }
      fundingSource.fund = matchedFund;
      const matchedDeptUnit = await fetchUnit(dept, unit);
      if (matchedDeptUnit.length !== 1) {
        throw `Unable to find dept-unit: ${dept}-${unit}`;
      }
      fundingSource.dept_unit = matchedDeptUnit[0];
    }
    fundingSources[i] = fundingSource;
  }
  //   index on interim project ID
  return fundingSources.reduce(
    (index, { interim_project_id, ...fundSource }) => {
      index[interim_project_id] ??= [];
      index[interim_project_id].push(fundSource);
      return index;
    },
    {}
  );
}

exports.getFunding = getFunding;
