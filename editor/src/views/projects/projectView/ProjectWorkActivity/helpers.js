export const createWorkActivityFileConnectionData = (
  workActivityRecord,
) => {
  const entityId = workActivityRecord?.id;
  const addFileConnection = {
    files_project_work_activities: {
      data: {
        entity_id: entityId,
      },
    },
  };
  return {
    addFileConnection,
    entityId,
  };
};
