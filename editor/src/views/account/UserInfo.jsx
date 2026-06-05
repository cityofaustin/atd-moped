import { Stack, Typography } from "@mui/material";
import { getUserFullName } from "src/utils/userNames";
import { useSessionDatabaseData } from "src/auth/user";

const UserInfo = () => {
  const user = useSessionDatabaseData();
  const userFullName = getUserFullName(user);
  const userEmail = user?.email;

  return (
    <Stack direction="column" sx={{ alignItems: "left", cursor: "default" }}>
      <Typography
        title={userFullName}
        variant="body2"
        sx={{ pt: 0.5, fontWeight: 500 }}
        noWrap
      >
        {userFullName}
      </Typography>
      <Typography
        title={userEmail}
        variant="caption"
        noWrap
        sx={{ maxWidth: { xs: "150px", md: "225px", fontWeight: 400 } }}
      >
        {userEmail}
      </Typography>
    </Stack>
  );
};

export default UserInfo;
