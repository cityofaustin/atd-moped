import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { useSessionDatabaseData } from "src/auth/user";
import { PROJECT_FOLLOW, PROJECT_UNFOLLOW } from "src/queries/project";
import IconButtonWithTooltip from "src/components/IconButtonWithTooltip";
import { ProjectSummaryQuery } from "src/gql/graphql";
import { AlertProps } from "@mui/material";

interface ProjectFollowButtonProps {
  projectId: string | undefined;
  isFollowing: boolean;
  refetch: () => Promise<ApolloQueryResult<ProjectSummaryQuery>>;
  handleSnackbar: (
    open: boolean,
    message: string,
    severity: AlertProps["severity"] | "",
    error?: unknown
  ) => void;
}

/**
 * Icon button to follow/unfollow a project
 * @param projectId - The id of the current project to follow/unfollow
 * @param isFollowing - Whether the user is currently following the project
 * @param refetch - The refetch function from Apollo
 * @param handleSnackbar - The function to show the snackbar
 */
const ProjectFollowButton = ({
  projectId,
  isFollowing,
  refetch,
  handleSnackbar,
}: ProjectFollowButtonProps) => {
  const userSessionData = useSessionDatabaseData() as
    | {
        user_id: number;
      }
    | undefined;
  const userId = userSessionData?.user_id;

  const [followProject] = useMutation(PROJECT_FOLLOW);
  const [unfollowProject] = useMutation(PROJECT_UNFOLLOW);

  const handleFollowProject = async () => {
    if (!isFollowing) {
      try {
        await followProject({
          variables: {
            object: {
              project_id: Number(projectId),
              user_id: userId,
            },
          },
        });
        await refetch();

        handleSnackbar(true, "Project followed", "success");
      } catch (error) {
        handleSnackbar(true, "Error following project", "error", error);
      }
    } else {
      try {
        await unfollowProject({
          variables: {
            project_id: Number(projectId),
            user_id: userId,
          },
        });
        await refetch();

        handleSnackbar(true, "Project unfollowed", "success");
      } catch (error) {
        handleSnackbar(true, "Error unfollowing project", "error", error);
      }
    }
  };

  return (
    // @ts-expect-error - IconButtonWithTooltip needs to be converted to .tsx in issue #29269
    <IconButtonWithTooltip
      title={isFollowing ? "Unfollow" : "Follow"}
      onClick={() => handleFollowProject()}
      ariaLabel={isFollowing ? "unfollow" : "follow"}
    >
      {isFollowing ? (
        <BookmarkIcon sx={{ color: "primary.main", fontSize: "2rem" }} />
      ) : (
        <BookmarkBorderIcon
          sx={{ color: "text.secondary", fontSize: "2rem" }}
        />
      )}
    </IconButtonWithTooltip>
  );
};

export default ProjectFollowButton;
