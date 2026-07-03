export const createWorkActivityFileConnectionData = (
  workActivityRecord,
  projectId
) => {
  const entityId = workActivityRecord?.id;
  const addFileConnection = {
    files_project_work_activities: {
      data: {
        project_id: projectId,
        entity_id: entityId,
      },
    },
  };
  return {
    addFileConnection,
    entityId,
  };
};
