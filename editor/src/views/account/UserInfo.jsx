import { Stack, Typography } from "@mui/material";
import { getUserFullName } from "src/utils/userNames";
import { useMopedUser } from "src/auth/auth";

const UserInfo = () => {
  const mopedUser = useMopedUser();
  const userFullName = getUserFullName(mopedUser);
  const userEmail = mopedUser?.email;

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
