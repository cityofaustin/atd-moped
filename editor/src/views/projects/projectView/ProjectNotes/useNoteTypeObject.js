import { useMemo } from "react";

/**
 * Hook to create an object mapping note type slugs to their IDs
 * @param {Array} noteTypes - Array of note types from moped_note_types query
 * @returns
 */
export const useNoteTypeObject = (noteTypes) =>
  useMemo(
    () =>
      noteTypes.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.slug]: item.id,
          }),
        {}
      ),
    [noteTypes]
  );
