import {
  formatDateType,
  formatTimeStampZType,
  makeUSExpandedFormDateFromTimeStampZ,
  makeHourAndMinutesFromTimeStampZ,
  makeFullTimeFromTimeStampZ,
} from "../dateAndTime";

describe("formatDateType()", () => {
  it("formats PostgreSQL date type as MM/DD/YYYY", () => {
    const dateFromDatabase = "2022-01-15";
    const formattedDate = formatDateType(dateFromDatabase);

    expect(formattedDate).toBe("1/15/2022");
  });
});

describe("formatTimeStampZType()", () => {
  it("formats PostgreSQL timestamp with time zone type as MM/DD/YYYY", () => {
    const timeStampZFromDatabase = "2022-05-17T22:37:26.072259+00:00";
    const formattedDate = formatTimeStampZType(timeStampZFromDatabase);

    expect(formattedDate).toBe("5/17/2022");
  });
});

describe("makeUSExpandedFormDateFromTimeStamp()", () => {
  it("formats PostgreSQL timestamp with time zone type as US expanded form", () => {
    const timeStampZFromDatabase = "2022-05-17T22:37:26.072259+00:00";
    const formattedDate = makeUSExpandedFormDateFromTimeStampZ(
      timeStampZFromDatabase
    );

    expect(formattedDate).toBe("May 17, 2022");
  });
});

describe("makeHourAndMinutesFromTimeStamp()", () => {
  it("formats PostgreSQL timestamp with time zone type US expanded form", () => {
    const timeStampZFromDatabase = "2022-05-19T18:00:20.617788+00:00";
    const formattedTime = makeHourAndMinutesFromTimeStampZ(
      timeStampZFromDatabase
    );

    expect(formattedTime).toBe("1:00 PM");
  });
});

describe("makeFullTimeFromTimeStampZ()", () => {
  it("formats PostgreSQL timestamp with time zone type US expanded form", () => {
    const timeStampZFromDatabase = "2022-05-20T16:14:45.845391+00:00";
    const formattedTime = makeFullTimeFromTimeStampZ(timeStampZFromDatabase);

    expect(formattedTime).toBe("11:14:45 AM");
  });
});
