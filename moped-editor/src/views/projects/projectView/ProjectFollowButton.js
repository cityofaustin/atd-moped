import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useMutation } from "@apollo/client";
import { useSessionDatabaseData } from "src/auth/user";
import { PROJECT_FOLLOW, PROJECT_UNFOLLOW } from "src/queries/project";

/**
 * Icon button to follow/unfollow a project
 * @param {Number} projectId - The id of the current project to follow/unfollow
 * @param {Boolean} isFollowing - Whether the user is currently following the project
 * @param {Function} refetch - The refetch function from Apollo
 * @param {Function} handleSnackbar - The function to show the snackbar
 * @return {JSX.Element}
 */
const ProjectFollowButton = ({
  projectId,
  isFollowing,
  refetch,
  handleSnackbar,
}) => {
  const userSessionData = useSessionDatabaseData();
  const userId = userSessionData?.user_id;

  const [followProject] = useMutation(PROJECT_FOLLOW);
  const [unfollowProject] = useMutation(PROJECT_UNFOLLOW);

  const handleFollowProject = () => {
    if (!isFollowing) {
      followProject({
        variables: {
          object: {
            project_id: projectId,
            user_id: userId,
          },
        },
      })
        .then(() => {
          return refetch();
        })
        .then(() => {
          handleSnackbar(true, "Project followed", "success");
        })
        .catch((error) => {
          handleSnackbar(true, "Error following project", "error", error);
        });
    } else {
      unfollowProject({
        variables: {
          project_id: projectId,
          user_id: userId,
        },
      })
        .then(() => {
          return refetch();
        })
        .then(() => {
          handleSnackbar(true, "Project unfollowed", "success");
        })
        .catch((error) => {
          handleSnackbar(true, "Error unfollowing project", "error", error);
        });
    }
  };

  return (
    <Tooltip title={isFollowing ? "Unfollow" : "Follow"}>
      <IconButton onClick={() => handleFollowProject()}>
        {isFollowing ? (
          <BookmarkIcon sx={{ color: "primary.main", fontSize: "2rem" }} />
        ) : (
          <BookmarkBorderIcon
            sx={{ color: "text.secondary", fontSize: "2rem" }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ProjectFollowButton;
