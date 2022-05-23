import {
  formatDateType,
  formatTimeStampTZType,
  makeUSExpandedFormDateFromTimeStampTZ,
  makeHourAndMinutesFromTimeStampTZ,
  makeFullTimeFromTimeStampTZ,
} from "../dateAndTime";

describe("formatDateType()", () => {
  it("formats PostgreSQL date type as MM/DD/YYYY", () => {
    const dateFromDatabase = "2022-01-15";
    const formattedDate = formatDateType(dateFromDatabase);

    expect(formattedDate).toBe("1/15/2022");
  });
});

describe("formatTimeStampTZType()", () => {
  it("formats PostgreSQL timestamp with time zone type as MM/DD/YYYY", () => {
    const timeStampTZFromDatabase = "2022-05-17T22:37:26.072259+00:00";
    const formattedDate = formatTimeStampTZType(timeStampTZFromDatabase);

    expect(formattedDate).toBe("5/17/2022");
  });
});

describe("makeUSExpandedFormDateFromTimeStampTZ()", () => {
  it("formats PostgreSQL timestamp with time zone type as US expanded form", () => {
    const timeStampTZFromDatabase = "2022-05-17T22:37:26.072259+00:00";
    const formattedDate = makeUSExpandedFormDateFromTimeStampTZ(
      timeStampTZFromDatabase
    );

    expect(formattedDate).toBe("May 17, 2022");
  });
});

describe("makeHourAndMinutesFromTimeStampTZ()", () => {
  it("formats PostgreSQL timestamp with time zone type US expanded form", () => {
    const timeStampTZFromDatabase = "2022-05-19T18:00:20.617788+00:00";
    const formattedTime = makeHourAndMinutesFromTimeStampTZ(
      timeStampTZFromDatabase
    );

    expect(formattedTime).toBe("1:00 PM");
  });
});

describe("makeFullTimeFromTimeStampTZ()", () => {
  it("formats PostgreSQL timestamp with time zone type US expanded form", () => {
    const timeStampTZFromDatabase = "2022-05-20T16:14:45.845391+00:00";
    const formattedTime = makeFullTimeFromTimeStampTZ(timeStampTZFromDatabase);

    expect(formattedTime).toBe("11:14:45 AM");
  });
});
