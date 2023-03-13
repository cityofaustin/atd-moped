const PUBLIC_PROCESS_STATUS_MAP = [
  {
    in: "No Public Process",
    out: 2, // not_needed
  },
  {
    in: "Public Process Complete",
    out: 4, // complete
  },
  {
    in: "Public Process Complete_NoBuild",
    out: 4, // complete
  },
  {
    in: "Public Process in Progress",
    out: 3, // in_progress
  },
  {
    in: "Public Process Needed",
    out: 1, // needed
  },
  {
    in: "Public Process TBD",
    out: null,
  },
];

module.exports = {
  PUBLIC_PROCESS_STATUS_MAP,
};
