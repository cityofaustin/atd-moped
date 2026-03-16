import UserAvatar from "src/components/user/Avatar";
import { Stack, Typography } from "@mui/material";
import { getInitials, getUserFullName } from "src/utils/userNames";
import { useSessionDatabaseData } from "src/auth/user";
import emailToInitials from "src/utils/emailToInitials";
import { useUser } from "src/auth/user";

const UserInfo = () => {
  const user = useSessionDatabaseData();
  const session = useUser();

  const userInitials = user ? getInitials(user) : emailToInitials(user?.email);

  return (
    <Stack direction="column" sx={{ alignItems: "center", cursor: "default" }}>
      <UserAvatar
        size="small"
        initials={userInitials}
        userColor={session?.user?.userColor}
      />
      <Typography variant="body2" sx={{ pt: 0.5 }} noWrap>
        {getUserFullName(user)}
      </Typography>
      <Typography
        variant="subtitle2"
        noWrap
        sx={{ maxWidth: { xs: "150px", md: "225px", fontWeight: 400 } }}
      >
        {user?.email}
      </Typography>
    </Stack>
  );
};

export default UserInfo;
