// reshape the array of file types into an object with key id, value name
export const useFileTypeObject = (fileTypes) =>
  useMemo(
    () =>
      fileTypes.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.id]: item.name,
          }),
        {}
      ),
    [fileTypes]
  );

// remove the FilePond and s3 added path for display, ex:
// 'private/project/65/80_04072022191747_40d4c982e064d0f9_1800halfscofieldridgepwkydesignprint.pdf'
export const cleanUpFileKey = (str) => str.replace(/^(?:[^_]*_){3}/g, "");
